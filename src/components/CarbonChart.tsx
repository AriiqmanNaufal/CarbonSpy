"use client"

import { Bar, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js'
import { Product } from '@/types/Product'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface CarbonChartProps {
  data: Product[]
}

const CarbonChart = ({ data }: CarbonChartProps) => {
  const barChartData = {
    labels: data.map((p) => p.productName),
    datasets: [
      {
        label: 'Estimated CO₂ (kg)',
        data: data.map((p) => p.estimatedCO2),
        backgroundColor: 'hsl(var(--primary))',
      },
    ],
  }

  const materialData = data.reduce((acc, product) => {
    const material = product.material || 'Unknown'
    acc[material] = (acc[material] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const pieChartData = {
    labels: Object.keys(materialData),
    datasets: [
      {
        label: '# of Products',
        data: Object.values(materialData),
        backgroundColor: [
          'hsl(var(--primary))',
          'hsl(var(--secondary))',
          'hsl(var(--muted))',
          'hsl(var(--accent))',
        ],
        borderColor: 'hsl(var(--background))',
        borderWidth: 2,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'CO₂ Emissions per Product',
      },
    },
     maintainAspectRatio: false,
  }

  return (
    <div className="grid h-[500px] gap-8 md:grid-cols-2">
      <div className="relative h-[500px]">
        <Bar options={options} data={barChartData} />
      </div>
      <div className="relative h-[500px]">
        <Pie data={pieChartData} options={{...options, plugins: {...options.plugins, title: {display: true, text: 'Material Categories'}}}} />
      </div>
    </div>
  )
}

export default CarbonChart
