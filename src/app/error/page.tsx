'use client'
import { AlertCircle } from 'lucide-react'

export default function ErrorPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-50 rounded-lg p-8 max-w-md mx-auto shadow-sm border border-red-100">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error.
        </p>
      </div>
    </div>
  )
}