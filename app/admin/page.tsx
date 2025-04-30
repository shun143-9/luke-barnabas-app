"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/context/language-context"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()
  const { translations } = useLanguage()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    // Updated with the provided credentials
    if (email === "nitaspirant1439@gmail.com" && password === "Bhuvi...777") {
      router.push("/admin/dashboard")
    } else {
      setError("Invalid email or password")
    }
  }

  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">{translations.admin.loginTitle}</h1>

      <Card className="w-full">
        <form onSubmit={handleLogin}>
          <CardHeader>
            <CardTitle>{translations.admin.signIn}</CardTitle>
            <CardDescription>{translations.admin.loginSubtitle}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm bg-red-900 text-red-100 border border-red-700 rounded-md">{error}</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{translations.admin.email}</Label>
              <Input
                id="email"
                type="email"
                placeholder="nitaspirant1439@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{translations.admin.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              {translations.admin.signIn}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
