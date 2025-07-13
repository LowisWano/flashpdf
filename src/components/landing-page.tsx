"use client"

import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Zap, BookOpen, Brain, CheckCircle, Star, ArrowRight, FileText, Sparkles, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-purple-600 bg-clip-text text-transparent">
              FlashPDF
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors">
              How it Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost">
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t bg-white/95 backdrop-blur-sm">
            <div className="px-4 py-4 space-y-4">
              <nav className="flex flex-col space-y-3">
                <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors py-2">
                  Features
                </Link>
                <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 transition-colors py-2">
                  How it Works
                </Link>
                <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors py-2">
                  Pricing
                </Link>
              </nav>
              <div className="flex flex-col space-y-3 pt-4 border-t">
                <Link href="/login">
                  <Button variant="ghost" className="w-full">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4 md:py-20">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge className="mb-4 bg-orange-100 text-orange-700 hover:bg-orange-200">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Learning
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-orange-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Turn Any PDF Into
            <br />
            Smart Flashcards
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Upload your PDFs and let our AI instantly generate personalized flashcards. Study smarter, learn faster, and
            ace your exams with FlashPDF.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 md:mb-12">
            <Link href="/dashboard">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 text-base md:text-lg px-6 md:px-8 py-3"
              >
                <Upload className="w-5 h-5 mr-2" />
                Upload Your First PDF
              </Button>
            </Link>
            <Link href="https://youtu.be/xvFZjo5PgG0">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-base md:text-lg px-6 md:px-8 py-3">
                Watch Demo
              </Button>
            </Link>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl border p-4 md:p-8">
              <div className="grid md:grid-cols-2 gap-4 md:gap-8 items-center">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-3 md:p-4 bg-orange-50 rounded-lg">
                    <FileText className="w-6 h-6 md:w-8 md:h-8 text-orange-600" />
                    <div className="text-left">
                      <div className="font-semibold text-gray-900 text-sm md:text-base">Biology_Chapter_5.pdf</div>
                      <div className="text-xs md:text-sm text-gray-500">Uploaded • 2.3 MB</div>
                    </div>
                  </div>
                  <ArrowRight className="w-6 h-6 text-gray-400 mx-auto" />
                </div>
                <div className="space-y-3">
                  <div className="p-3 md:p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="font-semibold text-gray-900 mb-2 text-sm md:text-base">What is photosynthesis?</div>
                    <div className="text-xs md:text-sm text-gray-600">The process by which plants convert light energy...</div>
                  </div>
                  <div className="p-3 md:p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                    <div className="font-semibold text-gray-900 mb-2 text-sm md:text-base">Define cellular respiration</div>
                    <div className="text-xs md:text-sm text-gray-600">The metabolic process that breaks down glucose...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 px-4 md:py-20 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">Powerful Features for Smarter Learning</h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to transform your study materials into effective learning tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Upload className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl mb-2">Smart PDF Upload</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Simply drag and drop your PDFs. Our AI reads and understands your content instantly.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Brain className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl mb-2">AI-Generated Cards</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Advanced AI creates relevant questions and answers from your PDF content automatically.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl mb-2">Interactive Study</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Study with spaced repetition, track progress, and focus on areas that need improvement.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-pink-200 transition-colors">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Zap className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl mb-2">Lightning Fast</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Generate hundreds of flashcards in seconds. No more manual card creation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-cyan-200 transition-colors">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl mb-2">Smart Organization</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Automatically organize cards by topics, difficulty, and your learning progress.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-amber-200 transition-colors">
              <CardHeader className="p-4 md:p-6">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center mb-3 md:mb-4">
                  <Star className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <CardTitle className="text-lg md:text-xl mb-2">Multiple Formats</CardTitle>
                <CardDescription className="text-sm md:text-base">
                  Support for textbooks, research papers, lecture notes, and any PDF document.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-12 px-4 md:py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How FlashPDF Works</h2>
            <p className="text-xl text-gray-600">From PDF to mastery in three simple steps</p>
          </div>

          <div className="space-y-12">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    1
                  </div>
                  <h3 className="text-2xl font-bold">Upload Your PDF</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Drag and drop any PDF document - textbooks, lecture notes, research papers, or study guides. Our
                  system supports all major PDF formats.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-dashed border-orange-200">
                  <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                  <div className="text-center text-gray-600">Drop your PDF here</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row-reverse items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    2
                  </div>
                  <h3 className="text-2xl font-bold">AI Generates Cards</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Our advanced AI analyzes your content and automatically creates relevant flashcards with questions and
                  answers tailored to key concepts.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Brain className="w-8 h-8 text-purple-500 mr-3" />
                    <div className="text-sm text-gray-500">AI Processing...</div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-purple-100 rounded animate-pulse"></div>
                    <div className="h-3 bg-purple-100 rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-purple-100 rounded animate-pulse w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold mr-4">
                    3
                  </div>
                  <h3 className="text-2xl font-bold">Study & Master</h3>
                </div>
                <p className="text-gray-600 text-lg">
                  Review your flashcards with our intelligent spaced repetition system. Track your progress and focus on
                  areas that need more attention.
                </p>
              </div>
              <div className="flex-1">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Study Progress</span>
                      <span className="text-sm text-green-600">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-2 rounded-full w-3/4"></div>
                    </div>
                  </div>
                  <div className="text-center">
                    <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-sm text-gray-600">Ready to study!</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-orange-500 via-purple-600 to-pink-600">
        <div className="container mx-auto text-center max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Transform Your Study Experience?</h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of students who are already studying smarter with FlashPDF
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
              <Upload className="w-5 h-5 mr-2" />
              Start Creating Flashcards
            </Button>
            <Button
              size="lg"
              className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3"
            >
              View Pricing
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">FlashPDF</span>
              </div>
              <p className="text-gray-400">Transform your PDFs into smart flashcards with the power of AI.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    API
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Status
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 FlashPDF. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
