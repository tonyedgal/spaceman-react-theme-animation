import React from 'react';
import { clsx } from 'clsx';
import { ThemeSwitcherProps, Theme } from '../types';
import { useThemeAnimation } from '../hooks/use-theme-animation';

const SunIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="5" />
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
  </svg>
);

const MoonIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MonitorIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="14" x="2" y="3" rx="2" />
    <line x1="8" x2="16" y1="21" y2="21" />
    <line x1="12" x2="12" y1="17" y2="21" />
  </svg>
);

interface ThemeOptionProps {
  theme: Theme;
  isActive: boolean;
  onClick: (theme: Theme) => void;
  icon: React.ReactNode;
  size: 'sm' | 'md' | 'lg';
  variant: 'default' | 'outline' | 'ghost';
  buttonRef?: React.RefObject<HTMLButtonElement>;
}

const ThemeOption: React.FC<ThemeOptionProps> = ({
  theme,
  isActive,
  onClick,
  icon,
  size,
  variant,
  buttonRef,
}) => {
  const sizeClasses = {
    sm: 'h-7 w-7 [&_svg]:h-3 [&_svg]:w-3',
    md: 'h-8 w-8 [&_svg]:h-4 [&_svg]:w-4',
    lg: 'h-10 w-10 [&_svg]:h-5 [&_svg]:w-5',
  };

  const variantClasses = {
    default: isActive
      ? 'bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900'
      : 'text-gray-400 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-100',
    outline: isActive
      ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
      : 'border-gray-200 text-gray-400 hover:border-gray-900 hover:text-gray-900 dark:border-gray-700 dark:text-gray-500 dark:hover:border-gray-100 dark:hover:text-gray-100',
    ghost: isActive
      ? 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-500 dark:hover:bg-gray-800 dark:hover:text-gray-100',
  };

  const baseClasses = clsx(
    'relative flex cursor-pointer items-center justify-center rounded-full transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 dark:focus:ring-gray-600',
    sizeClasses[size],
    variantClasses[variant],
    variant === 'outline' && 'border'
  );

  return (
    <button
      ref={isActive ? buttonRef : undefined}
      className={baseClasses}
      role="radio"
      aria-checked={isActive}
      aria-label={`Switch to ${theme} theme`}
      onClick={() => onClick(theme)}
    >
      {icon}
      {isActive && variant === 'default' && (
        <div className="absolute inset-0 rounded-full border border-gray-300 dark:border-gray-600" />
      )}
    </button>
  );
};

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  themes = ['light', 'dark', 'system'],
  currentTheme,
  onThemeChange,
  animationType,
  duration,
  className,
  size = 'md',
  variant = 'default',
  icons,
}) => {
  const {
    ref,
    theme,
    switchTheme,
  } = useThemeAnimation({
    themes,
    theme: currentTheme,
    onThemeChange,
    animationType,
    duration,
  });

  const defaultIcons = {
    light: <SunIcon />,
    dark: <MoonIcon />,
    system: <MonitorIcon />,
  };

  const themeIcons = { ...defaultIcons, ...icons };

  const handleThemeChange = async (newTheme: Theme) => {
    await switchTheme(newTheme);
  };

  const containerClasses = clsx(
    'inline-flex items-center overflow-hidden rounded-full',
    variant === 'default' && 'bg-white ring-1 ring-gray-200 ring-inset dark:bg-gray-950 dark:ring-gray-700',
    variant === 'outline' && 'border border-gray-200 dark:border-gray-700',
    variant === 'ghost' && 'gap-1',
    className
  );

  return (
    <div className={containerClasses} role="radiogroup">
      {themes.map((themeOption) => (
        <ThemeOption
          key={themeOption}
          theme={themeOption}
          isActive={theme === themeOption}
          onClick={handleThemeChange}
          icon={themeIcons[themeOption]}
          size={size}
          variant={variant}
          buttonRef={theme === themeOption ? ref : undefined}
        />
      ))}
    </div>
  );
};
