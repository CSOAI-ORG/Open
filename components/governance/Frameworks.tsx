/*
 * CSOAI Frameworks Page - Compliance Frameworks and 4MQ Integration
 */

import { motion } from "framer-motion";
import { useLocation } from "wouter";
import { Globe, Shield, Zap, CheckCircle, ArrowRight, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Frameworks() {
  const [, setLocation] = useLocation();

  const frameworks = [
    {
      name: "EU AI Act",
      region: "European Union",
      icon: "🇪🇺",
      description: "Comprehensive regulatory framework for artificial intelligence in the EU",
      deadline: "August 2, 2026",
      key_requirements: [
        "Risk classification (prohibited, high-risk, limited-risk, minimal-risk)",
        "Transparency and documentation requirements",
        "Human oversight mechanisms",
        "Bias monitoring and mitigation",
        "Data governance and quality standards"
      ],
      articles: 52,
      status: "Active",
      color: "from-blue-500 to-cyan-500"
    },
    {
      name: "NIST AI RMF",
      region: "United States",
      icon: "🇺🇸",
      description: "AI Risk Management Framework for responsible AI development",
      deadline: "Ongoing",
      key_requirements: [
        "Govern: Organizational accountability",
        "Map: AI system capabilities and risks",
        "Measure: Performance metrics and testing",
        "Manage: Risk mitigation strategies",
        "Continuous improvement cycles"
      ],
      articles: 23,
      status: "Active",
      color: "from-red-500 to-orange-500"
    },
    {
      name: "ISO 42001",
      region: "International",
      icon: "🌍",
      description: "International standard for AI management systems",
      deadline: "Ongoing",
      key_requirements: [
        "Information security controls",
        "AI system lifecycle management",
        "Risk assessment and mitigation",
        "Stakeholder engagement",
        "Compliance monitoring"
      ],
      articles: 18,
      status: "Active",
      color: "from-green-500 to-emerald-500"
    },
    {
      name: "TC260 Standards",
      region: "China",
      icon: "🇨🇳",
      description: "Technical standards for AI security and ethics",
      deadline: "Ongoing",
      key_requirements: [
        "Algorithm security assessment",
        "Data protection requirements",
        "Content security controls",
        "Ethical AI principles",
        "Transparency requirements"
      ],
      articles: 15,
      status: "Active",
      color: "from-yellow-500 to-red-500"
    },
  ];

  const fourMQPillars = [
    {
      letter: "M",
      word: "Modeling",
      description: "Advanced AI analysis and risk modeling",
      capabilities: [
        "Multi-modal reasoning",
        "Pattern recognition",
        "Predictive analytics",
        "Threat detection"
      ]
    },
    {
      letter: "Q",
      word: "Quality",
      description: "Comprehensive quality assessment",
      capabilities: [
        "Safety evaluation",
        "Bias detection",
        "Performance metrics",
        "Compliance verification"
      ]
    },
    {
      letter: "M",
      word: "Monitoring",
      description: "Continuous oversight and tracking",
      capabilities: [
        "Real-time monitoring",
        "Anomaly detection",
        "Performance tracking",
        "Incident alerting"
      ]
    },
    {
      letter: "Q",
      word: "Quantification",
      description: "Measurable outcomes and metrics",
      capabilities: [
        "Risk scoring",
        "Impact assessment",
        "ROI calculation",
        "Trend analysis"
      ]
    }
  ];

  const complianceProcess = [
    {
      step: 1,
      title: "Assessment",
      description: "Comprehensive evaluation of AI system against applicable frameworks"
    },
    {
      step: 2,
      title: "Analysis",
      description: "33-Agent Council reviews findings using 4MQ Protocol"
    },
    {
      step: 3,
      title: "Reporting",
      description: "Detailed compliance report with recommendations"
    },
    {
      step: 4,
      title: "Monitoring",
      description: "Continuous oversight and periodic re-evaluation"
    },
    {
      step: 5,
      title: "Improvement",
      description: "Iterative enhancement based on monitoring insights"
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
          <h1 className="text-5xl font-bold mb-4">Compliance Frameworks</h1>
          <p className="text-xl text-slate-300 max-w-2xl">
            CSOAI integrates the world's leading AI safety and compliance frameworks into a unified, globally accessible standard.
          </p>
        </motion.div>
      </div>

      {/* Framework Overview */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-blue-400 mb-2">4</div>
              <div className="text-sm text-slate-300">Major Frameworks</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-center"
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">108</div>
              <div className="text-sm text-slate-300">Total Articles</div>
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
              <div className="text-3xl font-bold text-purple-400 mb-2">100%</div>
              <div className="text-sm text-slate-300">Coverage</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Frameworks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Global Compliance Standards</h2>
          <p className="text-xl text-slate-300">Unified assessment across all major regulatory frameworks</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {frameworks.map((framework, index) => (
            <motion.div
              key={framework.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8 hover:border-blue-400 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-4xl mb-2">{framework.icon}</div>
                  <h3 className="text-2xl font-bold">{framework.name}</h3>
                  <p className="text-slate-400 text-sm">{framework.region}</p>
                </div>
                <div className="text-right">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30">
                    {framework.status}
                  </span>
                </div>
              </div>

              <p className="text-slate-300 mb-4">{framework.description}</p>

              <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-slate-400">
                  <strong>Deadline:</strong> {framework.deadline}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  <strong>Articles:</strong> {framework.articles}
                </p>
              </div>

              <h4 className="font-semibold mb-3 text-sm">Key Requirements</h4>
              <ul className="space-y-2">
                {framework.key_requirements.map((req) => (
                  <li key={req} className="flex items-start gap-2 text-sm text-slate-300">
                    <CheckCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4MQ Protocol */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">4MQ Protocol</h2>
            <p className="text-xl text-slate-300">Cognitive Operating System for AI Safety Analysis</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {fourMQPillars.map((pillar, index) => (
              <motion.div
                key={pillar.word}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-slate-700/50 border border-slate-600 rounded-xl p-8"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="text-4xl font-bold text-blue-400">{pillar.letter}</div>
                  <div>
                    <h3 className="text-xl font-semibold">{pillar.word}</h3>
                    <p className="text-slate-400 text-sm">{pillar.description}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {pillar.capabilities.map((cap) => (
                    <li key={cap} className="flex items-start gap-2 text-sm text-slate-300">
                      <Zap className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                      {cap}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-8 text-center"
          >
            <Code2 className="h-8 w-8 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Byzantine Consensus</h3>
            <p className="text-slate-300 mb-4">
              The 4MQ Protocol uses Byzantine fault-tolerant consensus across 33 AI agents from 12 different providers to ensure unbiased, reliable safety assessments.
            </p>
            <p className="text-sm text-slate-400">
              No single AI vendor controls the outcome. Democracy for AI safety decisions.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Compliance Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold mb-4">Compliance Process</h2>
          <p className="text-xl text-slate-300">How CSOAI evaluates AI systems</p>
        </motion.div>

        <div className="space-y-6">
          {complianceProcess.map((item, index) => (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-8 ${index % 2 === 1 ? "md:flex-row-reverse" : ""}`}
            >
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center font-bold text-xl">
                {item.step}
              </div>
              <div className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl p-6 flex items-center">
                <div>
                  <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                  <p className="text-slate-300">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Integration Benefits */}
      <section className="bg-slate-800/50 border-y border-slate-700 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">Why Unified Frameworks Matter</h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8"
            >
              <Globe className="h-8 w-8 text-blue-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Global Consistency</h3>
              <p className="text-slate-300">
                One assessment covers compliance across all major regulatory frameworks simultaneously.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8"
            >
              <Shield className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Risk Mitigation</h3>
              <p className="text-slate-300">
                Comprehensive analysis reduces compliance gaps and regulatory risk for organizations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-slate-700/50 border border-slate-600 rounded-xl p-8"
            >
              <Zap className="h-8 w-8 text-yellow-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2">Efficiency</h3>
              <p className="text-slate-300">
                Single assessment process saves time and resources compared to multiple framework evaluations.
              </p>
            </motion.div>
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
          <h2 className="text-4xl font-bold mb-4">Get Your AI System Assessed</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Ensure compliance across all major frameworks with a single, comprehensive CSOAI assessment.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-slate-100"
              onClick={() => window.location.href = "mailto:assessment@csoai.org"}
            >
              Request Assessment
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-blue-700"
              onClick={() => setLocation("/about")}
            >
              Learn More
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
