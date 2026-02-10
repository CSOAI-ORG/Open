 * Live Vote Simulation Component
 * Animated demonstration of 33-agent council reaching consensus
 */

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Users,
  Shield,
  Scale,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type VoteType = "approve" | "reject" | "escalate" | "pending";
type AgentType = "guardian" | "arbiter" | "scribe";

interface SimulatedAgent {
  id: number;
  name: string;
  type: AgentType;
  provider: string;
  vote: VoteType;
  confidence: number;
  votedAt: number | null;
}

interface LiveVoteSimulationProps {
  onComplete?: (result: "approved" | "rejected" | "escalated") => void;
  autoStart?: boolean;
  subject?: string;
}

const providers = ["OpenAI", "Anthropic", "Google", "Kimi", "DeepSeek"];

const agentTypeConfig = {
  guardian: { icon: Shield, color: "text-emerald-500", bgColor: "bg-emerald-500" },
  arbiter: { icon: Scale, color: "text-purple-500", bgColor: "bg-purple-500" },