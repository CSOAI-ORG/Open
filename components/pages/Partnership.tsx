/*
 * CSOAI Partnership Page - Strategic Alliance Details
 */

import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { useState } from "react";
import { Shield, Globe, Users, Zap, CheckCircle, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Partnership() {
  const [, setLocation] = useLocation();
  const [showCSOAIModal, setShowCSOAIModal] = useState(false);
  const [showTerramnovaModal, setShowTerramnovaModal] = useState(false);
  const [showCSGAModal, setShowCSGAModal] = useState(false);

  const partners = [
    {
      name: "Terranova Aerospace and Defense Group",
      role: "The Armor",
      description: "Defense-Grade Infrastructure & Security",
      details: [
        "NATO-certified security infrastructure",
        "$161M institutional scale",
        "Operations across 21 countries",
        "Defense-grade encryption and compliance",
        "Secure government integration",
        "Military-grade redundancy and failover"
      ],
      benefits: [
        "Enterprise-grade security",
        "Government-ready infrastructure",
        "Global operational reach",
        "Compliance with defense standards"
      ],
      color: "from-red-500 to-orange-500"
    },
    {
      name: "Cyber Security Global Alliance (CSGA)",
      role: "The Global Reach",
      description: "International Coordination & Operations",
      details: [
        "Operations across 20+ countries and 6 continents",
        "Regional compliance expertise",
        "Government liaison networks",
        "International standards coordination",
        "Multi-language support",
        "Cultural and regulatory adaptation"
      ],
      benefits: [
        "Global market penetration",
        "Regional compliance expertise",
        "Government relationships",
        "International standards alignment"
      ],
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "4MQ Protocol",
      role: "The Brain",
      description: "Cognitive Operating System",
      details: [
        "Advanced AI analysis framework",
        "Multi-modal reasoning capabilities",
        "Financial identity architecture",
        "Byzantine consensus mechanisms",
        "Real-time threat detection",
        "Predictive risk modeling"
      ],
      benefits: [
        "Cutting-edge AI analysis",
        "Unbiased safety assessments",
        "Advanced threat detection",
        "Continuous improvement"
      ],
      color: "from-purple-500 to-pink-500"
    }
  ];

  const allianceStructure = [
    {
      title: "CSOAI (Council Core)",
      description: "Governance, standards, and policy",
      responsibilities: [
        "Set global AI safety standards",
        "Manage 33-Agent Council",
        "Oversee certification programs",
        "Publish Watchdog reports"
      ]
    },
    {
      title: "Terranova (Infrastructure)",
      description: "Security and operations",
      responsibilities: [
        "Provide defense-grade infrastructure",
        "Ensure NATO compliance",
        "Manage secure data centers",
        "Handle government integrations"
      ]
    },
    {
      title: "CSGA (Distribution)",
      description: "Global reach and compliance",
      responsibilities: [
        "Coordinate international operations",
        "Manage regional compliance",
        "Build government relationships",
        "Support localization efforts"
      ]
    },
    {
      title: "4MQ (Intelligence)",
      description: "AI analysis and assessment",
      responsibilities: [
        "Power safety assessments",
        "Analyze AI systems",
        "Generate risk reports",
        "Support analyst training"
      ]
    }
  ];

  const timeline = [
    {
      date: "January 2026",
      title: "Strategic Alliance Announced",
      description: "CSOAI, Terranova, and CSGA announce historic partnership to establish global AI safety standard"
    },
    {
      date: "Q1 2026",
      title: "Infrastructure Integration",
      description: "Terranova's defense-grade infrastructure integrated with CSOAI governance framework"
    },
    {
      date: "Q2 2026",
      title: "Global Operations Launch",
      description: "CSGA begins coordinating operations across 21 NATO-friendly countries"
    },
    {
      date: "Q3 2026",
      title: "4MQ Protocol Deployment",
      description: "4MQ cognitive operating system fully integrated into all safety assessments"
    },
    {
      date: "Q4 2026",
      title: "First Government Integrations",
      description: "First regulatory bodies integrate CSOAI standards into national AI governance"
    },
    {
      date: "2027+",
      title: "Global Expansion",
      description: "Expansion to 50+ countries with localized compliance frameworks"
    }
  ];

  const capabilities = [
    {
      icon: Shield,
      title: "Defense-Grade Security",
      description: "NATO-certified infrastructure with military-grade encryption and compliance"
    },
    {
      icon: Globe,
      title: "Global Operations",
      description: "Coordinated operations across 21 countries with regional compliance expertise"
    },
    {
      icon: Users,
      title: "Expert Governance",
      description: "24 Founding Council members from academia, industry, and government"
    },
    {
      icon: Zap,
      title: "Advanced AI Analysis",
      description: "4MQ Protocol powers unbiased, multi-vendor safety assessments"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            onClick={() => setLocation("/")}
            className="text-blue-400 hover:text-blue-300 mb-6 flex items-center gap-2 text-sm"
          >
            ← Back to Home
          </button>
          <h1 className="text-5xl font-bold mb-4">Strategic Alliance</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            CSOAI + Terranova + CSGA: Building the global standard for AI safety with defense-grade infrastructure and international reach.
          </p>
        </motion.div>
      </div>

      {/* Partner Logos Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Our Alliance Partners</h2>
          <p className="text-xl text-slate-300">Three organizations united for global AI safety</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 items-center justify-items-center">
          {/* CSOAI Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 w-full flex flex-col items-center justify-center hover:border-blue-400 transition cursor-pointer"
            onClick={() => setShowCSOAIModal(true)}
          >
            <img
              src="/logo-csoai.png"
              alt="CSOAI Logo"
              className="h-32 w-auto mb-4 object-contain"
            />
            <h3 className="text-lg font-semibold text-center">Council for the Safety of Artificial Intelligence</h3>
            <p className="text-slate-400 text-sm text-center mt-2">Governance & Standards</p>
          </motion.div>

          {/* Terranova Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 w-full flex flex-col items-center justify-center hover:border-red-400 transition cursor-pointer"
            onClick={() => setShowTerramnovaModal(true)}
          >
            <img
              src="/logo-terranova.png"
              alt="Terranova Logo"
              className="h-32 w-auto mb-4 object-contain"
            />
            <h3 className="text-lg font-semibold text-center">Terranova Aerospace and Defense Group</h3>
            <p className="text-slate-400 text-sm text-center mt-2">Defense-Grade Infrastructure</p>
          </motion.div>

          {/* CSGA Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 w-full flex flex-col items-center justify-center hover:border-green-400 transition cursor-pointer"
            onClick={() => setShowCSGAModal(true)}
          >
            <img
              src="/logo-csga.png"
              alt="CSGA Logo"
              className="h-32 w-auto mb-4 object-contain"
            />
            <h3 className="text-lg font-semibold text-center">Cyber Security Global Alliance</h3>
            <p className="text-slate-400 text-sm text-center mt-2">Global Operations & Reach</p>
          </motion.div>
        </div>
      </section>

      {/* Alliance Overview */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">$161M</div>
              <div className="text-sm text-slate-300">Institutional Scale</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">21</div>
              <div className="text-sm text-slate-300">NATO-Friendly Countries</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-green-400 mb-2">6</div>
              <div className="text-sm text-slate-300">Continents</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-purple-400 mb-2">24</div>
              <div className="text-sm text-slate-300">Founding Council Members</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partner Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="space-y-12">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-400 transition"
            >
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${partner.color} bg-clip-text text-transparent mb-4`}>
                    {partner.role}
                  </div>
                  <h2 className="text-3xl font-bold mb-2">{partner.name}</h2>
                  <p className="text-slate-300 text-lg mb-6">{partner.description}</p>

                  <h3 className="font-semibold mb-3 text-sm">Key Capabilities</h3>
                  <ul className="space-y-2">
                    {partner.details.map((detail) => (
                      <li key={detail} className="flex items-start gap-2 text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Strategic Benefits</h3>
                  <div className="space-y-3">
                    {partner.benefits.map((benefit) => (
                      <div
                        key={benefit}
                        className="bg-slate-800/50 border border-slate-600 rounded-lg p-4"
                      >
                        <p className="text-sm text-slate-300">{benefit}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Alliance Structure */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Alliance Structure</h2>
            <p className="text-xl text-slate-300">How CSOAI, Terranova, CSGA, and 4MQ work together</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {allianceStructure.map((org, index) => (
              <motion.div
                key={org.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700/50 border border-slate-600 rounded-xl p-6"
              >
                <h3 className="text-lg font-semibold mb-1">{org.title}</h3>
                <p className="text-slate-400 text-sm mb-4">{org.description}</p>
                <ul className="space-y-2">
                  {org.responsibilities.map((resp) => (
                    <li key={resp} className="flex items-start gap-2 text-sm text-slate-300">
                      <span className="text-blue-400 mt-1">→</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Implementation Timeline</h2>
          <p className="text-xl text-slate-300">From announcement to global impact</p>
        </motion.div>

        <div className="space-y-6">
          {timeline.map((event, index) => (
            <motion.div
              key={event.date}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-shrink-0 w-32 text-right md:text-left">
                <div className="font-bold text-blue-400">{event.date}</div>
              </div>
              <div className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                <p className="text-slate-300">{event.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Capabilities */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Combined Capabilities</h2>
            <p className="text-xl text-slate-300">What the alliance delivers</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {capabilities.map((cap, index) => {
              const Icon = cap.icon;
              return (
                <motion.div
                  key={cap.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/50 border border-slate-600 rounded-xl p-6"
                >
                  <Icon className="h-8 w-8 text-blue-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">{cap.title}</h3>
                  <p className="text-slate-300">{cap.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-12 text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Join the Alliance?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're a government, enterprise, researcher, or analyst, there's a role for you in building the global standard for AI safety.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100"
              onClick={() => setLocation("/about")}
            >
              Learn More About CSOAI
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
              onClick={() => window.location.href = "mailto:partnerships@csoai.org"}
            >
              Contact Partnership Team
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Logo Carousel Section */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Supporting Organizations</h2>
            <p className="text-xl text-slate-300">Partners and organizations committed to AI safety</p>
          </motion.div>

          <div className="overflow-hidden">
            <motion.div
              animate={{ x: [0, -1000, 0] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="flex gap-8 whitespace-nowrap"
            >
              {[
                { name: "IEEE", logo: "🏛️" },
                { name: "OWASP", logo: "🔒" },
                { name: "Fortune 100", logo: "💼" },
                { name: "Academic Partners", logo: "🎓" },
                { name: "Government Bodies", logo: "🏛️" },
                { name: "Research Institutes", logo: "🔬" },
                { name: "Industry Leaders", logo: "⚙️" },
                { name: "NGOs", logo: "🌍" },
              ].map((org, idx) => (
                <div
                  key={idx}
                  className="bg-slate-700/50 border border-slate-600 rounded-lg p-6 min-w-max flex flex-col items-center justify-center"
                >
                  <div className="text-4xl mb-2">{org.logo}</div>
                  <p className="text-sm font-semibold text-slate-300">{org.name}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* CSOAI Modal */}
      {showCSOAIModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-600 rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <img src="/logo-csoai.png" alt="CSOAI" className="h-16 w-auto mb-4" />
                  <h2 className="text-3xl font-bold">Council for the Safety of Artificial Intelligence</h2>
                </div>
                <button
                  onClick={() => setShowCSOAIModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Role: Governance & Standards</h3>
                  <p>CSOAI serves as the independent governance body, setting global AI safety standards and managing the 33-Agent Council.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Key Responsibilities</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Set and enforce global AI safety standards</li>
                    <li>Manage the 33-Agent Council voting system</li>
                    <li>Oversee certification programs</li>
                    <li>Publish Watchdog incident reports</li>
                    <li>Maintain transparency and independence</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Contact</h3>
                  <p>partnerships@csoai.org</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Terranova Modal */}
      {showTerramnovaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-600 rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <img src="/logo-terranova.png" alt="Terranova" className="h-16 w-auto mb-4" />
                  <h2 className="text-3xl font-bold">Terranova Aerospace and Defense Group</h2>
                </div>
                <button
                  onClick={() => setShowTerramnovaModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Role: The Armor - Defense-Grade Infrastructure</h3>
                  <p>Terranova provides enterprise-grade security infrastructure and NATO compliance for CSOAI operations.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Capabilities</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>NATO-certified security infrastructure</li>
                    <li>$161M institutional scale</li>
                    <li>Operations across 21 countries</li>
                    <li>Defense-grade encryption and compliance</li>
                    <li>Secure government integration</li>
                    <li>Military-grade redundancy and failover</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Contact</h3>
                  <p>infrastructure@terranova.aero</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* CSGA Modal */}
      {showCSGAModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 border border-slate-600 rounded-xl max-w-2xl w-full max-h-96 overflow-y-auto"
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <img src="/logo-csga.png" alt="CSGA" className="h-16 w-auto mb-4" />
                  <h2 className="text-3xl font-bold">Cyber Security Global Alliance</h2>
                </div>
                <button
                  onClick={() => setShowCSGAModal(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 text-slate-300">
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Role: The Global Reach - International Operations</h3>
                  <p>CSGA coordinates international operations and ensures compliance across diverse regulatory frameworks.</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Capabilities</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Operations across 20+ countries and 6 continents</li>
                    <li>Regional compliance expertise</li>
                    <li>Government liaison networks</li>
                    <li>International standards coordination</li>
                    <li>Multi-language support</li>
                    <li>Cultural and regulatory adaptation</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-green-400 mb-2">Contact</h3>
                  <p>operations@csga.global</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
