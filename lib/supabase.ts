import { createClient } from "@supabase/supabase-js"

// Types for our database tables
export type Sermon = {
  id: string
  title: string
  description: string
  date: string
  youtube_url: string
  thumbnail_url: string
  created_at?: string
  updated_at?: string
}

export type Meeting = {
  id: string
  title: string
  meeting_type: "morning" | "evening"
  time: string
  location?: string
  zoom_link?: string
  maps_link?: string
  created_at?: string
  updated_at?: string
}

export type Livestream = {
  id: number
  youtube_id: string
  description: string
  is_live: boolean
  created_at?: string
  updated_at?: string
}

export type PrayerRequest = {
  id: string
  name: string
  email?: string
  phone?: string
  request: string
  is_private: boolean
  status: "pending" | "approved" | "rejected"
  created_at?: string
  updated_at?: string
}

// Create a single supabase client for the entire app
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Authentication helper functions
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  return { data, error }
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export async function getCurrentUser() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  return { user, error }
}

// Data fetching functions
export async function getLivestream() {
  const { data, error } = await supabase
    .from("livestream")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return { data, error }
}

export async function updateLivestream(livestream: Partial<Livestream>) {
  const { data, error } = await supabase
    .from("livestream")
    .upsert({
      id: livestream.id || 1, // Default to ID 1 if not provided
      youtube_id: livestream.youtube_id,
      description: livestream.description,
      is_live: livestream.is_live,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}

export async function getSermons() {
  const { data, error } = await supabase.from("sermons").select("*").order("date", { ascending: false })

  return { data, error }
}

export async function getSermon(id: string) {
  const { data, error } = await supabase.from("sermons").select("*").eq("id", id).single()

  return { data, error }
}

export async function createSermon(sermon: Omit<Sermon, "id" | "created_at" | "updated_at">) {
  const { data, error } = await supabase
    .from("sermons")
    .insert({
      title: sermon.title,
      description: sermon.description,
      date: sermon.date,
      youtube_url: sermon.youtube_url,
      thumbnail_url: sermon.thumbnail_url,
    })
    .select()
    .single()

  return { data, error }
}

export async function updateSermon(id: string, sermon: Partial<Sermon>) {
  const { data, error } = await supabase
    .from("sermons")
    .update({
      ...sermon,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select()
    .single()

  return { data, error }
}

export async function deleteSermon(id: string) {
  const { error } = await supabase.from("sermons").delete().eq("id", id)

  return { error }
}

export async function getMeetings() {
  const { data, error } = await supabase.from("meetings").select("*")

  return { data, error }
}

export async function getMeetingsByType(type: "morning" | "evening") {
  const { data, error } = await supabase
    .from("meetings")
    .select("*")
    .eq("meeting_type", type)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  return { data, error }
}

export async function updateMeeting(meeting: Partial<Meeting>) {
  const { data, error } = await supabase
    .from("meetings")
    .upsert({
      id: meeting.id || undefined,
      title: meeting.title!,
      meeting_type: meeting.meeting_type!,
      time: meeting.time!,
      location: meeting.location,
      zoom_link: meeting.zoom_link,
      maps_link: meeting.maps_link,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single()

  return { data, error }
}
