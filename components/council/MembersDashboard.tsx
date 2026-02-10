/**
 * Members Dashboard - Simplified authenticated dashboard
 * Shows the main dashboard overview with sidebar navigation
 * Removed inner tab navigation to avoid confusion with sidebar
 */

import { Suspense } from 'react';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import { OnboardingTour } from '@/components/OnboardingTour';

// Import the Dashboard component
import Dashboard from './Dashboard';

// Loading fallback component
function DashboardLoadingFallback() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}

export default function MembersDashboard() {
  // Onboarding tour steps
  const tourSteps = [
    {
      element: '.px-6',
      popover: {
        title: 'Welcome to CSOAI Dashboard!',
        description: 'Take a quick tour to discover key features and get started with AI safety governance.',
        side: 'bottom' as const,
      },
    },
    {
      element: '[href="/ai-systems"]',
      popover: {
        title: 'Register AI Systems',
        description: 'Start by registering your AI systems. Add new systems, specify their type, and assign risk levels according to regulatory frameworks.',
        side: 'right' as const,
      },
    },
    {
      element: '[href="/compliance"]',
      popover: {
        title: 'Run Compliance Assessments',
        description: 'Evaluate your AI systems against multiple frameworks (EU AI Act, NIST RMF, TC260). Run assessments to identify gaps and track compliance progress.',
        side: 'right' as const,
      },
    },
    {
      element: '[href="/courses"]',
      popover: {
        title: 'Free Training Courses',
        description: 'Access all 7 AI safety training courses completely free. Learn about EU AI Act, NIST RMF, ISO 42001, and regional frameworks.',
        side: 'right' as const,
      },
    },
    {
      element: '[href="/agent-council"]',
      popover: {
        title: '33-Agent Council',
        description: 'View real-time voting sessions where 33 AI agents evaluate Watchdog reports and provide safety recommendations.',
        side: 'right' as const,
      },
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
          <div className="px-8 py-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Members Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your AI safety training, certification, watchdog reports, and regulatory compliance
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="overflow-y-auto flex-1">
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Suspense fallback={<DashboardLoadingFallback />}>
                <Dashboard />
              </Suspense>
            </motion.div>
          </div>
        </div>

        {/* Onboarding Tour */}
        <OnboardingTour
          steps={tourSteps}
          storageKey="members-dashboard-tour"
        />
      </div>
    </DashboardLayout>
  );
}
