import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Brain, 
  Scale, 
  Cpu,
  Heart,
  Globe,
  Lock,
  Eye,
  TrendingUp,
  Award,
  Users,
  ChevronRight
} from 'lucide-react';

// Council member categories with detailed info
const COUNCIL_CATEGORIES = [
  {
    id: 'ethics',
    title: 'AI Safety & Ethics Specialists',
    icon: Shield,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    borderColor: 'border-purple-200 dark:border-purple-800',
    description: 'Experts in AI ethics, bias detection, and human rights protection',
    members: [
      { id: 1, name: 'Ethics Guardian', role: 'AI Ethics Specialist', provider: 'Anthropic Claude', specialty: 'Ethical decision frameworks' },
      { id: 2, name: 'Bias Detector', role: 'Fairness Analyst', provider: 'OpenAI GPT-4', specialty: 'Algorithmic fairness testing' },
      { id: 3, name: 'Safety Sentinel', role: 'Safety Engineer', provider: 'Google Gemini', specialty: 'Safety boundary enforcement' },
      { id: 4, name: 'Rights Advocate', role: 'Human Rights Expert', provider: 'Mistral', specialty: 'Digital rights protection' },
      { id: 5, name: 'Transparency Agent', role: 'Explainability Expert', provider: 'Cohere', specialty: 'Model interpretability' },
      { id: 6, name: 'Accountability Auditor', role: 'Compliance Auditor', provider: 'Meta Llama', specialty: 'Audit trail verification' },
      { id: 7, name: 'Privacy Protector', role: 'Privacy Specialist', provider: 'Anthropic Claude', specialty: 'Data privacy compliance' },
      { id: 8, name: 'Consent Validator', role: 'Consent Expert', provider: 'OpenAI GPT-4', specialty: 'User consent verification' },
    ]
  },
  {
    id: 'regulatory',
    title: 'Regulatory & Compliance Experts',
    icon: Scale,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    borderColor: 'border-blue-200 dark:border-blue-800',
    description: 'Specialists in global AI regulations and compliance frameworks',
    members: [
      { id: 9, name: 'EU AI Act Analyst', role: 'EU Regulation Expert', provider: 'Google Gemini', specialty: 'EU AI Act compliance' },
      { id: 10, name: 'NIST RMF Specialist', role: 'US Standards Expert', provider: 'Mistral', specialty: 'NIST framework implementation' },
      { id: 11, name: 'TC260 Interpreter', role: 'China Standards Expert', provider: 'Cohere', specialty: 'Chinese AI regulations' },
      { id: 12, name: 'ISO 42001 Auditor', role: 'ISO Compliance Expert', provider: 'Meta Llama', specialty: 'ISO certification' },
      { id: 13, name: 'GDPR Guardian', role: 'Data Protection Expert', provider: 'Anthropic Claude', specialty: 'GDPR compliance' },
      { id: 14, name: 'Sector Regulator', role: 'Industry Specialist', provider: 'OpenAI GPT-4', specialty: 'Industry-specific rules' },
      { id: 15, name: 'Cross-Border Analyst', role: 'International Law Expert', provider: 'Google Gemini', specialty: 'Cross-jurisdiction compliance' },
      { id: 16, name: 'Standards Harmonizer', role: 'Standards Expert', provider: 'Mistral', specialty: 'Standards alignment' },
    ]
  },
  {
    id: 'technical',
    title: 'Technical Security Experts',
    icon: Lock,
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    borderColor: 'border-green-200 dark:border-green-800',
    description: 'Security researchers and ML engineers ensuring technical safety',
    members: [
      { id: 17, name: 'Adversarial Defender', role: 'Security Researcher', provider: 'Cohere', specialty: 'Adversarial attack defense' },
      { id: 18, name: 'Model Validator', role: 'ML Engineer', provider: 'Meta Llama', specialty: 'Model validation' },
      { id: 19, name: 'Robustness Tester', role: 'QA Specialist', provider: 'Anthropic Claude', specialty: 'Robustness testing' },
      { id: 20, name: 'Drift Monitor', role: 'MLOps Engineer', provider: 'OpenAI GPT-4', specialty: 'Model drift detection' },
      { id: 21, name: 'Supply Chain Auditor', role: 'Supply Chain Expert', provider: 'Google Gemini', specialty: 'ML supply chain security' },
      { id: 22, name: 'Vulnerability Hunter', role: 'Penetration Tester', provider: 'Mistral', specialty: 'Vulnerability assessment' },
      { id: 23, name: 'Cryptography Expert', role: 'Security Architect', provider: 'Cohere', specialty: 'Cryptographic security' },
      { id: 24, name: 'Infrastructure Guardian', role: 'DevSecOps Engineer', provider: 'Meta Llama', specialty: 'Infrastructure security' },
    ]
  },
  {
    id: 'domain',
    title: 'Domain & Impact Specialists',
    icon: Globe,
    color: 'from-amber-500 to-amber-600',
    bgColor: 'bg-amber-50 dark:bg-amber-950/30',
    borderColor: 'border-amber-200 dark:border-amber-800',
    description: 'Industry experts assessing real-world AI impact across sectors',
    members: [
      { id: 25, name: 'Healthcare Analyst', role: 'Medical AI Expert', provider: 'Anthropic Claude', specialty: 'Healthcare AI safety' },
      { id: 26, name: 'Finance Watchdog', role: 'FinTech Specialist', provider: 'OpenAI GPT-4', specialty: 'Financial AI compliance' },
      { id: 27, name: 'Education Evaluator', role: 'EdTech Expert', provider: 'Google Gemini', specialty: 'Educational AI ethics' },
      { id: 28, name: 'Legal Advisor', role: 'AI Law Specialist', provider: 'Mistral', specialty: 'AI legal frameworks' },
      { id: 29, name: 'Environmental Assessor', role: 'Sustainability Expert', provider: 'Cohere', specialty: 'Environmental impact' },
      { id: 30, name: 'Labor Impact Analyst', role: 'Workforce Expert', provider: 'Meta Llama', specialty: 'Workforce displacement' },
      { id: 31, name: 'Accessibility Champion', role: 'Inclusion Specialist', provider: 'Anthropic Claude', specialty: 'Accessibility compliance' },
      { id: 32, name: 'Public Interest Guardian', role: 'Civil Society Rep', provider: 'OpenAI GPT-4', specialty: 'Public interest advocacy' },
      { id: 33, name: 'Future Risk Analyst', role: 'Long-term Safety Expert', provider: 'Google Gemini', specialty: 'Existential risk assessment' },
    ]
  }
];

