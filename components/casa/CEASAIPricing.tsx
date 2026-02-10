/**
 * CEASAI Certification Pricing - 100% FREE MODEL
 * All training is completely free - no barriers to entry
 * Certification is free - no fees after passing exam
 * Everything is 100% Free - Open Source - No Barriers
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  TrendingUp,
  Shield,
  Award,
  BookOpen,
  Clock,
  Users,
  Globe,
  Zap,
  Heart,
  Gift,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useLocation } from 'wouter';

interface PricingTier {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  priceNote: string;
  duration: string;
  modules: string;
  features: string[];
  color: string;
  icon: React.ElementType;
  buttonText: string;
  buttonLink: string;
}

const pricingTiers: PricingTier[] = [
  {
    id: 'training',
    name: 'Training',
    subtitle: 'All 7 Regional Courses',
    price: 'FREE',
    priceNote: 'No payment required',
    duration: 'Self-paced',
    modules: '7 regional frameworks',
    features: [
      'EU AI Act Fundamentals',
      'NIST AI RMF Training',
      'ISO 42001 International',
      'UK AI Bill Framework',
      'Canada AIDA Compliance',
      'Australia AI Governance',
      'China TC260 Standards',
      'Self-paced learning',
      'Practice exams included',
      'Community forum access',
      'Lifetime course access',
    ],
    color: 'emerald',
    icon: BookOpen,
    buttonText: 'Start Free Training',
    buttonLink: '/courses',
  },
  {
    id: 'certification',
    name: 'Certification',
    subtitle: 'After Passing Exam',
    price: 'FREE',
    priceNote: 'No payment required',
    duration: 'Upon exam completion',
    modules: 'Official CEASAI Certificate',
    features: [
      'Official CEASAI Certificate',
      'Blockchain-verified credentials',
      'Digital certificate with QR code',
      'LinkedIn badge integration',
      'Certified analyst directory listing',
      'Job opportunities access',
      'Verification badge for employers',
      'Certificate valid for 2 years',
      'Unlimited exam retakes',
    ],
    color: 'blue',
    icon: Award,
    buttonText: 'Learn About Certification',
    buttonLink: '/certification',
  },
  {
    id: 'registration',
    name: 'Professional Network',
    subtitle: 'Lifetime Access',
    price: 'FREE',
    priceNote: 'No payment required',
    duration: 'Lifetime',
    modules: 'Community & Opportunities',
    features: [
      'Certified analyst directory listing',
      'Job opportunities access',
      'Priority job matching',
      'Professional network community',
      'Continuing education access',
      'Annual compliance updates training',
      'Certificate lifetime validity',
      'Verification badge access',
      'Lifetime platform access',
    ],
    color: 'purple',
    icon: Shield,
    buttonText: 'Join the Community',
    buttonLink: '/courses',
  },
];

export default function CEASAIPricing() {
  const [, setLocation] = useLocation();

  const handleClick = (link: string) => {
    setLocation(link);
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
            <Gift className="w-4 h-4 mr-2" />
            Free Training Initiative
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Free Training for 250,000 AI Safety Analysts
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Based on CISO feedback, we've removed all barriers to entry. Training is now completely free.
            The more awareness we spread, the safer the future for all.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {pricingTiers.map((tier, index) => {
            const Icon = tier.icon;
            const colorClasses = {
              emerald: {
                badge: 'bg-emerald-500',
                border: 'border-emerald-500',
                icon: 'bg-emerald-100 text-emerald-600',
                button: 'bg-emerald-600 hover:bg-emerald-700',
                price: 'text-emerald-600',
              },
              blue: {
                badge: 'bg-blue-500',
                border: 'border-blue-500',
                icon: 'bg-blue-100 text-blue-600',
                button: 'bg-blue-600 hover:bg-blue-700',
                price: 'text-blue-600',
              },
              purple: {
                badge: 'bg-purple-500',
                border: 'border-purple-500',
                icon: 'bg-purple-100 text-purple-600',
                button: 'bg-purple-600 hover:bg-purple-700',
                price: 'text-purple-600',
              },
            }[tier.color];

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative h-full border-2 ${colorClasses?.border} shadow-xl hover:shadow-2xl transition-shadow`}>
                  {tier.id === 'training' && (
                    <div className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${colorClasses?.badge} text-white px-4 py-1 rounded-full text-sm font-bold`}>
                      100% FREE
                    </div>
                  )}
                  <CardHeader className="text-center pb-4">
                    <div className={`w-16 h-16 ${colorClasses?.icon} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="h-8 w-8" />
                    </div>
                    <CardTitle className="text-2xl">{tier.name}</CardTitle>
                    <CardDescription>{tier.subtitle}</CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="mb-6">
                      <span className={`text-5xl font-bold ${colorClasses?.price}`}>{tier.price}</span>
                      <p className="text-gray-500 mt-1">{tier.priceNote}</p>
                    </div>
                    
                    <div className="text-left mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span>{tier.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <BookOpen className="h-4 w-4" />
                        <span>{tier.modules}</span>
                      </div>
                    </div>

                    <ul className="space-y-3 text-left mb-8">
                      {tier.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle className={`h-5 w-5 flex-shrink-0 ${colorClasses?.price}`} />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={`w-full ${colorClasses?.button} text-white`}
                      onClick={() => handleClick(tier.buttonLink)}
                    >
                      {tier.buttonText}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Support Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-amber-600" />
                <h3 className="text-2xl font-bold text-gray-900">Support Our Mission</h3>
              </div>
              <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
                While training is free, you can support our mission with a voluntary "Pay What You Can" donation.
                Your contribution helps us maintain the platform, develop new content, and train more analysts to protect humanity.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-100">
                  <Gift className="mr-2 h-4 w-4" />
                  Donate $25
                </Button>
                <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-100">
                  <Gift className="mr-2 h-4 w-4" />
                  Donate $50
                </Button>
                <Button variant="outline" className="border-amber-500 text-amber-700 hover:bg-amber-100">
                  <Gift className="mr-2 h-4 w-4" />
                  Donate $100
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Heart className="mr-2 h-4 w-4" />
                  Custom Amount
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Why Free Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mt-16"
        >
          <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Why We Made Training Free
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">CISO Feedback</h4>
                  <p className="text-gray-600 text-sm">
                    Top CISOs told us the barrier to entry was preventing adoption.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Public Good</h4>
                  <p className="text-gray-600 text-sm">
                    CSOAI exists to protect humanity from AI risks.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">Urgency</h4>
                  <p className="text-gray-600 text-sm">
                    We need 250,000 analysts by Feb 2026.
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <h4 className="font-bold text-lg mb-2">No Conflict</h4>
                  <p className="text-gray-600 text-sm">
                    Removing profit eliminates conflict of interest.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
