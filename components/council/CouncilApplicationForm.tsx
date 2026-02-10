/*
 * Council Application Form - Capture interested analysts' information
 * For the Byzantine Council of AI Safety Analysts
 */

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Brain,
  Globe,
  CheckCircle,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Scale,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

interface CouncilApplicationFormProps {
  onSuccess?: () => void;
}

const expertiseAreas = [
  { id: "eu_ai_act", label: "EU AI Act Compliance", icon: Scale },
  { id: "nist_ai_rmf", label: "NIST AI Risk Management Framework", icon: FileText },
  { id: "iso_42001", label: "ISO/IEC 42001 AI Management", icon: Shield },
  { id: "gdpr_privacy", label: "GDPR & Data Privacy", icon: Users },
  { id: "algorithmic_bias", label: "Algorithmic Bias Detection", icon: Brain },
  { id: "safety_testing", label: "AI Safety Testing & Red Teaming", icon: Shield },
  { id: "ethics_governance", label: "AI Ethics & Governance", icon: Scale },
  { id: "technical_audit", label: "Technical AI Auditing", icon: FileText },
];

const experienceLevels = [
  { value: "entry", label: "Entry Level (0-2 years)" },
  { value: "mid", label: "Mid Level (2-5 years)" },
  { value: "senior", label: "Senior (5-10 years)" },
  { value: "expert", label: "Expert (10+ years)" },
];

const referralSources = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "Twitter/X" },
  { value: "conference", label: "Conference/Event" },
  { value: "colleague", label: "Colleague Referral" },
  { value: "search", label: "Search Engine" },
  { value: "news", label: "News Article" },
  { value: "other", label: "Other" },
];

