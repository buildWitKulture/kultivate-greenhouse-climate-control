"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { initializeFirebaseData } from "@/lib/firebase-init"
import { Loader2, CheckCircle, XCircle } from "lucide-react"

export default function InitFirebasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: any } | null>(null)

  const handleInitialize = async () => {
    setLoading(true)
    setResult(null)
    const res = await initializeFirebaseData()
    setResult(res)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="max-w-md w-full p-6 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Initialize Firebase Database</h1>
          <p className="text-sm text-muted-foreground">
            This will seed your Firebase Realtime Database with initial greenhouse data. Only run this once.
          </p>
        </div>

        <Button onClick={handleInitialize} disabled={loading} className="w-full">
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Initialize Database
        </Button>

        {result && (
          <div
            className={`flex items-start gap-3 p-4 rounded-lg ${
              result.success ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"
            }`}
          >
            {result.success ? (
              <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            ) : (
              <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            )}
            <div className="space-y-1">
              <p className="font-medium">
                {result.success ? "Database initialized successfully!" : "Initialization failed"}
              </p>
              {result.error && (
                <p className="text-sm opacity-90">Error: {result.error.message || String(result.error)}</p>
              )}
              {result.success && (
                <p className="text-sm opacity-90">
                  You can now navigate to the dashboard to see real-time data from Firebase.
                </p>
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
