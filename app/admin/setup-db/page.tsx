"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function SetupDatabasePage() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`])
  }

  const createTables = async () => {
    setIsLoading(true)
    setResult(null)
    setLogs([])
    addLog("Starting database setup...")

    try {
      // Create livestream table
      addLog("Creating livestream table...")
      const livestreamResult = await executeSql(`
        CREATE TABLE IF NOT EXISTS livestream (
          id SERIAL PRIMARY KEY,
          youtube_id TEXT NOT NULL,
          description TEXT,
          is_live BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `)

      if (livestreamResult.error) {
        addLog(`Error creating livestream table: ${livestreamResult.error}`)
        setResult({ error: `Failed to create livestream table: ${livestreamResult.error}` })
        return
      }

      addLog("Livestream table created successfully")

      // Create sermons table
      addLog("Creating sermons table...")
      const sermonsResult = await executeSql(`
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
      `)

      if (sermonsResult.error) {
        addLog(`Error creating sermons table: ${sermonsResult.error}`)
        setResult({ error: `Failed to create sermons table: ${sermonsResult.error}` })
        return
      }

      addLog("Sermons table created successfully")

      // Create meetings table
      addLog("Creating meetings table...")
      const meetingsResult = await executeSql(`
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
      `)

      if (meetingsResult.error) {
        addLog(`Error creating meetings table: ${meetingsResult.error}`)
        setResult({ error: `Failed to create meetings table: ${meetingsResult.error}` })
        return
      }

      addLog("Meetings table created successfully")

      // Create prayer_requests table
      addLog("Creating prayer_requests table...")
      const prayerResult = await executeSql(`
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
      `)

      if (prayerResult.error) {
        addLog(`Error creating prayer_requests table: ${prayerResult.error}`)
        setResult({ error: `Failed to create prayer_requests table: ${prayerResult.error}` })
        return
      }

      addLog("Prayer requests table created successfully")

      // Insert default livestream data
      addLog("Inserting default livestream data...")
      const insertResult = await executeSql(`
        INSERT INTO livestream (youtube_id, description, is_live)
        SELECT 'jfKfPfyJRdk', 'Welcome to Luke Barnabas Ministry livestream', false
        WHERE NOT EXISTS (SELECT 1 FROM livestream LIMIT 1);
      `)

      if (insertResult.error) {
        addLog(`Error inserting default data: ${insertResult.error}`)
        setResult({ error: `Failed to insert default data: ${insertResult.error}` })
        return
      }

      addLog("Default data inserted successfully")

      setResult({ success: true })
      addLog("Database setup completed successfully!")
    } catch (error: any) {
      console.error("Error setting up database:", error)
      addLog(`Error: ${error.message || "Unknown error"}`)
      setResult({ error: error.message || "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  const executeSql = async (sql: string) => {
    try {
      const response = await fetch("/api/execute-sql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sql }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { error: data.error || "Failed to execute SQL" }
      }

      return { success: true }
    } catch (error: any) {
      console.error("Error executing SQL:", error)
      return { error: error.message || "An unexpected error occurred" }
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>Create the necessary tables in your Supabase database</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4">This utility will create the following tables in your Supabase database:</p>
          <ul className="list-disc pl-5 mb-4 space-y-1">
            <li>livestream - For managing the current livestream</li>
            <li>sermons - For storing sermon recordings</li>
            <li>meetings - For managing meeting information</li>
            <li>prayer_requests - For storing prayer requests</li>
          </ul>

          {result && (
            <div
              className={`p-4 mb-4 rounded-md ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {result.success ? "Database setup completed successfully!" : result.error}
            </div>
          )}

          <div className="bg-gray-100 p-4 rounded-md h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">Logs will appear here...</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="mb-1">
                  {log}
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={createTables} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up database...
              </>
            ) : (
              "Create Database Tables"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
