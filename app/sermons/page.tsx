"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"
import { useEffect, useState } from "react"
import { getSermons, type Sermon } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function SermonsPage() {
  const { translations } = useLanguage()
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchSermons() {
      setLoading(true)
      const { data, error } = await getSermons()
      if (data) {
        setSermons(data)
      } else {
        // Fallback to sample data if no sermons in database
        setSermons([
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
        ])
      }
      setLoading(false)
    }

    fetchSermons()
  }, [])

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.sermons.title}</h1>
      <p className="text-muted-foreground mb-6">{translations.sermons.subtitle}</p>

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
