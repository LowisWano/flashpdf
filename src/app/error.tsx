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
      <div className="bg-red-50 rounded-lg p-8 max-w-md mx-auto shadow-sm border border-red-100">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Oops! Something went wrong</h2>
        <p className="text-gray-600 mb-6">
          We encountered an unexpected error.
        </p>
        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="w-full py-2 px-4 bg-white hover:bg-gray-50 text-gray-700 font-medium rounded-md border border-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Return to dashboard
          </button>
        </div>
        {error.digest && (
          <p className="mt-6 text-xs text-gray-500">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}