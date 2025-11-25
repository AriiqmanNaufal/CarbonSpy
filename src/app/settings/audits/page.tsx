"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import useUserStore from "@/store/useUserStore"

// Mock store for settings
import { create } from 'zustand'

interface AuditSettingsState {
  auditsEnabled: boolean
  emailNotifications: boolean
  toggleAudits: () => void
  toggleEmail: () => void
}

const useAuditSettingsStore = create<AuditSettingsState>((set) => ({
  auditsEnabled: false,
  emailNotifications: true,
  toggleAudits: () => set((state) => ({ auditsEnabled: !state.auditsEnabled })),
  toggleEmail: () => set((state) => ({ emailNotifications: !state.emailNotifications })),
}))

const AuditSettingsPage = () => {
  const { user } = useUserStore()
  const { auditsEnabled, emailNotifications, toggleAudits, toggleEmail } = useAuditSettingsStore()
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveChanges = async () => {
    setIsSaving(true)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    toast.success("Settings Saved", {
      description: "Your weekly audit settings have been updated.",
    })
  }

  if (user?.plan !== 'pro') {
    return (
      <div>
        <h1 className="text-3xl font-bold">Weekly Audit Settings</h1>
        <p className="mt-4 text-muted-foreground">
          This feature is only available for Pro users. Please upgrade your plan to enable automated weekly audits.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Weekly Audit Settings</h1>

      <Card>
        <CardHeader>
          <CardTitle>Automated Scans</CardTitle>
          <CardDescription>
            Enable or disable automated weekly re-scans of your most recent URL.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch id="audits-enabled" checked={auditsEnabled} onCheckedChange={toggleAudits} />
            <Label htmlFor="audits-enabled">Enable Weekly Audits</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={toggleEmail} />
            <Label htmlFor="email-notifications">Email summary report</Label>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Next scheduled audit: <span className="font-medium">In 5 days</span></p>
          </div>
          <Button onClick={handleSaveChanges} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default AuditSettingsPage
