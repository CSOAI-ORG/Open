 * Notification Settings Page
 * Configure email/Slack preferences and test notification delivery
 */

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  Mail,
  MessageSquare,
  AlertTriangle,
  Info,
  Award,
  Briefcase,
  FileText,
  Users,
  Send,
  Check,
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

export default function NotificationSettings() {
  const [slackWebhookUrl, setSlackWebhookUrl] = useState('');

  // Fetch current preferences
  const { data: preferences, refetch } = trpc.notifications.getPreferences.useQuery();

  // Update preferences mutation
  const updateMutation = trpc.notifications.updatePreferences.useMutation({
    onSuccess: () => {
      toast.success('Notification preferences updated');
      refetch();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  // Test notification mutation
  const testMutation = trpc.notifications.testNotification.useMutation({
    onSuccess: (data) => {
      toast.success(data.message);
    },