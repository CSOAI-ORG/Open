import { motion } from 'framer-motion';
import {
  Users,
  Building2,
  Shield,
  CheckCircle2,
  TrendingUp,
  Zap,
  Globe,
  Award,
} from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: 1,
      title: "AI Companies Submit Systems",
      description: "Organizations submit their AI models and systems for independent evaluation",
      icon: Building2,
      details: [
        "Upload AI model documentation",
        "Provide system architecture details",
        "Define use cases and scope"
      ]
    },
    {
      number: 2,
      title: "Byzantine Council Reviews",
      description: "33 specialized AI agents analyze systems using the 4MQ Protocol framework",
      icon: Users,
      details: [
        "Measurement: Quantify safety metrics",
        "Monitoring: Track performance",
        "Mitigation: Identify risks",
        "Management: Governance review"
      ]
    },
    {
      number: 3,
      title: "Transparent Assessment",
      description: "Results published publicly with detailed findings and recommendations",
      icon: Shield,
      details: [
        "Public risk assessment",
        "Compliance status",
        "Improvement roadmap",
        "Certification eligibility"
      ]
    },
    {
      number: 4,
      title: "Certification & Compliance",
      description: "Organizations receive CSOAI certification upon meeting global standards",
      icon: Award,
      details: [
        "CSOAI Safety Badge",
        "Regulatory recognition",
        "Government compliance",
        "Market advantage"
      ]
    },
    {
      number: 5,
      title: "Continuous Monitoring",
      description: "Watchdog system monitors AI systems in production for safety incidents",
      icon: TrendingUp,
      details: [
        "Real-time incident detection",
        "Public reporting",
        "Community feedback",
        "Rapid response protocols"
      ]
    },
    {
      number: 6,
      title: "Global Governance",
      description: "Standards evolve through multi-stakeholder consensus across 21+ countries",
      icon: Globe,
      details: [
        "Government integration",
        "Industry participation",
        "Academic research",
        "Civil society input"
      ]
    }
  ];

  const stakeholders = [
    {
      title: "For AI Companies",
      icon: Building2,
      benefits: [
        "Demonstrate safety commitment",
        "Reduce regulatory risk",
        "Build customer trust",
        "Competitive advantage"
      ]
    },
    {
      title: "For Governments",
      icon: Shield,
      benefits: [
        "Standardized compliance",
        "Risk assessment",
        "Regulatory framework",
        "Global coordination"
      ]
    },
    {
      title: "For Professionals",
      icon: Award,
      benefits: [
        "AI safety careers",
        "Professional certification",
        "Global recognition",
        "Job opportunities"
      ]
    },
    {
      title: "For the Public",
      icon: Users,
      benefits: [
        "Safer AI systems",
        "Transparency",
        "Accountability",
        "Incident reporting"
      ]
    }
  ];

  return (
    <div className="space-y-0">
      {/* How It Works - Step by Step */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">How CSOAI Works</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              A comprehensive, transparent process for evaluating and certifying AI systems globally
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="space-y-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  {/* Connector Line */}
                  {idx < steps.length - 1 && (
                    <div className="absolute left-8 top-24 w-0.5 h-32 bg-gradient-to-b from-emerald-500/50 to-transparent" />
                  )}

                  <div className="flex gap-6">
                    {/* Step Number Circle */}
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                        {step.number}
                      </div>
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pt-2">
                      <div className="bg-gradient-to-br from-slate-50 to-white border border-emerald-200 rounded-lg p-6 hover:border-emerald-500 transition-colors shadow-sm">
                        <div className="flex items-start gap-3 mb-3">
                          <Icon className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                            <p className="text-slate-600 mt-1">{step.description}</p>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4 pt-4 border-t border-emerald-100">
                          {step.details.map((detail, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-slate-700">{detail}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stakeholder Value Propositions */}
      <section className="py-20 px-4 bg-gradient-to-b from-emerald-50 to-white border-y border-emerald-200">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Value for Every Stakeholder</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              CSOAI creates a comprehensive ecosystem that benefits all participants
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stakeholders.map((stakeholder, idx) => {
              const Icon = stakeholder.icon;
              return (
                <motion.div
                  key={stakeholder.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white border border-emerald-200 rounded-lg p-6 hover:border-emerald-500 transition-colors shadow-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">{stakeholder.title}</h3>
                  </div>

                  <ul className="space-y-3">
                    {stakeholder.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Zap className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { label: "Founding Members", value: "5" },
              { label: "Byzantine Agents", value: "33" },
              { label: "NATO-Friendly Countries", value: "21+" },
              { label: "Charter Articles", value: "52" }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-emerald-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
