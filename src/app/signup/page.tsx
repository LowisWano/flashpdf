import { Sparkles } from "lucide-react"
import Image from "next/image"
import SignUpPage from "@/components/signup-page"

export default function Page() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
        <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] bg-clip-text text-transparent">
              AutoDeck
            </span>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpPage />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:block">
        <Image
          src="/gradient.png"
          width={800}
          height={600}
          alt="Decorative background image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}
