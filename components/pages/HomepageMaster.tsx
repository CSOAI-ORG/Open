import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import HowItWorksSection from '@/components/HowItWorksSection';
import CASACountdownBanner from '@/components/CASACountdownBanner';
import {
  ChevronDown,
  Shield,
  Zap,
  Eye,
  TrendingUp,
  CheckCircle2,
  Globe,
  Lock,
  Heart,
  ArrowRight,
  FileText,
  AlertTriangle,
  Target,
  Award,
  Sparkles,
} from 'lucide-react';

export default function HomepageMaster() {
  const [, setLocation] = useLocation();
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  useEffect(() => {
    document.title = 'CSOAI: Terranova Alliance for AI Safety & Governance';
  }, []);

  // 11 Critical Solutions
  const solutions = [
    {
      id: 1,
      title: "Vendor-Neutral AI Governance",
      description: "Remove vendor bias from AI compliance decisions through independent Byzantine consensus",
      icon: Shield,
      color: "from-blue-500 to-blue-600"
    },
    {
      id: 2,
      title: "Transparent Risk Assessment",
      description: "Publicly accessible AI system evaluation using standardized 4MQ Protocol frameworks",
      icon: Eye,
      color: "from-green-500 to-green-600"
    },
    {
      id: 3,
      title: "Global Compliance Harmonization",
      description: "Align with EU AI Act, NIST RMF, ISO 42001, and 21 NATO-friendly countries' standards",
      icon: Globe,
      color: "from-purple-500 to-purple-600"
    },
    {
      id: 4,
      title: "Enforceable Standards",
      description: "52-article charter creating binding AI safety requirements across jurisdictions",
      icon: FileText,
      color: "from-orange-500 to-orange-600"
    },
    {
      id: 5,
      title: "Algorithmic Harm Accountability",
      description: "Support for communities affected by algorithmic bias and AI system failures",
      icon: Heart,
      color: "from-red-500 to-red-600"
    },
    {
      id: 6,
      title: "Enterprise Compliance Automation",
      description: "Streamlined AI governance for Fortune 500 companies and government agencies",
      icon: Zap,
      color: "from-yellow-500 to-yellow-600"
    },
    {
      id: 7,
      title: "Real-Time Incident Monitoring",
      description: "Watchdog system for detecting and reporting AI safety incidents globally",
      icon: AlertTriangle,
      color: "from-pink-500 to-pink-600"
    },
    {
      id: 8,
      title: "AI Safety Certification",
      description: "Professional AI analyst credentials recognized by governments and enterprises",
      icon: Award,
      color: "from-indigo-500 to-indigo-600"
    },
    {
      id: 9,
      title: "Defense-Grade Infrastructure",
      description: "Terranova's military-standard security protecting critical AI governance data",
      icon: Lock,
      color: "from-teal-500 to-teal-600"
    },
    {
      id: 10,
      title: "Scalable Testing Methodologies",
      description: "Novel frameworks beyond traditional red-teaming for comprehensive AI evaluation",
      icon: Target,
      color: "from-cyan-500 to-cyan-600"
    },
    {
      id: 11,
      title: "Institutional Credibility",
      description: "Institutional backing from Terranova, CSGA, and 24+ founding council members",
      icon: TrendingUp,
      color: "from-lime-500 to-lime-600"
    }
  ];

  const faqs = [
    {
      q: "How does CSOAI differ from other AI governance platforms?",
      a: "CSOAI is the only vendor-neutral, 100% transparent platform backed by Terranova Aerospace, CSGA, and 24+ founding council members. Our 52-article charter and 4MQ Protocol create enforceable standards across 21 NATO-friendly countries."
    },
    {
      q: "Is CSOAI compliant with EU AI Act requirements?",
      a: "Yes. CSOAI's framework directly aligns with EU AI Act requirements, NIST RMF, and ISO 42001. We're designed to be the gold standard for government and enterprise compliance."
    },
    {
      q: "How can enterprises get started?",
      a: "Submit a Letter of Intent through our portal. Our team will guide you through AI system registration, compliance assessment, and certification within your jurisdiction."
    },
    {
      q: "What is the 4MQ Protocol?",
      a: "The 4MQ Protocol is our proprietary framework for AI safety evaluation: Measurement, Monitoring, Mitigation, and Maintenance. It provides standardized assessment across all AI systems."
    },
    {
      q: "Can governments integrate CSOAI into their regulatory framework?",
      a: "Absolutely. CSOAI is designed for seamless government integration. Contact our government relations team for institutional partnerships and licensing."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="w-full bg-white">
      {/* HERO SECTION */}
      <section className="min-h-screen bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center px-4 py-20">
        <div className="max-w-6xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <CASACountdownBanner />
            
            <p className="text-sm font-semibold text-emerald-700 mb-4 tracking-wide uppercase"></p>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Establishing Global Standards for
              <br />
              <span className="text-emerald-600">AI, Ensuring a Safe Future with Abudance & Prosperity</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-700 font-semibold mt-6 mb-8 max-w-3xl mx-auto">
              Terranova Aerospace & Defense Group + CSOAI + CSGA
            </p>
            
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-12">
              A historic strategic alliance focused on establishing enforceable, transparent, and globally accessible standards for AI safety, ethics, and governance across 21 NATO-friendly countries.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button
                onClick={() => setLocation('/charter-download')}
                size="lg"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-6 rounded-lg flex items-center justify-center gap-2"
              >
                Download Charter & Solutions <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setLocation('/council')}
                variant="outline"
                size="lg"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold text-lg px-8 py-6 rounded-lg"
              >
                Meet Our Council
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-emerald-600">52</div>
                <p className="text-sm text-gray-600 mt-2">Charter Articles</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-emerald-600">11</div>
                <p className="text-sm text-gray-600 mt-2">Critical Solutions</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-emerald-600">21</div>
                <p className="text-sm text-gray-600 mt-2">NATO Countries</p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-3xl font-bold text-emerald-600">24+</div>
                <p className="text-sm text-gray-600 mt-2">Council Members</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 11 SOLUTIONS SECTION */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              11 Critical Solutions CSOAI Delivers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive framework addressing the most pressing challenges in AI governance
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {solutions.map((solution, idx) => {
              const Icon = solution.icon;
              return (
                <motion.div 
                  key={solution.id} 
                  variants={itemVariants}
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  className="group h-full"
                >
                  <Card className="h-full p-8 hover:shadow-2xl transition-all duration-300 border-2 border-gray-200 hover:border-emerald-400 bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-blue-50 relative overflow-hidden">
                    {/* Animated background gradient */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br from-emerald-400 to-blue-400"></div>
                    
                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon with animated background */}
                      <motion.div
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${solution.color} mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                      >
                        <Icon className="w-7 h-7 text-white" />
                      </motion.div>
                      
                      {/* Solution number badge */}
                      <div className="absolute top-6 right-6 w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center text-sm font-bold text-gray-700 group-hover:bg-gradient-to-r group-hover:from-emerald-400 group-hover:to-blue-400 group-hover:text-white transition-all">
                        {idx + 1}
                      </div>
                      
                      {/* Title */}
                      <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-700 transition-colors">{solution.title}</h3>
                      
                      {/* Description */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-4 group-hover:text-gray-700 transition-colors">{solution.description}</p>
                      
                      {/* Hover CTA */}
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 text-emerald-600 font-semibold text-sm opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Learn more <ArrowRight className="w-4 h-4" />
                      </motion.div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Button
              onClick={() => setLocation('/solutions')}
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-6 rounded-lg flex items-center justify-center gap-2 mx-auto"
            >
              Explore Full Solutions Framework <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* STRATEGIC ALLIANCE SECTION */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Our Strategic Alliance
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Institutional backing from defense, governance, and AI safety leaders
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-8 md:p-12 border-2 border-emerald-200"
          >
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-600 mb-2">Terranova</div>
                <p className="text-gray-700 font-semibold mb-2">Aerospace & Defense</p>
                <p className="text-gray-600 text-sm">Defense-grade infrastructure and institutional credibility</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">CSOAI</div>
                <p className="text-gray-700 font-semibold mb-2">Council Leadership</p>
                <p className="text-gray-600 text-sm">Vision, governance frameworks, and AI safety expertise</p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600 mb-2">CSGA</div>
                <p className="text-gray-700 font-semibold mb-2">Global Reach</p>
                <p className="text-gray-600 text-sm">21 NATO-friendly countries and regulatory alignment</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12"
          >
            <Button
              onClick={() => setLocation('/partnership')}
              size="lg"
              className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-lg px-8 py-6 rounded-lg flex items-center justify-center gap-2 mx-auto"
            >
              Learn About the Alliance <ArrowRight className="w-5 h-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* CHARTER SECTION */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              52-Article Partnership Charter
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Establishing enforceable, transparent standards for AI safety across jurisdictions
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-xl p-8 border-2 border-emerald-200"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">What's Inside</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Governance framework for AI systems</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Compliance requirements across frameworks</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Accountability mechanisms</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Institutional governance structure</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700">Byzantine consensus protocols</span>
                </li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white rounded-xl p-8"
            >
              <h3 className="text-2xl font-bold mb-4">Get Instant Access</h3>
              <p className="mb-6 text-emerald-100">Download the complete 52-article charter and 11 critical solutions framework</p>
              <Button
                onClick={() => setLocation('/charter-download')}
                className="w-full bg-white text-emerald-600 hover:bg-gray-100 font-bold text-lg py-6 rounded-lg"
              >
                Download Now (Free)
              </Button>
              <p className="text-xs text-emerald-200 mt-4 text-center">No credit card required • Instant access</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Join the AI Safety Movement?
            </h2>
            <p className="text-xl text-emerald-100 mb-8 max-w-2xl mx-auto">
              Whether you're a government agency, enterprise, or researcher, CSOAI provides the framework you need for AI governance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation('/charter-download')}
                className="bg-white text-emerald-600 hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-lg flex items-center justify-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                onClick={() => setLocation('/contact')}
                variant="outline"
                className="border-2 border-white text-white hover:bg-emerald-600 font-bold text-lg px-8 py-6 rounded-lg"
              >
                Contact Our Team
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorksSection />

      {/* FAQ SECTION - REMOVED */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-all border-2 border-gray-200"
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                >
                  <div className="p-6 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-lg">{faq.q}</h3>
                    <ChevronDown
                      className={`w-5 h-5 text-emerald-600 transition-transform ${
                        expandedFAQ === idx ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                  {expandedFAQ === idx && (
                    <div className="px-6 pb-6 text-gray-700 border-t border-gray-200 pt-4">
                      {faq.a}
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
