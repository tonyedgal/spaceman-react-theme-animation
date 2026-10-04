'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import * as React from 'react'

export function SelectGroup({
  ...props
}: Readonly<
  React.ComponentProps<typeof SelectPrimitive.Group>
>): React.JSX.Element {
  return <SelectPrimitive.Group data-slot='select-group' {...props} />
}
