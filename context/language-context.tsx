"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "english" | "telugu"

type Translations = {
  nav: {
    home: string
    sermons: string
    meetings: string
    settings: string
  }
  home: {
    welcome: string
    liveNow: string
    todaysMessage: string
    aboutTitle: string
    aboutText1: string
    aboutText2: string
  }
  sermons: {
    title: string
    subtitle: string
    watchButton: string
  }
  meetings: {
    title: string
    subtitle: string
    morningTitle: string
    morningDescription: string
    joinZoom: string
    eveningTitle: string
    eveningDescription: string
    showLocation: string
  }
  settings: {
    title: string
    subtitle: string
    languagePreferences: string
    languageTitle: string
    languageDescription: string
    darkMode: string
    darkModeDescription: string
    administration: string
    adminDescription: string
    adminText: string
    adminButton: string
  }
  admin: {
    loginTitle: string
    loginSubtitle: string
    email: string
    password: string
    signIn: string
    dashboardTitle: string
    dashboardSubtitle: string
    livestreamTab: string
    sermonsTab: string
    meetingsTab: string
    updateLivestream: string
    livestreamDescription: string
    videoId: string
    videoIdHelp: string
    streamDescription: string
    addSermon: string
    sermonDescription: string
    sermonTitle: string
    date: string
    description: string
    youtubeLink: string
    thumbnailUrl: string
    updateMeetings: string
    meetingsDescription: string
    morningMeeting: string
    meetingTitle: string
    time: string
    zoomLink: string
    eveningMeeting: string
    locationName: string
    mapsLink: string
    updateButton: string
    addButton: string
  }
}

const englishTranslations: Translations = {
  nav: {
    home: "Home",
    sermons: "Sermons",
    meetings: "Meetings",
    settings: "Settings",
  },
  home: {
    welcome: "Welcome to Luke Barnabas Ministry",
    liveNow: "Live Now",
    todaysMessage: "Today's Message",
    aboutTitle: "About Our Ministry",
    aboutText1:
      "Luke Barnabas Ministry is dedicated to spreading the word of God through inspiring sermons, bible studies, and community gatherings. Our mission is to help people grow in their faith and develop a deeper relationship with Christ.",
    aboutText2: "Join us for our regular meetings and services to be part of our growing community of believers.",
  },
  sermons: {
    title: "Sermons",
    subtitle: "Watch and listen to our previous sermons to grow in your faith journey.",
    watchButton: "Watch Sermon",
  },
  meetings: {
    title: "Meeting Updates",
    subtitle: "Join us for our regular meetings to grow together in faith and fellowship.",
    morningTitle: "Morning Prayer & Devotion",
    morningDescription: "Join us online for morning prayer and devotion to start your day with spiritual nourishment.",
    joinZoom: "Join Zoom Meeting",
    eveningTitle: "Evening Bible Study",
    eveningDescription:
      "Join us in person for our evening Bible study where we explore scripture together and grow in our understanding.",
    showLocation: "Show Location",
  },
  settings: {
    title: "Settings",
    subtitle: "Customize your app experience with these settings.",
    languagePreferences: "Language Preferences",
    languageTitle: "Telugu Language",
    languageDescription: "Switch between English and Telugu",
    darkMode: "Dark Mode",
    darkModeDescription: "Switch between light and dark theme",
    administration: "Administration",
    adminDescription: "Access the admin panel to manage content.",
    adminText:
      "This section is only for authorized administrators. You will need to log in to access the admin features.",
    adminButton: "Admin Panel",
  },
  admin: {
    loginTitle: "Admin Login",
    loginSubtitle: "Enter your credentials to access the admin panel.",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    dashboardTitle: "Admin Dashboard",
    dashboardSubtitle: "Manage your ministry content and settings.",
    livestreamTab: "Live Stream",
    sermonsTab: "Sermons",
    meetingsTab: "Meetings",
    updateLivestream: "Update Live Stream",
    livestreamDescription: "Set the current YouTube live stream for the home page.",
    videoId: "YouTube Video ID",
    videoIdHelp: 'The ID is the part after "v=" in a YouTube URL.',
    streamDescription: "Stream Description",
    addSermon: "Add New Sermon",
    sermonDescription: "Add a new sermon to the sermons page.",
    sermonTitle: "Sermon Title",
    date: "Date",
    description: "Description",
    youtubeLink: "YouTube Link",
    thumbnailUrl: "Thumbnail URL",
    updateMeetings: "Update Meeting Details",
    meetingsDescription: "Update the information for morning and evening meetings.",
    morningMeeting: "Morning Zoom Meeting",
    meetingTitle: "Meeting Title",
    time: "Time",
    zoomLink: "Zoom Link",
    eveningMeeting: "Evening Bible Study Meeting",
    locationName: "Location Name",
    mapsLink: "Google Maps Link",
    updateButton: "Update",
    addButton: "Add",
  },
}

