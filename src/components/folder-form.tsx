import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import React from "react"

interface FolderFormProps {
  name: string;
  description: string;
  color: string;
  onNameChange: (name: string) => void;
  onDescriptionChange: (description: string) => void;
  onColorChange: (color: string) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

const FolderForm: React.FC<FolderFormProps> = ({
  name,
  description,
  color,
  onNameChange,
  onDescriptionChange,
  onColorChange,
  onSave,
  onCancel,
  isSaving = false,
}) => {
  // Array of predefined colors
  const colorOptions = [
    "#4F46E5", // Indigo
    "#2563EB", // Blue
    "#10B981", // Emerald
    "#EF4444", // Red
    "#F59E0B", // Amber
    "#8B5CF6", // Violet
    "#EC4899", // Pink
    "#6366F1", // Indigo
  ];

  return (
    <Card className="border-gray-200 shadow-sm">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-base">Folder Name</Label>
            <Input
              id="name"
              placeholder="Enter a name for your folder"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-base">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Enter a description for your folder"
              value={description}
              onChange={(e) => onDescriptionChange(e.target.value)}
              rows={3}
              className="bg-white border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>
          
          <div className="space-y-2">
            <Label className="text-base">Folder Color</Label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map((colorOption) => (
                <button
                  key={colorOption}
                  type="button"
                  className={`w-8 h-8 rounded-full ${color === colorOption ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                  style={{ backgroundColor: colorOption }}
                  onClick={() => onColorChange(colorOption)}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-6">
            {onCancel && (
              <Button variant="outline" className="border-gray-300" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
            )}
            <Button
              onClick={onSave}
              className="bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:from-orange-600 hover:to-purple-700 shadow-md px-8"
              disabled={isSaving || !name.trim()}
            >
              {isSaving ? "Saving..." : "Save Folder"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default FolderForm;
