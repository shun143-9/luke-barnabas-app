"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useLanguage } from "@/context/language-context"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { translations } = useLanguage()

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-xl font-semibold text-primary">Luke Barnabas</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <NavLinks isActive={isActive} translations={translations} />
          </nav>
        </div>
      </div>

      {/* Mobile navigation */}
      {isMenuOpen && (
        <nav className="md:hidden bg-background border-b border-border">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-3">
            <NavLinks isActive={isActive} onClick={closeMenu} translations={translations} />
          </div>
        </nav>
      )}
    </header>
  )
}

function NavLinks({
  isActive,
  onClick,
  translations,
}: {
  isActive: (path: string) => boolean
  onClick?: () => void
  translations: any
}) {
  const links = [
    { href: "/", label: translations.nav.home },
    { href: "/sermons", label: translations.nav.sermons },
    { href: "/meetings", label: translations.nav.meetings },
    { href: "/settings", label: translations.nav.settings },
  ]

  return (
    <>
      {links.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`text-base font-medium transition-colors hover:text-primary ${
            isActive(link.href) ? "text-primary" : "text-foreground"
          }`}
          onClick={onClick}
        >
          {link.label}
        </Link>
      ))}
    </>
  )
}
