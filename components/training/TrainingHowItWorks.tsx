import { ChevronDown, BookOpen, CheckCircle, Users, Zap, Award, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TrainingHowItWorks() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const trainingLevels = [
    {
      level: "Watchdog Training (Free)",
      duration: "4 hours",
      description: "Foundation in AI safety and incident identification",
      modules: [
        "Introduction to AI Safety",
        "Identifying AI Incidents",
        "Severity Assessment Framework",
        "Evidence Collection & Reporting"
      ],
      price: "Free"
    },
    {
      level: "CEASAI Fundamentals",
      duration: "6-8 weeks",
      description: "Entry-level certification covering core frameworks",
      modules: [
        "EU AI Act Fundamentals",
        "NIST AI RMF Basics",
        "TC260 Overview",
        "Compliance Principles",
        "Case Studies & Practice Exams"
      ],
      price: "$99"
    },
    {
      level: "CEASAI Professional",
      duration: "10-12 weeks",
      description: "Advanced certification for experienced analysts",
      modules: [
        "Deep Dive: EU AI Act",
        "NIST AI RMF Implementation",
        "TC260 Advanced Topics",
        "UK AI Bill & Canada AI Act",
        "Complex Case Studies",
        "Advanced Assessment Techniques"
      ],
      price: "$199"
    },
    {
      level: "CEASAI Expert",
      duration: "14-16 weeks",
      description: "Master-level certification for senior analysts",
      modules: [
        "All Previous Modules",
        "Australia AI Governance",
        "ISO 42001 Mastery",
        "SOAI-PDCA Methodology",
        "Byzantine Council Decision Making",
        "Enterprise Compliance Strategy",
        "Capstone Project"
      ],
      price: "$499"
    }
  ];

  const learningMethodology = [
    {
      title: "Self-Paced Learning",
      description: "Study at your own speed, access materials 24/7, take breaks whenever needed",
      icon: Clock
    },
    {
      title: "Interactive Content",
      description: "Videos, quizzes, case studies, and hands-on exercises to reinforce learning",
      icon: Zap
    },
    {
      title: "Real-World Case Studies",
      description: "Learn from actual AI incidents and how they were assessed and resolved",
      icon: Users
    },
    {
      title: "Expert Instructors",
      description: "Taught by AI safety researchers, compliance experts, and industry veterans",
      icon: Award
    },
    {
      title: "Practice Exams",
      description: "Take unlimited practice exams to prepare for the real certification exam",
      icon: CheckCircle
    },
    {
      title: "Community Support",
      description: "Join study groups, ask questions in forums, and learn from peers",
      icon: Users
    }
  ];

  const examStructure = [
    {