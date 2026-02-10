import { useState } from "react";
import { ChevronDown, Shield, Eye, AlertTriangle, Users, CheckCircle, Clock, Award, FileText, TrendingUp, Zap, Target, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function WatchdogHowItWorks() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const watchdogProcess = [
    {
      step: 1,
      title: "Identify AI Incidents",
      description: "Spot potential AI safety issues in the wild—from biased algorithms to harmful outputs. Use our structured framework to assess severity and impact.",
      icon: Eye
    },
    {
      step: 2,
      title: "Report & Document",
      description: "Submit detailed incident reports through our secure platform. Include evidence, context, and your initial assessment using standardized templates.",
      icon: FileText
    },
    {
      step: 3,
      title: "Byzantine Council Review",
      description: "Your report is reviewed by our 33-agent Byzantine Council—a distributed AI governance system that ensures fair, unbiased assessment.",
      icon: Users
    },
    {
      step: 4,
      title: "Consensus & Action",
      description: "The council reaches consensus on severity, assigns risk levels, and triggers appropriate responses—from warnings to compliance enforcement.",
      icon: CheckCircle
    },
    {
      step: 5,
      title: "Track & Remediate",
      description: "Monitor the incident through resolution. Track remediation progress, verify fixes, and ensure AI systems return to safe operation.",
      icon: TrendingUp
    }
  ];

  const incidentCategories = [
    {
      category: "Bias & Discrimination",
      description: "AI systems showing unfair treatment based on race, gender, age, or other protected characteristics",
      examples: ["Hiring algorithm rejecting qualified candidates", "Loan approval disparities", "Facial recognition misidentification"],
      severity: "High"
    },
    {
      category: "Privacy Violations",
      description: "AI systems collecting, using, or exposing personal data inappropriately",
      examples: ["Unauthorized data collection", "Data leakage in model outputs", "Surveillance overreach"],
      severity: "Critical"
    },
    {
      category: "Safety Hazards",
      description: "AI systems causing or risking physical harm to humans",
      examples: ["Autonomous vehicle failures", "Medical AI misdiagnosis", "Industrial robot malfunctions"],
      severity: "Critical"
    },
    {
      category: "Misinformation",
      description: "AI systems generating or spreading false information",
      examples: ["Deepfake content", "AI-generated fake news", "Hallucinated facts in outputs"],
      severity: "High"
    },
    {
      category: "Security Vulnerabilities",
      description: "AI systems with exploitable weaknesses or attack surfaces",
      examples: ["Prompt injection attacks", "Model extraction", "Adversarial examples"],
      severity: "High"
    },
    {
      category: "Compliance Failures",
      description: "AI systems violating regulatory requirements",
      examples: ["EU AI Act violations", "GDPR breaches", "Sector-specific regulation failures"],
      severity: "Medium-High"
    }
  ];

  const analystLevels = [
    {
      level: "Watchdog Observer",
      requirements: "Complete free 4-hour training",
      capabilities: ["Submit incident reports", "View public dashboards", "Participate in community discussions"],
      earnings: "Volunteer (badges & recognition)"
    },
    {
      level: "Certified Analyst",
      requirements: "CEASAI Fundamentals certification",
      capabilities: ["Full incident reporting", "Severity assessment", "Framework compliance checks", "Earn per-report bounties"],
      earnings: "$25-50 per verified report"
    },
    {
      level: "Senior Analyst",
      requirements: "CEASAI Professional certification + 50 verified reports",
      capabilities: ["Complex case analysis", "Council voting participation", "Mentor junior analysts", "Priority assignments"],
      earnings: "$45-100/hour consulting"
    },
    {
      level: "Expert Analyst",
      requirements: "CEASAI Expert certification + 200 verified reports",
      capabilities: ["Lead investigations", "Enterprise assessments", "Policy recommendations", "Training development"],
      earnings: "$100-150/hour + enterprise contracts"
    }
  ];

  const faqs = [
    {
      question: "What qualifications do I need to become a Watchdog Analyst?",
      answer: "Anyone can start as a Watchdog Observer with our free 4-hour training. To become a Certified Analyst and earn money, you'll need to complete the CEASAI Fundamentals certification ($99). No prior technical background is required—we teach you everything you need to know."
    },
    {
      question: "How do I report an AI incident?",
      answer: "Use our incident reporting form at /watchdog/incident. Provide details about the AI system, the incident observed, evidence (screenshots, links, etc.), and your initial severity assessment. Our Byzantine Council will review and validate your report."
    },
    {
      question: "What happens after I submit a report?",
      answer: "Your report enters our Byzantine Council review process. 33 AI agents analyze the incident, cross-reference with known issues, and reach consensus on severity. Human analysts then verify the assessment. You'll receive updates on your report's status and any actions taken."
    },
    {
      question: "How do I get paid for my work?",
      answer: "Certified Analysts earn bounties for verified incident reports ($25-50 each). Senior and Expert Analysts can take on hourly consulting work ($45-150/hour) for enterprise clients. Payments are processed monthly via direct deposit or PayPal."
    },
    {
      question: "What's the Byzantine Council?",
      answer: "The Byzantine Council is our distributed AI governance system. 33 specialized AI agents vote on incident severity and appropriate responses. The system uses Byzantine Fault Tolerance to ensure accurate decisions even if some agents are compromised or malfunctioning."
    },
    {
      question: "Can I report incidents anonymously?",
      answer: "Yes, you can submit anonymous reports. However, anonymous reports may receive lower priority and you won't be eligible for bounty payments. We recommend creating an account for full benefits while maintaining strict confidentiality of your identity."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 mb-6">
            <Eye className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-medium text-amber-500">Watchdog Program</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            How the <span className="text-amber-500">Watchdog</span> Program Works
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Join thousands of AI safety analysts protecting humanity from harmful AI. 
            Learn how to identify, report, and help remediate AI incidents through our 
            structured Watchdog program.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/watchdog/incident">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Report an Incident
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline">
                <Award className="w-5 h-5 mr-2" />
                Start Free Training
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Watchdog Process</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From incident identification to resolution—here's how our distributed 
              AI governance system keeps AI safe.
            </p>
          </div>
          <div className="relative">
            {/* Connection line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-amber-500 via-orange-500 to-red-500 hidden md:block" />
            
            <div className="space-y-8">
              {watchdogProcess.map((item, index) => (
                <div key={item.step} className={`flex items-center gap-8 ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                    <Card className="p-6 inline-block">
                      <div className={`flex items-center gap-4 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <item.icon className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                          <h3 className="font-semibold text-lg">{item.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">{item.description}</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-lg z-10 hidden md:flex">
                    {item.step}
                  </div>
                  <div className="flex-1 hidden md:block" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Incident Categories */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What We Monitor</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watchdog Analysts identify and report incidents across these critical categories.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {incidentCategories.map((cat) => (
              <Card key={cat.category} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-semibold text-lg">{cat.category}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cat.severity === 'Critical' ? 'bg-red-500/10 text-red-500' :
                    cat.severity === 'High' ? 'bg-orange-500/10 text-orange-500' :
                    'bg-yellow-500/10 text-yellow-500'
                  }`}>
                    {cat.severity}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">{cat.description}</p>
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">Examples:</p>
                  <ul className="space-y-1">
                    {cat.examples.map((ex, i) => (
                      <li key={i} className="text-sm flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        {ex}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Analyst Levels */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Analyst Career Path</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Progress from volunteer observer to expert analyst with increasing 
              responsibilities and earning potential.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {analystLevels.map((level, index) => (
              <Card key={level.level} className={`p-6 relative ${index === analystLevels.length - 1 ? 'border-amber-500' : ''}`}>
                {index === analystLevels.length - 1 && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-xs font-medium rounded-full">
                    Top Tier
                  </div>
                )}
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-3 ${
                    index === 0 ? 'bg-slate-500/10' :
                    index === 1 ? 'bg-blue-500/10' :
                    index === 2 ? 'bg-purple-500/10' :
                    'bg-amber-500/10'
                  }`}>
                    <Award className={`w-8 h-8 ${
                      index === 0 ? 'text-slate-500' :
                      index === 1 ? 'text-blue-500' :
                      index === 2 ? 'text-purple-500' :
                      'text-amber-500'
                    }`} />
                  </div>
                  <h3 className="font-semibold">{level.level}</h3>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Requirements</p>
                    <p>{level.requirements}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Capabilities</p>
                    <ul className="space-y-1">
                      {level.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {cap}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-muted-foreground text-xs mb-1">Earnings</p>
                    <p className="font-semibold text-amber-500">{level.earnings}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-br from-amber-500/10 via-background to-orange-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">12,000+</div>
              <p className="text-muted-foreground">Incidents Reported</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">3,500+</div>
              <p className="text-muted-foreground">Active Analysts</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">98.7%</div>
              <p className="text-muted-foreground">Verification Accuracy</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-500 mb-2">124</div>
              <p className="text-muted-foreground">Countries Covered</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">
              Everything you need to know about the Watchdog program.
            </p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full p-6 text-left flex items-center justify-between"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 transition-transform ${expandedFaq === index ? 'rotate-180' : ''}`} />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6 text-muted-foreground">
                    {faq.answer}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-amber-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Protect Humanity from Harmful AI?
          </h2>
          <p className="text-amber-100 mb-8 max-w-2xl mx-auto">
            Join thousands of Watchdog Analysts making AI safer for everyone. 
            Start with free training and work your way up to expert analyst.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/courses">
              <Button size="lg" variant="secondary" className="bg-white text-amber-600 hover:bg-amber-50">
                Start Free Training
              </Button>
            </Link>
            <Link href="/watchdog/incident">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Report an Incident
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
