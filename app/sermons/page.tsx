"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Image from "next/image"
import { useLanguage } from "@/context/language-context"

// In a real app, this would come from your database
const sermons = [
  {
    id: "1",
    title: "Finding Peace in God's Promises",
    date: "May 1, 2023",
    description: "Pastor Luke explores how God's promises can bring peace in our daily lives.",
    thumbnailUrl: "/placeholder.svg?height=200&width=350",
    youtubeUrl: "https://www.youtube.com/watch?v=example1",
  },
  {
    id: "2",
    title: "The Power of Prayer",
    date: "April 28, 2023",
    description: "Learn how prayer can transform your relationship with God and others around you.",
    thumbnailUrl: "/placeholder.svg?height=200&width=350",
    youtubeUrl: "https://www.youtube.com/watch?v=example2",
  },
  {
    id: "3",
    title: "Walking in Faith",
    date: "April 25, 2023",
    description: "Pastor Luke teaches how to strengthen your faith through daily spiritual practices.",
    thumbnailUrl: "/placeholder.svg?height=200&width=350",
    youtubeUrl: "https://www.youtube.com/watch?v=example3",
  },
  {
    id: "4",
    title: "Understanding God's Grace",
    date: "April 21, 2023",
    description: "A powerful message about God's unconditional grace and how it impacts our lives.",
    thumbnailUrl: "/placeholder.svg?height=200&width=350",
    youtubeUrl: "https://www.youtube.com/watch?v=example4",
  },
]

export default function SermonsPage() {
  const { translations } = useLanguage()

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.sermons.title}</h1>
      <p className="text-muted-foreground mb-6">{translations.sermons.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sermons.map((sermon) => (
          <SermonCard key={sermon.id} sermon={sermon} />
        ))}
      </div>
    </div>
  )
}

function SermonCard({ sermon }: { sermon: any }) {
  const { translations } = useLanguage()

  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="relative h-48 w-full">
        <Image src={sermon.thumbnailUrl || "/placeholder.svg"} alt={sermon.title} fill className="object-cover" />
      </div>
      <CardContent className="p-4 flex-grow">
        <div className="text-sm text-muted-foreground mb-2">{sermon.date}</div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{sermon.title}</h3>
        <p className="text-muted-foreground text-sm">{sermon.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => window.open(sermon.youtubeUrl, "_blank")}>
          {translations.sermons.watchButton} <ExternalLink className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
