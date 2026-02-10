/**
 * Badge Preview Page
 * 
 * Allows employers to preview and get embed code for verification badges
 * that can be added to job postings and websites.
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { 
  Code, 
  Copy, 
  Check, 
  ExternalLink, 
  Palette,
  Moon,
  Sun,
  Eye,
  Download,
  Shield,
  ArrowLeft,
  Building2,
  Briefcase,
  FileCode,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';

type BadgeStyle = 'compact' | 'detailed' | 'minimal';
type BadgeTheme = 'light' | 'dark';

export default function BadgePreview() {
  const params = useParams<{ certificateId?: string }>();
  const [certificateId, setCertificateId] = useState(params.certificateId || '');
  const [searchId, setSearchId] = useState(params.certificateId || '');
  const [style, setStyle] = useState<BadgeStyle>('compact');
  const [theme, setTheme] = useState<BadgeTheme>('light');
  const [copied, setCopied] = useState<string | null>(null);

  // Verify certificate exists
  const { data: verification, isLoading } = trpc.certificateVerification.verify.useQuery(
    { certificateId: searchId },
    { enabled: searchId.length > 0, retry: false }
  );

  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'https://coai.manus.space';
  
  const badgeUrl = `${baseUrl}/api/verification-badge/${searchId}?style=${style}&theme=${theme}`;
  const verifyUrl = `${baseUrl}/verify/${searchId}`;
  const widgetUrl = `${baseUrl}/api/verification-badge/widget.js`;

  const embedCodes = {
    html: `<a href="${verifyUrl}" target="_blank" rel="noopener noreferrer" title="Verify CSOAI Certificate">
  <img src="${badgeUrl}" alt="CSOAI Verified Certificate" style="max-width: 100%; height: auto;" />
</a>`,
    markdown: `[![CSOAI Verified Certificate](${badgeUrl})](${verifyUrl})`,
    widget: `<!-- CSOAI Verification Badge Widget -->
<div class="csoai-badge" 
     data-certificate-id="${searchId}"
     data-style="${style}"
     data-theme="${theme}">
</div>
<script src="${widgetUrl}" async></script>`,
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateId.trim()) {
      setSearchId(certificateId.trim());
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link href="/">
            <Button variant="ghost" className="mb-4 text-slate-300 hover:text-white hover:bg-white/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm">
              <Code className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Verification Badge Widget
              </h1>
              <p className="text-slate-300 mt-1">
                Embed certificate verification badges on your website or job postings
              </p>
            </div>
          </div>

          {/* Use Cases */}
          <div className="flex flex-wrap gap-3 mt-6">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Briefcase className="h-4 w-4 text-blue-400" />
              <span>Job Postings</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Building2 className="h-4 w-4 text-purple-400" />
              <span>Company Websites</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Globe className="h-4 w-4 text-emerald-400" />
              <span>LinkedIn Profiles</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Certificate ID Input */}
        <Card className="mb-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-emerald-600" />
              Enter Certificate ID
            </CardTitle>
            <CardDescription>
              Enter a certificate ID to generate an embeddable verification badge
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="e.g., COAI-EUAIACT-1704067200000-A1B2C3D4"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                className="flex-1 font-mono"
              />
              <Button type="submit" disabled={!certificateId.trim() || isLoading}>
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                ) : (
                  'Generate Badge'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Badge Preview & Configuration */}
        {searchId && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Configuration Panel */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5 text-purple-600" />
                  Badge Configuration
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your verification badge
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Style Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Badge Style</Label>
                  <RadioGroup 
                    value={style} 
                    onValueChange={(v) => setStyle(v as BadgeStyle)}
                    className="grid grid-cols-3 gap-3"
                  >
                    <div>
                      <RadioGroupItem value="minimal" id="minimal" className="peer sr-only" />
                      <Label
                        htmlFor="minimal"
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                          style === 'minimal' 
                            ? "border-emerald-500 bg-emerald-50" 
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <span className="text-sm font-medium">Minimal</span>
                        <span className="text-xs text-slate-500">120×28px</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="compact" id="compact" className="peer sr-only" />
                      <Label
                        htmlFor="compact"
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                          style === 'compact' 
                            ? "border-emerald-500 bg-emerald-50" 
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <span className="text-sm font-medium">Compact</span>
                        <span className="text-xs text-slate-500">180×48px</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="detailed" id="detailed" className="peer sr-only" />
                      <Label
                        htmlFor="detailed"
                        className={cn(
                          "flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer transition-all",
                          style === 'detailed' 
                            ? "border-emerald-500 bg-emerald-50" 
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <span className="text-sm font-medium">Detailed</span>
                        <span className="text-xs text-slate-500">280×80px</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Theme Selection */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Color Theme</Label>
                  <RadioGroup 
                    value={theme} 
                    onValueChange={(v) => setTheme(v as BadgeTheme)}
                    className="grid grid-cols-2 gap-3"
                  >
                    <div>
                      <RadioGroupItem value="light" id="light" className="peer sr-only" />
                      <Label
                        htmlFor="light"
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all",
                          theme === 'light' 
                            ? "border-emerald-500 bg-emerald-50" 
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <Sun className="h-4 w-4" />
                        <span className="text-sm font-medium">Light</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                      <Label
                        htmlFor="dark"
                        className={cn(
                          "flex items-center justify-center gap-2 rounded-lg border-2 p-4 cursor-pointer transition-all",
                          theme === 'dark' 
                            ? "border-emerald-500 bg-emerald-50" 
                            : "border-slate-200 hover:border-slate-300"
                        )}
                      >
                        <Moon className="h-4 w-4" />
                        <span className="text-sm font-medium">Dark</span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Certificate Status */}
                {verification && (
                  <div className="p-4 rounded-lg bg-slate-50 border">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className={cn(
                        "h-5 w-5",
                        verification.valid ? "text-emerald-600" : "text-red-600"
                      )} />
                      <span className="font-medium">
                        {verification.valid ? 'Valid Certificate' : 'Invalid Certificate'}
                      </span>
                    </div>
                    {verification.certificate && (
                      <div className="text-sm text-slate-600 space-y-1">
                        <p><strong>Holder:</strong> {verification.certificate.holderName}</p>
                        <p><strong>Course:</strong> {verification.certificate.courseName}</p>
                        {verification.certificate.framework && (
                          <p><strong>Framework:</strong> {verification.certificate.framework}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Preview Panel */}
            <Card className="shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-blue-600" />
                  Live Preview
                </CardTitle>
                <CardDescription>
                  See how your badge will appear on websites
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Light Background Preview */}
                <div className="mb-6">
                  <Label className="text-xs text-slate-500 mb-2 block">On light background</Label>
                  <div className="p-6 bg-white rounded-lg border flex items-center justify-center min-h-[120px]">
                    <a href={verifyUrl} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={badgeUrl} 
                        alt="CSOAI Verified Certificate"
                        className="max-w-full h-auto hover:opacity-90 transition-opacity"
                      />
                    </a>
                  </div>
                </div>

                {/* Dark Background Preview */}
                <div>
                  <Label className="text-xs text-slate-500 mb-2 block">On dark background</Label>
                  <div className="p-6 bg-slate-900 rounded-lg flex items-center justify-center min-h-[120px]">
                    <a href={verifyUrl} target="_blank" rel="noopener noreferrer">
                      <img 
                        src={`${baseUrl}/api/verification-badge/${searchId}?style=${style}&theme=dark`} 
                        alt="CSOAI Verified Certificate"
                        className="max-w-full h-auto hover:opacity-90 transition-opacity"
                      />
                    </a>
                  </div>
                </div>

                {/* Direct Link */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Verification Link:</span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => copyToClipboard(verifyUrl, 'link')}
                    >
                      {copied === 'link' ? (
                        <Check className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <code className="text-xs text-slate-500 break-all">{verifyUrl}</code>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Embed Code Section */}
        {searchId && (
          <Card className="mt-8 shadow-lg border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-orange-600" />
                Embed Code
              </CardTitle>
              <CardDescription>
                Copy the code below to add the verification badge to your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="html">HTML</TabsTrigger>
                  <TabsTrigger value="markdown">Markdown</TabsTrigger>
                  <TabsTrigger value="widget">Widget</TabsTrigger>
                </TabsList>

                <TabsContent value="html" className="mt-4">
                  <div className="relative">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                      <code>{embedCodes.html}</code>
                    </pre>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedCodes.html, 'html')}
                    >
                      {copied === 'html' ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Use this code in any HTML page, email signature, or website builder.
                  </p>
                </TabsContent>

                <TabsContent value="markdown" className="mt-4">
                  <div className="relative">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                      <code>{embedCodes.markdown}</code>
                    </pre>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedCodes.markdown, 'markdown')}
                    >
                      {copied === 'markdown' ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    Use this in GitHub READMEs, documentation, or any Markdown-enabled platform.
                  </p>
                </TabsContent>

                <TabsContent value="widget" className="mt-4">
                  <div className="relative">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                      <code>{embedCodes.widget}</code>
                    </pre>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(embedCodes.widget, 'widget')}
                    >
                      {copied === 'widget' ? (
                        <>
                          <Check className="h-4 w-4 mr-1 text-emerald-600" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    The widget script automatically renders badges with hover effects. 
                    Customize with <code className="bg-slate-100 px-1 rounded">data-style</code> and <code className="bg-slate-100 px-1 rounded">data-theme</code> attributes.
                  </p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 shadow-lg border-0">
          <CardHeader>
            <CardTitle>How to Use Verification Badges</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-slate max-w-none">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-semibold m-0">Job Postings</h3>
                </div>
                <p className="text-sm text-slate-600 m-0">
                  Add badges to job listings to show that your company values AI safety 
                  certifications. Candidates can click to verify credentials instantly.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Building2 className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-semibold m-0">Company Websites</h3>
                </div>
                <p className="text-sm text-slate-600 m-0">
                  Display team member certifications on your About or Team page 
                  to demonstrate your commitment to responsible AI development.
                </p>
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-emerald-100 rounded-lg">
                    <Globe className="h-5 w-5 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold m-0">Professional Profiles</h3>
                </div>
                <p className="text-sm text-slate-600 m-0">
                  Add to LinkedIn, personal websites, or portfolios to showcase 
                  your AI safety credentials to potential employers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
