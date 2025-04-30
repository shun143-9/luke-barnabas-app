"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { useLanguage } from "@/context/language-context"

export default function Home() {
  // In a real app, this would come from your database
  const [liveStreamId, setLiveStreamId] = useState("jfKfPfyJRdk")
  const [isLive, setIsLive] = useState(true)
  const { translations } = useLanguage()

  return (
    <div className="flex flex-col space-y-6">
      <section>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{translations.home.welcome}</h1>

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
            <p className="text-muted-foreground">{translations.home.aboutText1}</p>
          </CardContent>
        </Card>
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
