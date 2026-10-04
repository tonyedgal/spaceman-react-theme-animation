'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import * as React from 'react'

import { cn } from '@/lib/utils'

export function SelectSeparator({
  className,
  ...props
}: Readonly<
  React.ComponentProps<typeof SelectPrimitive.Separator>
>): React.JSX.Element {
  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={cn('bg-border pointer-events-none -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}
