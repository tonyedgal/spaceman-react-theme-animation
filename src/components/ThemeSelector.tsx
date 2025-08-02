import React from 'react';
import { clsx } from 'clsx';
import { ThemeSelectorProps, Theme } from '../types';
import { useThemeAnimation } from '../hooks/use-theme-animation';

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
  placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ 
  value, 
  onValueChange, 
  children, 
  className,
  placeholder 
}) => (
  <select
    value={value}
    onChange={(e) => onValueChange(e.target.value)}
    className={clsx(
      'rounded-md border border-gray-200 bg-white px-3 py-2 text-sm',
      'focus:border-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400',
      'dark:border-gray-700 dark:bg-gray-950 dark:text-gray-100',
      'dark:focus:border-gray-600 dark:focus:ring-gray-600',
      className
    )}
  >
    {placeholder && <option value="">{placeholder}</option>}
    {children}
  </select>
);

const SelectItem: React.FC<{ value: string; children: React.ReactNode }> = ({ 
  value, 
  children 
}) => (
  <option value={value} className="capitalize">
    {children}
  </option>
);

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  themes = ['light', 'dark', 'system'],
  colorThemes = ['default'],
  currentTheme,
  currentColorTheme,
  onThemeChange,
  onColorThemeChange,
  animationType,
  duration,
  className,
  placeholder = 'Choose a theme',
  themeLabel = 'Theme',
  colorThemeLabel = 'Color Theme',
}) => {
  const {
    ref,
    theme,
    colorTheme,
    switchTheme,
    setColorTheme,
  } = useThemeAnimation({
    themes,
    colorThemes,
    theme: currentTheme,
    colorTheme: currentColorTheme,
    onThemeChange,
    onColorThemeChange,
    animationType,
    duration,
  });

  const handleThemeChange = async (newTheme: string) => {
    if (themes.indexOf(newTheme as Theme) !== -1) {
      await switchTheme(newTheme as Theme);
    }
  };

  const handleColorThemeChange = (newColorTheme: string) => {
    if (colorThemes.indexOf(newColorTheme) !== -1) {
      setColorTheme(newColorTheme);
    }
  };

  const containerClasses = clsx(
    'space-y-4 rounded-lg border border-gray-200 bg-white p-4 shadow-sm',
    'dark:border-gray-700 dark:bg-gray-950',
    className
  );

  return (
    <div className={containerClasses}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {themeLabel}
        </label>
        <Select
          value={theme}
          onValueChange={handleThemeChange}
          placeholder={placeholder}
          className="w-full"
        >
          {themes.map((themeOption) => (
            <SelectItem key={themeOption} value={themeOption}>
              {themeOption}
            </SelectItem>
          ))}
        </Select>
      </div>

      {colorThemes.length > 1 && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {colorThemeLabel}
          </label>
          <Select
            value={colorTheme}
            onValueChange={handleColorThemeChange}
            className="w-full"
          >
            {colorThemes.map((colorThemeOption) => (
              <SelectItem key={colorThemeOption} value={colorThemeOption}>
                {colorThemeOption}
              </SelectItem>
            ))}
          </Select>
        </div>
      )}
    </div>
  );
};
