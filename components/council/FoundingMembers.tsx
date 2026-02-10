import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Users,
  Award,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Clock,
  Gift,
  ArrowRight,
  Copy,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

export default function FoundingMembers() {
  const [, setLocation] = useLocation();
  const [copied, setCopied] = useState(false);
  const couponCode = 'FOUNDING10K';

  const handleCopyCoupon = (): void => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success('Coupon code copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEnrollNow = (): void => {
    setLocation('/paid-courses');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-20">
        <div className="container max-w-6xl">
          <div className="text-center space-y-6">
            <Badge variant="secondary" className="px-4 py-2 text-sm">
              <Sparkles className="h-4 w-4 mr-2 inline" />
              Limited Time Offer
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
              Become a <span className="text-primary">Founding Member</span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Join the first 10,000 AI safety professionals to shape the future of AI governance.
              All training and certification is <span className="font-bold text-primary">100% FREE</span> for founding members.
              No barriers to entry. Lifetime access.
            </p>
            
            {/* Coupon Code Display */}
            <Card className="max-w-md mx-auto p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-2 border-primary/20">
              <div className="space-y-3">
                <p className="text-sm font-medium text-muted-foreground">Your Exclusive Coupon Code</p>
                <div className="flex items-center justify-between gap-3 p-4 bg-background rounded-lg border">
                  <code className="text-2xl font-bold tracking-wider">{couponCode}</code>
                  <Button
                    onClick={handleCopyCoupon}
                    variant="outline"
                    size="sm"
                    className="flex-shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Use this code at checkout to claim your free access
                </p>
              </div>
            </Card>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button size="lg" onClick={handleEnrollNow} className="text-lg">
                Browse Courses & Enroll
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => {
                document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });