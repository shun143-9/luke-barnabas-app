import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Create tables one by one using separate queries
    // Create livestream table
    const { error: livestreamError } = await supabase.rpc("create_livestream_table")
    if (livestreamError) {
      console.error("Error creating livestream table:", livestreamError)
      return NextResponse.json(
        { error: `Failed to create livestream table: ${livestreamError.message}` },
        { status: 500 },
      )
    }

    // Create sermons table
    const { error: sermonsError } = await supabase.rpc("create_sermons_table")
    if (sermonsError) {
      console.error("Error creating sermons table:", sermonsError)
      return NextResponse.json({ error: `Failed to create sermons table: ${sermonsError.message}` }, { status: 500 })
    }

    // Create meetings table
    const { error: meetingsError } = await supabase.rpc("create_meetings_table")
    if (meetingsError) {
      console.error("Error creating meetings table:", meetingsError)
      return NextResponse.json({ error: `Failed to create meetings table: ${meetingsError.message}` }, { status: 500 })
    }

    // Create prayer_requests table
    const { error: prayerRequestsError } = await supabase.rpc("create_prayer_requests_table")
    if (prayerRequestsError) {
      console.error("Error creating prayer_requests table:", prayerRequestsError)
      return NextResponse.json(
        { error: `Failed to create prayer_requests table: ${prayerRequestsError.message}` },
        { status: 500 },
      )
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

// Also support GET for easier testing
export async function GET() {
  return POST()
}
