'use client'

import Header from './Header'

interface ClientHeaderProps {
  font: string
}

export function ClientHeader({ font }: ClientHeaderProps) {
  return <Header font={font} />
} 