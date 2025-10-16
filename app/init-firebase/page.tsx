"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { initializeFirebaseData } from "@/lib/firebase-init"
import { Loader2, CheckCircle, XCircle, AlertCircle, Copy, Check } from "lucide-react"

export default function InitFirebasePage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; error?: any } | null>(null)
  const [copied, setCopied] = useState(false)

  const handleInitialize = async () => {
    setLoading(true)
    setResult(null)
    const res = await initializeFirebaseData()
    setResult(res)
    setLoading(false)
  }

  const firebaseRules = `{
  "rules": {
    "greenhouses": {
      ".read": true,
      ".write": true
    }
  }
}`

  const handleCopyRules = () => {
    navigator.clipboard.writeText(firebaseRules)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-2xl w-full space-y-6">
        <Card className="p-6 space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">Initialize Firebase Database</h1>
            <p className="text-sm text-muted-foreground">
              This will seed your Firebase Realtime Database with initial greenhouse data.
            </p>
          </div>

          <div className="space-y-4 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <p className="font-medium text-amber-500">Setup Required</p>
                <p className="text-sm text-muted-foreground">
                  Before initializing, you need to configure Firebase Realtime Database rules:
                </p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Go to Firebase Console → Realtime Database → Rules</li>
                  <li>Copy and paste the rules below</li>
                  <li>Click "Publish" to save the rules</li>
                  <li>Return here and click "Initialize Database"</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Firebase Rules</label>
              <Button variant="ghost" size="sm" onClick={handleCopyRules} className="h-8 gap-2">
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <pre className="p-4 bg-muted rounded-lg text-sm overflow-x-auto">
              <code>{firebaseRules}</code>
            </pre>
            <p className="text-xs text-muted-foreground">
              Note: These rules allow public read/write access. For production, implement proper authentication and
              security rules.
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
                  <div className="space-y-1">
                    <p className="text-sm opacity-90">Error: {result.error.message || String(result.error)}</p>
                    {result.error.code === "PERMISSION_DENIED" && (
                      <p className="text-sm opacity-90">Make sure you've set up the Firebase rules as shown above.</p>
                    )}
                  </div>
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

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Alternative: Manual Setup</h2>
          <p className="text-sm text-muted-foreground">
            If you prefer, you can manually add data to Firebase Console instead of using the initialization button.
            Navigate to Realtime Database → Data and create the structure shown in the initialization code.
          </p>
        </Card>
      </div>
    </div>
  )
}
