"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Video, Loader2 } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useEffect, useState } from "react"
import { getMeetingsByType, type Meeting } from "@/lib/supabase"

export default function MeetingsPage() {
  const { translations } = useLanguage()
  const [morningMeeting, setMorningMeeting] = useState<Meeting | null>(null)
  const [eveningMeeting, setEveningMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchMeetings() {
      setLoading(true)

      // Fetch morning meeting
      const { data: morningData } = await getMeetingsByType("morning")
      if (morningData) {
        setMorningMeeting(morningData)
      } else {
        // Fallback to default values
        setMorningMeeting({
          id: "",
          title: "Morning Prayer & Devotion",
          meeting_type: "morning",
          time: "7:00 AM - 8:00 AM",
          zoom_link: "https://zoom.us/j/example",
        })
      }

      // Fetch evening meeting
      const { data: eveningData } = await getMeetingsByType("evening")
      if (eveningData) {
        setEveningMeeting(eveningData)
      } else {
        // Fallback to default values
        setEveningMeeting({
          id: "",
          title: "Evening Bible Study",
          meeting_type: "evening",
          time: "7:30 PM - 9:00 PM",
          location: "Community Church Hall",
          maps_link: "https://maps.google.com/?q=Community+Church+Hall",
        })
      }

      setLoading(false)
    }

    fetchMeetings()
  }, [])

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.meetings.title}</h1>
      <p className="text-muted-foreground mb-6">{translations.meetings.subtitle}</p>

      {loading ? (
        <div className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MorningMeetingCard meeting={morningMeeting} />
          <EveningMeetingCard meeting={eveningMeeting} />
        </div>
      )}
    </div>
  )
}

function MorningMeetingCard({ meeting }: { meeting: Meeting | null }) {
  const { translations } = useLanguage()

  if (!meeting) return null

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <Video className="h-5 w-5 text-primary mt-0.5 mr-2" />
          <h3 className="text-lg font-semibold text-foreground">{meeting.title}</h3>
        </div>

        <div className="flex items-center mb-4 text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{meeting.time}</span>
        </div>

        <p className="text-muted-foreground mb-4">{translations.meetings.morningDescription}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" onClick={() => window.open(meeting.zoom_link, "_blank")}>
          {translations.meetings.joinZoom}
        </Button>
      </CardFooter>
    </Card>
  )
}

function EveningMeetingCard({ meeting }: { meeting: Meeting | null }) {
  const { translations } = useLanguage()

  if (!meeting) return null

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2" />
          <h3 className="text-lg font-semibold text-foreground">{meeting.title}</h3>
        </div>

        <div className="flex items-center mb-2 text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{meeting.time}</span>
        </div>

        <div className="flex items-center mb-4 text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{meeting.location}</span>
        </div>

        <p className="text-muted-foreground mb-4">{translations.meetings.eveningDescription}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" onClick={() => window.open(meeting.maps_link, "_blank")}>
          {translations.meetings.showLocation}
        </Button>
      </CardFooter>
    </Card>
  )
}
