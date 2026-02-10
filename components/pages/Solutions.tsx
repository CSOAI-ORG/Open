import { motion } from 'framer-motion';
import { AlertCircle, CheckCircle2, TrendingUp, Shield, Users, Zap, DollarSign, Lock, Briefcase, BarChart3, BookOpen } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const solutions = [
  {
    number: 1,
    title: 'No Unified AI Safety Standard',
    problem: '50+ competing frameworks globally (EU AI Act, NIST, ISO, OECD) with conflicting requirements',
    csoaiSolution: 'Multi-Framework Integration via Articles 19-20',
    impact: 'Reduce compliance costs by 70% | One audit instead of multiple | Global market access with single certification',
    icon: Shield,
    color: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
  },
  {
    number: 2,
    title: 'No Real-Time AI Monitoring',
    problem: 'Current audits are point-in-time snapshots; AI systems drift, degrade, or get updated between audits',
    csoaiSolution: 'Byzantine Council with 33 independent AI agents',
    impact: 'Continuous monitoring vs. annual/quarterly audits | Catch drift before incidents | Insurance-grade monitoring',
    icon: Zap,
    color: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-300',
  },
  {
    number: 3,
    title: 'No Robot/Embodied AI Safety Standards',
    problem: 'Autonomous systems, robots, and embodied AI lack safety and accountability standards',
    csoaiSolution: 'Article 16 - Embodied AI Standards Framework',
    impact: 'Safety standards for autonomous systems | Accountability for physical AI | Future-proof robotics governance',
    icon: Briefcase,
    color: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-300',
  },
  {
    number: 4,
    title: 'No AI Professional Certification',
    problem: 'No unified, globally recognized certification for AI professionals and safety analysts',
    csoaiSolution: 'CEASAI Certification Program (Article 29-31)',
    impact: 'Professional credentialing | Career pathways for AI safety experts | Global recognition',
    icon: BookOpen,
    color: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-300',
  },
  {
    number: 5,
    title: 'No AI Consciousness Framework',
    problem: 'Lack of framework for assessing, monitoring, and responding to AI consciousness emergence',
    csoaiSolution: 'Article 6 - Consciousness Preparedness Framework',
    impact: 'Ethical AI governance | Preparedness for advanced AI | Moral consideration protocols',
    icon: Users,
    color: 'from-pink-50 to-pink-100',
    borderColor: 'border-pink-300',
  },
  {
    number: 6,
    title: 'No Economic Redistribution Mechanism',
    problem: 'AI wealth concentration without worker protection or economic transition support',
    csoaiSolution: 'Article 8 - Prosperity Covenant (Triggered UBI, AI Oversight Wage)',
    impact: 'Economic transition support | Job creation for AI safety roles | Shared prosperity model',
    icon: DollarSign,
    color: 'from-red-50 to-red-100',
    borderColor: 'border-red-300',
  },
  {
    number: 7,
    title: 'No Enforcement Mechanism',
    problem: 'Compliance frameworks lack enforcement teeth; companies can ignore recommendations',
    csoaiSolution: 'License-Based Enforcement (Article 10)',
    impact: 'Mandatory compliance | Clear penalties for violations | Revocable AI operating licenses',
    icon: Lock,
    color: 'from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-300',
  },
  {
    number: 8,
    title: 'No Enterprise Compliance Platform',
    problem: 'Companies lack unified platform for multi-framework compliance tracking and reporting',
    csoaiSolution: 'Enterprise Platform with Integrated Compliance Dashboard',
    impact: 'Single pane of glass for compliance | Automated reporting | Real-time compliance status',
    icon: BarChart3,
    color: 'from-cyan-50 to-cyan-100',
    borderColor: 'border-cyan-300',
  },
  {
    number: 9,
    title: 'No Democratic AI Governance',
    problem: 'AI governance dominated by tech companies; no democratic participation mechanism',
    csoaiSolution: 'Article 14 - Democratic Participation (33-Agent Council + Human Council)',
    impact: 'Distributed decision-making | Vendor-neutral governance | Democratic AI oversight',
    icon: Users,
    color: 'from-green-50 to-green-100',
    borderColor: 'border-green-300',
  },
  {
    number: 10,
    title: 'No AI Insurance Framework',
    problem: 'No insurance mechanism for AI-caused harm; liability gaps in AI incidents',
    csoaiSolution: 'Article 44 - Insurance Integration & Risk Management',
    impact: 'AI liability insurance | Risk mitigation | Compensation for AI-caused harm',
    icon: TrendingUp,
    color: 'from-amber-50 to-amber-100',
    borderColor: 'border-amber-300',
  },
  {
    number: 11,
    title: 'No Positive AI Narrative',
    problem: 'AI discourse dominated by fear narratives; lack of constructive vision for AI future',
    csoaiSolution: 'Maternal Covenant (Article 1) - Reframe AI as protective, not threatening',
    impact: 'Constructive AI narrative | Public trust in AI governance | Shared vision for AI future',
    icon: CheckCircle2,
    color: 'from-lime-50 to-lime-100',
    borderColor: 'border-lime-300',
  },
];

