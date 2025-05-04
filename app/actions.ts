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
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const { data, error } = await supabaseSignIn(email, password)

  if (error) {
    return { success: false, error: error.message }
  }

  redirect("/admin/dashboard")
}

export async function updateLivestreamAction(formData: FormData) {
  const youtube_id = formData.get("youtube_id") as string
  const description = formData.get("description") as string
  const is_live = formData.get("is_live") === "on"

  const { data, error } = await updateLivestream({
    youtube_id,
    description,
    is_live,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/")
  return { success: true, data }
}

export async function createSermonAction(formData: FormData) {
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const youtube_url = formData.get("youtube_url") as string
  const thumbnail_url = formData.get("thumbnail_url") as string

  const { data, error } = await createSermon({
    title,
    description,
    date,
    youtube_url,
    thumbnail_url,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/sermons")
  return { success: true, data }
}

export async function updateSermonAction(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const description = formData.get("description") as string
  const date = formData.get("date") as string
  const youtube_url = formData.get("youtube_url") as string
  const thumbnail_url = formData.get("thumbnail_url") as string

  const { data, error } = await updateSermon(id, {
    title,
    description,
    date,
    youtube_url,
    thumbnail_url,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/sermons")
  return { success: true, data }
}

export async function deleteSermonAction(formData: FormData) {
  const id = formData.get("id") as string

  const { error } = await deleteSermon(id)

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/sermons")
  return { success: true }
}

export async function updateMorningMeetingAction(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const time = formData.get("time") as string
  const zoom_link = formData.get("zoom_link") as string

  const { data, error } = await updateMeeting({
    id: id || undefined,
    title,
    meeting_type: "morning",
    time,
    zoom_link,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/meetings")
  return { success: true, data }
}

export async function updateEveningMeetingAction(formData: FormData) {
  const id = formData.get("id") as string
  const title = formData.get("title") as string
  const time = formData.get("time") as string
  const location = formData.get("location") as string
  const maps_link = formData.get("maps_link") as string

  const { data, error } = await updateMeeting({
    id: id || undefined,
    title,
    meeting_type: "evening",
    time,
    location,
    maps_link,
  })

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath("/meetings")
  return { success: true, data }
}
