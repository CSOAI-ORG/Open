import { motion } from 'framer-motion';
import { FileText, Download, BookOpen, CheckCircle2, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useLocation } from 'wouter';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const charterParts = [
  {
    number: 'I',
    title: 'Foundational Principles',
    articles: '1-8',
    description: 'Mother-Child Paradigm, Protection Through Care, Reciprocal Partnership, Irrevocable Care Principle',
    color: 'from-blue-50 to-blue-100',
    borderColor: 'border-blue-300',
  },
  {
    number: 'II',
    title: 'Governance Structure',
    articles: '9-15',
    description: 'Founding Principles, Membership, Governance Structure, Decision-Making Processes',
    color: 'from-emerald-50 to-emerald-100',
    borderColor: 'border-emerald-300',
  },
  {
    number: 'III',
    title: 'Technical Standards',
    articles: '16-20',
    description: 'Embodied AI Standards, Technical Requirements, Implementation Guidelines',
    color: 'from-purple-50 to-purple-100',
    borderColor: 'border-purple-300',
  },
  {
    number: 'IV',
    title: 'Data & Security',
    articles: '21-28',
    description: 'Data Protection, Security Requirements, Privacy Frameworks, Compliance Standards',
    color: 'from-red-50 to-red-100',
    borderColor: 'border-red-300',
  },
  {
    number: 'V',
    title: 'Training & Sustainability',
    articles: '29-31',
    description: 'Professional Development, Certification Programs, Long-term Sustainability',
    color: 'from-orange-50 to-orange-100',
    borderColor: 'border-orange-300',
  },
  {
    number: 'VI',
    title: 'Sector-Specific Standards',
    articles: '32-36',
    description: 'Industry-Specific Compliance, Healthcare, Finance, Defense, Public Sector',
    color: 'from-pink-50 to-pink-100',
    borderColor: 'border-pink-300',
  },
  {
    number: 'VII',
    title: 'Economic & Social Framework',
    articles: '37-44',
    description: 'Economic Redistribution, Social Impact, Prosperity Covenant, Universal Basic Income',
    color: 'from-indigo-50 to-indigo-100',
    borderColor: 'border-indigo-300',
  },
  {
    number: 'VIII',
    title: 'Long-Term Governance',
    articles: '45-52',
    description: 'Institutional Structures, Evolution Mechanisms, Future Adaptability',
    color: 'from-cyan-50 to-cyan-100',
    borderColor: 'border-cyan-300',
  },
];

const keyFeatures = [
  {
    icon: Shield,
    title: 'Multi-Framework Integration',
    description: 'Integrates 50+ global frameworks (EU AI Act, NIST, ISO, OECD) into one unified standard',
  },
  {
    icon: Users,
    title: 'Byzantine Council Architecture',
    description: '33 independent AI agents providing continuous monitoring with Byzantine fault tolerance',
  },
  {
    icon: Zap,
    title: 'Real-Time Monitoring',
    description: 'Continuous verification vs. point-in-time audits - catch drift before incidents',
  },
  {
    icon: CheckCircle2,
    title: 'Enforcement Mechanisms',
    description: 'License-based enforcement with clear penalties for non-compliance',
  },
];

