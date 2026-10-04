'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { clsx } from 'clsx'
import * as React from 'react'

import { ChevronUpIcon } from './ChevronUpIcon'

export function SelectScrollUpButton({
  className,
  ...props
}: Readonly<
  React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>
>): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot='select-scroll-up-button'
      className={clsx(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  )
}
