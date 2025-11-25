"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CheckCircle } from "lucide-react"
import useUserStore from "@/store/useUserStore"

const BillingPage = () => {
  const { user } = useUserStore()

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Billing & Plan</h1>

      <Card>
        <CardHeader>
          <CardTitle>Your Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-2xl font-bold capitalize">{user?.plan}</p>
            <p className="text-muted-foreground">
              {user?.plan === 'pro' ? 'You have unlimited scans.' : `You have ${user?.weeklyCredits} weekly scans remaining.`}
            </p>
          </div>
          {user?.plan !== 'pro' && (
            <Button size="lg">Upgrade to Pro</Button>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Feature</TableHead>
                <TableHead className="text-center">Free</TableHead>
                <TableHead className="text-center">Pro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Scans per week</TableCell>
                <TableCell className="text-center">1</TableCell>
                <TableCell className="text-center font-bold text-primary">Unlimited</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>AI Analysis</TableCell>
                <TableCell className="text-center">Standard</TableCell>
                <TableCell className="text-center font-bold text-primary">Advanced</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Weekly Automated Audits</TableCell>
                <TableCell className="text-center">--</TableCell>
                <TableCell className="text-center">
                  <CheckCircle className="mx-auto h-5 w-5 text-primary" />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Full Scan History</TableCell>
                <TableCell className="text-center">--</TableCell>
                <TableCell className="text-center">
                  <CheckCircle className="mx-auto h-5 w-5 text-primary" />
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BillingPage
