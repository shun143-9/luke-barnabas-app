"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { useLanguage } from "@/context/language-context"

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, translations } = useLanguage()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const goToAdminPanel = () => {
    router.push("/admin")
  }

  const handleLanguageChange = (checked: boolean) => {
    setLanguage(checked ? "telugu" : "english")
  }

  const handleThemeChange = (checked: boolean) => {
    setTheme(checked ? "light" : "dark")
  }

  if (!mounted) return null

  return (
    <div className="flex flex-col space-y-6 max-w-md mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{translations.settings.title}</h1>
      <p className="text-muted-foreground mb-6">{translations.settings.subtitle}</p>

      <Card>
        <CardHeader>
          <CardTitle>{translations.settings.languagePreferences}</CardTitle>
          <CardDescription>{translations.settings.languageDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="language-toggle">{translations.settings.languageTitle}</Label>
              <p className="text-sm text-muted-foreground">{translations.settings.languageDescription}</p>
            </div>
            <Switch id="language-toggle" checked={language === "telugu"} onCheckedChange={handleLanguageChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{translations.settings.darkMode}</CardTitle>
          <CardDescription>{translations.settings.darkModeDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="theme-toggle">Light Mode</Label>
              <p className="text-sm text-muted-foreground">Switch between dark and light theme</p>
            </div>
            <Switch id="theme-toggle" checked={theme === "light"} onCheckedChange={handleThemeChange} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{translations.settings.administration}</CardTitle>
          <CardDescription>{translations.settings.adminDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{translations.settings.adminText}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={goToAdminPanel} className="w-full">
            {translations.settings.adminButton}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
