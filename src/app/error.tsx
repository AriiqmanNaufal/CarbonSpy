'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <h1 className="text-6xl font-bold text-destructive">500</h1>
      <h2 className="mt-4 text-2xl font-semibold">Something went wrong!</h2>
      <p className="mt-2 text-muted-foreground">
        We're sorry, but an unexpected error occurred.
      </p>
      <Button
        onClick={() => reset()}
        className="mt-6"
      >
        Try again
      </Button>
    </div>
  )
}
