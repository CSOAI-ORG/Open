import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Key, 
  Plus, 
  Copy, 
  Trash2, 
  Eye, 
  EyeOff,
  RefreshCw,
  AlertTriangle,
  Check,
  Clock,
  Shield,
  Activity
} from 'lucide-react';
import { toast } from 'sonner';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed: string | null;
  expiresAt: string | null;
  permissions: string[];
  status: 'active' | 'expired' | 'revoked';
  requestCount: number;
}

// Mock API keys data
const MOCK_API_KEYS: ApiKey[] = [
  {
    id: 'key_1',
    name: 'Production API Key',
    key: 'csoai_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2025-12-01',
    lastUsed: '2026-01-07',
    expiresAt: '2026-12-01',
    permissions: ['compliance:read', 'compliance:write', 'council:submit', 'webhooks:manage'],
    status: 'active',
    requestCount: 15234,
  },
  {
    id: 'key_2',
    name: 'Development API Key',
    key: 'csoai_test_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2025-11-15',
    lastUsed: '2026-01-06',
    expiresAt: null,
    permissions: ['compliance:read', 'council:submit'],
    status: 'active',
    requestCount: 8921,
  },
  {
    id: 'key_3',
    name: 'Legacy Integration',
    key: 'csoai_live_sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    createdAt: '2025-06-01',
    lastUsed: '2025-10-15',
    expiresAt: '2025-12-01',
    permissions: ['compliance:read'],
    status: 'expired',
    requestCount: 45678,
  },
];

const PERMISSION_OPTIONS = [
  { value: 'compliance:read', label: 'Read Compliance Data' },
  { value: 'compliance:write', label: 'Write Compliance Data' },
  { value: 'council:submit', label: 'Submit to Council' },
  { value: 'council:read', label: 'Read Council Data' },
  { value: 'webhooks:manage', label: 'Manage Webhooks' },
  { value: 'certifications:read', label: 'Read Certifications' },
  { value: 'certifications:write', label: 'Issue Certifications' },
];

export function ApiKeyManagement() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_API_KEYS);
  const [showKey, setShowKey] = useState<string | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyExpiry, setNewKeyExpiry] = useState('never');
  const [newKeyPermissions, setNewKeyPermissions] = useState<string[]>(['compliance:read']);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(id);
    toast.success('API key copied to clipboard');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '...' + key.substring(key.length - 8);
  };

  const handleCreateKey = () => {
    const newKey: ApiKey = {
      id: `key_${Date.now()}`,
      name: newKeyName,
      key: `csoai_live_sk_${Math.random().toString(36).substring(2, 38)}`,
      createdAt: new Date().toISOString().split('T')[0],
      lastUsed: null,
      expiresAt: newKeyExpiry === 'never' ? null : new Date(Date.now() + parseInt(newKeyExpiry) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      permissions: newKeyPermissions,
      status: 'active',
      requestCount: 0,
    };
    setApiKeys([newKey, ...apiKeys]);
    setIsCreateDialogOpen(false);
    setNewKeyName('');
    setNewKeyExpiry('never');
    setNewKeyPermissions(['compliance:read']);
    toast.success('API key created successfully');
  };

  const handleRevokeKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { ...key, status: 'revoked' as const } : key
    ));
    toast.success('API key revoked');
  };

  const handleRegenerateKey = (id: string) => {
    setApiKeys(apiKeys.map(key => 
      key.id === id ? { 
        ...key, 
        key: `csoai_live_sk_${Math.random().toString(36).substring(2, 38)}`,
        createdAt: new Date().toISOString().split('T')[0],
      } : key
    ));
    toast.success('API key regenerated');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">Active</Badge>;
      case 'expired':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">Expired</Badge>;
      case 'revoked':
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300">Revoked</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Key className="w-6 h-6" />
            API Key Management
          </h2>
          <p className="text-muted-foreground">Manage your API keys for programmatic access</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              Create New Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Generate a new API key with specific permissions and expiration settings.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input 
                  id="key-name" 
                  placeholder="e.g., Production API Key"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="key-expiry">Expiration</Label>
                <Select value={newKeyExpiry} onValueChange={setNewKeyExpiry}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never expires</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Permissions</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {PERMISSION_OPTIONS.map((perm) => (
                    <div key={perm.value} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <span className="text-sm">{perm.label}</span>
                      <Switch 
                        checked={newKeyPermissions.includes(perm.value)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewKeyPermissions([...newKeyPermissions, perm.value]);
                          } else {
                            setNewKeyPermissions(newKeyPermissions.filter(p => p !== perm.value));
                          }
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleCreateKey} disabled={!newKeyName}>Create Key</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{apiKeys.filter(k => k.status === 'active').length}</p>
                <p className="text-sm text-muted-foreground">Active Keys</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{apiKeys.reduce((sum, k) => sum + k.requestCount, 0).toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">10,000</p>
                <p className="text-sm text-muted-foreground">Daily Limit</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{apiKeys.filter(k => k.expiresAt && new Date(k.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length}</p>
                <p className="text-sm text-muted-foreground">Expiring Soon</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Keys List */}
      <Card>
        <CardHeader>
          <CardTitle>Your API Keys</CardTitle>
          <CardDescription>Manage and monitor your API keys</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <div 
                key={apiKey.id} 
                className={`p-4 rounded-lg border ${apiKey.status !== 'active' ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{apiKey.name}</h3>
                      {getStatusBadge(apiKey.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Created: {apiKey.createdAt} • Last used: {apiKey.lastUsed || 'Never'}
                      {apiKey.expiresAt && ` • Expires: ${apiKey.expiresAt}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {apiKey.status === 'active' && (
                      <>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleRegenerateKey(apiKey.id)}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleRevokeKey(apiKey.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {/* API Key Display */}
                <div className="flex items-center gap-2 p-2 bg-muted rounded-lg mb-3">
                  <code className="flex-1 text-sm font-mono">
                    {showKey === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                  </code>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowKey(showKey === apiKey.id ? null : apiKey.id)}
                  >
                    {showKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => copyToClipboard(apiKey.key, apiKey.id)}
                  >
                    {copiedKey === apiKey.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>

                {/* Permissions */}
                <div className="flex flex-wrap gap-1">
                  {apiKey.permissions.map((perm) => (
                    <Badge key={perm} variant="outline" className="text-xs">
                      {perm}
                    </Badge>
                  ))}
                </div>

                {/* Usage */}
                <div className="mt-3 pt-3 border-t flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {apiKey.requestCount.toLocaleString()} requests
                  </span>
                  {apiKey.status === 'active' && apiKey.expiresAt && new Date(apiKey.expiresAt) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
                    <div className="flex items-center gap-1 text-yellow-600">
                      <AlertTriangle className="w-4 h-4" />
                      <span>Expiring soon</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Notice */}
      <Card className="bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">Security Best Practices</h3>
              <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                <li>• Never expose API keys in client-side code or public repositories</li>
                <li>• Use environment variables to store API keys securely</li>
                <li>• Rotate keys regularly and revoke unused keys</li>
                <li>• Use the minimum required permissions for each key</li>
                <li>• Monitor API usage for unusual activity</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
