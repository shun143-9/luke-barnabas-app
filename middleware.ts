import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function middleware(request: NextRequest) {
  // Only run on admin dashboard routes, not the login page
  if (!request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    return NextResponse.next()
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

  // Create a Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Get the session from the request cookie
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If there's no session, redirect to the login page
  if (!session) {
    const redirectUrl = new URL("/admin", request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
