import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Check, ArrowRight, HelpCircle } from 'lucide-react';

export default function Licensing() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);

  const tiers = [
    {
      id: 'startup',
      name: 'Startup',
      annualFee: '£1,000',
      prosperityPercentage: '1%',
      targetRevenue: '<£1M revenue',
      description: 'For emerging AI companies and startups',
      features: [
        'Basic compliance monitoring',
        'EU AI Act alignment check',
        'Monthly compliance reports',
        'Email support',
        'Access to CEASAI training resources',
        'Community forum access'
      ],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      id: 'growth',
      name: 'Growth',
      annualFee: '£10,000',
      prosperityPercentage: '2%',
      targetRevenue: '£1-10M revenue',
      description: 'For scaling AI companies',
      features: [
        'All Startup features',
        'Advanced compliance monitoring',
        'Quarterly compliance audits',
        'Priority email support',
        'API access',
        'Custom compliance reports',
        'Dedicated account manager'
      ],
      color: 'from-emerald-500 to-teal-500',
      highlighted: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      annualFee: '£100,000',
      prosperityPercentage: '3%',
      targetRevenue: '£10-100M revenue',
      description: 'For large-scale AI operations',
      features: [
        'All Growth features',
        'Real-time compliance monitoring',
        'Monthly on-site audits',
        '24/7 phone support',
        'Custom integrations',
        'Dedicated compliance officer',
        'Advanced analytics dashboard'
      ],
      color: 'from-purple-500 to-pink-500'
    },
    {
      id: 'global',
      name: 'Global',
      annualFee: '£1,000,000',
      prosperityPercentage: '4%',
      targetRevenue: '£100M+ revenue',
      description: 'For multinational AI corporations',
      features: [
        'All Enterprise features',
        'Multi-region compliance',
        'Dedicated compliance team',
        'Custom regulatory mapping',
        'Executive briefings',
        'Priority feature requests',
        'White-glove service'
      ],
      color: 'from-orange-500 to-red-500'
    },
    {
      id: 'foundation',
      name: 'Foundation',
      annualFee: '£10,000,000',
      prosperityPercentage: '5%',
      targetRevenue: 'Frontier AI labs',
      description: 'For frontier AI research organizations',
      features: [
        'All Global features',
        'Custom governance framework',
        'Dedicated research partnership',
        'Policy influence opportunities',
        'Board-level engagement',
        'Unlimited custom solutions',
        'Strategic partnership status'
      ],
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const faqs = [
    {
      question: 'What is the Prosperity Fund contribution?',
      answer: 'The Prosperity Fund is a mechanism where a percentage of your licensing fee (1-5% depending on tier) contributes to a global fund supporting AI safety research and education. This ensures that all licensed AI systems contribute to the greater good of AI safety.'
    },
    {
      question: 'Can I upgrade or downgrade my tier?',
      answer: 'Yes, you can change tiers at any time. Upgrades take effect immediately, and downgrades take effect at the end of your billing cycle.'
    },
    {
      question: 'What happens if my revenue changes?',
      answer: 'Your tier is based on your revenue at the time of subscription. If your revenue changes significantly, contact our sales team to discuss tier adjustments.'
    },
    {
      question: 'Is there a contract term?',
      answer: 'Licensing agreements are typically annual with month-to-month options available for Enterprise and above tiers.'
    },
    {
      question: 'Do you offer discounts for multi-year commitments?',
      answer: 'Yes, we offer 10% discounts for 2-year commitments and 15% discounts for 3-year commitments across all tiers.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Navigation Spacer */}
      <div className="h-16" />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            AI System Licensing
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Compliance Made Simple
            </span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto">
            Choose the licensing tier that matches your organization's scale and compliance needs. All tiers include access to CEASAI training and the CSOAI governance framework.
          </p>
        </motion.div>
      </section>

      {/* Pricing Tiers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tiers.map((tier, index) => (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative ${tier.highlighted ? 'lg:scale-105 lg:z-10' : ''}`}
            >
              <Card className={`p-8 border-2 ${tier.highlighted ? 'border-emerald-400 bg-slate-800/80' : 'border-slate-700 bg-slate-800/40'} hover:border-slate-600 transition`}>
                {tier.highlighted && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-emerald-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
                  <p className="text-slate-400 text-sm mb-4">{tier.description}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Annual Fee:</span>
                      <span className="text-2xl font-bold text-blue-400">{tier.annualFee}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Prosperity Fund:</span>
                      <span className="text-lg font-semibold text-emerald-400">{tier.prosperityPercentage}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Target:</span>
                      <span className="text-sm text-slate-300">{tier.targetRevenue}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6 mb-6">
                  <h4 className="font-semibold mb-4">Includes:</h4>
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => setSelectedTier(tier.id)}
                  className={`w-full ${tier.highlighted ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Prosperity Fund Explanation */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/30 rounded-xl p-8"
        >
          <h2 className="text-3xl font-bold mb-6">The Prosperity Fund</h2>
          <p className="text-slate-300 mb-6">
            Every CSOAI licensee contributes a percentage of their annual fee to the Prosperity Fund. This global fund supports:
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">🎓 AI Safety Research</h3>
              <p className="text-sm text-slate-400">Funding cutting-edge research into AI safety methodologies and governance frameworks</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">📚 CEASAI Scholarships</h3>
              <p className="text-sm text-slate-400">Supporting the £20M scholarship program for 10,000 AI Safety Analysts globally</p>
            </div>
            <div className="bg-slate-800/50 p-6 rounded-lg">
              <h3 className="font-bold mb-2">🌍 Global Infrastructure</h3>
              <p className="text-sm text-slate-400">Building the infrastructure for AI safety monitoring across 21+ countries</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-800/40 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition"
            >
              <div className="flex items-start gap-4">
                <HelpCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-slate-400 text-sm">{faq.answer}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold mb-6">Ready to Get Licensed?</h2>
          <p className="text-xl text-slate-300 mb-8">
            Contact our licensing team to discuss which tier is right for your organization.
          </p>
          <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
            Contact Licensing Team <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>
    </div>
  );
}
