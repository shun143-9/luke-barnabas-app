"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Video } from "lucide-react"
import { useLanguage } from "@/context/language-context"

// In a real app, this would come from your database
const meetings = {
  morning: {
    title: "Morning Prayer & Devotion",
    time: "7:00 AM - 8:00 AM",
    zoomLink: "https://zoom.us/j/example",
  },
  evening: {
    title: "Evening Bible Study",
    time: "7:30 PM - 9:00 PM",
    location: "Community Church Hall",
    mapsLink: "https://maps.google.com/?q=Community+Church+Hall",
  },
}

export default function MeetingsPage() {
  const { translations } = useLanguage()

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.meetings.title}</h1>
      <p className="text-muted-foreground mb-6">{translations.meetings.subtitle}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MorningMeetingCard meeting={meetings.morning} />
        <EveningMeetingCard meeting={meetings.evening} />
      </div>
    </div>
  )
}

function MorningMeetingCard({ meeting }: { meeting: any }) {
  const { translations } = useLanguage()

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <Video className="h-5 w-5 text-primary mt-0.5 mr-2" />
          <h3 className="text-lg font-semibold text-foreground">{translations.meetings.morningTitle}</h3>
        </div>

        <div className="flex items-center mb-4 text-muted-foreground">
          <Clock className="h-4 w-4 mr-2" />
          <span>{meeting.time}</span>
        </div>

        <p className="text-muted-foreground mb-4">{translations.meetings.morningDescription}</p>
      </CardContent>
      <CardFooter className="p-6 pt-0">
        <Button className="w-full" onClick={() => window.open(meeting.zoomLink, "_blank")}>
          {translations.meetings.joinZoom}
        </Button>
      </CardFooter>
    </Card>
  )
}

function EveningMeetingCard({ meeting }: { meeting: any }) {
  const { translations } = useLanguage()

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <MapPin className="h-5 w-5 text-primary mt-0.5 mr-2" />
          <h3 className="text-lg font-semibold text-foreground">{translations.meetings.eveningTitle}</h3>
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
        <Button className="w-full" onClick={() => window.open(meeting.mapsLink, "_blank")}>
          {translations.meetings.showLocation}
        </Button>
      </CardFooter>
    </Card>
  )
}
