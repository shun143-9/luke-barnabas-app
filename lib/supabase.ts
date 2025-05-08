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
  meeting_type: string
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
  status: string
  created_at?: string
  updated_at?: string
}

// Create a single supabase client for the entire app
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
)

// Helper function to check if a table exists - updated to use the correct API
export async function checkTableExists(tableName: string) {
  try {
    // Use a direct query to check if the table exists
    const { data, error } = await supabase.from(tableName).select("*").limit(1).throwOnError()

    // If we get here without an error, the table exists
    return true
  } catch (err: any) {
    // Check if the error is because the table doesn't exist
    if (err.message && err.message.includes("does not exist")) {
      return false
    }

    // For other errors, log and return false
    console.error(`Error checking if table ${tableName} exists:`, err)
    return false
  }
}

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

// Data fetching functions with error handling
export async function getLivestream() {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("livestream")
    if (!tableExists) {
      return {
        data: null,
        error: { message: 'relation "public.livestream" does not exist' },
      }
    }

    const { data, error } = await supabase
      .from("livestream")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error) {
      console.error("Error fetching livestream:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Exception fetching livestream:", err)
    return { data: null, error: err }
  }
}

export async function updateLivestream(livestream: Partial<Livestream>) {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("livestream")
    if (!tableExists) {
      return {
        data: null,
        error: { message: 'relation "public.livestream" does not exist' },
      }
    }

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

    if (error) {
      console.error("Error updating livestream:", error)
      return { data: null, error }
    }

    return { data: data[0] || null, error: null }
  } catch (err) {
    console.error("Exception updating livestream:", err)
    return { data: null, error: err }
  }
}

export async function getSermons() {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("sermons")
    if (!tableExists) {
      return {
        data: [],
        error: { message: 'relation "public.sermons" does not exist' },
      }
    }

    const { data, error } = await supabase.from("sermons").select("*").order("date", { ascending: false })

    if (error) {
      console.error("Error fetching sermons:", error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Exception fetching sermons:", err)
    return { data: [], error: err }
  }
}

export async function getSermon(id: string) {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("sermons")
    if (!tableExists) {
      return {
        data: null,
        error: { message: 'relation "public.sermons" does not exist' },
      }
    }

    const { data, error } = await supabase.from("sermons").select("*").eq("id", id).single()

    if (error) {
      console.error("Error fetching sermon:", error)
      return { data: null, error }
    }

    return { data, error: null }
  } catch (err) {
    console.error("Exception fetching sermon:", err)
    return { data: null, error: err }
  }
}

export async function createSermon(sermon: Omit<Sermon, "id" | "created_at" | "updated_at">) {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("sermons")
    if (!tableExists) {
      return {
        data: null,
        error: { message: 'relation "public.sermons" does not exist' },
      }
    }

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

    if (error) {
      console.error("Error creating sermon:", error)
      return { data: null, error }
    }

    return { data: data[0] || null, error: null }
  } catch (err) {
    console.error("Exception creating sermon:", err)
    return { data: null, error: err }
  }
}

export async function updateSermon(id: string, sermon: Partial<Sermon>) {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("sermons")
    if (!tableExists) {
      return {
        data: null,
        error: { message: 'relation "public.sermons" does not exist' },
      }
    }

    const { data, error } = await supabase
      .from("sermons")
      .update({
        ...sermon,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()

    if (error) {
      console.error("Error updating sermon:", error)
      return { data: null, error }
    }

    return { data: data[0] || null, error: null }
  } catch (err) {
    console.error("Exception updating sermon:", err)
    return { data: null, error: err }
  }
}

export async function deleteSermon(id: string) {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("sermons")
    if (!tableExists) {
      return {
        error: { message: 'relation "public.sermons" does not exist' },
      }
    }

    const { error } = await supabase.from("sermons").delete().eq("id", id)

    if (error) {
      console.error("Error deleting sermon:", error)
      return { error }
    }

    return { error: null }
  } catch (err) {
    console.error("Exception deleting sermon:", err)
    return { error: err }
  }
}

export async function getMeetings() {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("meetings")
    if (!tableExists) {
      return {
        data: [],
        error: { message: 'relation "public.meetings" does not exist' },
      }
    }

    const { data, error } = await supabase.from("meetings").select("*")

    if (error) {
      console.error("Error fetching meetings:", error)
      return { data: [], error }
    }

    return { data: data || [], error: null }
  } catch (err) {
    console.error("Exception fetching meetings:", err)
    return { data: [], error: err }
  }
}

