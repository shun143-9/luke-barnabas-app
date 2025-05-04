"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/context/language-context"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import {
  createSermonAction,
  deleteSermonAction,
  updateEveningMeetingAction,
  updateLivestreamAction,
  updateMorningMeetingAction,
  updateSermonAction,
} from "@/app/actions"
import { useFormState } from "react-dom"
import {
  getLivestream,
  getMeetingsByType,
  getSermons,
  type Livestream,
  type Meeting,
  type Sermon,
} from "@/lib/supabase"
import { Loader2, Trash2 } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const initialState = {
  success: true,
  error: null,
  data: null,
}

export default function AdminDashboardPage() {
  const { translations } = useLanguage()
  const [activeTab, setActiveTab] = useState("livestream")

  return (
    <div className="flex flex-col space-y-6">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.admin.dashboardTitle}</h1>
      <p className="text-muted-foreground mb-6">{translations.admin.dashboardSubtitle}</p>

      <Tabs defaultValue="livestream" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="livestream">{translations.admin.livestreamTab}</TabsTrigger>
          <TabsTrigger value="sermons">{translations.admin.sermonsTab}</TabsTrigger>
          <TabsTrigger value="meetings">{translations.admin.meetingsTab}</TabsTrigger>
        </TabsList>

        <TabsContent value="livestream" className="mt-6">
          <LiveStreamForm />
        </TabsContent>

        <TabsContent value="sermons" className="mt-6">
          <SermonManager />
        </TabsContent>

        <TabsContent value="meetings" className="mt-6">
          <MeetingsForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function LiveStreamForm() {
  const { translations } = useLanguage()
  const { toast } = useToast()
  const [livestream, setLivestream] = useState<Livestream | null>(null)
  const [loading, setLoading] = useState(true)

  const [state, formAction] = useFormState(updateLivestreamAction, initialState)

  useEffect(() => {
    async function fetchLivestream() {
      setLoading(true)
      const { data, error } = await getLivestream()
      if (data) {
        setLivestream(data)
      } else {
        // Create default if none exists
        setLivestream({
          id: 1,
          youtube_id: "",
          description: "",
          is_live: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      }
      setLoading(false)
    }

    fetchLivestream()
  }, [])

  useEffect(() => {
    if (state.success && state.data) {
      toast({
        title: "Success",
        description: "Livestream updated successfully",
      })
    } else if (!state.success) {
      toast({
        title: "Error",
        description: state.error || "Failed to update livestream",
        variant: "destructive",
      })
    }
  }, [state, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <form action={formAction}>
        <CardHeader>
          <CardTitle>{translations.admin.updateLivestream}</CardTitle>
          <CardDescription>{translations.admin.livestreamDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="youtube_id">{translations.admin.videoId}</Label>
            <Input
              id="youtube_id"
              name="youtube_id"
              placeholder="e.g. dQw4w9WgXcQ"
              defaultValue={livestream?.youtube_id}
              required
            />
            <p className="text-xs text-muted-foreground">{translations.admin.videoIdHelp}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{translations.admin.streamDescription}</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the current live stream..."
              defaultValue={livestream?.description}
              rows={4}
              required
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch id="is_live" name="is_live" defaultChecked={livestream?.is_live} />
            <Label htmlFor="is_live">Currently Live</Label>
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

function SermonManager() {
  const { translations } = useLanguage()
  const { toast } = useToast()
  const [sermons, setSermons] = useState<Sermon[]>([])
  const [loading, setLoading] = useState(true)
  const [editingSermon, setEditingSermon] = useState<Sermon | null>(null)

  const [createState, createFormAction] = useFormState(createSermonAction, initialState)
  const [updateState, updateFormAction] = useFormState(updateSermonAction, initialState)
  const [deleteState, deleteFormAction] = useFormState(deleteSermonAction, initialState)

  useEffect(() => {
    async function fetchSermons() {
      setLoading(true)
      const { data, error } = await getSermons()
      if (data) {
        setSermons(data)
      }
      setLoading(false)
    }

    fetchSermons()
  }, [createState, updateState, deleteState])

  useEffect(() => {
    if (createState.success && createState.data) {
      toast({
        title: "Success",
        description: "Sermon created successfully",
      })
    } else if (!createState.success) {
      toast({
        title: "Error",
        description: createState.error || "Failed to create sermon",
        variant: "destructive",
      })
    }
  }, [createState, toast])

  useEffect(() => {
    if (updateState.success && updateState.data) {
      toast({
        title: "Success",
        description: "Sermon updated successfully",
      })
      setEditingSermon(null)
    } else if (!updateState.success) {
      toast({
        title: "Error",
        description: updateState.error || "Failed to update sermon",
        variant: "destructive",
      })
    }
  }, [updateState, toast])

  useEffect(() => {
    if (deleteState.success) {
      toast({
        title: "Success",
        description: "Sermon deleted successfully",
      })
    } else if (!deleteState.success) {
      toast({
        title: "Error",
        description: deleteState.error || "Failed to delete sermon",
        variant: "destructive",
      })
    }
  }, [deleteState, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <form action={createFormAction}>
          <CardHeader>
            <CardTitle>{translations.admin.addSermon}</CardTitle>
            <CardDescription>{translations.admin.sermonDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">{translations.admin.sermonTitle}</Label>
              <Input id="title" name="title" placeholder="e.g. Finding Peace in Christ" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">{translations.admin.date}</Label>
              <Input id="date" name="date" type="date" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{translations.admin.description}</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Brief description of the sermon..."
                rows={3}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtube_url">{translations.admin.youtubeLink}</Label>
              <Input id="youtube_url" name="youtube_url" placeholder="https://www.youtube.com/watch?v=..." required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">{translations.admin.thumbnailUrl}</Label>
              <Input id="thumbnail_url" name="thumbnail_url" placeholder="https://example.com/image.jpg" required />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {translations.admin.addButton} {translations.admin.sermonsTab}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Sermons</CardTitle>
          <CardDescription>Edit or delete existing sermons</CardDescription>
        </CardHeader>
        <CardContent>
          {sermons.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No sermons found</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sermons.map((sermon) => (
                  <TableRow key={sermon.id}>
                    <TableCell className="font-medium">{sermon.title}</TableCell>
                    <TableCell>{new Date(sermon.date).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingSermon(sermon)}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Edit Sermon</DialogTitle>
                              <DialogDescription>Make changes to the sermon details below</DialogDescription>
                            </DialogHeader>
                            {editingSermon && (
                              <form action={updateFormAction} className="space-y-4 py-4">
                                <input type="hidden" name="id" value={editingSermon.id} />
                                <div className="space-y-2">
                                  <Label htmlFor="edit-title">Title</Label>
                                  <Input id="edit-title" name="title" defaultValue={editingSermon.title} required />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-date">Date</Label>
                                  <Input
                                    id="edit-date"
                                    name="date"
                                    type="date"
                                    defaultValue={editingSermon.date}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-description">Description</Label>
                                  <Textarea
                                    id="edit-description"
                                    name="description"
                                    defaultValue={editingSermon.description}
                                    rows={3}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-youtube_url">YouTube Link</Label>
                                  <Input
                                    id="edit-youtube_url"
                                    name="youtube_url"
                                    defaultValue={editingSermon.youtube_url}
                                    required
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="edit-thumbnail_url">Thumbnail URL</Label>
                                  <Input
                                    id="edit-thumbnail_url"
                                    name="thumbnail_url"
                                    defaultValue={editingSermon.thumbnail_url}
                                    required
                                  />
                                </div>
                                <DialogFooter>
                                  <Button type="submit">Save changes</Button>
                                </DialogFooter>
                              </form>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Sermon</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this sermon? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <form action={deleteFormAction}>
                              <input type="hidden" name="id" value={sermon.id} />
                              <DialogFooter className="mt-4">
                                <Button type="submit" variant="destructive">
                                  Delete
                                </Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function MeetingsForm() {
  const { translations } = useLanguage()
  const { toast } = useToast()
  const [morningMeeting, setMorningMeeting] = useState<Meeting | null>(null)
  const [eveningMeeting, setEveningMeeting] = useState<Meeting | null>(null)
  const [loading, setLoading] = useState(true)

  const [morningState, morningFormAction] = useFormState(updateMorningMeetingAction, initialState)
  const [eveningState, eveningFormAction] = useFormState(updateEveningMeetingAction, initialState)

  useEffect(() => {
    async function fetchMeetings() {
      setLoading(true)

      // Fetch morning meeting
      const { data: morningData } = await getMeetingsByType("morning")
      if (morningData) {
        setMorningMeeting(morningData)
      } else {
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

  useEffect(() => {
    if (morningState.success && morningState.data) {
      toast({
        title: "Success",
        description: "Morning meeting updated successfully",
      })
    } else if (!morningState.success) {
      toast({
        title: "Error",
        description: morningState.error || "Failed to update morning meeting",
        variant: "destructive",
      })
    }
  }, [morningState, toast])

  useEffect(() => {
    if (eveningState.success && eveningState.data) {
      toast({
        title: "Success",
        description: "Evening meeting updated successfully",
      })
    } else if (!eveningState.success) {
      toast({
        title: "Error",
        description: eveningState.error || "Failed to update evening meeting",
        variant: "destructive",
      })
    }
  }, [eveningState, toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card>
      <form action={morningFormAction}>
        <CardHeader>
          <CardTitle>{translations.admin.updateMeetings}</CardTitle>
          <CardDescription>{translations.admin.meetingsDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-4">{translations.admin.morningMeeting}</h3>
            <div className="space-y-4">
              <input type="hidden" name="id" value={morningMeeting?.id || ""} />
              <div className="space-y-2">
                <Label htmlFor="morning-title">{translations.admin.meetingTitle}</Label>
                <Input
                  id="morning-title"
                  name="title"
                  placeholder="e.g. Morning Prayer & Devotion"
                  defaultValue={morningMeeting?.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="morning-time">{translations.admin.time}</Label>
                <Input
                  id="morning-time"
                  name="time"
                  placeholder="e.g. 7:00 AM - 8:00 AM"
                  defaultValue={morningMeeting?.time}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="morning-zoom">{translations.admin.zoomLink}</Label>
                <Input
                  id="morning-zoom"
                  name="zoom_link"
                  placeholder="https://zoom.us/j/..."
                  defaultValue={morningMeeting?.zoom_link}
                  required
                />
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full">
            {translations.admin.updateButton} {translations.admin.morningMeeting}
          </Button>
        </CardContent>
      </form>

      <form action={eveningFormAction}>
        <CardContent className="space-y-6 pt-0">
          <div>
            <h3 className="text-lg font-medium mb-4">{translations.admin.eveningMeeting}</h3>
            <div className="space-y-4">
              <input type="hidden" name="id" value={eveningMeeting?.id || ""} />
              <div className="space-y-2">
                <Label htmlFor="evening-title">{translations.admin.meetingTitle}</Label>
                <Input
                  id="evening-title"
                  name="title"
                  placeholder="e.g. Evening Bible Study"
                  defaultValue={eveningMeeting?.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evening-time">{translations.admin.time}</Label>
                <Input
                  id="evening-time"
                  name="time"
                  placeholder="e.g. 7:30 PM - 9:00 PM"
                  defaultValue={eveningMeeting?.time}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evening-location">{translations.admin.locationName}</Label>
                <Input
                  id="evening-location"
                  name="location"
                  placeholder="e.g. Community Church Hall"
                  defaultValue={eveningMeeting?.location}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evening-maps">{translations.admin.mapsLink}</Label>
                <Input
                  id="evening-maps"
                  name="maps_link"
                  placeholder="https://maps.google.com/?q=..."
                  defaultValue={eveningMeeting?.maps_link}
                  required
                />
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full">
            {translations.admin.updateButton} {translations.admin.eveningMeeting}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
