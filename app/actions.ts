"use server"

import { revalidatePath } from "next/cache"
import {
  createSermon,
  deleteSermon,
  updateLivestream,
  updateMeeting,
  updateSermon,
  signIn as supabaseSignIn,
} from "@/lib/supabase"
import { redirect } from "next/navigation"

export async function signIn(formData: FormData) {
  try {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      return { success: false, error: "Email and password are required" }
    }

    const { data, error } = await supabaseSignIn(email, password)

    if (error) {
      console.error("Sign in error:", error)
      return { success: false, error: error.message }
    }

    redirect("/admin/dashboard")
  } catch (err) {
    console.error("Exception in sign in:", err)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateLivestreamAction(formData: FormData) {
  try {
    const youtube_id = formData.get("youtube_id") as string
    const description = formData.get("description") as string
    const is_live = formData.get("is_live") === "on"

    if (!youtube_id) {
      return { success: false, error: "YouTube ID is required" }
    }

    const { data, error } = await updateLivestream({
      youtube_id,
      description,
      is_live,
    })

    if (error) {
      return { success: false, error: error.message || "Failed to update livestream" }
    }

    revalidatePath("/")
    return { success: true, data }
  } catch (err) {
    console.error("Exception in updateLivestreamAction:", err)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function createSermonAction(formData: FormData) {
  try {
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const youtube_url = formData.get("youtube_url") as string
    const thumbnail_url = formData.get("thumbnail_url") as string

    if (!title || !date || !youtube_url) {
      return { success: false, error: "Title, date, and YouTube URL are required" }
    }

    const { data, error } = await createSermon({
      title,
      description,
      date,
      youtube_url,
      thumbnail_url,
    })

    if (error) {
      return { success: false, error: error.message || "Failed to create sermon" }
    }

    revalidatePath("/sermons")
    return { success: true, data }
  } catch (err) {
    console.error("Exception in createSermonAction:", err)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateSermonAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const date = formData.get("date") as string
    const youtube_url = formData.get("youtube_url") as string
    const thumbnail_url = formData.get("thumbnail_url") as string

    if (!id || !title || !date || !youtube_url) {
      return { success: false, error: "ID, title, date, and YouTube URL are required" }
    }

    const { data, error } = await updateSermon(id, {
      title,
      description,
      date,
      youtube_url,
      thumbnail_url,
    })

    if (error) {
      return { success: false, error: error.message || "Failed to update sermon" }
    }

    revalidatePath("/sermons")
    return { success: true, data }
  } catch (err) {
    console.error("Exception in updateSermonAction:", err)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function deleteSermonAction(formData: FormData) {
  try {
    const id = formData.get("id") as string

    if (!id) {
      return { success: false, error: "Sermon ID is required" }
    }

    const { error } = await deleteSermon(id)

    if (error) {
      return { success: false, error: error.message || "Failed to delete sermon" }
    }

    revalidatePath("/sermons")
    return { success: true }
  } catch (err) {
    console.error("Exception in deleteSermonAction:", err)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateMorningMeetingAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const time = formData.get("time") as string
    const zoom_link = formData.get("zoom_link") as string

    if (!title || !time) {
      return { success: false, error: "Title and time are required" }
    }

    const { data, error } = await updateMeeting({
      id: id || undefined,
      title,
      meeting_type: "morning",
      time,
      zoom_link,
    })

    if (error) {
      return { success: false, error: error.message || "Failed to update morning meeting" }
    }

    revalidatePath("/meetings")
    return { success: true, data }
  } catch (err) {
    console.error("Exception in updateMorningMeetingAction:", err)
    return { success: false, error: "An unexpected error occurred" }
  }
}

export async function updateEveningMeetingAction(formData: FormData) {
  try {
    const id = formData.get("id") as string
    const title = formData.get("title") as string
    const time = formData.get("time") as string
    const location = formData.get("location") as string
    const maps_link = formData.get("maps_link") as string

    if (!title || !time) {
      return { success: false, error: "Title and time are required" }
    }

    const { data, error } = await updateMeeting({
      id: id || undefined,
      title,
      meeting_type: "evening",
      time,
      location,
      maps_link,
    })

    if (error) {
      return { success: false, error: error.message || "Failed to update evening meeting" }
    }

    revalidatePath("/meetings")
    return { success: true, data }
  } catch (err) {
    console.error("Exception in updateEveningMeetingAction:", err)
    return { success: false, error: "An unexpected error occurred" }
  }
}
