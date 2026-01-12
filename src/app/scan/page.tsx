"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import axios from "@/lib/axios"
import useScanStore from "@/store/useScanStore"
import ScanStatus from "@/components/ScanStatus"

const formSchema = z.object({
  url: z.string().url({ message: "Please enter a valid URL." }),
})

const ScanPage = () => {
  const [error, setError] = useState<string | null>(null)
  const { jobId, scanId, setJob, resetScan } = useScanStore()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setError(null)
    resetScan()
    try {
      const response = await axios.post("/api/scrape/start", values)
      setJob(response.data.jobId, response.data.scanId)
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred.")
    }
  }

  const handleNewScan = () => {
    resetScan();
    form.reset();
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      {!jobId ? (
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Start a New Scan</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {error && <p className="text-sm font-medium text-destructive">{error}</p>}
                <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? "Starting Scan..." : "Start Scan"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      ) : (
        <div className="w-full max-w-2xl">
          <ScanStatus jobId={jobId} scanId={scanId!} />
          <Button onClick={handleNewScan} className="mt-4 w-full">Start Another Scan</Button>
        </div>
      )}
    </div>
  )
}

export default ScanPage
