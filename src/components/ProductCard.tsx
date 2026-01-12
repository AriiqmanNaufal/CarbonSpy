import { Product } from "@/types/Product"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

interface ProductCardProps {
  product: Product
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{product.productName}</CardTitle>
        <CardDescription>
          <Badge>{product.comparisonToIndustryAvg}</Badge>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="font-semibold">Estimated CO₂</h3>
            <p className="text-2xl font-bold text-primary">{product.estimatedCO2} kg</p>
          </div>
          <div>
            <h3 className="font-semibold">Primary Material</h3>
            <p>{product.material}</p>
          </div>
          <div>
            <h3 className="font-semibold">Packaging</h3>
            <p>{product.packaging}</p>
          </div>
          <div>
            <h3 className="font-semibold">Logistics</h3>
            <p>{product.logistics}</p>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Suggestions for Improvement</h3>
          <ul className="mt-2 space-y-2">
            {product.suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start">
                <CheckCircle className="mr-2 mt-1 h-4 w-4 text-primary" />
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductCard
