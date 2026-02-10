import { useState } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { trpc } from '@/lib/trpc';
import { 
  Check, 
  Zap, 
  Shield,
  Users,
  Globe,
  ChevronDown,
  ChevronUp,
  Award,
  BookOpen,
  Heart,
  Gift,
  Sparkles,
  Star
} from 'lucide-react';
import { JoinCouncilCTA } from '@/components/JoinCouncilCTA';
import { FloatingJoinCouncilCTA } from '@/components/FloatingJoinCouncilCTA';

const FAQ = [
  {
    question: 'Why is training now free?',
    answer: 'Based on feedback from top CISOs, we\'ve removed all barriers to entry. CSOAI is committed to training 250,000 AI Safety Analysts to meet the EU AI Act deadline. The more awareness we spread, the more data we collect, the safer the future for all. Our mission is public safety, not profit from training.',
  },
  {
    question: 'Is certification really free?',
    answer: 'Yes! Certification is completely free. After completing free training and passing the exam, you get your official CEASAI certificate at no cost. This includes: official CEASAI certificate issuance, verification badge for employers, digital certificate with QR code verification, LinkedIn badge integration, and lifetime access to your credentials.',
  },
  {
    question: 'Is there a professional membership fee?',
    answer: 'No! All membership benefits are completely free. You get: inclusion in our certified analyst directory, access to job opportunities through the Watchdog program, annual compliance updates training, certificate renewal and verification services, community access with other certified analysts, and lifetime professional network access - all at no cost.',
  },
  {
    question: 'Can I donate to support the platform?',
    answer: 'Yes! We offer a "Pay What You Can" option when you complete a course. Your donations help us maintain the platform, develop new training content, and expand our mission to train 250,000 analysts. Every contribution helps make AI safer for everyone.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'All training is completely free! You can complete all 7 regional courses (EU AI Act, NIST, UK, Canada, Australia, ISO 42001, China TC260) without paying anything. Certification is also completely free when you pass the exam. There are zero payment barriers.',
  },
  {
    question: 'What compliance frameworks are covered?',
    answer: 'Our free training covers all major AI governance frameworks: EU AI Act, NIST AI RMF, ISO/IEC 42001, China\'s TC260, UK AI Bill, Canada\'s AIDA, and Australia\'s AI governance framework. Each framework has its own dedicated course.',
  },
  {
    question: 'How does the 33-Agent Council work?',
    answer: 'Our AI council evaluates safety scenarios using 33 specialized agents representing different stakeholder perspectives (regulators, ethicists, engineers, affected communities, etc.). Using Byzantine fault-tolerant consensus, they provide balanced recommendations that inform compliance decisions.',
  },
  {
    question: 'Can I earn money after getting certified?',
    answer: 'Yes! Certified analysts can earn $45-150/hour reviewing AI systems through our Watchdog program. Work is remote, flexible, and meaningful. You\'ll be protecting humanity from AI risks while building a career in one of the fastest-growing fields.',
  },
];

