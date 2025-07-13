"use client";

import { Folder as FolderIcon, Plus, Search } from "lucide-react";
import Folder from "./folder"
import { Folder as FolderType } from "@/generated/prisma"
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState, useMemo } from "react";
import Link from "next/link";

export default function FoldersSection({
  folders,
}: {
  folders: FolderType[];
}) {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    // Filter by search query
    if (searchQuery.trim()) {
      return folders.filter((folder) =>
        folder.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
    }
    
    return folders;
  }, [folders, searchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  return (
    <div>
      <div className="flex flex-row sm:items-center sm:justify-between gap-4 mb-3">
        <div>
          <h1 className="text-3xl font-bold">My Folders</h1>
          <p className="text-gray-600">Organize your flashcard collections into folders</p>
        </div>
        
        <Link href="/dashboard/folders/create">
          <Button
            size="lg"
            className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700 px-8 sm:h-12 h-full rounded-3xl"
          >
            <Plus className="mr-2" />
            New Folder
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search folders"
            className="pl-10 bg-white border-gray-200 focus:bg-white"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Search info */}
      {searchQuery.trim() && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {filteredFolders.length === 0 
              ? `No folders found for "${searchQuery}"`
              : `Found ${filteredFolders.length} folder${filteredFolders.length === 1 ? '' : 's'} for "${searchQuery}"`
            }
          </p>
        </div>
      )}

      {filteredFolders.length === 0 && searchQuery.trim() ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No folders found</h3>
          <p className="text-gray-600">
            Try adjusting your search terms or create a new folder.
          </p>
        </div>
      ) : filteredFolders.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <FolderIcon className="w-12 h-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No folders yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first folder to organize your flashcard sets.
          </p>
          <Link href="/dashboard/folders/create">
            <Button className="bg-gradient-to-r from-orange-500 to-purple-600 hover:from-orange-600 hover:to-purple-700">
              <Plus className="mr-2 h-4 w-4" />
              Create Folder
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-3">
          {
            filteredFolders.map((folder) => (
              <Folder key={folder.id} folder={folder} />
            ))
          }
        </div>
      )}
    </div>
  )
}
