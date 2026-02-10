import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Gift, 
  Award, 
  Sparkles,
  ArrowRight,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import { trpc } from '@/lib/trpc';

interface PayWhatYouCanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCertificate: () => void;
  courseName: string;
  courseId: number;
}

const PRESET_AMOUNTS = [5, 10, 25, 50, 100];

export function PayWhatYouCanModal({
  isOpen,
  onClose,
  onProceedToCertificate,
  courseName,
  courseId,
}: PayWhatYouCanModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Create payment intent mutation for donations
  const createPaymentMutation = trpc.stripe.createPaymentIntent.useMutation();

  const getActiveAmount = (): number => {
    if (customAmount && !isNaN(parseFloat(customAmount))) {
      return parseFloat(customAmount);
    }
    return selectedAmount || 0;
  };

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleContribute = async () => {
    const amount = getActiveAmount();
    if (amount < 1) {
      toast.error('Please enter an amount of at least $1');
      return;
    }

    setIsProcessing(true);
    try {
      // Create a payment intent for the donation
      const result = await createPaymentMutation.mutateAsync({
        amount: Math.round(amount * 100), // Convert to cents
        description: `Pay What You Can contribution for ${courseName}`,
        metadata: {
          type: 'pay_what_you_can',
          courseId: courseId.toString(),
          courseName,
        },
      });

      if (result.clientSecret) {
        // Redirect to Stripe checkout or handle payment
        // For now, we'll show success and proceed
        toast.success(`Thank you for your $${amount} contribution! 💚`);
        onProceedToCertificate();
      }
    } catch (error: any) {
      toast.error(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSkip = () => {
    onProceedToCertificate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">
            Congratulations! 🎉
          </DialogTitle>
          <DialogDescription className="text-base">
            You've completed <span className="font-semibold text-foreground">{courseName}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Mission Message */}
          <Card className="p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border-emerald-200 dark:border-emerald-800">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-emerald-800 dark:text-emerald-200 mb-1">
                  Support Our Mission
                </p>
                <p className="text-emerald-700 dark:text-emerald-300">
                  Your training was free. If you found value in this course, consider a voluntary contribution 
                  to help us train 250,000 AI Safety Analysts and keep education accessible for everyone.
                </p>
              </div>
            </div>
          </Card>

          {/* Preset Amounts */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose an amount (optional)</Label>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_AMOUNTS.map((amount) => (
                <Button
                  key={amount}
                  variant={selectedAmount === amount ? 'default' : 'outline'}
                  className={`h-12 ${
                    selectedAmount === amount 
                      ? 'bg-amber-500 hover:bg-amber-600 border-amber-500' 
                      : 'hover:border-amber-400 hover:text-amber-600'
                  }`}
                  onClick={() => handlePresetClick(amount)}
                >
                  ${amount}
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Amount */}
          <div className="space-y-2">
            <Label htmlFor="custom-amount" className="text-sm font-medium">
              Or enter a custom amount
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="custom-amount"
                type="number"
                min="1"
                step="1"
                placeholder="Enter amount"
                value={customAmount}
                onChange={(e) => handleCustomAmountChange(e.target.value)}
                className="pl-7"
              />
            </div>
          </div>

          {/* Impact Message */}
          {getActiveAmount() > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <Gift className="w-4 h-4 text-amber-500" />
              <span>
                Your ${getActiveAmount()} contribution helps train more analysts to protect humanity from AI risks.
              </span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            {getActiveAmount() > 0 ? (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                onClick={handleContribute}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  'Processing...'
                ) : (
                  <>
                    <Heart className="w-4 h-4 mr-2" />
                    Contribute ${getActiveAmount()} & Get Certificate
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                onClick={handleSkip}
              >
                <Award className="w-4 h-4 mr-2" />
                Get My Certificate (FREE)
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}

            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleSkip}
            >
              Skip contribution & proceed to certificate
            </Button>
          </div>

          {/* Certificate Info */}
          <div className="text-center text-xs text-muted-foreground border-t pt-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Check className="w-3 h-3 text-emerald-500" />
              <span>Official CEASAI Certificate</span>
            </div>
            <p>Certificate: 100% FREE (no cost)</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
