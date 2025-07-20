"use client";

import { Folder, Clock, Filter, Search } from "lucide-react";
import { FolderWithDecks } from "@/lib/types";
import { Input } from "../ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { useState, useMemo } from "react";
import FolderItem from "./folder-item";
import CreateFolderButton from "@/app/dashboard/folders/create-folder-button";

// Define sort types
type SortOption = "recent" | "name" | null;

export default function FoldersSection({
  folders,
}: {
  folders: FolderWithDecks[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>(null);

  // Filter and sort folders based on search and sort options
  const filteredFolders = useMemo(() => {
    // First, filter by search query
    let result = folders;
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter((folder) =>
        folder.name.toLowerCase().includes(query) ||
        folder.description.toLowerCase().includes(query)
      );
    }

    // Then, apply sorting
    if (sortOption === "recent") {
      return [...result].sort((a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    } else if (sortOption === "name") {
      return [...result].sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [folders, searchQuery, sortOption]);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex gap-2 w-full">
          {/* Search Input */}
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              placeholder="Search folders..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSortOption("recent")}>
                <Clock className="mr-2 h-4 w-4" />
                <span>Recently Updated</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOption("name")}>
                <Folder className="mr-2 h-4 w-4" />
                <span>Folder Name</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Create Folder Button */}
          <CreateFolderButton />
        </div>
      </div>

      {/* Empty State */}
      {folders.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-white">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Folder className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No folders yet</h3>
          <p className="text-gray-500 max-w-sm mx-auto mb-6">
            Create folders to organize your flashcard decks by subject, course, or any category you prefer.
          </p>
          <CreateFolderButton />
        </div>
      )}

      {/* Folders Grid */}
      {folders.length > 0 && filteredFolders.length === 0 && (
        <div className="text-center py-16 border-2 border-dashed rounded-lg bg-white">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 mb-4">
            <Search className="h-6 w-6 text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No folders found</h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            We couldn&apos;t find any folders matching your search. Try using different keywords.
          </p>
        </div>
      )}

      {folders.length > 0 && filteredFolders.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
          {
            filteredFolders.map((folder) => (
              <FolderItem key={folder.id} folder={folder} />
            ))
          }
        </div>
      )}
    </div>
  );
}
