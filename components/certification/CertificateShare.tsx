/**
 * Certificate Share Component
 * 
 * Social sharing buttons for course completion certificates.
 * Supports LinkedIn and Twitter/X sharing.
 */

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Linkedin, 
  Twitter, 
  Share2, 
  Copy, 
  Check,
  ExternalLink
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CertificateShareProps {
  courseName: string;
  certificateId?: string;
  certificateUrl?: string;
  userName?: string;
  completionDate?: Date;
  framework?: string;
}

export function CertificateShare({
  courseName,
  certificateId,
  certificateUrl,
  userName,
  completionDate,
  framework,
}: CertificateShareProps) {
  const [copied, setCopied] = useState(false);

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const verifyUrl = certificateId 
    ? `${baseUrl}/verify-certificate/${certificateId}` 
    : certificateUrl || baseUrl;

  // LinkedIn share URL
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(verifyUrl)}`;

  // Twitter/X share text and URL
  const twitterText = `I just completed the ${courseName} certification from CSOAI! 🎓 

This course covered ${framework || 'AI governance'} frameworks and best practices.

#AIGovernance #AICompliance #CSOAI #Certificate`;
  
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(verifyUrl)}`;

  // LinkedIn post text (for manual posting)
  const linkedInText = `🎓 I'm excited to share that I've completed the "${courseName}" certification from CSOAI!

This comprehensive course covered:
• ${framework || 'AI Governance'} frameworks and regulations
• Risk assessment and compliance strategies
• Implementation best practices

Verify my certificate: ${verifyUrl}

#AIGovernance #AICompliance #ArtificialIntelligence #ProfessionalDevelopment`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(verifyUrl);
      setCopied(true);
      toast.success('Certificate link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleCopyLinkedInPost = async () => {
    try {
      await navigator.clipboard.writeText(linkedInText);
      toast.success('LinkedIn post text copied! Paste it in your LinkedIn post.');
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  const handleShareLinkedIn = () => {
    window.open(linkedInShareUrl, '_blank', 'width=600,height=600');
  };

  const handleShareTwitter = () => {
    window.open(twitterShareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Share2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <h3 className="font-semibold text-lg">Share Your Achievement</h3>
        </div>
        
        <p className="text-sm text-muted-foreground">
          Congratulations on completing your certification! Share your achievement with your professional network.
        </p>

        <div className="flex flex-wrap gap-3">
          {/* LinkedIn Share Button */}
          <Button
            onClick={handleShareLinkedIn}
            className="bg-[#0A66C2] hover:bg-[#004182] text-white gap-2"
          >
            <Linkedin className="w-4 h-4" />
            Share on LinkedIn
            <ExternalLink className="w-3 h-3" />
          </Button>

          {/* Twitter/X Share Button */}
          <Button
            onClick={handleShareTwitter}
            className="bg-black hover:bg-gray-800 text-white gap-2"
          >
            <Twitter className="w-4 h-4" />
            Share on X
            <ExternalLink className="w-3 h-3" />
          </Button>

          {/* Copy Link Button */}
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Link
              </>
            )}
          </Button>
        </div>

        {/* LinkedIn Post Helper */}
        <div className="pt-4 border-t border-blue-200 dark:border-blue-800">
          <p className="text-xs text-muted-foreground mb-2">
            Want to write a detailed LinkedIn post? Click below to copy a pre-written post:
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyLinkedInPost}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            <Copy className="w-3 h-3 mr-2" />
            Copy LinkedIn Post Template
          </Button>
        </div>
      </div>
    </Card>
  );
}
