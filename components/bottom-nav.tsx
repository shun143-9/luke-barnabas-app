"use client"

import { Home, Book, Calendar, Settings, Heart } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/language-context"

export default function BottomNav() {
  const pathname = usePathname()
  const { translations } = useLanguage()

  const isActive = (path: string) => {
    return pathname === path
  }

  const navItems = [
    {
      href: "/",
      icon: Home,
      label: translations.nav.home,
    },
    {
      href: "/sermons",
      icon: Book,
      label: translations.nav.sermons,
    },
    {
      href: "/meetings",
      icon: Calendar,
      label: translations.nav.meetings,
    },
    {
      href: "/prayer-requests",
      icon: Heart,
      label: "Prayer",
    },
    {
      href: "/settings",
      icon: Settings,
      label: translations.nav.settings,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center w-full h-full text-xs ${
              isActive(item.href)
                ? "text-primary font-medium"
                : "text-muted-foreground hover:text-foreground transition-colors"
            }`}
          >
            <item.icon className={`h-5 w-5 mb-1 ${isActive(item.href) ? "text-primary" : ""}`} />
            <span className="font-medium">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
