"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Loader2, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function PrayerRequestPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [request, setRequest] = useState("")
  const [isPrivate, setIsPrivate] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Validate form
      if (!name || !request) {
        throw new Error("Name and prayer request are required")
      }

      // Submit to Supabase
      const { error } = await supabase.from("prayer_requests").insert({
        name,
        email: email || null,
        phone: phone || null,
        request,
        is_private: isPrivate,
        status: "pending",
      })

      if (error) {
        throw new Error(error.message)
      }

      // Clear form and show success
      setName("")
      setEmail("")
      setPhone("")
      setRequest("")
      setIsPrivate(false)
      setSuccess(true)
    } catch (err: any) {
      console.error("Error submitting prayer request:", err)
      setError(err.message || "Failed to submit prayer request. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Prayer Requests</h1>
      <p className="text-muted-foreground mb-6">
        Share your prayer needs with us. We are committed to praying for you and your concerns.
      </p>

      {success ? (
        <Card className="border-green-500">
          <CardContent className="pt-6 pb-6 flex flex-col items-center text-center space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500 mb-2" />
            <h2 className="text-xl font-semibold">Prayer Request Submitted</h2>
            <p className="text-muted-foreground">
              Thank you for sharing your prayer request. Our prayer team will be praying for you.
            </p>
            <Button onClick={() => setSuccess(false)} className="mt-2">
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Submit a Prayer Request</CardTitle>
              <CardDescription>Fill out the form below to submit your prayer request.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 text-sm bg-destructive/20 text-destructive-foreground border border-destructive/50 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="name">Your Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone (Optional)</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="request">Prayer Request *</Label>
                <Textarea
                  id="request"
                  value={request}
                  onChange={(e) => setRequest(e.target.value)}
                  placeholder="Share your prayer request here..."
                  rows={5}
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="private" checked={isPrivate} onCheckedChange={setIsPrivate} />
                <Label htmlFor="private">Keep this request private (only visible to the prayer team)</Label>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Prayer Request"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      )}
    </div>
  )
}
