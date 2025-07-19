"use client"

import React from "react"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  colors: { value: string; label: string }[]
}

export function ColorPicker({ value, onChange, colors }: ColorPickerProps) {
  return (
    <div className="flex flex-wrap gap-3">
      {colors.map((colorOption) => (
        <button
          key={colorOption.value}
          type="button"
          aria-label={`Select ${colorOption.label} color`}
          className={`w-10 h-10 rounded-full cursor-pointer flex items-center justify-center border-2 ${
            value === colorOption.value ? "border-black" : "border-transparent"
          } hover:border-gray-400 transition-all`}
          style={{ backgroundColor: colorOption.value }}
          onClick={() => onChange(colorOption.value)}
        >
          {value === colorOption.value && (
            <div className="w-3 h-3 bg-white rounded-full" />
          )}
        </button>
      ))}
    </div>
  )
}
