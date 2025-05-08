import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(request: Request) {
  try {
    const { sql } = await request.json()

    if (!sql) {
      return NextResponse.json({ error: "SQL query is required" }, { status: 400 })
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "Missing Supabase environment variables" }, { status: 500 })
    }

    // Create a Supabase client with admin privileges
    const supabase = createClient(supabaseUrl, supabaseKey)

    console.log("Executing SQL:", sql)

    // Execute SQL directly using the REST API
    const response = await fetch(`${supabaseUrl}/rest/v1/sql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({ query: sql }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("SQL API error response:", response.status, errorText)
      return NextResponse.json(
        { error: `Failed to execute SQL: Status ${response.status}, ${errorText}` },
        { status: 500 },
      )
    }

    const result = await response.json()

    return NextResponse.json({ success: true, result })
  } catch (error: any) {
    console.error("Error executing SQL:", error)
    return NextResponse.json({ error: `Failed to execute SQL: ${error.message || "Unknown error"}` }, { status: 500 })
  }
}
