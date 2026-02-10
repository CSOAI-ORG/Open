import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Brain, 
  Users, 
  Vote, 
  CheckCircle2, 
  Shield,
  ArrowRight,
  Clock,
  Zap,
  AlertTriangle,
  FileCheck
} from "lucide-react";

interface WorkflowStep {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  duration: string;
  details: string[];
  status?: "active" | "completed" | "pending";
}

const workflowSteps: WorkflowStep[] = [
  {
    id: 1,
    title: "Report Submission",
    description: "Compliance report submitted for review",
    icon: <FileText className="h-6 w-6" />,
    duration: "Instant",
    details: [
      "Organization uploads compliance documentation",
      "System validates report format and completeness",
      "Report queued for Byzantine Council review",
      "Unique session ID generated"
    ],
  },
  {
    id: 2,
    title: "AI Analysis",
    description: "33 AI agents analyze the report in parallel",
    icon: <Brain className="h-6 w-6" />,
    duration: "10-30 seconds",
    details: [
      "Each agent specializes in different compliance areas",
      "Parallel processing for maximum efficiency",
      "Framework-specific validation rules applied",
      "Risk scoring and gap analysis performed"
    ],
  },
  {
    id: 3,
    title: "Byzantine Voting",
    description: "Agents cast votes with confidence scores",
    icon: <Vote className="h-6 w-6" />,
    duration: "5-15 seconds",
    details: [
      "Each agent votes: Approve, Reject, or Abstain",
      "Confidence scores (0-100%) attached to votes",
      "Reasoning provided for each decision",
      "Real-time vote streaming to dashboard"
    ],
  },
  {
    id: 4,
    title: "Consensus Check",
    description: "Byzantine fault-tolerant consensus reached",
    icon: <Users className="h-6 w-6" />,
    duration: "Instant",
    details: [
      "Requires 2/3 majority (22+ of 33 agents)",
      "Tolerates up to 10 malicious/faulty agents",
      "Deadlock resolution protocols if needed",
      "Consensus confidence score calculated"
    ],
  },
  {
    id: 5,
    title: "Human Review",
    description: "Optional human oversight for edge cases",
    icon: <Shield className="h-6 w-6" />,
    duration: "Variable",
    details: [
      "Triggered for low-confidence decisions",
      "Expert reviewers validate AI reasoning",
      "Can override or confirm AI consensus",
      "Audit trail maintained for compliance"
    ],
  },
  {
    id: 6,
    title: "Final Decision",
    description: "Compliance status determined and recorded",
    icon: <CheckCircle2 className="h-6 w-6" />,
    duration: "Instant",
    details: [
      "Decision recorded on immutable audit log",
      "Certificate generated if approved",
      "Detailed feedback report created",
      "Notifications sent to stakeholders"
    ],
  },
];

export function CouncilWorkflowDiagram() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Byzantine Council Workflow
          </CardTitle>
          <CardDescription>
            How the 33-Agent Council processes compliance reports using Byzantine fault-tolerant consensus
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Total Processing Time: 30-60 seconds</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Fault Tolerance: Up to 10 malicious agents</span>
            </div>
            <div className="flex items-center gap-2">
              <FileCheck className="h-4 w-4" />
              <span>Consensus Threshold: 67% (22/33)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Workflow Steps */}
      <div className="relative">
        {/* Connection Line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-primary/20 hidden md:block" />

        <div className="space-y-6">
          {workflowSteps.map((step, index) => (
            <div key={step.id} className="relative">
              {/* Step Card */}
              <Card className="ml-0 md:ml-20 hover:shadow-lg transition-shadow">
                {/* Step Number Circle */}
                <div className="absolute -left-4 md:left-0 top-6 md:-left-12 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm z-10">
                  {step.id}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        {step.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                        <CardDescription>{step.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      {step.duration}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ArrowRight className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              {/* Arrow between steps */}
              {index < workflowSteps.length - 1 && (
                <div className="hidden md:flex justify-center my-2 ml-20">
                  <ArrowRight className="h-5 w-5 text-primary/50 rotate-90" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-green-500/5 border-green-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <Zap className="h-5 w-5 text-green-500" />
              </div>
              <h3 className="font-semibold">Speed</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Complete compliance reviews in under 60 seconds with parallel AI processing and real-time consensus.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-500/5 border-blue-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <h3 className="font-semibold">Security</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Byzantine fault tolerance ensures accurate decisions even if up to 10 agents are compromised or malicious.
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-500/5 border-purple-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="h-5 w-5 text-purple-500" />
              </div>
              <h3 className="font-semibold">Transparency</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Every vote, reasoning, and decision is recorded with full audit trails for regulatory compliance.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Byzantine Consensus Explanation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            Byzantine Fault Tolerance Explained
          </CardTitle>
        </CardHeader>
        <CardContent className="prose prose-sm dark:prose-invert max-w-none">
          <p className="text-muted-foreground">
            The Byzantine Generals Problem describes a scenario where distributed systems must reach consensus 
            despite some participants being unreliable or malicious. Our 33-Agent Council implements a 
            practical Byzantine fault-tolerant (pBFT) consensus mechanism:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Why 33 Agents?</h4>
              <p className="text-sm text-muted-foreground">
                With n = 33 agents, the system can tolerate f = 10 faulty agents (where n ≥ 3f + 1). 
                This provides strong security guarantees while maintaining efficiency.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted">
              <h4 className="font-semibold mb-2">Why 2/3 Majority?</h4>
              <p className="text-sm text-muted-foreground">
                A 2/3 majority (22+ votes) ensures that even if 10 agents vote maliciously, 
                the honest majority (23+ agents) will always determine the outcome.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default CouncilWorkflowDiagram;
