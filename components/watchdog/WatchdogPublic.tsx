 * Public Watchdog Hub
 * Global AI problem reporting and transparency dashboard
 * Anyone can report AI issues - no login required
 * All reports are public by default
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Globe,
  TrendingUp,
  Filter,
  Search,
  Send,
  Eye,
  MapPin,
  Calendar,
  Tag,
  Shield,
  Users,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Breadcrumb } from "@/components/Breadcrumb";

// Mock data for reports
const mockReports = [
  {
    id: 1,
    title: "ChatGPT hallucinating medical advice",
    description: "AI provided incorrect medical diagnosis that could harm patients",
    severity: "critical",
    aiSystem: "ChatGPT-4",
    reporter: "Anonymous",
    region: "United States",
    date: "2025-12-26",
    views: 1243,
    status: "verified",
    category: "Healthcare",
  },
  {
    id: 2,
    title: "Facial recognition bias in hiring",
    description: "AI system showing racial bias in resume screening",
    severity: "high",
    aiSystem: "HireBot Pro",
    reporter: "Anonymous",
    region: "Europe",
    date: "2025-12-25",
    views: 856,
    status: "investigating",
    category: "Employment",
  },
  {
    id: 3,
    title: "Autonomous vehicle near-miss",
    description: "Self-driving car failed to detect pedestrian in low light",
    severity: "critical",
    aiSystem: "Tesla FSD v12",
    reporter: "Anonymous",
    region: "United States",
    date: "2025-12-24",
    views: 2156,
    status: "verified",
    category: "Transportation",
  },
  {
    id: 4,
    title: "Financial AI recommending risky investments",
    description: "Robo-advisor algorithm recommending unsuitable investments for retirees",
    severity: "high",
    aiSystem: "WealthBot",
    reporter: "Anonymous",
    region: "Asia",
    date: "2025-12-23",
    views: 654,
    status: "verified",
    category: "Finance",
  },
  {
    id: 5,
    title: "Content moderation AI censoring legitimate speech",
    description: "Social media AI incorrectly flagging political discourse as hate speech",
    severity: "medium",
    aiSystem: "ContentGuard",
    reporter: "Anonymous",
    region: "Global",
    date: "2025-12-22",
    views: 1089,
    status: "investigating",
    category: "Content Moderation",
  },
];

export default function WatchdogPublic() {
  const [reports, setReports] = useState(mockReports);
  const [filteredReports, setFilteredReports] = useState(mockReports);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showReportForm, setShowReportForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    aiSystem: "",
    severity: "medium",
    category: "Other",
    region: "",
  });

  // Filter and search reports
  useEffect(() => {
    let filtered = reports;

    // Search
    if (searchQuery) {
      filtered = filtered.filter(
        (report) =>
          report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          report.aiSystem.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Severity filter
    if (severityFilter !== "all") {
      filtered = filtered.filter((report) => report.severity === severityFilter);
    }

    // Category filter
    if (categoryFilter !== "all") {
      filtered = filtered.filter((report) => report.category === categoryFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((report) => report.status === statusFilter);
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "views") {
      filtered.sort((a, b) => b.views - a.views);
    } else if (sortBy === "critical") {
      const severityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      filtered.sort(
        (a, b) => severityOrder[a.severity as keyof typeof severityOrder] - severityOrder[b.severity as keyof typeof severityOrder]
      );
    }

    setFilteredReports(filtered);
  }, [searchQuery, severityFilter, categoryFilter, statusFilter, sortBy, reports]);

  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.aiSystem) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newReport = {
      id: reports.length + 1,
      ...formData,
      reporter: "Anonymous",
      date: new Date().toISOString().split("T")[0],
      views: 0,
      status: "pending",
    };

    setReports([newReport, ...reports]);
    setFormData({
      title: "",
      description: "",
      aiSystem: "",
      severity: "medium",
      category: "Other",
      region: "",
    });
    setShowReportForm(false);
    toast.success("Report submitted! Thank you for helping keep AI safe.");