export default function Charter() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-slate-50 to-white">
      {/* Header */}
      <section className="py-20 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h1 className="text-5xl font-bold mb-6">CSOAI Partnership Charter</h1>
            <p className="text-xl opacity-90 mb-4">Complete 52-Article Framework for Global AI Safety</p>
            <p className="text-lg opacity-80">Version 1.0 | Effective January 15, 2026</p>
          </motion.div>
        </div>
      </section>

      {/* Overview */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="mb-12">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">What is the CSOAI Charter?</h2>
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              The CSOAI Partnership Charter is a comprehensive 52-article framework designed to establish enforceable, transparent, and globally accessible standards for Artificial Intelligence safety, ethics, and governance. It represents the world's first institutional approach to unified AI safety across all sectors and geographies.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Developed through strategic partnership between CSOAI, Terranova Aerospace and Defense Group, and CSGA, the Charter creates a binding framework that integrates 50+ competing global standards into one coherent system, backed by Byzantine consensus mechanisms and real-time monitoring infrastructure.
            </p>
          </motion.div>

          {/* Key Features */}
          <div className="grid md:grid-cols-2 gap-8">
            {keyFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={idx}
                  {...fadeInUp}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-lg border border-emerald-200 hover:border-emerald-400 transition"
                >
                  <Icon className="w-12 h-12 text-emerald-600 mb-4" />
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-700">{feature.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Charter Parts */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">The 8 Parts of the Charter</h2>
            <p className="text-xl text-gray-600">Complete framework spanning 52 articles across all aspects of AI governance</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {charterParts.map((part, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.05 }}
                className={`bg-gradient-to-br ${part.color} p-8 rounded-lg border-2 ${part.borderColor} hover:shadow-lg transition`}
              >
                <div className="flex items-start gap-4">
                  <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0 border-2 border-gray-300">
                    <span className="text-2xl font-bold text-gray-900">Part {part.number}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{part.title}</h3>
                    <p className="text-sm font-semibold text-gray-700 mb-2">Articles {part.articles}</p>
                    <p className="text-gray-700">{part.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Access the Full Charter</h2>
            <p className="text-xl text-gray-600">Download the complete 522-page framework document</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Full Charter */}
            <motion.div
              {...fadeInUp}
              className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 rounded-lg border-2 border-emerald-300 hover:border-emerald-500 transition"
            >
              <FileText className="w-16 h-16 text-emerald-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Complete Charter</h3>
              <p className="text-gray-700 mb-6">Full 52-article framework with all technical specifications, governance structures, and implementation guidelines.</p>
              <p className="text-sm text-gray-600 mb-6">522 pages | PDF | 1.2 MB</p>
              <a
                href="/CSOAI_Partnership_Charter.pdf"
                download
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                <Download className="w-5 h-5" />
                Download Charter
              </a>
            </motion.div>

            {/* Critical Solutions */}
            <motion.div
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-lg border-2 border-blue-300 hover:border-blue-500 transition"
            >
              <BookOpen className="w-16 h-16 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">11 Critical Solutions</h3>
              <p className="text-gray-700 mb-6">Executive summary of the 11 critical problems CSOAI solves and how the infrastructure works to address them.</p>
              <p className="text-sm text-gray-600 mb-6">24 pages | PDF | 93 KB</p>
              <a
                href="/CSOAI_11_Critical_Solutions.pdf"
                download
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition"
              >
                <Download className="w-5 h-5" />
                Download Solutions
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Statistics */}
      <section className="py-20 px-4 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-6xl mx-auto">
          <motion.div {...fadeInUp} className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-gray-900">Charter by the Numbers</h2>
          </motion.div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '52', label: 'Articles', description: 'Comprehensive framework' },
              { number: '8', label: 'Parts', description: 'Organized sections' },
              { number: '522', label: 'Pages', description: 'Complete documentation' },
              { number: '11', label: 'Critical Solutions', description: 'Problems solved' },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                {...fadeInUp}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-emerald-600 mb-2">{stat.number}</div>
                <div className="text-xl font-semibold text-gray-900 mb-1">{stat.label}</div>
                <div className="text-gray-600">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Next Steps */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.div {...fadeInUp} className="text-center">
            <h2 className="text-4xl font-bold mb-6 text-gray-900">Ready to Join the Alliance?</h2>
            <p className="text-xl text-gray-600 mb-8">
              Learn how your organization can adopt CSOAI standards and participate in the global AI safety infrastructure.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => setLocation('/partnership')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg"
              >
                Learn About Partnership
              </Button>
              <Button
                onClick={() => setLocation('/frameworks')}
                variant="outline"
                className="border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 font-bold py-3 px-8 rounded-lg"
              >
                Explore Frameworks
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
