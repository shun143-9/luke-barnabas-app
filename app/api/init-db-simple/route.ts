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

    console.log("Creating tables using simple approach...")

    // Try to create the livestream table first
    try {
      const { error } = await supabase.from("livestream").select("id").limit(1)

      if (error && error.message.includes("does not exist")) {
        // Table doesn't exist, create it
        await fetch(`${supabaseUrl}/rest/v1/sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            query: `CREATE TABLE livestream (
              id SERIAL PRIMARY KEY,
              youtube_id TEXT NOT NULL,
              description TEXT,
              is_live BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`,
          }),
        })

        // Insert default data
        await supabase.from("livestream").insert({
          youtube_id: "jfKfPfyJRdk",
          description: "Welcome to Luke Barnabas Ministry livestream",
          is_live: false,
        })
      }
    } catch (err) {
      console.error("Error with livestream table:", err)
    }

    // Try to create the sermons table
    try {
      const { error } = await supabase.from("sermons").select("id").limit(1)

      if (error && error.message.includes("does not exist")) {
        // Table doesn't exist, create it
        await fetch(`${supabaseUrl}/rest/v1/sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            query: `CREATE TABLE sermons (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              title TEXT NOT NULL,
              description TEXT,
              date DATE NOT NULL,
              youtube_url TEXT NOT NULL,
              thumbnail_url TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`,
          }),
        })
      }
    } catch (err) {
      console.error("Error with sermons table:", err)
    }

    // Try to create the meetings table
    try {
      const { error } = await supabase.from("meetings").select("id").limit(1)

      if (error && error.message.includes("does not exist")) {
        // Table doesn't exist, create it
        await fetch(`${supabaseUrl}/rest/v1/sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            query: `CREATE TABLE meetings (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              title TEXT NOT NULL,
              meeting_type TEXT NOT NULL,
              time TEXT NOT NULL,
              location TEXT,
              zoom_link TEXT,
              maps_link TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`,
          }),
        })
      }
    } catch (err) {
      console.error("Error with meetings table:", err)
    }

    // Try to create the prayer_requests table
    try {
      const { error } = await supabase.from("prayer_requests").select("id").limit(1)

      if (error && error.message.includes("does not exist")) {
        // Table doesn't exist, create it
        await fetch(`${supabaseUrl}/rest/v1/sql`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            query: `CREATE TABLE prayer_requests (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              name TEXT NOT NULL,
              email TEXT,
              phone TEXT,
              request TEXT NOT NULL,
              is_private BOOLEAN DEFAULT FALSE,
              status TEXT DEFAULT 'pending',
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );`,
          }),
        })
      }
    } catch (err) {
      console.error("Error with prayer_requests table:", err)
    }

    return NextResponse.json({ success: true, message: "Database initialization attempted" })
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
