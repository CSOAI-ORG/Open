/**
 * Public Certificate Verification Page
 * 
 * A polished, employer-friendly page where anyone can verify
 * the authenticity of CSOAI certificates by entering a certificate ID.
 */

import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  Shield, 
  Calendar, 
  User, 
  Award, 
  Clock,
  AlertTriangle,
  Building2,
  GraduationCap,
  BadgeCheck,
  Copy,
  Check,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { cn } from '@/lib/utils';
import { CertificateQRCode } from '@/components/CertificateQRCode';
import { QrCode, Code } from 'lucide-react';

type VerificationStatus = 'valid' | 'expired' | 'revoked' | 'not_found' | 'expiring_soon';

interface VerificationResult {
  valid: boolean;
  status: VerificationStatus;
  certificate?: {
    certificateId: string;
    holderName: string;
    courseName: string;
    framework: string | null;
    issuedAt: string;
    expiresAt: string | null;
    certificationLevel: string | null;
  };
  message: string;
  verifiedAt: string;
}

export default function VerifyCertificatePage() {
  const params = useParams<{ certificateId?: string }>();
  const [, setLocation] = useLocation();
  const [certificateId, setCertificateId] = useState(params.certificateId || '');
  const [searchId, setSearchId] = useState(params.certificateId || '');
  const [copied, setCopied] = useState(false);

  // Query the verification endpoint
  const { data: result, isLoading, error, refetch } = trpc.certificateVerification.verify.useQuery(
    { certificateId: searchId },
    { 
      enabled: searchId.length > 0,
      retry: false,
      refetchOnWindowFocus: false,
    }
  );

  // Update URL when searching
  useEffect(() => {
    if (searchId && searchId !== params.certificateId) {
      setLocation(`/verify/${searchId}`, { replace: true });
    }
  }, [searchId, params.certificateId, setLocation]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certificateId.trim()) {
      setSearchId(certificateId.trim());
    }
  };

  const handleReset = () => {
    setCertificateId('');
    setSearchId('');
    setLocation('/verify', { replace: true });
  };

  const copyToClipboard = async () => {
    if (result?.certificate?.certificateId) {
      await navigator.clipboard.writeText(result.certificate.certificateId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusConfig = (status: VerificationStatus) => {
    switch (status) {
      case 'valid':
        return {
          icon: CheckCircle2,
          color: 'emerald',
          bgGradient: 'from-emerald-500 to-emerald-600',
          lightBg: 'bg-emerald-50',
          borderColor: 'border-emerald-200',
          textColor: 'text-emerald-700',
          badgeText: '✓ Verified & Valid',
          title: 'Certificate Verified',
        };
      case 'expiring_soon':
        return {
          icon: AlertTriangle,
          color: 'amber',
          bgGradient: 'from-amber-500 to-amber-600',
          lightBg: 'bg-amber-50',
          borderColor: 'border-amber-200',
          textColor: 'text-amber-700',
          badgeText: '⚠ Valid - Expiring Soon',
          title: 'Certificate Valid (Expiring Soon)',
        };
      case 'expired':
        return {
          icon: Clock,
          color: 'orange',
          bgGradient: 'from-orange-500 to-orange-600',
          lightBg: 'bg-orange-50',
          borderColor: 'border-orange-200',
          textColor: 'text-orange-700',
          badgeText: '⏰ Expired',
          title: 'Certificate Expired',
        };
      case 'revoked':
        return {
          icon: XCircle,
          color: 'red',
          bgGradient: 'from-red-500 to-red-600',
          lightBg: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-700',
          badgeText: '✕ Revoked',
          title: 'Certificate Revoked',
        };
      default:
        return {
          icon: XCircle,
          color: 'gray',
          bgGradient: 'from-gray-500 to-gray-600',
          lightBg: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-700',
          badgeText: '? Not Found',
          title: 'Certificate Not Found',
        };
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDaysUntilExpiry = (expiresAt: string | null) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-2xl mb-6 backdrop-blur-sm">
            <Shield className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Certificate Verification
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Verify the authenticity of CSOAI AI Safety certifications instantly. 
            Enter a certificate ID to confirm credentials.
          </p>
          
          {/* Trust Badges */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <BadgeCheck className="h-4 w-4 text-emerald-400" />
              <span>Instant Verification</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <Building2 className="h-4 w-4 text-blue-400" />
              <span>Employer Trusted</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm">
              <GraduationCap className="h-4 w-4 text-purple-400" />
              <span>Industry Recognized</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-8 pb-16">
        {/* Search Card */}
        <Card className="shadow-xl border-0 mb-8">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Search className="h-5 w-5 text-slate-500" />
              Enter Certificate ID
            </CardTitle>
            <CardDescription>
              Certificate IDs follow the format: COAI-FRAMEWORK-TIMESTAMP-CODE
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="flex gap-3">
              <Input
                type="text"
                placeholder="e.g., COAI-EUAIACT-1704067200000-A1B2C3D4"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value.toUpperCase())}
                className="flex-1 text-lg h-12 font-mono"
              />
              <Button 
                type="submit" 
                size="lg"
                disabled={!certificateId.trim() || isLoading}
                className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Search className="h-5 w-5 mr-2" />
                    Verify
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Loading State */}
        {isLoading && (
          <Card className="border-0 shadow-lg">
            <CardContent className="py-16">
              <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
                <p className="text-slate-600 font-medium">Verifying certificate...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <Card className="border-red-200 bg-red-50 shadow-lg">
            <CardContent className="py-12">
              <div className="flex flex-col items-center text-center gap-4">
                <div className="p-4 bg-red-100 rounded-full">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-900 mb-2">
                    Verification Error
                  </h3>
                  <p className="text-red-700 mb-4">
                    {error.message || 'Unable to verify certificate. Please try again.'}
                  </p>
                </div>
                <Button variant="outline" onClick={handleReset}>
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Result Display */}
        {result && !isLoading && (
          <div className="space-y-6">
            {(() => {
              const config = getStatusConfig(result.status);
              const StatusIcon = config.icon;
              const daysUntilExpiry = result.certificate?.expiresAt 
                ? getDaysUntilExpiry(result.certificate.expiresAt) 
                : null;

              return (
                <>
                  {/* Status Card */}
                  <Card className={cn("border-2 shadow-lg overflow-hidden", config.borderColor)}>
                    {/* Status Header */}
                    <div className={cn("bg-gradient-to-r text-white p-8 text-center", config.bgGradient)}>
                      <div className="inline-flex items-center justify-center p-4 bg-white/20 rounded-full mb-4">
                        <StatusIcon className="h-12 w-12" />
                      </div>
                      <Badge className="mb-3 bg-white/20 text-white border-0 text-sm px-4 py-1">
                        {config.badgeText}
                      </Badge>
                      <h2 className="text-2xl font-bold">{config.title}</h2>
                      <p className="text-white/90 mt-2">{result.message}</p>
                    </div>

                    {/* Certificate Details */}
                    {result.certificate && (
                      <CardContent className="p-8">
                        <div className="grid gap-6">
                          {/* Certificate ID with Copy */}
                          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <Shield className="h-5 w-5 text-slate-500" />
                              <div>
                                <div className="text-sm text-slate-500">Certificate ID</div>
                                <div className="font-mono font-semibold text-slate-900">
                                  {result.certificate.certificateId}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={copyToClipboard}
                              className="gap-2"
                            >
                              {copied ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-500" />
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

                          {/* Details Grid */}
                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                              <User className="h-5 w-5 text-slate-500 mt-0.5" />
                              <div>
                                <div className="text-sm text-slate-500">Certificate Holder</div>
                                <div className="font-semibold text-slate-900">
                                  {result.certificate.holderName}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                              <Award className="h-5 w-5 text-slate-500 mt-0.5" />
                              <div>
                                <div className="text-sm text-slate-500">Certification</div>
                                <div className="font-semibold text-slate-900">
                                  {result.certificate.courseName}
                                </div>
                                {result.certificate.framework && (
                                  <div className="text-sm text-slate-600">
                                    {result.certificate.framework}
                                  </div>
                                )}
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                              <Calendar className="h-5 w-5 text-slate-500 mt-0.5" />
                              <div>
                                <div className="text-sm text-slate-500">Issue Date</div>
                                <div className="font-semibold text-slate-900">
                                  {formatDate(result.certificate.issuedAt)}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg">
                              <Clock className="h-5 w-5 text-slate-500 mt-0.5" />
                              <div>
                                <div className="text-sm text-slate-500">Expiration Date</div>
                                <div className="font-semibold text-slate-900">
                                  {formatDate(result.certificate.expiresAt)}
                                </div>
                                {daysUntilExpiry !== null && daysUntilExpiry > 0 && (
                                  <div className={cn(
                                    "text-sm",
                                    daysUntilExpiry <= 30 ? "text-amber-600" : "text-slate-600"
                                  )}>
                                    {daysUntilExpiry} days remaining
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Certification Level */}
                          {result.certificate.certificationLevel && (
                            <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg">
                              <GraduationCap className="h-5 w-5 text-slate-500" />
                              <div>
                                <div className="text-sm text-slate-500">Certification Level</div>
                                <div className="font-semibold text-slate-900">
                                  {result.certificate.certificationLevel}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Verification Timestamp */}
                        <div className="mt-6 pt-6 border-t border-slate-200 text-center text-sm text-slate-500">
                          Verified on {new Date(result.verifiedAt).toLocaleString()}
                        </div>
                      </CardContent>
                    )}
                  </Card>

                  {/* Actions */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <Button variant="outline" onClick={handleReset} className="gap-2">
                      <Search className="h-4 w-4" />
                      Verify Another Certificate
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open(`/badge/${result.certificate?.certificateId}`, '_blank')}
                      className="gap-2"
                    >
                      <Code className="h-4 w-4" />
                      Get Embed Badge
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.open('/training', '_blank')}
                      className="gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Learn About Our Certifications
                    </Button>
                  </div>

                  {/* QR Code Section */}
                  {result.certificate && (
                    <div className="mt-6">
                      <CertificateQRCode
                        certificateId={result.certificate.certificateId}
                        holderName={result.certificate.holderName}
                        courseName={result.certificate.courseName}
                        size="md"
                        showDownload={true}
                        showCopy={true}
                      />
                    </div>
                  )}
                </>
              );
            })()}
          </div>
        )}

        {/* Info Section - Show when no search */}
        {!searchId && !isLoading && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5 text-slate-500" />
                For Employers & HR Professionals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600">
                CSOAI certifications demonstrate expertise in AI safety and governance. 
                Use this tool to instantly verify candidate credentials.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    What Gets Verified
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• Certificate authenticity</li>
                    <li>• Holder identity</li>
                    <li>• Issue & expiry dates</li>
                    <li>• Certification framework</li>
                    <li>• Current validity status</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-slate-50 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                    <Award className="h-4 w-4 text-blue-500" />
                    Certificate Types
                  </h4>
                  <ul className="text-sm text-slate-600 space-y-1">
                    <li>• EU AI Act Compliance</li>
                    <li>• NIST AI RMF</li>
                    <li>• ISO 42001</li>
                    <li>• AI Safety Analyst</li>
                    <li>• Watchdog Certification</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <p className="text-sm text-emerald-800">
                  <strong>Note:</strong> All CSOAI certifications are valid for 1-2 years from the issue date. 
                  Certificate holders must recertify to maintain active status and stay current with evolving AI governance frameworks.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Footer */}
      <div className="bg-slate-900 text-white py-8">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-emerald-400" />
            <span className="font-semibold">CSOAI - Council of AIs</span>
          </div>
          <p className="text-slate-400 text-sm">
            AI Safety & Governance Platform | Trusted by organizations worldwide
          </p>
        </div>
      </div>
    </div>
  );
}
