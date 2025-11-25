"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import useUserStore from "@/store/useUserStore"
import axios from "@/lib/axios"
import { Scan } from "@/types/Scan"
import { useRouter } from "next/navigation"

const DashboardPage = () => {
  const { user, setUser } = useUserStore()
  const [scans, setScans] = useState<Scan[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch user if not in store
        if (!user) {
          const userRes = await axios.get('/api/auth/me');
          setUser(userRes.data);
        }

        // Fetch scan history
        const scansRes = await axios.get('/api/scans'); // Assuming an endpoint like this exists
        setScans(scansRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
        // Redirect to login if unauthorized
        if ((error as any).response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [user, setUser, router])

  const handleLogout = async () => {
    await axios.post('/api/auth/logout');
    setUser(null);
    router.push('/login');
  }

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Welcome, {user?.email}</CardTitle>
          <Button onClick={handleLogout} variant="destructive">Logout</Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>Plan</CardTitle></CardHeader>
            <CardContent><Badge variant={user?.plan === 'pro' ? 'default' : 'secondary'}>{user?.plan}</Badge></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Weekly Credits</CardTitle></CardHeader>
            <CardContent><p className="text-2xl font-bold">{user?.weeklyCredits}</p></CardContent>
          </Card>
          <div className="md:col-span-3">
            <Button asChild className="w-full md:w-auto">
              <Link href="/scan">Start New Scan</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scan History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>URL</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scans.length > 0 ? (
                scans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell>{scan.url}</TableCell>
                    <TableCell>{new Date(scan.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell><Badge>{scan.status}</Badge></TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/scan/${scan.id}`}>View Report</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">No scans yet.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardPage
