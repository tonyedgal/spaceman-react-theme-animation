import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: Readonly<ClassValue[]>): string {
  return twMerge(clsx(inputs))
}
