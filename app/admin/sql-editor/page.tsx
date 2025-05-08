"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

export default function SqlEditorPage() {
  const [sql, setSql] = useState(`-- Create livestream table
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
WHERE NOT EXISTS (SELECT 1 FROM livestream LIMIT 1);`)
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{ success?: boolean; error?: string; data?: any } | null>(null)

  const executeSql = async () => {
    setIsLoading(true)
    setResult(null)

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
        setResult({ error: data.error || "Failed to execute SQL" })
      } else {
        setResult({ success: true, data: data.result })
      }
    } catch (error: any) {
      console.error("Error executing SQL:", error)
      setResult({ error: error.message || "An unexpected error occurred" })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>SQL Editor</CardTitle>
          <CardDescription>Execute SQL queries directly against your Supabase database</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={sql}
            onChange={(e) => setSql(e.target.value)}
            className="font-mono h-80 mb-4"
            placeholder="Enter your SQL query here..."
          />

          {result && (
            <div
              className={`p-4 mb-4 rounded-md ${result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
            >
              {result.success ? "SQL executed successfully!" : result.error}
            </div>
          )}

          {result?.success && result.data && (
            <div className="bg-gray-100 p-4 rounded-md max-h-64 overflow-y-auto font-mono text-sm">
              <pre>{JSON.stringify(result.data, null, 2)}</pre>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={executeSql} disabled={isLoading} className="w-full">
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executing SQL...
              </>
            ) : (
              "Execute SQL"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
