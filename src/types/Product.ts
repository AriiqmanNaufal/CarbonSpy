export interface Product {
  id: string;
  scan: string; // Scan ID
  productName: string;
  material: string;
  packaging: string;
  logistics: string;
  estimatedCO2: number;
  comparisonToIndustryAvg: string;
  suggestions: string[];
  createdAt: string;
}
