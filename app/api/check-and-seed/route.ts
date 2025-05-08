import { NextResponse } from "next/server"
import { checkAllTablesExist, seedSampleData } from "@/lib/supabase"

export async function GET() {
  try {
    // Check if all tables exist
    const tablesExist = await checkAllTablesExist()

    if (!tablesExist) {
      return NextResponse.json({
        success: false,
        message: "Some tables don't exist. Please run the database initialization SQL.",
      })
    }

    // Seed sample data
    const { success, error } = await seedSampleData()

    if (!success) {
      return NextResponse.json({
        success: false,
        message: `Failed to seed sample data: ${error}`,
      })
    }

    return NextResponse.json({
      success: true,
      message: "Database is properly set up and sample data has been seeded.",
    })
  } catch (error: any) {
    console.error("Error checking and seeding database:", error)
    return NextResponse.json(
      { error: `Failed to check and seed database: ${error.message || "Unknown error"}` },
      { status: 500 },
    )
  }
}
