"use client"

import { useEffect, useState } from "react"
import axios from "@/lib/axios"
import useScanStore from "@/store/useScanStore"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"

interface ScanStatusProps {
  jobId: string
  scanId: string
}

const ScanStatus = ({ jobId, scanId }: ScanStatusProps) => {
  const { status, setStatus } = useScanStore()
  const [progress, setProgress] = useState(10)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'completed' || status === 'failed') return;

    const interval = setInterval(async () => {
      try {
        const response = await axios.get(`/api/scrape/status/${jobId}`)
        const { scanStatus, progress: jobProgress } = response.data

        setStatus(scanStatus)
        setProgress(jobProgress || progress + 10) // Mock progress if not provided

        if (scanStatus === 'completed' || scanStatus === 'failed') {
          clearInterval(interval)
        }
      } catch (err) {
        setError("Could not fetch scan status.")
        clearInterval(interval)
      }
    }, 5000) // Poll every 5 seconds

    return () => clearInterval(interval)
  }, [jobId, status, setStatus, progress])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan in Progress</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === 'pending' && <p>Your scan is in the queue...</p>}
        {status === 'processing' && <p>Processing... our AI is analyzing the site.</p>}

        <Progress value={status === 'completed' ? 100 : progress} className="w-full" />

        {status === 'completed' && (
          <Alert>
            <Terminal className="h-4 w-4" />
            <AlertTitle>Scan Complete!</AlertTitle>
            <AlertDescription>
              Your carbon footprint report is ready.
              <Button asChild className="mt-2 w-full">
                <Link href={`/scan/${scanId}`}>View Report</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {status === 'failed' && (
           <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Scan Failed</AlertTitle>
            <AlertDescription>
              Something went wrong during the scan. Please try again.
            </AlertDescription>
          </Alert>
        )}

        {error && <p className="text-sm font-medium text-destructive">{error}</p>}
      </CardContent>
    </Card>
  )
}

export default ScanStatus
