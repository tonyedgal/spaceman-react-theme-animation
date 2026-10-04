'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { clsx } from 'clsx'
import * as React from 'react'

export function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>): React.JSX.Element {
  return (
    <SelectPrimitive.Label
      data-slot='select-label'
      className={clsx('py-1.5 pr-2 pl-8 text-sm font-semibold', className)}
      {...props}
    />
  )
}
