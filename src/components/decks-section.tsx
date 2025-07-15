"use client";

import { BookOpen, Clock, FolderPlus, FileText, Filter, Search, TrendingUp, CheckSquare } from "lucide-react";
import Deck from "./deck"
import { Deck as DeckType } from "@/generated/prisma"
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { CreateFlashcardsDialog } from "./create-flashcards-dialog";
import BulkMoveDeckToFolderDialog from "./bulk-move-deck-to-folder-dialog";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

// Define sort types
type SortOption = "recent" | "name" | null;

export default function DecksSection({
  decks,
  currentFolderId,
}: {
  decks: DeckType[];
  currentFolderId?: string;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const [isBulkMoveDialogOpen, setIsBulkMoveDialogOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);

  // Filter and sort decks based on search query and sort option
  const filteredDecks = useMemo(() => {
    // First filter by search query
    let result = decks;
    
    if (searchQuery.trim()) {
      result = result.filter((deck) =>
        deck.title.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }
    
    // Then apply sorting
    if (sortBy) {
      return [...result].sort((a, b) => {
        if (sortBy === "name") {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === "recent") {
          // Sort by lastStudied date, most recent first
          return new Date(b.lastStudied).getTime() - new Date(a.lastStudied).getTime();
        }
        return 0;
      });
    }
    
    return result;
  }, [decks, searchQuery, sortBy]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSort = (option: SortOption) => {
    setSortBy(option);
  };
  
  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode);
    if (isSelectionMode) {
      // Clear selections when exiting selection mode
      setSelectedDeckIds([]);
    }
  };
  
  const handleDeckSelection = (deckId: string) => {
    setSelectedDeckIds(prev => 
      prev.includes(deckId) 
        ? prev.filter(id => id !== deckId) 
        : [...prev, deckId]
    );
  };
  
  const selectAllDecks = () => {
    setSelectedDeckIds(filteredDecks.map(deck => deck.id));
  };
  
  const clearSelection = () => {
    setSelectedDeckIds([]);
  };
  
  return (
    <div>
      <div className="flex flex-row sm:items-center sm:justify-between gap-4 mb-3">
        <div>
          <h1 className="text-3xl font-bold">My Decks</h1>
          <p className="text-gray-600">Manage and study your flashcard collections</p>
        </div>
        
        <div className="flex gap-2">
          {isSelectionMode && selectedDeckIds.length > 0 && (
            <Button 
              variant="outline"
              onClick={() => setIsBulkMoveDialogOpen(true)}
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Move to Folder
            </Button>
          )}
          <Button 
            variant={isSelectionMode ? "default" : "outline"}
            onClick={toggleSelectionMode}
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            {isSelectionMode ? "Exit Selection" : "Select Decks"}
          </Button>
          <CreateFlashcardsDialog />
        </div>
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
              Sort by {sortBy === 'name' ? ': Name' : sortBy === 'recent' ? ': Recently studied' : ''}
              <Filter className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => handleSort('recent')}>
              <Clock className="w-4 h-4 mr-2" />
              Recently studied
              {sortBy === 'recent' && <span className="ml-2 text-primary">✓</span>}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSort('name')}>
              <FileText className="w-4 h-4 mr-2" />
              Name
              {sortBy === 'name' && <span className="ml-2 text-primary">✓</span>}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Search and sort info */}
      {(searchQuery.trim() || sortBy) && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredDecks.length === 0 
              ? `No decks found${searchQuery ? ` for "${searchQuery}"` : ''}`
              : `Found ${filteredDecks.length} deck${filteredDecks.length === 1 ? '' : 's'}${searchQuery ? ` for "${searchQuery}"` : ''}${
                  sortBy ? ` sorted by ${sortBy === 'name' ? 'name' : 'recently studied'}` : ''
                }`
            }
          </p>
        </div>
      )}

      {isSelectionMode && filteredDecks.length > 0 && (
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            {selectedDeckIds.length} of {filteredDecks.length} decks selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={selectAllDecks}>
              Select All
            </Button>
            <Button variant="outline" size="sm" onClick={clearSelection}>
              Clear Selection
            </Button>
          </div>
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
          {filteredDecks.map((deck) => (
            <Deck 
              key={deck.id} 
              deck={deck}
              isSelectable={isSelectionMode}
              isSelected={selectedDeckIds.includes(deck.id)}
              onSelect={handleDeckSelection}
            />
          ))}
        </div>
      )}
      
      {/* Bulk Move Dialog */}
      <BulkMoveDeckToFolderDialog
        open={isBulkMoveDialogOpen}
        onOpenChange={setIsBulkMoveDialogOpen}
        decks={filteredDecks.filter(deck => selectedDeckIds.includes(deck.id))}
        excludeFolderId={currentFolderId}
      />
    </div>
  )
}