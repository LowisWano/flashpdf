"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Deck } from '@/generated/prisma'
import FlashCard from './flashcard'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { updateDeckProgress } from '@/services/deck.service'

export default function StudySession({ deck, userId }: { 
  deck: any, // Using any temporarily as we need to fix the Deck type
  userId: string 
}) {
  const router = useRouter();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [answeredCards, setAnsweredCards] = useState<{ [key: string]: boolean }>({});
  const [isStudyCompleted, setIsStudyCompleted] = useState(false);
  const [finalScore, setFinalScore] = useState(0);

  const flashcards = deck.flashcards || [];
  const totalCards = flashcards.length;
  
  // Calculate progress percentage
  const progressPercentage = totalCards > 0 ? (Object.keys(answeredCards).length / totalCards) * 100 : 0;
  
  // Initialize study session
  const initiateStudySession = () => {
    setCurrentCardIndex(0);
    setCorrectAnswers(0);
    setAnsweredCards({});
    setIsStudyCompleted(false);
  };

  // Handle answering a card
  const handleAnswer = (isCorrect: boolean) => {
    const cardId = flashcards[currentCardIndex].id;
    
    // Update answered cards
    setAnsweredCards(prev => ({
      ...prev,
      [cardId]: isCorrect
    }));
    
    // Update correct answers count
    if (isCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    // Move to next card or complete session
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else {
      // For the last card, we need to wait for state updates to complete
      // before calculating the final score
      setTimeout(() => {
        completeStudySession(isCorrect);
      }, 0);
    }
  };

  // Navigate to previous card if possible
  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
    }
  };

  // Navigate to next card if possible
  const goToNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
    } else if (!isStudyCompleted) {
      // When manually navigating to the end, just complete without affecting score
      completeStudySession();
    }
  };

  // Complete the study session and calculate score
  const completeStudySession = async (lastAnswerCorrect?: boolean) => {
    // Calculate the final score based on the most current state
    // If we have a lastAnswerCorrect parameter, include it in the calculation
    const finalCorrectAnswers = lastAnswerCorrect !== undefined 
      ? correctAnswers + (lastAnswerCorrect ? 1 : 0)
      : correctAnswers;
      
    const score = Math.round((finalCorrectAnswers / totalCards) * 100);
    setFinalScore(score);
    setIsStudyCompleted(true);
    
    // Update deck progress in database via API
    try {
      const response = await fetch(`/api/decks/${deck.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ accuracy: score }),
      });
      
      if (!response.ok) {
        console.error('Failed to update deck progress');
      }
      
      // Refresh the dashboard page data
      router.refresh();
    } catch (error) {
      console.error('Error updating deck progress:', error);
    }
  };

  // Return to deck view
  const returnToDeck = () => {
    router.push(`/dashboard/decks/${deck.id}`);
  };

  if (totalCards === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">No flashcards found in this deck</h2>
        <Button onClick={() => router.push(`/dashboard/decks/${deck.id}/edit`)}>Edit Deck</Button>
      </div>
    );
  }

  if (isStudyCompleted) {
    return (
      <div className="max-w-xl mx-auto text-center py-16 px-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-10">
          <div className="mb-8">
            <h2 className="text-4xl font-bold mb-4">You're doing great!</h2>
            <p className="text-gray-600 dark:text-gray-300">
              Keep it up to build confidence.
            </p>
          </div>
          
          <div className="my-10">
            <div className="relative h-48 w-48 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold">{finalScore}%</span>
              </div>
              <svg className="w-full h-full" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="#e2e8f0" 
                  strokeWidth="8"
                />
                <circle
                  cx="50" cy="50" r="45"
                  fill="none"
                  stroke={finalScore > 70 ? "#4ade80" : finalScore > 40 ? "#facc15" : "#f87171"}
                  strokeWidth="8"
                  strokeDasharray={`${finalScore * 2.83} ${283 - (finalScore * 2.83)}`}
                  strokeDashoffset="70"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-10 mb-10 text-center">
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Correct</p>
              <p className="text-3xl font-bold">{correctAnswers}</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">Total Cards</p>
              <p className="text-3xl font-bold">{totalCards}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 py-6 text-lg"
              onClick={initiateStudySession}
            >
              Study Again
            </Button>
            <Button 
              variant="outline" 
              className="w-full py-6 text-lg"
              onClick={() => router.push(`/dashboard`)}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex justify-between items-center">
            <span className="font-medium">Study Progress</span>
            <span className="text-sm font-medium">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 rounded-md" />
        </div>
      </div>

      {/* Current Flashcard - Updated with more spacing */}
      <div className="flex flex-col gap-6 mb-12">
        {flashcards.length > 0 && (
          <FlashCard 
            key={flashcards[currentCardIndex].id || currentCardIndex} 
            flashcard={flashcards[currentCardIndex]} 
          />
        )}
      </div>

      {/* Answer Buttons */}
      <div className="flex justify-center gap-8 mb-12">
        <Button 
          variant="outline" 
          size="lg" 
          className="flex items-center border-red-500 text-red-500 hover:bg-red-500 hover:text-white px-6 py-6"
          onClick={() => handleAnswer(false)}
        >
          <X className="mr-2 h-5 w-5" />
          Incorrect
        </Button>
        <Button 
          variant="outline" 
          size="lg" 
          className="flex items-center border-green-500 text-green-500 hover:bg-green-500 hover:text-white px-6 py-6"
          onClick={() => handleAnswer(true)}
        >
          <Check className="mr-2 h-5 w-5" />
          Correct
        </Button>
      </div>

      {/* Navigation Buttons - Similar to flashcards-section */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <Button 
          variant="outline" 
          onClick={goToPreviousCard}
          disabled={currentCardIndex === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <span className="text-sm text-muted-foreground">
          Card {currentCardIndex + 1} of {totalCards}
        </span>
        
        <Button 
          variant="outline" 
          onClick={goToNextCard}
          className="flex items-center gap-2"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
