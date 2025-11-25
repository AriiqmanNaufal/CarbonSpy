"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle } from "lucide-react"
import Link from "next/link"

const LandingPage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  }

  return (
    <motion.div
      className="space-y-24"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Hero Section */}
      <motion.section
        className="text-center"
        variants={itemVariants}
      >
        <h1 className="text-5xl font-bold tracking-tight text-primary md:text-6xl">
          Automated Carbon Footprint Estimator for Brands
        </h1>
        <p className="mt-6 text-lg text-muted-foreground md:text-xl">
          Instantly analyze your products' environmental impact.
          <br />
          CarbonSpy.ai scrapes your site, runs AI-powered analysis, and delivers actionable insights.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/scan">Try Free Scan <ArrowRight className="ml-2 h-5 w-5" /></Link>
          </Button>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </motion.section>

      {/* How It Works Section */}
      <motion.section variants={itemVariants}>
        <h2 className="text-center text-4xl font-bold">How It Works</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>1. Submit Your URL</CardTitle></CardHeader>
            <CardContent>Enter the URL of a product or your company homepage. Our system gets to work instantly.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>2. AI Analysis</CardTitle></CardHeader>
            <CardContent>We scrape product data—materials, packaging, logistics—and feed it to our AI for deep analysis.</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>3. Get Your Report</CardTitle></CardHeader>
            <CardContent>Receive a detailed carbon footprint report with actionable suggestions for reduction.</CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Pricing Section */}
      <motion.section variants={itemVariants}>
        <h2 className="text-center text-4xl font-bold">Pricing Plans</h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-2">
          <Card className="border-2 border-primary">
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <p className="text-4xl font-bold">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary" />1 Scan per week</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary" />Basic AI Analysis</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary" />Limited History</li>
              </ul>
              <Button className="w-full" disabled>Your Current Plan</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Pro</CardTitle>
              <p className="text-4xl font-bold">$49<span className="text-lg font-normal text-muted-foreground">/month</span></p>
            </CardHeader>
            <CardContent className="space-y-4">
               <ul className="space-y-2">
                <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary" />Unlimited Scans</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary" />Advanced AI Analysis & Suggestions</li>
                <li className="flex items-center"><CheckCircle className="mr-2 h-5 w-5 text-primary" />Weekly Automated Audits</li>
              </ul>
              <Button className="w-full" asChild>
                <Link href="/billing">Upgrade to Pro</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer className="border-t border-zinc-800 pt-8 text-center text-muted-foreground" variants={itemVariants}>
        <p>&copy; {new Date().getFullYear()} CarbonSpy.ai. All rights reserved.</p>
      </motion.footer>
    </motion.div>
  )
}

export default LandingPage
