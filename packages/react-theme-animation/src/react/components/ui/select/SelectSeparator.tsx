'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { clsx } from 'clsx'
import * as React from 'react'

export function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>): React.JSX.Element {
  return (
    <SelectPrimitive.Separator
      data-slot='select-separator'
      className={clsx('bg-muted -mx-1 my-1 h-px', className)}
      {...props}
    />
  )
}
