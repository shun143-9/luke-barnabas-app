import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    // Create a Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseKey)

    // Check if tables exist by trying to select from them
    const { error: livestreamError } = await supabase.from("livestream").select("id").limit(1)
    const { error: sermonsError } = await supabase.from("sermons").select("id").limit(1)
    const { error: meetingsError } = await supabase.from("meetings").select("id").limit(1)
    const { error: prayerRequestsError } = await supabase.from("prayer_requests").select("id").limit(1)

    // Create tables if they don't exist
    if (livestreamError && livestreamError.message.includes("does not exist")) {
      // Create livestream table using standard SQL
      const { error } = await supabase.schema.createTable("livestream", {
        id: { type: "serial", primaryKey: true },
        youtube_id: { type: "text", notNull: true },
        description: { type: "text" },
        is_live: { type: "boolean", default: false },
        created_at: { type: "timestamp with time zone", default: "now()" },
        updated_at: { type: "timestamp with time zone", default: "now()" },
      })

      if (error) {
        console.error("Error creating livestream table:", error)
        return NextResponse.json({ error: `Failed to create livestream table: ${error.message}` }, { status: 500 })
      }
    }

    if (sermonsError && sermonsError.message.includes("does not exist")) {
      // Create sermons table
      const { error } = await supabase.schema.createTable("sermons", {
        id: { type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
        title: { type: "text", notNull: true },
        description: { type: "text" },
        date: { type: "date", notNull: true },
        youtube_url: { type: "text", notNull: true },
        thumbnail_url: { type: "text" },
        created_at: { type: "timestamp with time zone", default: "now()" },
        updated_at: { type: "timestamp with time zone", default: "now()" },
      })

      if (error) {
        console.error("Error creating sermons table:", error)
        return NextResponse.json({ error: `Failed to create sermons table: ${error.message}` }, { status: 500 })
      }
    }

    if (meetingsError && meetingsError.message.includes("does not exist")) {
      // Create meetings table
      const { error } = await supabase.schema.createTable("meetings", {
        id: { type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
        title: { type: "text", notNull: true },
        meeting_type: { type: "text", notNull: true },
        time: { type: "text", notNull: true },
        location: { type: "text" },
        zoom_link: { type: "text" },
        maps_link: { type: "text" },
        created_at: { type: "timestamp with time zone", default: "now()" },
        updated_at: { type: "timestamp with time zone", default: "now()" },
      })

      if (error) {
        console.error("Error creating meetings table:", error)
        return NextResponse.json({ error: `Failed to create meetings table: ${error.message}` }, { status: 500 })
      }
    }

    if (prayerRequestsError && prayerRequestsError.message.includes("does not exist")) {
      // Create prayer_requests table
      const { error } = await supabase.schema.createTable("prayer_requests", {
        id: { type: "uuid", primaryKey: true, default: "gen_random_uuid()" },
        name: { type: "text", notNull: true },
        email: { type: "text" },
        phone: { type: "text" },
        request: { type: "text", notNull: true },
        is_private: { type: "boolean", default: false },
        status: { type: "text", default: "'pending'" },
        created_at: { type: "timestamp with time zone", default: "now()" },
        updated_at: { type: "timestamp with time zone", default: "now()" },
      })

      if (error) {
        console.error("Error creating prayer_requests table:", error)
        return NextResponse.json({ error: `Failed to create prayer_requests table: ${error.message}` }, { status: 500 })
      }
    }

    // Insert default livestream data if it doesn't exist
    const { data: existingData, error: checkError } = await supabase.from("livestream").select("*").limit(1)

    if (checkError) {
      console.error("Error checking existing livestream data:", checkError)
      return NextResponse.json({ error: `Failed to check existing data: ${checkError.message}` }, { status: 500 })
    }

    if (!existingData || existingData.length === 0) {
      const { error: insertError } = await supabase.from("livestream").insert({
        youtube_id: "jfKfPfyJRdk",
        description: "Welcome to Luke Barnabas Ministry livestream",
        is_live: false,
      })

      if (insertError) {
        console.error("Error inserting default livestream:", insertError)
        return NextResponse.json({ error: `Failed to insert default data: ${insertError.message}` }, { status: 500 })
      }
    }

    return NextResponse.json({ success: true, message: "Database initialized successfully" })
  } catch (error: any) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      { error: `Failed to initialize database: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}

// Also support POST for compatibility
export async function POST() {
  return GET()
}
