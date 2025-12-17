"use client";

import { Clock, FolderPlus, FileText, Filter, Search, CheckSquare, SquareX } from "lucide-react";
import Deck from "./deck"
import { Deck as DeckType } from "@/generated/prisma"
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import BulkMoveDeckToFolderDialog from "./folder/bulk-move-deck-to-folder-dialog";
import { useState, useMemo, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

// Define sort types
type SortOption = "recent" | "name" | null;

export default function DecksSection({
  decks,
  currentFolderId,
}: {
  decks: DeckType[];
  currentFolderId?: string;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>(null);
  const [isBulkMoveDialogOpen, setIsBulkMoveDialogOpen] = useState(false);
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedDeckIds, setSelectedDeckIds] = useState<string[]>([]);
  
  // Check if we're in folder selection mode from URL parameters
  const selectFor = searchParams?.get('selectFor');
  const targetFolderId = searchParams?.get('folderId') || currentFolderId;
  
  // Automatically enter selection mode when selectFor=folder
  useEffect(() => {
    if (selectFor === 'folder') {
      setIsSelectionMode(true);
    }
  }, [selectFor]);
  
  // Handle confirming selection of decks for a folder
  const handleConfirmSelection = async () => {
    if (selectedDeckIds.length > 0 && targetFolderId) {
      try {
        // Make API call to add decks to folder
        const response = await fetch('/api/folders/add-decks', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            folderId: targetFolderId,
            deckIds: selectedDeckIds,
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to add decks to folder');
        }
        
        // Redirect back to the folder page after adding decks
        router.push(`/dashboard/folders/${targetFolderId}`);
      } catch (error) {
        console.error("Error adding decks to folder:", error);
      }
    }
  };

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
      <div className="flex flex-col sm:flex-row gap-2 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for anything"
            className="pl-10 bg-white border-gray-200 focus:bg-white"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
        <div className="flex gap-2">
          {selectFor === 'folder' && selectedDeckIds.length > 0 ? (
            <Button 
              variant="default"
              onClick={handleConfirmSelection}
              className="bg-gradient-to-r from-[#2980B9] via-[#6DD5FA] to-[#FFFFFF] hover:from-[#2980B9] hover:to-[#6DD5FA]"
            >
              Add Selected Decks
            </Button>
          ) : (
            isSelectionMode && selectedDeckIds.length > 0 && (
              <Button 
                variant="outline"
                onClick={() => setIsBulkMoveDialogOpen(true)}
              >
                <FolderPlus className="w-4 h-4 mr-2" />
                Move to Folder
              </Button>
            )
          )}
          
          {selectFor !== 'folder' && (
            <Button
              className="w-full sm:w-auto"
              variant={isSelectionMode ? "default" : "outline"}
              onClick={toggleSelectionMode}
            >
              {isSelectionMode ? <SquareX className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
            </Button>
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              {sortBy === 'name' ? 'Name' : sortBy === 'recent' ? 'Recently studied' : ''}
              <Filter className="w-4 h-4" />
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