export default function CouncilApplicationForm({ onSuccess }: CouncilApplicationFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    organization: "",
    jobTitle: "",
    country: "",
    linkedinUrl: "",
    experienceLevel: "",
    expertiseAreas: [] as string[],
    relevantCertifications: "",
    motivation: "",
    previousAuditExperience: "",
    availableHoursPerWeek: "",
    referralSource: "",
    agreeToTerms: false,
  });
  const [submitted, setSubmitted] = useState(false);

  const submitMutation = trpc.councilApplications.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Application submitted!", {
        description: "Thank you for applying to join the Council. We'll review your application and be in touch soon.",
      });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error("Submission failed", {
        description: error.message,
      });
    },
  });

  const handleExpertiseChange = (areaId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      expertiseAreas: checked
        ? [...prev.expertiseAreas, areaId]
        : prev.expertiseAreas.filter(id => id !== areaId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.motivation) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.expertiseAreas.length === 0) {
      toast.error("Please select at least one area of expertise");
      return;
    }

    if (!formData.agreeToTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    submitMutation.mutate({
      fullName: formData.fullName,
      email: formData.email,
      organization: formData.organization || undefined,
      jobTitle: formData.jobTitle || undefined,
      country: formData.country || undefined,
      linkedinUrl: formData.linkedinUrl || undefined,
      experienceLevel: formData.experienceLevel || undefined,
      expertiseAreas: formData.expertiseAreas,
      relevantCertifications: formData.relevantCertifications || undefined,
      motivation: formData.motivation,
      previousAuditExperience: formData.previousAuditExperience || undefined,
      availableHoursPerWeek: formData.availableHoursPerWeek 
        ? parseInt(formData.availableHoursPerWeek) 
        : undefined,
      referralSource: formData.referralSource || undefined,
    });
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800"
      >
        <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">
          Application Received!
        </h3>
        <p className="text-muted-foreground mb-4">
          Thank you for your interest in joining the Council of AI Safety Analysts.
          Our team will review your application and contact you within 5-7 business days.
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm">
          <Users className="h-4 w-4" />
          <span>You're one step closer to shaping AI governance</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <Shield className="h-4 w-4" />
          <span>Council Application</span>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Apply to Join the Council
        </h2>
        <p className="text-muted-foreground">
          Become part of the 33-Agent Byzantine Council and help shape the future of AI safety governance.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Personal Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                placeholder="Dr. Jane Smith"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="jane.smith@organization.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="organization">Organization</Label>
              <Input
                id="organization"
                placeholder="AI Safety Institute"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="jobTitle">Job Title</Label>
              <Input
                id="jobTitle"
                placeholder="AI Ethics Researcher"
                value={formData.jobTitle}
                onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="United States"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn Profile URL</Label>
              <Input
                id="linkedinUrl"
                placeholder="https://linkedin.com/in/janesmith"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Professional Background */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" />
            Professional Background
          </h3>

          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level</Label>
            <Select
              value={formData.experienceLevel}
              onValueChange={(value) => setFormData({ ...formData, experienceLevel: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select your experience level" />
              </SelectTrigger>
              <SelectContent>
                {experienceLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label>Areas of Expertise *</Label>
            <p className="text-sm text-muted-foreground">
              Select all areas where you have professional experience or certification
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {expertiseAreas.map((area) => {
                const Icon = area.icon;
                return (
                  <div
                    key={area.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-colors cursor-pointer ${
                      formData.expertiseAreas.includes(area.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => handleExpertiseChange(area.id, !formData.expertiseAreas.includes(area.id))}
                  >
                    <Checkbox
                      id={area.id}
                      checked={formData.expertiseAreas.includes(area.id)}
                      onCheckedChange={(checked) => handleExpertiseChange(area.id, checked as boolean)}
                    />
                    <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                    <Label htmlFor={area.id} className="cursor-pointer text-sm">
                      {area.label}
                    </Label>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="relevantCertifications">Relevant Certifications</Label>
            <Textarea
              id="relevantCertifications"
              placeholder="e.g., CIPP/E, ISO 27001 Lead Auditor, CISSP, etc."
              rows={2}
              value={formData.relevantCertifications}
              onChange={(e) => setFormData({ ...formData, relevantCertifications: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="previousAuditExperience">Previous AI Audit Experience</Label>
            <Textarea
              id="previousAuditExperience"
              placeholder="Describe any previous experience auditing AI systems, conducting risk assessments, or evaluating algorithmic fairness..."
              rows={3}
              value={formData.previousAuditExperience}
              onChange={(e) => setFormData({ ...formData, previousAuditExperience: e.target.value })}
            />
          </div>
        </div>

        {/* Motivation & Availability */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            Motivation & Availability
          </h3>

          <div className="space-y-2">
            <Label htmlFor="motivation">Why do you want to join the Council? *</Label>
            <Textarea
              id="motivation"
              placeholder="Tell us about your passion for AI safety and why you'd be a valuable addition to the Council..."
              rows={4}
              value={formData.motivation}
              onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
              required
            />
            <p className="text-xs text-muted-foreground">
              Minimum 100 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="availableHours">Hours Available Per Week</Label>
              <Select
                value={formData.availableHoursPerWeek}
                onValueChange={(value) => setFormData({ ...formData, availableHoursPerWeek: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5-10 hours</SelectItem>
                  <SelectItem value="10">10-20 hours</SelectItem>
                  <SelectItem value="20">20-30 hours</SelectItem>
                  <SelectItem value="30">30-40 hours</SelectItem>
                  <SelectItem value="40">40+ hours (full-time)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <Select
                value={formData.referralSource}
                onValueChange={(value) => setFormData({ ...formData, referralSource: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select source" />
                </SelectTrigger>
                <SelectContent>
                  {referralSources.map((source) => (
                    <SelectItem key={source.value} value={source.value}>
                      {source.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Terms & Submit */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Checkbox
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: checked as boolean })}
            />
            <div className="space-y-1">
              <Label htmlFor="agreeToTerms" className="cursor-pointer">
                I agree to the terms and conditions *
              </Label>
              <p className="text-xs text-muted-foreground">
                By submitting this application, you agree to participate in the Council's AI safety governance activities,
                maintain confidentiality of sensitive information, and adhere to our code of ethics.
              </p>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={submitMutation.isPending}
          >
            {submitMutation.isPending ? (
              "Submitting Application..."
            ) : (
              <>
                Submit Council Application
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Your application will be reviewed by our team. We typically respond within 5-7 business days.
            Questions? Contact us at council@councilof.ai
          </p>
        </div>
      </form>
    </motion.div>
  );
}
