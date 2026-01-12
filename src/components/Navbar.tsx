"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "./ThemeToggle"

const Navbar = () => {
  return (
    <nav className="border-b border-zinc-800">
      <div className="container mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-primary">
          CarbonSpy.ai
        </Link>
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <ThemeToggle />
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
