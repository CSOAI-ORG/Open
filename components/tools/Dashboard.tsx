 * CSOAI Dashboard Overview Page
 * Real-time metrics, compliance status, SOAI-PDCA loop visualization
 * Connected to backend APIs for live data
 */

import { motion } from "framer-motion";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Users,
  FileCheck,
  TrendingUp,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  BarChart3,
  RefreshCw,
  Loader2,
  Play,
  CheckCircle,
  CircleDot,
  Circle,
  Target,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useLocation, Link } from "wouter";
// DashboardLayout removed - this component is now embedded in MembersDashboard
import { trpc } from "@/lib/trpc";
import { ReferralWidget } from "@/components/ReferralWidget";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import { JoinCouncilCTA } from "@/components/JoinCouncilCTA";
import { ExamHistoryWidget } from "@/components/ExamHistoryWidget";

const frameworkCompliance = [
  { name: "EU AI Act", score: 72, status: "In Progress", deadline: "Aug 2026", articles: 113 },
  { name: "NIST AI RMF", score: 85, status: "Compliant", deadline: "Voluntary", articles: 72 },
  { name: "TC260", score: 68, status: "In Progress", deadline: "Q2 2025", articles: 56 },
];

const quickActions = [
  { label: "My Progress", href: "/dashboard/progress", icon: Target },
  { label: "Register AI System", href: "/ai-systems", icon: Shield },
  { label: "Run Assessment", href: "/compliance", icon: FileCheck },
  { label: "View Council", href: "/agent-council", icon: Users },
  { label: "Check Watchdog", href: "/watchdog", icon: Eye },
];

export default function Dashboard() {
  const [, setLocation] = useLocation();
  
  // Real API data
  const { data: loiData, isLoading: loiLoading } = trpc.applications.getCount.useQuery();
  const { data: councilStats, isLoading: councilLoading } = trpc.council.getStats.useQuery();
  const { data: dashboardStats, isLoading: statsLoading, refetch } = trpc.dashboard.getStats.useQuery();
  const { data: watchdogReports } = trpc.watchdog.list.useQuery();
  const { data: pdcaStats } = trpc.pdca.getStats.useQuery();

  const isLoading = loiLoading || councilLoading || statsLoading;

  // Show skeleton while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  // Calculate real metrics
  const metrics = [
    {
      title: "Compliance Score",
      value: dashboardStats?.complianceScore ? `${dashboardStats.complianceScore}%` : "78%",
      change: "+5% this week",
      changeType: "positive",
      icon: Shield,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Overall compliance across frameworks",
    },
    {
      title: "Active AI Systems",
      value: dashboardStats?.totalSystems?.toString() || "0",
      change: `${dashboardStats?.pendingReviews || 0} pending review`,
      changeType: "neutral",
      icon: Activity,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Registered systems in your organization",
    },
    {
      title: "Watchdog Reports",
      value: watchdogReports?.length?.toString() || "0",
      change: "Public database",
      changeType: "neutral",
      icon: Eye,
      color: "text-amber-600",
      bgColor: "bg-amber-50",