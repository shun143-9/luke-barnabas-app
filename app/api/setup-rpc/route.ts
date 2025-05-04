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
          -- Function to create livestream table
          CREATE OR REPLACE FUNCTION create_livestream_table()
          RETURNS void AS $$
          BEGIN
            CREATE TABLE IF NOT EXISTS livestream (
              id SERIAL PRIMARY KEY,
              youtube_id TEXT NOT NULL,
              description TEXT,
              is_live BOOLEAN DEFAULT FALSE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          END;
          $$ LANGUAGE plpgsql;

          -- Function to create sermons table
          CREATE OR REPLACE FUNCTION create_sermons_table()
          RETURNS void AS $$
          BEGIN
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
          END;
          $$ LANGUAGE plpgsql;

          -- Function to create meetings table
          CREATE OR REPLACE FUNCTION create_meetings_table()
          RETURNS void AS $$
          BEGIN
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
          END;
          $$ LANGUAGE plpgsql;

          -- Function to create prayer_requests table
          CREATE OR REPLACE FUNCTION create_prayer_requests_table()
          RETURNS void AS $$
          BEGIN
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
          END;
          $$ LANGUAGE plpgsql;
        `,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: `Failed to create RPC functions: ${JSON.stringify(errorData)}` },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, message: "RPC functions created successfully" })
  } catch (error: any) {
    console.error("Error creating RPC functions:", error)
    return NextResponse.json(
      { error: `Failed to create RPC functions: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}

// Also support GET for easier testing
export async function GET() {
  return POST()
}
