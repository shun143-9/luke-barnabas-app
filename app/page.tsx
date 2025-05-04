"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"
import { getLivestream } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function Home() {
  const [liveStreamId, setLiveStreamId] = useState("")
  const [isLive, setIsLive] = useState(false)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(true)
  const { translations } = useLanguage()

  useEffect(() => {
    async function fetchLivestream() {
      setLoading(true)
      const { data, error } = await getLivestream()

      if (data) {
        setLiveStreamId(data.youtube_id)
        setIsLive(data.is_live)
        setDescription(data.description)
      } else {
        // Fallback to default values if no data
        setLiveStreamId("jfKfPfyJRdk")
        setIsLive(true)
        setDescription(translations.home.aboutText1)
      }

      setLoading(false)
    }

    fetchLivestream()
  }, [translations.home.aboutText1])

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
