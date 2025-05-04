"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Clock, MapPin, Video, Loader2, Database } from "lucide-react"
import { useLanguage } from "@/context/language-context"
import { useEffect, useState } from "react"
import { getMeetingsByType, type Meeting } from "@/lib/supabase"

export default function MeetingsPage() {
  const { translations } = useLanguage()
  const [morningMeeting, setMorningMeeting] = useState<Meeting | null>(null)
  const [eveningMeeting, setEveningMeeting] = useState<Meeting | null>(null)
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
      // Use GET method instead of POST
      const response = await fetch("/api/init-db-direct", {
        method: "GET",
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
    async function fetchMeetings() {
      setLoading(true)
      setError(null)
      setNeedsInit(false)

      try {
        // Fetch morning meeting
        const { data: morningData, error: morningError } = await getMeetingsByType("morning")

        if (morningError) {
          // Check if the error is because the table doesn't exist
          if (morningError.message?.includes("relation") && morningError.message?.includes("does not exist")) {
            setNeedsInit(true)
            return // Stop further processing
          } else {
            console.error("Error fetching morning meeting:", morningError)
          }
        }

        // Set default morning meeting data
        setMorningMeeting(
          morningData || {
            id: "",
            title: "Morning Prayer & Devotion",
            meeting_type: "morning",
            time: "7:00 AM - 8:00 AM",
            zoom_link: "https://zoom.us/j/example",
          },
        )

        // Fetch evening meeting
        const { data: eveningData, error: eveningError } = await getMeetingsByType("evening")

        if (eveningError && !eveningError.message?.includes("PGRST116")) {
          console.error("Error fetching evening meeting:", eveningError)
        }

        // Set default evening meeting data
        setEveningMeeting(
          eveningData || {
            id: "",
            title: "Evening Bible Study",
            meeting_type: "evening",
            time: "7:30 PM - 9:00 PM",
            location: "Community Church Hall",
            maps_link: "https://maps.google.com/?q=Community+Church+Hall",
          },
        )
      } catch (err) {
        console.error("Exception fetching meetings:", err)
        setError("An unexpected error occurred")

        // Fallback to default values
        setMorningMeeting({
          id: "",
          title: "Morning Prayer & Devotion",
          meeting_type: "morning",
          time: "7:00 AM - 8:00 AM",
          zoom_link: "https://zoom.us/j/example",
        })

        setEveningMeeting({
          id: "",
          title: "Evening Bible Study",
          meeting_type: "evening",
          time: "7:30 PM - 9:00 PM",
          location: "Community Church Hall",
          maps_link: "https://maps.google.com/?q=Community+Church+Hall",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchMeetings()
  }, [])

  // If database needs initialization, show the initialization UI
  if (needsInit) {
    return (
      <div className="flex flex-col space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{translations.meetings.title}</h1>

        <Card className="border-destructive">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
            <Database className="h-12 w-12 text-destructive mb-2" />
            <h2 className="text-xl font-semibold">Database Setup Required</h2>
            <p className="text-muted-foreground">
              The meetings table doesn't exist yet. Click the button below to initialize the database.
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
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.meetings.title}</h1>
      <p className="text-muted-foreground mb-6">{translations.meetings.subtitle}</p>

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
