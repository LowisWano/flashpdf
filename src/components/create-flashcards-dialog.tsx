import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import Link from "next/link"

export function CreateFlashcardsDialog() {
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 h-10 w-10 rounded-full"
        >
            <Plus/>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-4xl p-11">
          <DialogHeader>
            <DialogTitle className="text-center">How do you want to create your flashcard set</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col sm:flex-row gap-5 w-full items-stretch">
              {/* Card 1: Generate from an upload */}
              <Link href="/dashboard/upload" className="flex-1">
                <button
                  type="button"
                  className="w-full flex-1 min-h-40 rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition p-6 flex flex-col items-center justify-center gap-2"
                >
                  <span className="font-semibold text-lg">Generate from an upload</span>
                  <span className="text-sm text-gray-500 text-center">
                    Upload a PDF or document and we&apos;ll generate flashcards for you.
                  </span>
                </button>
              </Link>
              {/* Card 2: Create them yourself */}
              <Link href="/dashboard/create" className="flex-1">
                <button
                  type="button"
                  className="w-full flex-1 min-h-40 rounded-lg border border-gray-200 bg-white shadow hover:shadow-md transition p-6 flex flex-col items-center justify-center gap-2"
                >
                  <span className="font-semibold text-lg">Create them yourself</span>
                  <span className="text-sm text-gray-500 text-center">
                    Manually add your own questions and answers.
                  </span>
                </button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