export default function Pricing() {
  const [, setLocation] = useLocation();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  
  const { data: user } = trpc.auth.me.useQuery();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-emerald-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
            Open-Source AI Safety Infrastructure
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            100% Free. 100% Open. 100% Transparent.
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-4">
            As the open-source FAA for AI, we believe safety training should be accessible to everyone. 
            All courses are free. All standards are public. All governance is transparent.
          </p>
          <p className="text-lg text-emerald-600 dark:text-emerald-400 font-semibold">
            No vendor ties. No hidden agendas. Just independent AI safety for the public good.
          </p>
        </div>

        {/* New Pricing Model Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16">
          {/* Free Training */}
          <Card className="relative overflow-hidden border-2 border-emerald-500 shadow-xl">
            <div className="absolute top-0 right-0 bg-emerald-500 text-white px-4 py-1 text-sm font-bold">
              100% FREE
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-emerald-600" />
              </div>
              <CardTitle className="text-2xl">Training</CardTitle>
              <CardDescription>All 7 Regional Courses</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-5xl font-bold text-emerald-600">$0</span>
                <span className="text-gray-500 ml-2">forever</span>
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>EU AI Act Fundamentals</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>NIST AI RMF Training</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>ISO 42001 International</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>UK, Canada, Australia, China</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Self-paced learning</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                  <span>Practice exams included</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={() => setLocation('/courses')}
              >
                Start Free Training
              </Button>
            </CardContent>
          </Card>

          {/* Certification Fee - FREE */}
          <Card className="relative overflow-hidden border-2 border-blue-500 shadow-xl transform scale-105">
            <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold">
              100% FREE
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Certification</CardTitle>
              <CardDescription>After Passing the Exam</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-5xl font-bold text-blue-600">FREE</span>
                <span className="text-gray-500 ml-2">no payment required</span>
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>Official CEASAI Certificate</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>Verification badge for employers</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>Digital certificate with QR</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>LinkedIn badge integration</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>Shareable achievement link</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-blue-500 flex-shrink-0" />
                  <span>Lifetime certificate validity</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => setLocation('/courses')}
              >
                Start Training Now
              </Button>
            </CardContent>
          </Card>

          {/* Professional Network - FREE */}
          <Card className="relative overflow-hidden border-2 border-purple-500 shadow-xl">
            <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 text-sm font-bold">
              100% FREE
            </div>
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle className="text-2xl">Professional Network</CardTitle>
              <CardDescription>Lifetime Access</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="mb-6">
                <span className="text-5xl font-bold text-purple-600">FREE</span>
                <span className="text-gray-500 ml-2">lifetime</span>
              </div>
              <ul className="space-y-3 text-left mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Certified analyst directory listing</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Priority job opportunities</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Annual compliance updates</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Certificate lifetime validity</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Community access</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-purple-500 flex-shrink-0" />
                  <span>Watchdog program access</span>
                </li>
              </ul>
              <Button
                variant="outline"
                className="w-full border-purple-500 text-purple-600 hover:bg-purple-50"
                onClick={() => setLocation('/courses')}
              >
                Get Started Today
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Pay What You Can Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-2 border-amber-300">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <Heart className="h-8 w-8 text-amber-600" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Pay What You Can</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                When you complete a course, you'll have the option to make a voluntary contribution. 
                Your donations help us maintain the platform, develop new content, and train more analysts to protect humanity.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-4">
                <Badge variant="outline" className="border-amber-500 text-amber-700 px-4 py-2">
                  <Gift className="mr-2 h-4 w-4" />
                  $5
                </Badge>
                <Badge variant="outline" className="border-amber-500 text-amber-700 px-4 py-2">
                  <Gift className="mr-2 h-4 w-4" />
                  $10
                </Badge>
                <Badge variant="outline" className="border-amber-500 text-amber-700 px-4 py-2">
                  <Gift className="mr-2 h-4 w-4" />
                  $25
                </Badge>
                <Badge variant="outline" className="border-amber-500 text-amber-700 px-4 py-2">
                  <Gift className="mr-2 h-4 w-4" />
                  $50
                </Badge>
                <Badge variant="outline" className="border-amber-500 text-amber-700 px-4 py-2">
                  <Heart className="mr-2 h-4 w-4" />
                  Custom
                </Badge>
              </div>
              <p className="text-sm text-amber-700 dark:text-amber-400">
                <Sparkles className="inline h-4 w-4 mr-1" />
                100% of donations go directly to our mission
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Summary */}
        <div className="max-w-3xl mx-auto mb-16">
          <Card className="p-6 bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-800">
            <h3 className="text-xl font-bold text-center mb-6">Simple, Transparent Pricing</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4">
                <div className="text-3xl font-bold text-emerald-600">FREE</div>
                <div className="text-sm text-muted-foreground">All Training</div>
              </div>
              <div className="p-4 border-x">
                <div className="text-3xl font-bold text-blue-600">FREE</div>
                <div className="text-sm text-muted-foreground">Certification</div>
              </div>
              <div className="p-4">
                <div className="text-3xl font-bold text-purple-600">FREE</div>
                <div className="text-sm text-muted-foreground">Network</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Why Free Section */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Why We Made Training Free
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">CISO Feedback</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Top CISOs told us the barrier to entry was preventing adoption. 
                    We listened and removed all financial obstacles to training.
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
                  <h3 className="font-bold text-lg mb-2">Public Good Mission</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    CSOAI exists to protect humanity from AI risks. 
                    Making training free aligns with our non-profit, public-good mission.
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
                  <h3 className="font-bold text-lg mb-2">Urgency of the Crisis</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We need 250,000 trained analysts by Feb 2026. 
                    Free training accelerates adoption and helps meet this critical deadline.
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
                  <h3 className="font-bold text-lg mb-2">No Conflict of Interest</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    By removing profit from training, we eliminate any perception of 
                    conflict of interest. Our only incentive is public safety.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {FAQ.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                >
                  <span className="font-semibold text-gray-900 dark:text-white pr-4">{faq.question}</span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-gray-600 dark:text-gray-400">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-4xl mx-auto mt-16 text-center">
          <Card className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white p-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Your Free Training?</h2>
            <p className="text-emerald-100 mb-6 max-w-2xl mx-auto">
              Join thousands of analysts protecting humanity from AI risks.
              Complete training at your own pace, then get certified completely free. 100% no barriers.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                size="lg" 
                className="bg-white text-emerald-700 hover:bg-emerald-50"
                onClick={() => setLocation('/courses')}
              >
                Start Free Training
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white/10"
                onClick={() => setLocation('/certification')}
              >
                Learn About Certification
              </Button>
            </div>
          </Card>
        </div>

        {/* Join the Council CTA */}
        <div className="max-w-5xl mx-auto mt-16">
          <JoinCouncilCTA variant="banner" />
        </div>
      </div>

      {/* Floating Join Council CTA */}
      <FloatingJoinCouncilCTA />
    </div>
  );
}
