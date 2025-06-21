import { BookOpen, Clock, FileText, Filter, Grid3X3, List, Search, TrendingUp } from "lucide-react";
import Deck from "./deck"
import { Deck as DeckType } from "@/services/deck.service"
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function DecksSection({
  decks,
}: {
  decks: DeckType[];
}) {
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
        <div>
          <h1 className="text-3xl font-bold">My Decks</h1>
          <p className="text-gray-600">Manage and study your flashcard collections</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={"grid" === "grid" ? "default" : "outline"}
            size="lg"
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={"grid" === "list" ? "default" : "outline"}
            size="lg"
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search for anything"
            className="pl-10 bg-white border-gray-200 focus:bg-white"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Sort by
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
        {
          decks.map((deck) => (
            <Deck key={deck.id} deck={deck} />
          ))
        }
      </div>
    </div>
  )
}