"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { supabase } from "@/lib/supabase"
import { Loader2, Database } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Home() {
  const [liveStreamId, setLiveStreamId] = useState("jfKfPfyJRdk") // Default YouTube ID
  const [isLive, setIsLive] = useState(false)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isInitializing, setIsInitializing] = useState(false)
  const [initError, setInitError] = useState<string | null>(null)
  const [needsInit, setNeedsInit] = useState(false)
  const { translations } = useLanguage()

  // Function to initialize the database tables
  const initializeDatabase = async () => {
    setIsInitializing(true)
    setInitError(null)

    try {
      // Try the direct SQL approach first
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
    async function fetchLivestream() {
      setLoading(true)
      setError(null)
      setNeedsInit(false)

      try {
        // Try to fetch livestream data
        const { data, error } = await supabase
          .from("livestream")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (error) {
          console.error("Error fetching livestream:", error)

          // Check if the error is because the table doesn't exist
          if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
            setNeedsInit(true)
          } else {
            setError("Failed to load livestream data")
          }

          // Use default values
          setDescription(translations.home.aboutText1)
        } else if (data) {
          setLiveStreamId(data.youtube_id)
          setIsLive(data.is_live)
          setDescription(data.description)
        } else {
          // Fallback to default values if no data
          setDescription(translations.home.aboutText1)
        }
      } catch (err) {
        console.error("Exception fetching livestream:", err)
        setError("An unexpected error occurred")
        setDescription(translations.home.aboutText1)
      } finally {
        setLoading(false)
      }
    }

    fetchLivestream()
  }, [translations.home.aboutText1])

  // If database needs initialization, show the initialization UI
  if (needsInit) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{translations.home.welcome}</h1>

        <Card className="border-destructive">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
            <Database className="h-12 w-12 text-destructive mb-2" />
            <h2 className="text-xl font-semibold">Database Setup Required</h2>
            <p className="text-muted-foreground">
              The database tables don't exist yet. Click the button below to initialize the database.
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

        <section className="mt-8">
          <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{translations.home.aboutTitle}</h2>
          <Card>
            <CardContent className="p-4 md:p-6">
              <p className="text-muted-foreground mb-4">{translations.home.aboutText1}</p>
              <p className="text-muted-foreground">{translations.home.aboutText2}</p>
            </CardContent>
          </Card>
        </section>
      </div>
    )
  }

  return (
    <div className="flex flex-col space-y-6">
      <section>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{translations.home.welcome}</h1>

        {loading ? (
          <div className="flex justify-center items-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="relative pb-[56.25%] h-0 overflow-hidden">
              <iframe
                src={`https://www.youtube.com/embed/${liveStreamId}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              ></iframe>
            </div>

            <CardContent className="p-4 md:p-6">
              {isLive && (
                <div className="flex items-center mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-900 text-red-100 border border-red-700">
                    <span className="w-2 h-2 mr-1.5 bg-red-500 rounded-full animate-pulse"></span>
                    {translations.home.liveNow}
                  </span>
                </div>
              )}

              <h2 className="text-xl font-semibold text-foreground mb-2">{translations.home.todaysMessage}</h2>
              <p className="text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        )}

        {error && (
          <div className="mt-4 p-4 bg-destructive/20 border border-destructive/50 rounded-md text-destructive-foreground">
            {error}
          </div>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground mb-4">{translations.home.aboutTitle}</h2>
        <Card>
          <CardContent className="p-4 md:p-6">
            <p className="text-muted-foreground mb-4">{translations.home.aboutText1}</p>
            <p className="text-muted-foreground">{translations.home.aboutText2}</p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
