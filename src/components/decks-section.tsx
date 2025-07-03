"use client";

import { BookOpen, Clock, FileText, Filter, Search, TrendingUp } from "lucide-react";
import Deck from "./deck"
import { Deck as DeckType } from "@/generated/prisma"
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { CreateFlashcardsDialog } from "./create-flashcards-dialog";
import { useState, useMemo } from "react";

export default function DecksSection({
  decks,
}: {
  decks: DeckType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter decks based on search query
  const filteredDecks = useMemo(() => {
    if (!searchQuery.trim()) {
      return decks;
    }
    
    return decks.filter((deck) =>
      deck.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
    );
  }, [decks, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div>
      <div className="flex flex-row sm:items-center sm:justify-between gap-4 mb-3">
        <div>
          <h1 className="text-3xl font-bold">My Decks</h1>
          <p className="text-gray-600">Manage and study your flashcard collections</p>
        </div>
        
          <CreateFlashcardsDialog />
        
      </div>

      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for anything"
            className="pl-10 bg-white border-gray-200 focus:bg-white"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Sort by
              <Filter className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Clock className="w-4 h-4 mr-2" />
              Recently studied
            </DropdownMenuItem>
            <DropdownMenuItem>
              <FileText className="w-4 h-4 mr-2" />
              Name
            </DropdownMenuItem>
            <DropdownMenuItem>
              <TrendingUp className="w-4 h-4 mr-2" />
              Progress
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BookOpen className="w-4 h-4 mr-2" />
              Card count
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search results info */}
      {searchQuery.trim() && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredDecks.length === 0 
              ? `No decks found for "${searchQuery}"`
              : `Found ${filteredDecks.length} deck${filteredDecks.length === 1 ? '' : 's'} for "${searchQuery}"`
            }
          </p>
        </div>
      )}

      {filteredDecks.length === 0 && searchQuery.trim() ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No decks found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or create a new deck.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
          {
            filteredDecks.map((deck) => (
              <Deck key={deck.id} deck={deck} />
            ))
          }
        </div>
      )}
    </div>
  )
}