// Provider logos/colors
const PROVIDER_COLORS: Record<string, string> = {
  'Anthropic Claude': 'bg-orange-500',
  'OpenAI GPT-4': 'bg-emerald-500',
  'Google Gemini': 'bg-blue-500',
  'Mistral': 'bg-purple-500',
  'Cohere': 'bg-pink-500',
  'Meta Llama': 'bg-indigo-500',
};

export function CouncilMemberShowcase() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hoveredMember, setHoveredMember] = useState<number | null>(null);

  return (
    <div className="space-y-8">
      {/* Header Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="text-3xl font-bold">33</p>
            <p className="text-sm text-muted-foreground">Council Members</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Cpu className="w-8 h-8 mx-auto mb-2 text-blue-600" />
            <p className="text-3xl font-bold">6</p>
            <p className="text-sm text-muted-foreground">AI Providers</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Shield className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-3xl font-bold">4</p>
            <p className="text-sm text-muted-foreground">Specialty Areas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-amber-600" />
            <p className="text-3xl font-bold">22+</p>
            <p className="text-sm text-muted-foreground">Fault Tolerance</p>
          </CardContent>
        </Card>
      </div>

      {/* Category Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {COUNCIL_CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isExpanded = selectedCategory === category.id;

          return (
            <motion.div
              key={category.id}
              layout
              className={isExpanded ? 'md:col-span-2' : ''}
            >
              <Card 
                className={`cursor-pointer transition-all duration-300 ${category.bgColor} ${category.borderColor} border-2 hover:shadow-lg`}
                onClick={() => setSelectedCategory(isExpanded ? null : category.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${category.color} text-white`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{category.title}</CardTitle>
                        <CardDescription>{category.members.length} members</CardDescription>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{category.description}</p>
                </CardHeader>

                {isExpanded && (
                  <CardContent>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {category.members.map((member) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: (member.id % 8) * 0.05 }}
                          className="relative"
                          onMouseEnter={() => setHoveredMember(member.id)}
                          onMouseLeave={() => setHoveredMember(null)}
                        >
                          <Card className="h-full hover:shadow-md transition-shadow">
                            <CardContent className="pt-4">
                              <div className="flex items-start gap-3">
                                <div className={`w-10 h-10 rounded-full ${PROVIDER_COLORS[member.provider]} flex items-center justify-center text-white font-bold text-sm`}>
                                  {member.name.split(' ').map(w => w[0]).join('')}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm truncate">{member.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{member.role}</p>
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {member.provider.split(' ')[0]}
                                  </Badge>
                                </div>
                              </div>
                              
                              {hoveredMember === member.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-3 pt-3 border-t"
                                >
                                  <p className="text-xs text-muted-foreground">
                                    <strong>Specialty:</strong> {member.specialty}
                                  </p>
                                </motion.div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                )}
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Provider Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            AI Provider Distribution
          </CardTitle>
          <CardDescription>
            Council members are distributed across 6 different AI providers for maximum independence
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(PROVIDER_COLORS).map(([provider, color]) => {
              const count = COUNCIL_CATEGORIES.flatMap(c => c.members).filter(m => m.provider === provider).length;
              return (
                <div key={provider} className="text-center">
                  <div className={`w-12 h-12 mx-auto rounded-full ${color} flex items-center justify-center text-white font-bold mb-2`}>
                    {count}
                  </div>
                  <p className="text-sm font-medium">{provider.split(' ')[0]}</p>
                  <p className="text-xs text-muted-foreground">{provider.split(' ')[1]}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Join CTA */}
      <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
        <CardContent className="py-8 text-center">
          <h3 className="text-2xl font-bold mb-2">Join the Council as a Certified Analyst</h3>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            Become a certified AI Safety Analyst and participate in council decisions. 
            Earn $45-150/hour while protecting humanity from AI risks.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" variant="secondary" className="gap-2">
              <Award className="w-4 h-4" />
              Start Free Training
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 gap-2">
              <Eye className="w-4 h-4" />
              View Live Council
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
