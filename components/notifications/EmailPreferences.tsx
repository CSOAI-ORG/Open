import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Mail, 
  Bell, 
  Settings, 
  Newspaper, 
  Trophy, 
  Flame, 
  BarChart3,
  Users,
  Sparkles,
  Clock,
  Award
} from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { useToast } from '@/hooks/use-toast';
import DashboardLayout from '@/components/DashboardLayout';

export default function EmailPreferences() {
  const { toast } = useToast();
  const [preferences, setPreferences] = useState({
    optIn: false,
    marketingEmails: false,
    productUpdates: false,
    weeklyDigest: false,
    achievementEmails: true,
    streakReminders: true,
    teamUpdates: true,
    progressReports: true,
    expirationReminders: true,
  });

  const { data: userPrefs, isLoading } = trpc.emailOnboarding.getUserPreferences.useQuery();
  const updateMutation = trpc.emailOnboarding.updateEmailPreferences.useMutation();

  // Also fetch from emailPreferences router for achievement settings
  const { data: achievementPrefs } = trpc.emailPreferences.getPreferences?.useQuery?.() || { data: undefined };
  const updateAchievementMutation = trpc.emailPreferences.updatePreferences?.useMutation?.() || { mutateAsync: async () => {} };

  useEffect(() => {
    if (userPrefs) {
      setPreferences(prev => ({
        ...prev,
        optIn: Boolean(userPrefs.marketingEmails),
        marketingEmails: Boolean(userPrefs.marketingEmails),
        productUpdates: Boolean(userPrefs.systemAnnouncements),
        weeklyDigest: Boolean(userPrefs.weeklyProgress),
      }));
    }
  }, [userPrefs]);

  useEffect(() => {
    if (achievementPrefs) {
      setPreferences(prev => ({
        ...prev,
        achievementEmails: achievementPrefs.achievementsEnabled !== 0,
        streakReminders: achievementPrefs.streakRemindersEnabled !== 0,
        progressReports: achievementPrefs.progressReportsEnabled !== 0,
        expirationReminders: achievementPrefs.expirationRemindersEnabled !== 0,
      }));
    }
  }, [achievementPrefs]);

  const handlePreferenceChange = async (key: string, value: boolean): Promise<void> => {
    setPreferences((prev) => ({
      ...prev,
      [key]: value,
    }));

    // Update achievement-related preferences immediately
    if (['achievementEmails', 'streakReminders', 'progressReports', 'expirationReminders'].includes(key)) {
      try {
        await updateAchievementMutation.mutateAsync({
          achievementsEnabled: key === 'achievementEmails' ? value : preferences.achievementEmails,
          streakRemindersEnabled: key === 'streakReminders' ? value : preferences.streakReminders,
          progressReportsEnabled: key === 'progressReports' ? value : preferences.progressReports,
          expirationRemindersEnabled: key === 'expirationReminders' ? value : preferences.expirationReminders,
        });
        toast({
          title: "Preference updated",
          description: "Your email preference has been saved.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update preference. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = async (): Promise<void> => {
    try {
      await updateMutation.mutateAsync({
        optIn: preferences.optIn ? 1 : 0,
        marketingEmails: preferences.marketingEmails ? 1 : 0,
        productUpdates: preferences.productUpdates ? 1 : 0,
        weeklyDigest: preferences.weeklyDigest ? 1 : 0,
      } as any);
      toast({
        title: "Preferences saved",
        description: "Your email preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Email Preferences</h1>
          <p className="text-muted-foreground mt-2">
            Manage your email communication settings and notifications
          </p>
        </div>

        <div className="grid gap-6">
          {/* Achievement & Gamification Emails */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                </div>
                <div>
                  <CardTitle>Achievement Notifications</CardTitle>
                  <CardDescription>
                    Get notified when you earn badges or reach milestones
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Badge Earned Emails</span>
                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive congratulatory emails with shareable badge cards when you earn new badges
                  </p>
                </div>
                <Switch
                  checked={preferences.achievementEmails}
                  onCheckedChange={(checked) => handlePreferenceChange('achievementEmails', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Flame className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Streak Milestone Emails</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get notified when you hit streak milestones (7 days, 30 days, etc.)
                  </p>
                </div>
                <Switch
                  checked={preferences.streakReminders}
                  onCheckedChange={(checked) => handlePreferenceChange('streakReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Certificate Expiration Reminders */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10">
                  <Award className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <CardTitle>Certificate Reminders</CardTitle>
                  <CardDescription>
                    Get notified before your certifications expire
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Expiration Reminder Emails</span>
                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive reminders at 30, 14, and 7 days before your certificates expire
                  </p>
                </div>
                <Switch
                  checked={preferences.expirationReminders}
                  onCheckedChange={(checked) => handlePreferenceChange('expirationReminders', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Progress & Digest Emails */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BarChart3 className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <CardTitle>Progress Reports</CardTitle>
                  <CardDescription>
                    Receive summaries of your learning progress
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Weekly Digest</span>
                    <Badge variant="secondary" className="text-xs">Recommended</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Get a personalized weekly summary with progress, rank changes, and badges earned
                  </p>
                </div>
                <Switch
                  checked={preferences.progressReports}
                  onCheckedChange={(checked) => handlePreferenceChange('progressReports', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Team Updates</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive updates about your team's leaderboard and achievements
                  </p>
                </div>
                <Switch
                  checked={preferences.teamUpdates}
                  onCheckedChange={(checked) => handlePreferenceChange('teamUpdates', checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* General Email Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <Mail className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <CardTitle>General Communications</CardTitle>
                  <CardDescription>
                    Manage marketing and product update emails
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">All Email Communications</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Master switch for all email communications from CSOAI
                  </p>
                </div>
                <Switch
                  checked={Boolean(preferences.optIn)}
                  onCheckedChange={(checked) => handlePreferenceChange('optIn', checked)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Bell className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Marketing Emails</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Receive promotional content and special offers
                  </p>
                </div>
                <Switch
                  checked={Boolean(preferences.marketingEmails)}
                  onCheckedChange={(checked) => handlePreferenceChange('marketingEmails', checked)}
                  disabled={!Boolean(preferences.optIn)}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">Product Updates</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Stay informed about new features and improvements
                  </p>
                </div>
                <Switch
                  checked={Boolean(preferences.productUpdates)}
                  onCheckedChange={(checked) => handlePreferenceChange('productUpdates', checked)}
                  disabled={!Boolean(preferences.optIn)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              onClick={handleSave}
              disabled={updateMutation.isPending}
              size="lg"
            >
              {updateMutation.isPending ? 'Saving...' : 'Save All Preferences'}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
