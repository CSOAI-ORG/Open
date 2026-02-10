import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Award, Copy, ExternalLink, Eye, EyeOff, Settings, Share2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import DashboardLayout from '@/components/DashboardLayout';

export default function MyCertificateGallery() {
  const utils = trpc.useUtils();
  const { data: settings, isLoading: settingsLoading } = trpc.certificateGallery.getSettings.useQuery();
  const { data: certificates, isLoading: certsLoading } = trpc.certificateGallery.getMyCertificates.useQuery();
  
  const updateSettings = trpc.certificateGallery.updateSettings.useMutation({
    onSuccess: () => {
      utils.certificateGallery.getSettings.invalidate();
      toast.success('Settings updated');
    },
    onError: (e) => toast.error(e.message),
  });

  const generateSlug = trpc.certificateGallery.generateSlug.useMutation({
    onSuccess: (data) => {
      updateSettings.mutate({ publicSlug: data.slug });
    },
  });

  const toggleVisibility = trpc.certificateGallery.toggleCertificateVisibility.useMutation({
    onSuccess: () => {
      utils.certificateGallery.getMyCertificates.invalidate();
      toast.success('Certificate visibility updated');
    },
  });

  const [editingSlug, setEditingSlug] = useState(false);
  const [slugInput, setSlugInput] = useState('');

  const galleryUrl = settings?.publicSlug 
    ? `${window.location.origin}/gallery/${settings.publicSlug}`
    : null;

  const copyUrl = () => {
    if (galleryUrl) {
      navigator.clipboard.writeText(galleryUrl);
      toast.success('Gallery URL copied to clipboard');
    }
  };

  if (settingsLoading || certsLoading) {
    return (
      <DashboardLayout>
        <div className="container py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="container py-8 max-w-4xl">
        <div className="flex items-center gap-3 mb-8">
          <Award className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">My Certificate Gallery</h1>
            <p className="text-muted-foreground">Manage your public certificate showcase</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Share2 className="h-5 w-5" />Gallery URL</CardTitle>
              <CardDescription>Share your certificates with a custom public URL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Switch
                  checked={settings?.isPublic}
                  onCheckedChange={(checked) => updateSettings.mutate({ isPublic: checked })}
                />
                <Label>Make gallery public</Label>
              </div>

              {settings?.isPublic && (
                <div className="space-y-2">
                  <Label>Your Gallery URL</Label>
                  {settings?.publicSlug ? (
                    <div className="flex gap-2">
                      <Input value={galleryUrl || ''} readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="icon" onClick={copyUrl}><Copy className="h-4 w-4" /></Button>
                      <Button variant="outline" size="icon" asChild>
                        <a href={galleryUrl!} target="_blank" rel="noopener noreferrer"><ExternalLink className="h-4 w-4" /></a>
                      </Button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      {editingSlug ? (
                        <>
                          <Input
                            value={slugInput}
                            onChange={(e) => setSlugInput(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                            placeholder="my-certificates"
                          />
                          <Button onClick={() => { updateSettings.mutate({ publicSlug: slugInput }); setEditingSlug(false); }}>Save</Button>
                          <Button variant="outline" onClick={() => setEditingSlug(false)}>Cancel</Button>
                        </>
                      ) : (
                        <>
                          <Button onClick={() => generateSlug.mutate()}>Generate URL</Button>
                          <Button variant="outline" onClick={() => setEditingSlug(true)}>Custom URL</Button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />Display Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Display Name</Label>
                  <Input
                    defaultValue={settings?.displayName || ''}
                    onBlur={(e) => updateSettings.mutate({ displayName: e.target.value })}
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    defaultValue={settings?.linkedInUrl || ''}
                    onBlur={(e) => updateSettings.mutate({ linkedInUrl: e.target.value || null })}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bio</Label>
                <Textarea
                  defaultValue={settings?.bio || ''}
                  onBlur={(e) => updateSettings.mutate({ bio: e.target.value || null })}
                  placeholder="A brief description about yourself..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select
                  value={settings?.theme || 'default'}
                  onValueChange={(value: any) => updateSettings.mutate({ theme: value })}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings?.showCompletionDates}
                    onCheckedChange={(checked) => updateSettings.mutate({ showCompletionDates: checked })}
                  />
                  <Label>Show completion dates</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings?.showExpirationDates}
                    onCheckedChange={(checked) => updateSettings.mutate({ showExpirationDates: checked })}
                  />
                  <Label>Show expiration dates</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={settings?.showExamScores}
                    onCheckedChange={(checked) => updateSettings.mutate({ showExamScores: checked })}
                  />
                  <Label>Show exam scores</Label>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Certificates</CardTitle>
              <CardDescription>Choose which certificates to display in your gallery</CardDescription>
            </CardHeader>
            <CardContent>
              {!certificates?.length ? (
                <p className="text-muted-foreground text-center py-8">No certificates yet. Complete courses to earn certificates.</p>
              ) : (
                <div className="space-y-3">
                  {certificates.map(cert => (
                    <div key={cert.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Award className="h-6 w-6 text-primary" />
                        <div>
                          <p className="font-medium">{cert.courseName}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            {cert.framework && <Badge variant="outline" className="text-xs">{cert.framework}</Badge>}
                            <Badge variant={cert.status === 'valid' ? 'default' : cert.status === 'expired' ? 'destructive' : 'secondary'}>
                              {cert.status}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button
                        variant={cert.showInGallery ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleVisibility.mutate({ certificateId: cert.id, showInGallery: !cert.showInGallery })}
                      >
                        {cert.showInGallery ? <><Eye className="h-4 w-4 mr-1" />Visible</> : <><EyeOff className="h-4 w-4 mr-1" />Hidden</>}
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
