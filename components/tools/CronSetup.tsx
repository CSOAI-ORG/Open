/**
 * Cron Setup Documentation Page
 * 
 * Provides administrators with instructions for setting up external
 * cron services to trigger scheduled tasks like certificate expiration checks.
 */

import { useState } from 'react';
import { Link } from 'wouter';
import { 
  Clock, 
  Copy, 
  Check, 
  ExternalLink, 
  Shield, 
  AlertTriangle,
  ArrowLeft,
  Server,
  Key,
  Calendar,
  Bell,
  CheckCircle2,
  Settings,
  Globe,
  Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { trpc } from '@/lib/trpc';

export default function CronSetup() {
  const [cronSecret, setCronSecret] = useState('');
  const [copied, setCopied] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [testing, setTesting] = useState(false);

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://coai.manus.space';

  const cronEndpoint = `${baseUrl}/api/cron/certificate-expiration`;
  const healthEndpoint = `${baseUrl}/api/cron/health`;

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const testCronEndpoint = async () => {
    if (!cronSecret.trim()) {
      setTestResult({ success: false, message: 'Please enter your CRON_SECRET' });
      return;
    }

    setTesting(true);
    setTestResult(null);

    try {
      const response = await fetch(cronEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': cronSecret,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult({ 
          success: true, 
          message: `Success! Processed ${data.totals?.totalProcessed || 0} certificates, sent ${data.totals?.totalSent || 0} reminders.` 
        });
      } else {
        setTestResult({ 
          success: false, 
          message: data.message || 'Authentication failed. Check your CRON_SECRET.' 
        });
      }
    } catch (error) {
      setTestResult({ 
        success: false, 
        message: 'Failed to connect to the endpoint. Check your network connection.' 
      });
    } finally {
      setTesting(false);
    }
  };

  const curlExample = `curl -X POST "${cronEndpoint}" \\
  -H "Content-Type: application/json" \\
  -H "x-cron-secret: YOUR_CRON_SECRET"`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <Link href="/admin">
            <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Admin
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Clock className="h-8 w-8 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Cron Job Setup
              </h1>
              <p className="text-slate-300 mt-1">
                Configure external cron services for scheduled tasks
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Bell className="h-4 w-4 text-amber-400" />
              <span>Certificate Expiration Reminders</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Calendar className="h-4 w-4 text-emerald-400" />
              <span>Daily at 9:00 AM UTC</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Overview */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-600" />
              Certificate Expiration Cron Job
            </CardTitle>
            <CardDescription>
              This endpoint checks for expiring certificates and sends reminder emails to users
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-semibold">30-Day Reminder</span>
                </div>
                <p className="text-sm text-slate-600">
                  Sends first reminder 30 days before certificate expires
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                  <span className="font-semibold">14-Day Reminder</span>
                </div>
                <p className="text-sm text-slate-600">
                  Sends urgent reminder 14 days before expiration
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Bell className="h-5 w-5 text-red-600" />
                  <span className="font-semibold">7-Day Reminder</span>
                </div>
                <p className="text-sm text-slate-600">
                  Final reminder 7 days before certificate expires
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endpoint Details */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-emerald-600" />
              Endpoint Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Endpoint URL */}
            <div className="space-y-2">
              <Label className="text-sm font-medium">Endpoint URL</Label>
              <div className="flex gap-2">
                <Input 
                  value={cronEndpoint} 
                  readOnly 
                  className="font-mono text-sm"
                />
                <Button 
                  variant="outline" 
                  onClick={() => copyToClipboard(cronEndpoint, 'endpoint')}
                >
                  {copied === 'endpoint' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Method & Headers */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">HTTP Method</Label>
                <Badge variant="secondary" className="text-sm">POST</Badge>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Required Headers</Label>
                <div className="space-y-1">
                  <Badge variant="outline" className="text-xs font-mono">
                    x-cron-secret: YOUR_SECRET
                  </Badge>
                  <p className="text-xs text-slate-500">
                    Or use <code className="bg-slate-100 px-1 rounded">Authorization: Bearer YOUR_SECRET</code>
                  </p>
                </div>
              </div>
            </div>

            {/* Recommended Schedule */}
            <Alert>
              <Calendar className="h-4 w-4" />
              <AlertTitle>Recommended Schedule</AlertTitle>
              <AlertDescription>
                <strong>Daily at 9:00 AM UTC</strong> — This ensures users receive reminders 
                at a reasonable time regardless of their timezone.
                <br />
                <span className="font-mono text-sm mt-1 block">Cron expression: <code>0 9 * * *</code></span>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Setup Instructions */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-purple-600" />
              Setup Instructions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="cron-job-org" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="cron-job-org">cron-job.org</TabsTrigger>
                <TabsTrigger value="vercel">Vercel Cron</TabsTrigger>
                <TabsTrigger value="manual">Manual/curl</TabsTrigger>
              </TabsList>

              <TabsContent value="cron-job-org" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Create an account at cron-job.org</h4>
                      <p className="text-sm text-slate-600">
                        Visit <a href="https://cron-job.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">cron-job.org</a> and 
                        sign up for a free account (supports up to 3 cron jobs).
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Create a new cron job</h4>
                      <p className="text-sm text-slate-600">
                        Click "Create cronjob" and configure with these settings:
                      </p>
                      <ul className="mt-2 text-sm text-slate-600 list-disc list-inside space-y-1">
                        <li><strong>Title:</strong> CSOAI Certificate Expiration Check</li>
                        <li><strong>URL:</strong> <code className="bg-slate-100 px-1 rounded">{cronEndpoint}</code></li>
                        <li><strong>Schedule:</strong> Every day at 9:00 AM</li>
                        <li><strong>Request method:</strong> POST</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Add authentication header</h4>
                      <p className="text-sm text-slate-600">
                        In the "Advanced" settings, add a custom header:
                      </p>
                      <div className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm">
                        x-cron-secret: YOUR_CRON_SECRET
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 font-semibold">4</div>
                    <div>
                      <h4 className="font-semibold">Save and enable</h4>
                      <p className="text-sm text-slate-600">
                        Save the cron job and ensure it's enabled. You can test it immediately 
                        using the "Run now" button.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="vercel" className="mt-4 space-y-4">
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Vercel Cron Limitations</AlertTitle>
                  <AlertDescription>
                    Vercel Cron is only available on Pro and Enterprise plans. 
                    For free tier, use cron-job.org instead.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">1</div>
                    <div>
                      <h4 className="font-semibold">Add vercel.json configuration</h4>
                      <p className="text-sm text-slate-600">
                        Create or update your <code className="bg-slate-100 px-1 rounded">vercel.json</code> file:
                      </p>
                      <pre className="mt-2 p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm overflow-x-auto">
{`{
  "crons": [{
    "path": "/api/cron/certificate-expiration",
    "schedule": "0 9 * * *"
  }]
}`}
                      </pre>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">2</div>
                    <div>
                      <h4 className="font-semibold">Set CRON_SECRET environment variable</h4>
                      <p className="text-sm text-slate-600">
                        In your Vercel project settings, add the <code className="bg-slate-100 px-1 rounded">CRON_SECRET</code> environment variable.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">3</div>
                    <div>
                      <h4 className="font-semibold">Verify CRON_SECRET in request</h4>
                      <p className="text-sm text-slate-600">
                        Vercel automatically sends the <code className="bg-slate-100 px-1 rounded">Authorization</code> header 
                        with your CRON_SECRET for cron requests.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="manual" className="mt-4 space-y-4">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Using curl</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      You can manually trigger the cron job using curl:
                    </p>
                    <div className="relative">
                      <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm overflow-x-auto">
                        {curlExample}
                      </pre>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(curlExample, 'curl')}
                      >
                        {copied === 'curl' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Using system crontab</h4>
                    <p className="text-sm text-slate-600 mb-2">
                      Add this to your server's crontab (<code className="bg-slate-100 px-1 rounded">crontab -e</code>):
                    </p>
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg font-mono text-sm overflow-x-auto">
{`0 9 * * * curl -X POST "${cronEndpoint}" -H "x-cron-secret: YOUR_SECRET"`}
                    </pre>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Test Endpoint */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              Test Endpoint
            </CardTitle>
            <CardDescription>
              Test your cron endpoint configuration before setting up the scheduled job
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cronSecret">CRON_SECRET</Label>
              <Input
                id="cronSecret"
                type="password"
                placeholder="Enter your CRON_SECRET"
                value={cronSecret}
                onChange={(e) => setCronSecret(e.target.value)}
              />
              <p className="text-xs text-slate-500">
                This is the secret key set in your environment variables
              </p>
            </div>

            <Button 
              onClick={testCronEndpoint} 
              disabled={testing || !cronSecret.trim()}
              className="w-full"
            >
              {testing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Testing...
                </>
              ) : (
                <>
                  <Server className="h-4 w-4 mr-2" />
                  Test Cron Endpoint
                </>
              )}
            </Button>

            {testResult && (
              <Alert variant={testResult.success ? "default" : "destructive"}>
                {testResult.success ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                <AlertTitle>{testResult.success ? 'Success' : 'Error'}</AlertTitle>
                <AlertDescription>{testResult.message}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Alert className="mb-8">
          <Shield className="h-4 w-4" />
          <AlertTitle>Security Best Practices</AlertTitle>
          <AlertDescription>
            <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
              <li>Use a strong, randomly generated CRON_SECRET (at least 32 characters)</li>
              <li>Never expose your CRON_SECRET in client-side code or public repositories</li>
              <li>Rotate your CRON_SECRET periodically for enhanced security</li>
              <li>Monitor cron job execution logs for any unauthorized access attempts</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Health Check */}
        <Card className="shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Health Check Endpoint
            </CardTitle>
            <CardDescription>
              Use this endpoint to monitor cron service availability
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input 
                value={healthEndpoint} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                onClick={() => copyToClipboard(healthEndpoint, 'health')}
              >
                {copied === 'health' ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open(healthEndpoint, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              This endpoint does not require authentication and returns the service status.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
