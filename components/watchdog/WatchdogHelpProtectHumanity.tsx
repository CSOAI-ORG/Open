import { ChevronDown, Shield, Users, TrendingUp, BookOpen, AlertCircle, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function WatchdogHelpProtectHumanity() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const whyMattersSections = [
    {
      title: "AI is Everywhere",
      description: "AI systems make decisions affecting healthcare, finance, hiring, criminal justice, and more. Without human oversight, these systems can cause real harm.",
      icon: AlertCircle
    },
    {
      title: "Humans Must Decide",
      description: "AI can't judge ethics, fairness, or safety. Only humans can. Watchdog Analysts provide the critical human judgment that keeps AI safe.",
      icon: Users
    },
    {
      title: "Global Impact",
      description: "Your work as a Watchdog Analyst protects people worldwide. Every incident you identify, every assessment you make, prevents potential harm.",
      icon: Shield
    }
  ];

  const getInvolvedSteps = [
    {
      step: "1. Take Free Training",
      description: "Complete our 4-hour Watchdog training module covering incident identification, severity assessment, and reporting",
      time: "4 hours",
      cost: "Free"
    },
    {
      step: "2. Learn the Framework",
      description: "Understand how CSOAI's Byzantine Council works and how your assessments contribute to global AI safety",
      time: "2 hours",
      cost: "Free"
    },
    {
      step: "3. Get Certified",
      description: "Pass the CEASAI certification exam to become an official Watchdog Analyst",
      time: "6-8 weeks",
      cost: "$99-499"
    },
    {
      step: "4. Start Reporting",
      description: "Use the incident reporting system to flag AI safety concerns and contribute to public oversight",
      time: "Ongoing",
      cost: "Free"
    },
    {
      step: "5. Earn Money",
      description: "Get paid $45-150/hour for AI safety monitoring and compliance assessment work",
      time: "Flexible",
      cost: "Earn $1,800-6,000+/month"
    }
  ];

  const trainingCourses = [
    {
      title: "Free Watchdog Training",
      description: "Foundation in AI safety and incident identification",
      modules: [
        "Introduction to AI Safety",
        "Identifying AI Incidents",
        "Severity Assessment Framework",
        "Evidence Collection & Reporting"
      ],
      duration: "4 hours",
      price: "Free"
    },
    {
      title: "CEASAI Fundamentals",
      description: "Professional certification covering core compliance frameworks",
      modules: [
        "EU AI Act Fundamentals",
        "NIST AI RMF Basics",
        "TC260 Overview",
        "Compliance Principles",
        "Case Studies & Practice Exams"
      ],
      duration: "6-8 weeks",
      price: "$99"
    },
    {
      title: "CEASAI Professional",
      description: "Advanced certification for experienced analysts",
      modules: [
        "Deep Dive: All Frameworks",
        "Complex Case Studies",
        "Advanced Assessment Techniques",
        "Enterprise Compliance",
        "Capstone Project"
      ],
      duration: "10-12 weeks",
      price: "$199"
    }
  ];
