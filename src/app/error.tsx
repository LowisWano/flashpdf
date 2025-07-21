'use client' // Error boundaries must be Client Components
 
import { useEffect } from 'react'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 text-center">
  
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error.
        </p>
        <div className="space-y-3">
        </div>
        {error.digest && (
          <p className="text-xs text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
     
    </div>
  )
}