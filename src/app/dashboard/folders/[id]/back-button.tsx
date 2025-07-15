"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function BackButton() {
  const router = useRouter()
  
  return (
    <Button 
      variant="outline"
      onClick={() => router.push('/dashboard/folders')}
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Folders
    </Button>
  )
}
