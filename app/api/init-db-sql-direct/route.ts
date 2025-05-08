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

    console.log("Creating tables using direct SQL execution...")

    // Execute SQL directly using the SQL API
    const { error: sqlError } = await supabase.rpc("exec_sql", {
      sql: `
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
        
        -- Insert default livestream if it doesn't exist
        INSERT INTO livestream (youtube_id, description, is_live)
        SELECT 'jfKfPfyJRdk', 'Welcome to Luke Barnabas Ministry livestream', false
        WHERE NOT EXISTS (SELECT 1 FROM livestream LIMIT 1);
      `,
    })

    if (sqlError) {
      console.error("Error executing SQL:", sqlError)
      return NextResponse.json({ error: `Failed to execute SQL: ${sqlError.message}` }, { status: 500 })
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
