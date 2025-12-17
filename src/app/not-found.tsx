import Link from 'next/link'
import Image from 'next/image'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md mx-auto">
        <div className="mb-8">
          <h1 className="text-6xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Page Not Found</h2>
          <p className="text-gray-600 mb-8">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
          
          {/* Illustration could be added here */}
          {/* <div className="relative h-48 w-full mb-8">
            <Image 
              src="/images/404-illustration.svg" 
              alt="Page not found illustration"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div> */}
          
          <Link 
            href="/dashboard" 
            className="inline-flex items-center justify-center px-5 py-3 text-base font-medium rounded-md text-white bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  )
}