export async function getMeetingsByType(type: string) {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("meetings")
    if (!tableExists) {
      return {
        data: null,
        error: { message: 'relation "public.meetings" does not exist' },
      }
    }

    const { data, error } = await supabase
      .from("meetings")
      .select("*")
      .eq("meeting_type", type)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== "PGRST116") {
      // PGRST116 is the error code for no rows returned
      console.error("Error fetching meeting by type:", error)
      return { data: null, error }
    }

    return { data: data || null, error: null }
  } catch (err) {
    console.error("Exception fetching meeting by type:", err)
    return { data: null, error: err }
  }
}

export async function updateMeeting(meeting: Partial<Meeting>) {
  try {
    // First check if the table exists
    const tableExists = await checkTableExists("meetings")
    if (!tableExists) {
      return {
        data: null,
        error: { message: 'relation "public.meetings" does not exist' },
      }
    }

    // Create a clean object without undefined values
    const cleanMeeting = Object.fromEntries(
      Object.entries({
        id: meeting.id,
        title: meeting.title,
        meeting_type: meeting.meeting_type,
        time: meeting.time,
        location: meeting.location,
        zoom_link: meeting.zoom_link,
        maps_link: meeting.maps_link,
        updated_at: new Date().toISOString(),
      }).filter(([_, v]) => v !== undefined),
    )

    const { data, error } = await supabase.from("meetings").upsert(cleanMeeting).select()

    if (error) {
      console.error("Error updating meeting:", error)
      return { data: null, error }
    }

    return { data: data[0] || null, error: null }
  } catch (err) {
    console.error("Exception updating meeting:", err)
    return { data: null, error: err }
  }
}

// Add this function to check if all required tables exist
export async function checkAllTablesExist() {
  try {
    const tables = ["livestream", "sermons", "meetings", "prayer_requests"]
    let allExist = true

    for (const table of tables) {
      const exists = await checkTableExists(table)
      if (!exists) {
        console.log(`Table ${table} does not exist`)
        allExist = false
        break
      }
    }

    return allExist
  } catch (err) {
    console.error("Error checking tables:", err)
    return false
  }
}

// Add this function to seed sample data
export async function seedSampleData() {
  try {
    // Check if livestream has data
    const { data: livestreamData, error: livestreamError } = await supabase.from("livestream").select("*").limit(1)

    if (!livestreamError && (!livestreamData || livestreamData.length === 0)) {
      // Insert default livestream
      await supabase.from("livestream").insert({
        youtube_id: "jfKfPfyJRdk",
        description: "Welcome to Luke Barnabas Ministry livestream",
        is_live: false,
      })
    }

    // Check if sermons has data
    const { data: sermonsData, error: sermonsError } = await supabase.from("sermons").select("*").limit(1)

    if (!sermonsError && (!sermonsData || sermonsData.length === 0)) {
      // Insert sample sermons
      await supabase.from("sermons").insert([
        {
          title: "Finding Peace in God's Promises",
          description: "Pastor Luke explores how God's promises can bring peace in our daily lives.",
          date: "2023-05-01",
          youtube_url: "https://www.youtube.com/watch?v=example1",
          thumbnail_url: "/placeholder.svg?height=200&width=350",
        },
        {
          title: "The Power of Prayer",
          description: "Learn how prayer can transform your relationship with God and others around you.",
          date: "2023-04-28",
          youtube_url: "https://www.youtube.com/watch?v=example2",
          thumbnail_url: "/placeholder.svg?height=200&width=350",
        },
      ])
    }

    // Check if meetings has data
    const { data: meetingsData, error: meetingsError } = await supabase.from("meetings").select("*").limit(1)

    if (!meetingsError && (!meetingsData || meetingsData.length === 0)) {
      // Insert sample meetings
      await supabase.from("meetings").insert([
        {
          title: "Morning Prayer & Devotion",
          meeting_type: "morning",
          time: "7:00 AM - 8:00 AM",
          zoom_link: "https://zoom.us/j/example",
        },
        {
          title: "Evening Bible Study",
          meeting_type: "evening",
          time: "7:30 PM - 9:00 PM",
          location: "Community Church Hall",
          maps_link: "https://maps.google.com/?q=Community+Church+Hall",
        },
      ])
    }

    return { success: true }
  } catch (err) {
    console.error("Error seeding data:", err)
    return { success: false, error: err }
  }
}
