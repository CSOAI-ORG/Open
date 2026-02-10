import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle2, Lock, Clock, Award, Users, BookOpen } from 'lucide-react';

const modules = [
  {
    id: 1,
    title: "AI Safety Fundamentals",
    description: "Core concepts of AI safety, risk assessment frameworks, and the regulatory landscape",
    duration: "1 week",
    lessons: 12,
    topics: [
      "Introduction to AI Safety",
      "Risk Assessment Frameworks",
      "EU AI Act Overview",
      "Regulatory Compliance Basics"
    ],
    locked: false
  },
  {
    id: 2,
    title: "System Evaluation & Analysis",
    description: "Learn to evaluate AI systems using the 4MQ Protocol (Measurement, Monitoring, Mitigation, Management)",
    duration: "1 week",
    lessons: 14,
    topics: [
      "4MQ Protocol Deep Dive",
      "System Architecture Analysis",
      "Safety Metrics & KPIs",
      "Evaluation Methodologies"
    ],
    locked: false
  },
  {
    id: 3,
    title: "Risk Identification & Mitigation",
    description: "Identify potential AI risks and develop mitigation strategies across technical and organizational domains",
    duration: "1 week",
    lessons: 13,
    topics: [
      "Risk Taxonomy",
      "Technical Risk Assessment",
      "Organizational Risk Management",
      "Mitigation Strategy Development"
    ],
    locked: false
  },
  {
    id: 4,
    title: "Governance & Compliance",
    description: "Master governance frameworks and ensure compliance with EU AI Act and international standards",
    duration: "1 week",
    lessons: 11,
    topics: [
      "Governance Structures",
      "EU AI Act Compliance",
      "ISO & NIST Standards",
      "Audit & Certification"
    ],
    locked: false
  },
  {
    id: 5,
    title: "Incident Response & Monitoring",
    description: "Develop incident response protocols and implement continuous monitoring systems for deployed AI",
    duration: "1 week",
    lessons: 12,
    topics: [
      "Incident Detection",
      "Response Protocols",
      "Continuous Monitoring",
      "Public Reporting Requirements"
    ],
    locked: false
  },
  {
    id: 6,
    title: "Case Studies & Real-World Applications",
    description: "Analyze real-world AI safety incidents and apply frameworks to actual deployment scenarios",
    duration: "1 week",
    lessons: 10,
    topics: [
      "Historical AI Incidents",
      "Case Study Analysis",
      "Lessons Learned",
      "Best Practices"
    ],
    locked: false
  },
  {
    id: 7,
    title: "Capstone Project & Certification Exam",
    description: "Complete a comprehensive capstone project and pass the proctored certification exam to earn your CASA credential",
    duration: "1 week",
    lessons: 8,
    topics: [
      "Capstone Project",
      "Exam Preparation",
      "Proctored Assessment",
      "Certification Issuance"
    ],
    locked: false
  }
];

export default function CASACertification() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h1 className="text-5xl font-bold">CASA Certification Program</h1>
            <p className="text-xl text-emerald-100 max-w-2xl">
              Become a Certified Augmented Safety Analyst in 7 weeks. Master AI safety evaluation, governance, and compliance to meet EU AI Act requirements.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Program Overview */}
      <section className="py-16 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: Clock, label: "7 Weeks", value: "Complete in your own pace" },
              { icon: BookOpen, label: "7 Modules", value: "Comprehensive curriculum" },
              { icon: Users, label: "250K+", value: "Global community" },
              { icon: Award, label: "CASA", value: "Globally recognized credential" }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg p-6 shadow-sm border border-slate-200"
                >
                  <Icon className="w-8 h-8 text-emerald-600 mb-3" />
                  <h3 className="font-bold text-slate-900 mb-1">{item.label}</h3>
                  <p className="text-sm text-slate-600">{item.value}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modules */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-slate-900 mb-4">7-Module Curriculum</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Each module builds on the previous, creating a comprehensive foundation in AI safety analysis and governance
            </p>
          </motion.div>

          <div className="space-y-6">
            {modules.map((module, idx) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                    {/* Left - Module Info */}
                    <div className="bg-gradient-to-br from-emerald-50 to-white p-8 lg:col-span-2 border-r border-slate-200">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                            {module.id}
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-slate-900">{module.title}</h3>
                            <p className="text-slate-600 mt-1">{module.description}</p>
                          </div>
                        </div>
                        {module.locked ? (
                          <Lock className="w-6 h-6 text-slate-400 flex-shrink-0" />
                        ) : (
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                        )}
                      </div>

                      {/* Topics */}
                      <div className="mt-6 space-y-2">
                        <h4 className="font-semibold text-slate-900 text-sm">Key Topics:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {module.topics.map((topic) => (
                            <div key={topic} className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                              <span className="text-sm text-slate-700">{topic}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Right - Stats & CTA */}
                    <div className="bg-white p-8 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Duration</p>
                          <p className="text-2xl font-bold text-slate-900">{module.duration}</p>
                        </div>
                        <div>
                          <p className="text-sm text-slate-600 mb-1">Lessons</p>
                          <p className="text-2xl font-bold text-slate-900">{module.lessons}</p>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        disabled={module.locked}
                      >
                        {module.locked ? 'Locked' : 'Start Module'}
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Details */}
      <section className="py-20 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-12"
          >
            <div className="text-center">
              <h2 className="text-4xl font-bold text-slate-900 mb-4">What You'll Achieve</h2>
              <p className="text-xl text-slate-600">Upon completion of the CASA program, you will:</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                {
                  title: "CASA Certification",
                  description: "Earn a globally recognized credential as a Certified Augmented Safety Analyst"
                },
                {
                  title: "EU AI Act Compliance",
                  description: "Master the regulatory framework and ensure organizational compliance"
                },
                {
                  title: "Risk Assessment Expertise",
                  description: "Develop skills to evaluate and mitigate AI safety risks across domains"
                },
                {
                  title: "Career Opportunities",
                  description: "Access job opportunities with organizations requiring certified AI analysts"
                },
                {
                  title: "Governance Knowledge",
                  description: "Understand AI governance structures and implementation strategies"
                },
                {
                  title: "Continuous Learning",
                  description: "Join a community of 250,000+ AI safety professionals globally"
                }
              ].map((item, idx) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg p-6 border border-slate-200"
                >
                  <CheckCircle2 className="w-6 h-6 text-emerald-600 mb-3" />
                  <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-slate-600 text-sm">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <h2 className="text-4xl font-bold">Ready to Become a CASA?</h2>
            <p className="text-xl text-emerald-100 max-w-2xl mx-auto">
              Join thousands of professionals getting certified to meet the EU AI Act compliance deadline. Start your free training today.
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-700 hover:bg-emerald-50 font-bold text-lg px-10"
              onClick={() => window.location.href = '/signup'}
            >
              Enroll Now - Free Training
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
