'use client'

import * as SelectPrimitive from '@radix-ui/react-select'
import * as React from 'react'

export function SelectValue({
  ...props
}: Readonly<
  React.ComponentProps<typeof SelectPrimitive.Value>
>): React.JSX.Element {
  return <SelectPrimitive.Value data-slot='select-value' {...props} />
}
