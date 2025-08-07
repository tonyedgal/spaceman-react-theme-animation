'use client';

import React from 'react';
import { ThemeSelectorProps, ColorTheme } from '../types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  colorThemes = ['default', 'mono', 'supabase'],
  currentColorTheme,
  onColorThemeChange,
}) => {
  // Use controlled props instead of internal hook
  const colorTheme = currentColorTheme || 'default';

  const handleColorThemeChange = (newColorTheme: string) => {
    if (onColorThemeChange) {
      onColorThemeChange(newColorTheme as ColorTheme);
    }
  };

  return (
    <>
      {colorThemes.length > 1 && (
        <div className="flex flex-col gap-2">
          <Select value={colorTheme} onValueChange={(v: string) => handleColorThemeChange(v)}>
            <SelectTrigger className="capitalize">
              <SelectValue placeholder="Choose a color theme" />
            </SelectTrigger>
            <SelectContent>
              {colorThemes.map(theme => (
                <SelectItem key={theme} className="capitalize" value={theme}>
                  {theme}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );
};
