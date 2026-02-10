import { useParams } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Award, CheckCircle2, AlertTriangle, XCircle, ExternalLink, Linkedin, Calendar, Shield } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { format } from 'date-fns';

export default function CertificateGallery() {
  const params = useParams<{ slug: string }>();
  const { data, isLoading, error } = trpc.certificateGallery.getPublicGallery.useQuery(
    { slug: params.slug || '' },
    { enabled: !!params.slug }
  );

  if (isLoading) {
    return (
      <div className="container py-12 max-w-5xl">
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-64 w-full" />)}
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container py-12 max-w-5xl">
        <Card className="text-center py-12">
          <CardContent>
            <XCircle className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Gallery Not Found</h2>
            <p className="text-muted-foreground">This certificate gallery doesn't exist or is set to private.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { profile, certificates, stats } = data;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid': return <Badge className="bg-green-500"><CheckCircle2 className="h-3 w-3 mr-1" />Valid</Badge>;
      case 'expiring_soon': return <Badge variant="outline" className="border-amber-500 text-amber-600"><AlertTriangle className="h-3 w-3 mr-1" />Expiring Soon</Badge>;
      case 'expired': return <Badge variant="destructive"><XCircle className="h-3 w-3 mr-1" />Expired</Badge>;
      default: return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container py-12 max-w-5xl">
        <div className="text-center mb-12">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Award className="h-10 w-10 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{profile.displayName}</h1>
          {profile.bio && <p className="text-muted-foreground max-w-2xl mx-auto mb-4">{profile.bio}</p>}
          {profile.linkedInUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={profile.linkedInUrl} target="_blank" rel="noopener noreferrer">
                <Linkedin className="h-4 w-4 mr-2" />LinkedIn<ExternalLink className="h-3 w-3 ml-2" />
              </a>
            </Button>
          )}
          <div className="flex justify-center gap-6 mt-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">{stats.totalCertificates}</div>
              <div className="text-sm text-muted-foreground">Certificates</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500">{stats.validCertificates}</div>
              <div className="text-sm text-muted-foreground">Valid</div>
            </div>
          </div>
        </div>

        {certificates.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Shield className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No certificates to display yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map(cert => (
              <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-2 bg-gradient-to-r from-primary to-primary/50" />
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <Award className="h-8 w-8 text-primary" />
                    {getStatusBadge(cert.status || 'valid')}
                  </div>
                  <CardTitle className="text-lg mt-2">{cert.courseName}</CardTitle>
                  {cert.framework && <Badge variant="outline" className="w-fit">{cert.framework}</Badge>}
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Shield className="h-4 w-4" /><code className="text-xs">{cert.certificateId}</code>
                  </div>
                  {cert.issuedAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" /><span>Issued: {format(new Date(cert.issuedAt), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {cert.expiresAt && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" /><span>Expires: {format(new Date(cert.expiresAt), 'MMM d, yyyy')}</span>
                    </div>
                  )}
                  {cert.examScore && (
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground">Score:</span>
                      <Badge variant="secondary">{cert.examScore}%</Badge>
                    </div>
                  )}
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <a href={`/verify/${cert.certificateId}`}><CheckCircle2 className="h-4 w-4 mr-2" />Verify</a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
