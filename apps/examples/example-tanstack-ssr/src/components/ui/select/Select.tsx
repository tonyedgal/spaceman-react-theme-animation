'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import * as React from 'react'

export function Select({
  ...props
}: Readonly<
  React.ComponentProps<typeof SelectPrimitive.Root>
>): React.JSX.Element {
  return <SelectPrimitive.Root data-slot='select' {...props} />
}
