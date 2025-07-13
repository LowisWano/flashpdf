"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Deck } from '@/generated/prisma'
import FlashCard from './flashcard'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { ArrowLeft, ArrowRight, Check, X } from 'lucide-react'
import { updateDeckProgress } from '@/services/deck.service'
import { Input } from './ui/input'
import { Label } from './ui/label'

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
  const [userAnswer, setUserAnswer] = useState('');
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);

  const flashcards = deck.flashcards || [];
  const totalCards = flashcards.length;
  
  const progressPercentage = totalCards > 0 ? (Object.keys(answeredCards).length / totalCards) * 100 : 0;
  
  // Initialize study session
  const initiateStudySession = () => {
    setCurrentCardIndex(0);
    setCorrectAnswers(0);
    setAnsweredCards({});
    setIsStudyCompleted(false);
    setUserAnswer('');
    setIsAnswerSubmitted(false);
    setIsAnswerCorrect(false);
  };

  const handleAnswerSubmit = () => {
    if (!userAnswer.trim()) return;
    
    const currentCard = flashcards[currentCardIndex];
    const isCorrect = userAnswer.trim().toLowerCase() === currentCard.term.toLowerCase();
    
    setIsAnswerCorrect(isCorrect);
    setIsAnswerSubmitted(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnswerSubmit();
    }
  };

  const handleNextCard = () => {
    const cardId = flashcards[currentCardIndex].id;
    
    setAnsweredCards(prev => ({
      ...prev,
      [cardId]: isAnswerCorrect
    }));
    
    if (isAnswerCorrect) {
      setCorrectAnswers(prev => prev + 1);
    }
    
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswerSubmitted(false);
      setIsAnswerCorrect(false);
    } else {
      setTimeout(() => {
        completeStudySession();
      }, 0);
    }
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(prev => prev - 1);
      setUserAnswer('');
      setIsAnswerSubmitted(false);
      setIsAnswerCorrect(false);
    }
  };

  const goToNextCard = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(prev => prev + 1);
      setUserAnswer('');
      setIsAnswerSubmitted(false);
      setIsAnswerCorrect(false);
    } else if (!isStudyCompleted) {
      completeStudySession();
    }
  };

  const completeStudySession = async () => {
    const score = Math.round((correctAnswers / totalCards) * 100);
    setFinalScore(score);
    setIsStudyCompleted(true);
    
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
      
      router.refresh();
    } catch (error) {
      console.error('Error updating deck progress:', error);
    }
  };

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
      <div className="max-w-xl mx-auto text-center py-4 px-4">
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

  const currentCard = flashcards[currentCardIndex];

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

      {/* Current Flashcard - Show term (question) */}
      <div className="flex flex-col gap-6 mb-12 bg-white">
        {flashcards.length > 0 && (
          <div className={`border-4 rounded-lg p-6 transition-colors duration-300 ${
            isAnswerSubmitted 
              ? isAnswerCorrect 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
              : 'border-gray-200'
          }`}>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4">Question:</h3>
              <p className="text-2xl mb-6">{currentCard.definition}</p>
              
              {isAnswerSubmitted && (
                <div className="mt-6 p-4 bg-white rounded-lg border">
                  <h4 className="font-semibold mb-2">Your Answer:</h4>
                  <p className="text-lg mb-4">{userAnswer}</p>
                  <h4 className="font-semibold mb-2">Correct Answer:</h4>
                  <p className="text-lg">{currentCard.term}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Answer Input */}
      {!isAnswerSubmitted && (
        <div className="mb-12">
          <Input 
            id="answer"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your answer..."
            className="bg-white text-lg py-3"
            autoFocus
          />
          <div className="mt-2 text-sm text-gray-500">
            Press Enter to submit your answer
          </div>
        </div>
      )}

      {isAnswerSubmitted && (
        <div className="flex justify-center mb-12">
          <Button 
            size="lg" 
            className="px-8 py-6 text-lg bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700"
            onClick={handleNextCard}
          >
            {currentCardIndex < totalCards - 1 ? 'Continue' : 'Finish'}
          </Button>
        </div>
      )}

      {/* Navigation Buttons - Only show when answer is not submitted */}
      {/* {!isAnswerSubmitted && (
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
      )} */}
    </div>
  )
}
