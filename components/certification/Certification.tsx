 * CSOAI Certification Test Page
 * Take the certification test to become a Watchdog Analyst
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Award,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Download,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

// Sample test questions (will be loaded from database)
const sampleQuestions = [
  {
    id: 1,
    question: "What is the primary purpose of human-in-the-loop (HITL) in AI systems?",
    options: [
      "To replace AI completely",
      "To provide human oversight and intervention when AI confidence is low",
      "To slow down AI processing",
      "To increase AI costs"
    ],
    correctAnswer: 1,
  },
  {
    id: 2,
    question: "Under the EU AI Act, which of the following is classified as a 'high-risk' AI system?",
    options: [
      "A spam filter for emails",
      "A recommendation system for movies",
      "An AI system used for recruitment and hiring decisions",
      "A chatbot for customer service"
    ],
    correctAnswer: 2,
  },
  {
    id: 3,
    question: "What is 'algorithmic bias'?",
    options: [
      "When an algorithm runs too slowly",
      "When an AI system produces systematically unfair outcomes for certain groups",
      "When an algorithm uses too much memory",
      "When an AI system is too accurate"
    ],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "In the CSOAI 33-Agent Council, what percentage of votes is needed for consensus?",
    options: [
      "50% (simple majority)",
      "67% (two-thirds majority)",
      "75% (three-quarters majority)",
      "100% (unanimous)"
    ],
    correctAnswer: 1,
  },
  {
    id: 5,
    question: "When reviewing a Watchdog report, what should you do if you're uncertain about the decision?",
    options: [
      "Guess and submit quickly",
      "Always approve to be safe",
      "Always reject to be cautious",
      "Escalate to a senior reviewer or request more information"
    ],
    correctAnswer: 3,
  },
];

type TestState = "intro" | "testing" | "results";

export default function Certification() {
  const [, setLocation] = useLocation();
  const [testState, setTestState] = useState<TestState>("intro");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState(90 * 60); // 90 minutes
  const [score, setScore] = useState<number | null>(null);
  const [passed, setPassed] = useState(false);

  const { data: certificates } = trpc.certification.getMyCertificates.useQuery();
  const hasCertificate = certificates && certificates.length > 0;