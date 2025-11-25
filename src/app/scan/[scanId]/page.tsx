"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import axios from "@/lib/axios"
import { Product } from "@/types/Product"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, FileJson } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import CarbonChart from "@/components/CarbonChart"
import ProductCard from "@/components/ProductCard"

const ScanResultPage = () => {
  const params = useParams()
  const scanId = params.scanId as string
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!scanId) return;

    const fetchResults = async () => {
      try {
        const response = await axios.get(`/api/analysis/results/${scanId}`)
        setProducts(response.data.data) // Assuming paginated response
      } catch (err) {
        setError("Failed to fetch analysis results.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchResults()
  }, [scanId])

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (error) {
    return <p className="text-center text-destructive">{error}</p>
  }

  const handleExportJSON = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(products, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = `scan-results-${scanId}.json`;
    link.click();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Scan Report</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportJSON}>
            <FileJson className="mr-2 h-4 w-4" /> Export JSON
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" /> Generate PDF
          </Button>
        </div>
      </div>

      {products.length > 0 ? (
        <>
          <Card>
            <CardHeader><CardTitle>Carbon Footprint Overview</CardTitle></CardHeader>
            <CardContent>
              <CarbonChart data={products} />
            </CardContent>
          </Card>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Product Breakdown</h2>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-muted-foreground">No products were analyzed for this scan.</p>
      )}
    </div>
  )
}

export default ScanResultPage
