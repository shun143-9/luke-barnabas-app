"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Database, Loader2 } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { useEffect, useState } from "react"
import { getSermons, type Sermon } from "@/lib/supabase"

export default function SermonsPage() {
  const { translations } = useLanguage()
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [needsInit, setNeedsInit] = useState(false)
  const [isInitializing, setIsInitializing] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)

  // Function to initialize the database tables
  const initializeDatabase = async () => {
    setIsInitializing(true)
    setInitError(null)

    try {
      // Try the direct SQL approach
      const response = await fetch("/api/init-db-direct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to initialize database")
      }

      const data = await response.json()

      if (data.success) {
        // Reload the page to fetch fresh data
        window.location.reload()
      } else {
        throw new Error(data.error || "Unknown error occurred")
      }
    } catch (err: any) {
      console.error("Error initializing database:", err)
      setInitError(err.message || "Failed to initialize database. Please try again.")
    } finally {
      setIsInitializing(false)
    }
  }

  useEffect(() => {
    async function fetchSermons() {
      setLoading(true)
      setError(null)
      setNeedsInit(false)

      try {
        const { data, error } = await getSermons()

        if (error) {
          // Check if the error is because the table doesn't exist
          if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
            setNeedsInit(true)
          } else {
            console.error("Error fetching sermons:", error)
            setError("Failed to load sermons")
          }
          // Fallback to sample data
          setSermons(getSampleSermons())
        } else if (data && data.length > 0) {
          setSermons(data)
        } else {
          // No sermons in the database yet
          setSermons(getSampleSermons())
        }
      } catch (err) {
        console.error("Exception fetching sermons:", err)
        setError("An unexpected error occurred")
        setSermons(getSampleSermons())
      } finally {
        setLoading(false)
      }
    }

    fetchSermons()
  }, [])

  // Sample sermon data for fallback
  function getSampleSermons(): Sermon[] {
    return [
      {
        id: "1",
        title: "Finding Peace in God's Promises",
        date: "2023-05-01",
        description: "Pastor Luke explores how God's promises can bring peace in our daily lives.",
        thumbnail_url: "/placeholder.svg?height=200&width=350",
        youtube_url: "https://www.youtube.com/watch?v=example1",
      },
      {
        id: "2",
        title: "The Power of Prayer",
        date: "2023-04-28",
        description: "Learn how prayer can transform your relationship with God and others around you.",
        thumbnail_url: "/placeholder.svg?height=200&width=350",
        youtube_url: "https://www.youtube.com/watch?v=example2",
      },
    ]
  }

  // If database needs initialization, show the initialization UI
  if (needsInit) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{translations.sermons.title}</h1>

        <Card className="border-destructive">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
            <Database className="h-12 w-12 text-destructive mb-2" />
            <h2 className="text-xl font-semibold">Database Setup Required</h2>
            <p className="text-muted-foreground">
              The sermons table doesn't exist yet. Click the button below to initialize the database.
            </p>

            {initError && (
              <div className="p-4 w-full bg-destructive/20 border border-destructive/50 rounded-md text-destructive-foreground text-left">
                {initError}
              </div>
            )}

            <Button onClick={initializeDatabase} disabled={isInitializing} size="lg" className="mt-2">
              {isInitializing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                "Initialize Database"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.sermons.title}</h1>
      <p className="text-muted-foreground mb-6">{translations.sermons.subtitle}</p>

      {error && (
        <div className="p-4 bg-destructive/20 border border-destructive/50 rounded-md text-destructive-foreground mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sermons.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      )}
    </div>
  )
}

function SermonCard({ sermon }: { sermon: Sermon }) {
  const { translations } = useLanguage()

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image
          src={sermon.thumbnail_url || "/placeholder.svg?height=200&width=350"}
          alt={sermon.title}
          fill
          className="object-cover"
        />
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="text-sm text-muted-foreground mb-2">{new Date(sermon.date).toLocaleDateString()}</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{sermon.title}</h3>
        <p className="text-muted-foreground text-sm">{sermon.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => window.open(sermon.youtube_url, "_blank")}>
          {translations.sermons.watchButton} <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
