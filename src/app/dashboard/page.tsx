"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"

import { useState, useCallback } from "react"

export default function Dashboard() {
  // const [uploadState, setUploadState] = useState<UploadState>("idle")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [fileName, setFileName] = useState("")
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  return (
    <div className="">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300 hover:border-orange-400 transition-colors">
        <CardContent className="p-12">
          <div
            className={`text-center ${dragActive ? "scale-105" : ""} transition-transform`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            // onDrop={handleDrop}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <Upload className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Drop your PDF here</h3>
            <p className="text-gray-600 mb-6">or click to browse your files</p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
              
            >
              <Upload className="w-5 h-5 mr-2" />
              Choose File
            </Button>
            <p className="text-sm text-gray-500 mt-4">Supports PDF files up to 50MB</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}