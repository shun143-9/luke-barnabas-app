"use client"

import type React from "react"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/context/language-context"

export default function AdminDashboardPage() {
  const { translations } = useLanguage()

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.admin.dashboardTitle}</h1>
      <p className="text-muted-foreground mb-6">{translations.admin.dashboardSubtitle}</p>

      <Tabs defaultValue="livestream">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="livestream">{translations.admin.livestreamTab}</TabsTrigger>
          <TabsTrigger value="sermons">{translations.admin.sermonsTab}</TabsTrigger>
          <TabsTrigger value="meetings">{translations.admin.meetingsTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="livestream" className="mt-6">
          <LiveStreamForm />
        </TabsContent>

        <TabsContent value="sermons" className="mt-6">
          <SermonForm />
        </TabsContent>

        <TabsContent value="meetings" className="mt-6">
          <MeetingsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LiveStreamForm() {
  const [videoId, setVideoId] = useState("")
  const [description, setDescription] = useState("")
  const { translations } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save this to your database
    alert("Live stream updated successfully!")
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{translations.admin.updateLivestream}</CardTitle>
          <CardDescription>{translations.admin.livestreamDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="video-id">{translations.admin.videoId}</Label>
            <Input
              id="video-id"
              placeholder="e.g. dQw4w9WgXcQ"
              value={videoId}
              onChange={(e) => setVideoId(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">{translations.admin.videoIdHelp}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{translations.admin.streamDescription}</Label>
            <Textarea
              id="description"
              placeholder="Describe the current live stream..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {translations.admin.updateButton} {translations.admin.livestreamTab}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function SermonForm() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [youtubeLink, setYoutubeLink] = useState("")
  const [thumbnailUrl, setThumbnailUrl] = useState("")
  const [date, setDate] = useState("")
  const { translations } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save this to your database
    alert("Sermon added successfully!")
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{translations.admin.addSermon}</CardTitle>
          <CardDescription>{translations.admin.sermonDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">{translations.admin.sermonTitle}</Label>
            <Input
              id="title"
              placeholder="e.g. Finding Peace in Christ"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">{translations.admin.date}</Label>
            <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{translations.admin.description}</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the sermon..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="youtube-link">{translations.admin.youtubeLink}</Label>
            <Input
              id="youtube-link"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeLink}
              onChange={(e) => setYoutubeLink(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thumbnail">{translations.admin.thumbnailUrl}</Label>
            <Input
              id="thumbnail"
              placeholder="https://example.com/image.jpg"
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {translations.admin.addButton} {translations.admin.sermonsTab}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

function MeetingsForm() {
  const [morningTitle, setMorningTitle] = useState("")
  const [morningTime, setMorningTime] = useState("")
  const [morningZoomLink, setMorningZoomLink] = useState("")

  const [eveningTitle, setEveningTitle] = useState("")
  const [eveningTime, setEveningTime] = useState("")
  const [eveningLocation, setEveningLocation] = useState("")
  const [eveningMapsLink, setEveningMapsLink] = useState("")

  const { translations } = useLanguage()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would save this to your database
    alert("Meeting details updated successfully!")
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{translations.admin.updateMeetings}</CardTitle>
          <CardDescription>{translations.admin.meetingsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{translations.admin.morningMeeting}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="morning-title">{translations.admin.meetingTitle}</Label>
                <Input
                  id="morning-title"
                  placeholder="e.g. Morning Prayer & Devotion"
                  value={morningTitle}
                  onChange={(e) => setMorningTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="morning-time">{translations.admin.time}</Label>
                <Input
                  id="morning-time"
                  placeholder="e.g. 7:00 AM - 8:00 AM"
                  value={morningTime}
                  onChange={(e) => setMorningTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="morning-zoom">{translations.admin.zoomLink}</Label>
                <Input
                  id="morning-zoom"
                  placeholder="https://zoom.us/j/..."
                  value={morningZoomLink}
                  onChange={(e) => setMorningZoomLink(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">{translations.admin.eveningMeeting}</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="evening-title">{translations.admin.meetingTitle}</Label>
                <Input
                  id="evening-title"
                  placeholder="e.g. Evening Bible Study"
                  value={eveningTitle}
                  onChange={(e) => setEveningTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evening-time">{translations.admin.time}</Label>
                <Input
                  id="evening-time"
                  placeholder="e.g. 7:30 PM - 9:00 PM"
                  value={eveningTime}
                  onChange={(e) => setEveningTime(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evening-location">{translations.admin.locationName}</Label>
                <Input
                  id="evening-location"
                  placeholder="e.g. Community Church Hall"
                  value={eveningLocation}
                  onChange={(e) => setEveningLocation(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evening-maps">{translations.admin.mapsLink}</Label>
                <Input
                  id="evening-maps"
                  placeholder="https://maps.google.com/?q=..."
                  value={eveningMapsLink}
                  onChange={(e) => setEveningMapsLink(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {translations.admin.updateButton} {translations.admin.meetingsTab}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