const teluguTranslations: Translations = {
  nav: {
    home: "హోమ్",
    sermons: "ప్రసంగాలు",
    meetings: "సమావేశాలు",
    settings: "సెట్టింగ్‌లు",
  },
  home: {
    welcome: "లూక్ బర్నబాస్ మినిస్ట్రీకి స్వాగతం",
    liveNow: "ప్రత్యక్ష ప్రసారం",
    todaysMessage: "నేటి సందేశం",
    aboutTitle: "మా మినిస్ట్రీ గురించి",
    aboutText1:
      "లూక్ బర్నబాస్ మినిస్ట్రీ ప్రేరేపిత ప్రసంగాలు, బైబిల్ అధ్యయనాలు మరియు సమాజ సమావేశాల ద్వారా దేవుని వాక్యాన్ని వ్యాప్తి చేయడానికి అంకితం చేయబడింది. మా లక్ష్యం ప్రజలు తమ విశ్వాసంలో పెరగడానికి మరియు క్రీస్తుతో లోతైన సంబంధాన్ని పెంపొందించుకోవడానికి సహాయపడటం.",
    aboutText2: "మా నియమిత సమావేశాలు మరియు సేవలకు హాజరై మా పెరుగుతున్న విశ్వాసుల సమాజంలో భాగం కండి.",
  },
  sermons: {
    title: "ప్రసంగాలు",
    subtitle: "మీ విశ్వాస ప్రయాణంలో పెరగడానికి మా మునుపటి ప్రసంగాలను చూడండి మరియు వినండి.",
    watchButton: "ప్రసంగం చూడండి",
  },
  meetings: {
    title: "సమావేశ నవీకరణలు",
    subtitle: "విశ్వాసం మరియు సహవాసంలో కలిసి పెరగడానికి మా నియమిత సమావేశాలకు హాజరు కండి.",
    morningTitle: "ఉదయం ప్రార్థన & భక్తి",
    morningDescription: "మీ రోజును ఆధ్యాత్మిక పోషణతో ప్రారంభించడానికి ఉదయం ప్రార్థన మరియు భక్తి కోసం ఆన్‌లైన్‌లో మాతో చేరండి.",
    joinZoom: "జూమ్ మీటింగ్‌లో చేరండి",
    eveningTitle: "సాయంత్రం బైబిల్ స్టడీ",
    eveningDescription: "మేము లేఖనాన్ని కలిసి అన్వేషించే మరియు మా అవగాహనను పెంచుకునే సాయంత్రం బైబిల్ స్టడీ కోసం వ్యక్తిగతంగా మాతో చేరండి.",
    showLocation: "స్థానాన్ని చూపించు",
  },
  settings: {
    title: "సెట్టింగ్‌లు",
    subtitle: "ఈ సెట్టింగ్‌లతో మీ యాప్ అనుభవాన్ని అనుకూలీకరించండి.",
    languagePreferences: "భాషా ప్రాధాన్యతలు",
    languageTitle: "తెలుగు భాష",
    languageDescription: "ఇంగ్లీష్ మరియు తెలుగు మధ్య మారండి",
    darkMode: "డార్క్ మోడ్",
    darkModeDescription: "లైట్ మరియు డార్క్ థీమ్ మధ్య మారండి",
    administration: "నిర్వహణ",
    adminDescription: "కంటెంట్‌ను నిర్వహించడానికి అడ్మిన్ ప్యానెల్‌ను యాక్సెస్ చేయండి.",
    adminText: "ఈ విభాగం అధికారిక నిర్వాహకుల కోసం మాత్రమే. అడ్మిన్ ఫీచర్‌లను యాక్సెస్ చేయడానికి మీరు లాగిన్ చేయాలి.",
    adminButton: "అడ్మిన్ ప్యానెల్",
  },
  admin: {
    loginTitle: "అడ్మిన్ లాగిన్",
    loginSubtitle: "అడ్మిన్ ప్యానెల్‌ను యాక్సెస్ చేయడానికి మీ ఆధారాలను నమోదు చేయండి.",
    email: "ఇమెయిల్",
    password: "పాస్‌వర్డ్",
    signIn: "సైన్ ఇన్",
    dashboardTitle: "అడ్మిన్ డాష్‌బోర్డ్",
    dashboardSubtitle: "మీ మినిస్ట్రీ కంటెంట్ మరియు సెట్టింగ్‌లను నిర్వహించండి.",
    livestreamTab: "లైవ్ స్ట్రీమ్",
    sermonsTab: "ప్రసంగాలు",
    meetingsTab: "సమావేశాలు",
    updateLivestream: "లైవ్ స్ట్రీమ్‌ను నవీకరించండి",
    livestreamDescription: "హోమ్ పేజీ కోసం ప్రస్తుత YouTube లైవ్ స్ట్రీమ్‌ను సెట్ చేయండి.",
    videoId: "YouTube వీడియో ID",
    videoIdHelp: 'ID అనేది YouTube URLలో "v=" తర్వాత ఉన్న భాగం.',
    streamDescription: "స్ట్రీమ్ వివరణ",
    addSermon: "కొత్త ప్రసంగాన్ని జోడించండి",
    sermonDescription: "ప్రసంగాల పేజీకి కొత్త ప్రసంగాన్ని జోడించండి.",
    sermonTitle: "ప్రసంగం శీర్షిక",
    date: "తేదీ",
    description: "వివరణ",
    youtubeLink: "YouTube లింక్",
    thumbnailUrl: "థంబ్‌నెయిల్ URL",
    updateMeetings: "సమావేశ వివరాలను నవీకరించండి",
    meetingsDescription: "ఉదయం మరియు సాయంత్రం సమావేశాల కోసం సమాచారాన్ని నవీకరించండి.",
    morningMeeting: "ఉదయం జూమ్ సమావేశం",
    meetingTitle: "సమావేశం శీర్షిక",
    time: "సమయం",
    zoomLink: "జూమ్ లింక్",
    eveningMeeting: "సాయంత్రం బైబిల్ స్టడీ సమావేశం",
    locationName: "స్థానం పేరు",
    mapsLink: "గూగుల్ మ్యాప్స్ లింక్",
    updateButton: "నవీకరించు",
    addButton: "జోడించు",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  translations: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("english")
  const [translations, setTranslations] = useState<Translations>(englishTranslations)

  useEffect(() => {
    // Load language preference from localStorage if available
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(language === "english" ? englishTranslations : teluguTranslations)

    // Save language preference to localStorage
    localStorage.setItem("language", language)
  }, [language])

  return <LanguageContext.Provider value={{ language, setLanguage, translations }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
