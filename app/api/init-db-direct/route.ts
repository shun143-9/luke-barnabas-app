import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    // Create a Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    // Use the REST API directly to execute SQL
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
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
          
          -- Create sermons table
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
          
          -- Create meetings table
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
          
          -- Create prayer_requests table
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

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: `Failed to create tables: ${JSON.stringify(errorData)}` }, { status: 500 })
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