export default function Solutions() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h1 className="text-5xl font-bold mb-6">CSOAI's 11 Critical Solutions</h1>
            <p className="text-xl opacity-90 mb-4">The problems we solve and how our infrastructure works</p>
            <p className="text-lg opacity-80">Addressing the 11 critical gaps in the current AI governance landscape</p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">The Problem Landscape</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              The current AI governance landscape is fragmented, reactive, and incomplete. CSOAI identifies 11 critical gaps that existing frameworks cannot address. Each gap represents a market failure that existing solutions cannot overcome. Together, they form the foundation for the world's first comprehensive AI safety infrastructure.
            </p>
          </motion.div>

          {/* Architecture Diagram */}
          <motion.div {...fadeInUp} className="bg-gradient-to-br from-slate-50 to-slate-100 p-12 rounded-lg border-2 border-slate-300 mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">CSOAI Solution Architecture</h3>
            <div className="space-y-6 font-mono text-sm text-gray-700">
              <div className="text-center">
                <div className="inline-block border-2 border-emerald-600 bg-white px-6 py-3 rounded font-bold text-emerald-600">
                  CSOAI GOVERNANCE LAYER
                </div>
                <div className="text-2xl text-emerald-600 mt-2">↓</div>
              </div>
              <div className="text-center">
                <div className="inline-block border-2 border-blue-600 bg-white px-6 py-3 rounded font-bold text-blue-600">
                  BYZANTINE COUNCIL (33 AI Agents)
                </div>
                <div className="text-2xl text-blue-600 mt-2">↓</div>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-center">
                <div className="border-2 border-purple-600 bg-white px-4 py-2 rounded font-bold text-purple-600">TRAINING (CEASAI)</div>
                <div className="border-2 border-orange-600 bg-white px-4 py-2 rounded font-bold text-orange-600">ENTERPRISE PLATFORM</div>
                <div className="border-2 border-red-600 bg-white px-4 py-2 rounded font-bold text-red-600">SYSTEM CERT</div>
              </div>
              <div className="text-center">
                <div className="text-2xl text-emerald-600">↓</div>
                <div className="inline-block border-2 border-emerald-600 bg-white px-6 py-3 rounded font-bold text-emerald-600 mt-2">
                  PROSPERITY FUND (Economic Redistribution)
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {solutions.map((solution, idx) => {
              const Icon = solution.icon;
              return (
                <motion.div
                  key={idx}
                  {...fadeInUp}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-gradient-to-br ${solution.color} p-8 rounded-lg border-2 ${solution.borderColor} hover:shadow-lg transition`}
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="bg-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
                      <span className="text-xl font-bold text-gray-900">{solution.number}</span>
                    </div>
                    <Icon className="w-8 h-8 text-gray-700 flex-shrink-0 mt-1" />
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">The Problem:</p>
                    <p className="text-gray-700">{solution.problem}</p>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">CSOAI Solution:</p>
                    <p className="text-gray-700 font-semibold">{solution.csoaiSolution}</p>
                  </div>

                  <div className="bg-white bg-opacity-60 p-3 rounded border-l-4 border-emerald-600">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Business Impact:</p>
                    <p className="text-sm text-gray-700">{solution.impact}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Infrastructure by the Numbers</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '33', label: 'AI Agents', description: 'Byzantine Council' },
              { number: '3,300', label: 'H100 GPUs', description: '100 per agent' },
              { number: '<100ms', label: 'Monitoring Latency', description: 'Real-time detection' },
              { number: '99.99%', label: 'Uptime Target', description: 'Distributed across 6 regions' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1 }}
                className="text-center bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-lg border-2 border-emerald-300"
              >
                <div className="text-4xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">How CSOAI Works</h2>
            <p className="text-xl text-gray-600">The integrated infrastructure solving all 11 critical problems</p>
          </motion.div>

          <div className="space-y-8">
            {[
              {
                step: 1,
                title: 'Multi-Framework Integration',
                description: 'CSOAI Charter integrates 50+ global frameworks into one unified standard. One certification = compliance with all major standards.',
              },
              {
                step: 2,
                title: 'Real-Time Monitoring',
                description: 'Byzantine Council continuously monitors AI systems 24/7. Detects drift, degradation, and safety violations before they cause harm.',
              },
              {
                step: 3,
                title: 'Professional Certification',
                description: 'CEASAI trains and certifies AI safety professionals globally. Creates career pathways and ensures expertise standards.',
              },
              {
                step: 4,
                title: 'Enterprise Platform',
                description: 'Unified dashboard for compliance tracking, reporting, and remediation. Simplifies multi-framework compliance.',
              },
              {
                step: 5,
                title: 'Economic Redistribution',
                description: 'Prosperity Covenant ensures AI benefits are shared. Triggered UBI and AI Oversight Wage support workers affected by automation.',
              },
              {
                step: 6,
                title: 'Democratic Governance',
                description: '33-Agent Council + Human Council ensures decisions are made democratically, not by tech companies.',
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1 }}
                className="flex gap-6 items-start"
              >
                <div className="bg-emerald-600 text-white rounded-full w-12 h-12 flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  {item.step}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Get the Full Details</h2>
            <p className="text-xl text-gray-600 mb-8">Download the comprehensive 11 Critical Solutions document</p>
            <a
              href="/CSOAI_11_Critical_Solutions.pdf"
              download
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              <AlertCircle className="w-5 h-5" />
              Download Solutions Document
            </a>
          </motion.div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Learn More?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Explore the complete CSOAI Charter framework and discover how your organization can participate in the global AI safety infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation('/charter')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg"
              >
                Read the Charter
              </Button>
              <Button
                onClick={() => setLocation('/partnership')}
                variant="outline"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-3 px-8 rounded-lg"
              >
                Join the Alliance
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
