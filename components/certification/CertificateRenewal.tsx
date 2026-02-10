import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Calendar, CheckCircle2, Clock, RefreshCw, XCircle } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Link } from 'wouter';

export default function CertificateRenewal() {
  const utils = trpc.useUtils();
  const { data: certificates, isLoading } = trpc.certificateRenewal.getCertificatesNeedingRenewal.useQuery();

  const startRecertification = trpc.certificateRenewal.startRecertification.useMutation({
    onSuccess: (data) => {
      utils.certificateRenewal.getCertificatesNeedingRenewal.invalidate();
      toast.success(data.message);
    },
    onError: (e) => toast.error(e.message),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Certificate Renewals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => <div key={i} className="h-24 bg-muted rounded" />)}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!certificates?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5" />Certificate Renewals</CardTitle>
          <CardDescription>Manage certificate expirations and renewals</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <CheckCircle2 className="h-12 w-12 mx-auto text-green-500 mb-3" />
            <p className="text-muted-foreground">All your certificates are up to date!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getUrgencyLevel = (days: number | null) => {
    if (days === null) return 0;
    if (days <= 0) return 100;
    if (days <= 7) return 85;
    if (days <= 14) return 60;
    if (days <= 30) return 30;
    return 10;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><RefreshCw className="h-5 w-5" />Certificate Renewals</CardTitle>
        <CardDescription>Manage certificate expirations and renewals</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {certificates.some((c: any) => c.isExpired) && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Expired Certificates</AlertTitle>
            <AlertDescription>Some of your certificates have expired. Renew them to maintain your credentials.</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          {certificates.map((cert: any) => (
            <div key={cert.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${cert.isExpired ? 'bg-red-100 text-red-600' : cert.isExpiringSoon ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                    {cert.isExpired ? <XCircle className="h-5 w-5" /> : cert.isExpiringSoon ? <AlertTriangle className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="font-medium">{cert.courseName}</p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {cert.framework && <Badge variant="outline" className="text-xs">{cert.framework}</Badge>}
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{cert.expiresAt ? format(new Date(cert.expiresAt), 'MMM d, yyyy') : 'No expiry'}</span>
                    </div>
                  </div>
                </div>
                <Badge variant={cert.isExpired ? 'destructive' : cert.isExpiringSoon ? 'outline' : 'secondary'} className={cert.isExpiringSoon && !cert.isExpired ? 'border-amber-500 text-amber-600' : ''}>
                  {cert.isExpired ? 'Expired' : cert.daysUntilExpiry !== null ? `${cert.daysUntilExpiry} days left` : 'Valid'}
                </Badge>
              </div>

              {cert.daysUntilExpiry !== null && (
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Time remaining</span>
                    <span>{cert.isExpired ? 'Expired' : `${cert.daysUntilExpiry} days`}</span>
                  </div>
                  <Progress value={100 - getUrgencyLevel(cert.daysUntilExpiry)} className="h-2" />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => startRecertification.mutate({ certificateId: cert.id })}
                  disabled={startRecertification.isPending}
                  className="flex-1"
                  variant={cert.isExpired ? 'default' : 'outline'}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {cert.isExpired ? 'Renew Certificate' : 'Start Renewal'}
                </Button>
                <Button variant="outline" asChild>
                  <Link href={`/courses/${cert.courseId}`}>View Course</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
