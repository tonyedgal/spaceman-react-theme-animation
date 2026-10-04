'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import { clsx } from 'clsx'
import * as React from 'react'

import { ChevronDownIcon } from './ChevronDownIcon'

export function SelectScrollDownButton({
  className,
  ...props
}: Readonly<
  React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>
>): React.JSX.Element {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot='select-scroll-down-button'
      className={clsx(
        'flex cursor-default items-center justify-center py-1',
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  )
}
