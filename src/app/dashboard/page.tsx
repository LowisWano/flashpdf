"use client"

import { useState, useCallback } from "react"
import DecksSection from "@/components/decks-section"
import { Deck } from "@/services/deck.service"
import UploadArea from "@/components/upload-area"

export default function Dashboard() {


  const decks: Deck[] = [
    {
      id: 1,
      title: "AppDev",
      flashcards: [
        {
          term: "spring boot",
          definition: "a java web framework"
        },
        {
          term: "spring boot",
          definition: "a java web framework"
        }
      ],
      lastOpened: "2025-05-25"
    },
    {
      id: 2,
      title: "AppDev",
      flashcards: [
        {
          term: "spring boot",
          definition: "a java web framework"
        }
      ],
      lastOpened: "2025-05-25"
    },
    {
      id: 3,
      title: "AppDev",
      flashcards: [
        {
          term: "spring boot",
          definition: "a java web framework"
        }
      ],
      lastOpened: "2025-05-25"
    }
  ]

  return (
    <div className="p-20">
      {/* Upload Area */}
      {/* <UploadArea/> */}

      <DecksSection decks={decks}/>
    </div>
  )
}