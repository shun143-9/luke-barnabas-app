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

    console.log("Creating tables using direct REST API...")

    // Use the REST API directly to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        query: `
          -- Create livestream table
          CREATE TABLE IF NOT EXISTS livestream (
            id SERIAL PRIMARY KEY,
            youtube_id TEXT NOT NULL,
            description TEXT,
            is_live BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SQL API error response:", response.status, errorText)
      return NextResponse.json(
        { error: `Failed to execute SQL: Status ${response.status}, ${errorText}` },
        { status: 500 },
      )
    }

    // Create sermons table
    const sermonsResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS sermons (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            description TEXT,
            date DATE NOT NULL,
            youtube_url TEXT NOT NULL,
            thumbnail_url TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      }),
    })

    if (!sermonsResponse.ok) {
      const errorText = await sermonsResponse.text()
      console.error("SQL API error response (sermons):", sermonsResponse.status, errorText)
    }

    // Create meetings table
    const meetingsResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS meetings (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            title TEXT NOT NULL,
            meeting_type TEXT NOT NULL,
            time TEXT NOT NULL,
            location TEXT,
            zoom_link TEXT,
            maps_link TEXT,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      }),
    })

    if (!meetingsResponse.ok) {
      const errorText = await meetingsResponse.text()
      console.error("SQL API error response (meetings):", meetingsResponse.status, errorText)
    }

    // Create prayer_requests table
    const prayerResponse = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        query: `
          CREATE TABLE IF NOT EXISTS prayer_requests (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            request TEXT NOT NULL,
            is_private BOOLEAN DEFAULT FALSE,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
      }),
    })

    if (!prayerResponse.ok) {
      const errorText = await prayerResponse.text()
      console.error("SQL API error response (prayer_requests):", prayerResponse.status, errorText)
    }

    // Insert default livestream data
    const { error: insertError } = await supabase
      .from("livestream")
      .insert({
        youtube_id: "jfKfPfyJRdk",
        description: "Welcome to Luke Barnabas Ministry livestream",
        is_live: false,
      })
      .select()
      .maybeSingle()

    if (insertError && !insertError.message.includes("duplicate key")) {
      console.error("Error inserting default livestream:", insertError)
    }

    console.log("Tables created successfully")
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
