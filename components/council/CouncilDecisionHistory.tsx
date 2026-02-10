import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle,
  ChevronRight,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  Users
} from "lucide-react";
import { format } from "date-fns";

interface CouncilDecision {
  id: number;
  sessionId: string;
  reportTitle: string;
  framework: string;
  decision: "approved" | "rejected" | "deadlocked" | "pending";
  votesFor: number;
  votesAgainst: number;
  abstentions: number;
  totalAgents: number;
  consensusPercentage: number;
  duration: number; // seconds
  timestamp: Date;
  keyFindings: string[];
  dissenterReasons?: string[];
}

// Mock data for demonstration
const mockDecisions: CouncilDecision[] = [
  {
    id: 1,
    sessionId: "CS-2024-001",
    reportTitle: "AI Ethics Compliance Assessment - TechCorp",
    framework: "EU AI Act",
    decision: "approved",
    votesFor: 28,
    votesAgainst: 3,
    abstentions: 2,
    totalAgents: 33,
    consensusPercentage: 84.8,
    duration: 45,
    timestamp: new Date("2024-01-05T14:30:00"),
    keyFindings: [
      "Strong data governance practices",
      "Transparent AI decision-making processes",
      "Adequate human oversight mechanisms"
    ],
  },
  {
    id: 2,
    sessionId: "CS-2024-002",
    reportTitle: "Risk Management Framework Review - FinanceAI",
    framework: "NIST AI RMF",
    decision: "rejected",
    votesFor: 12,
    votesAgainst: 18,
    abstentions: 3,
    totalAgents: 33,
    consensusPercentage: 54.5,
    duration: 62,
    timestamp: new Date("2024-01-04T10:15:00"),
    keyFindings: [
      "Insufficient bias testing documentation",
      "Missing incident response procedures",
      "Incomplete third-party audit trails"
    ],
    dissenterReasons: [
      "Bias testing methodology needs improvement",
      "Risk assessment incomplete for edge cases"
    ],
  },
  {
    id: 3,
    sessionId: "CS-2024-003",
    reportTitle: "Healthcare AI Compliance - MedTech Solutions",
    framework: "ISO 42001",
    decision: "approved",
    votesFor: 30,
    votesAgainst: 2,
    abstentions: 1,
    totalAgents: 33,
    consensusPercentage: 90.9,
    duration: 38,
    timestamp: new Date("2024-01-03T16:45:00"),
    keyFindings: [
      "Excellent patient data protection",
      "Robust model validation processes",
      "Clear accountability structures"
    ],
  },
  {
    id: 4,
    sessionId: "CS-2024-004",
    reportTitle: "Autonomous Vehicle Safety Assessment",
    framework: "IEEE 7000",
    decision: "deadlocked",
    votesFor: 16,
    votesAgainst: 16,
    abstentions: 1,
    totalAgents: 33,
    consensusPercentage: 48.5,
    duration: 120,
    timestamp: new Date("2024-01-02T09:00:00"),
    keyFindings: [
      "Safety testing meets minimum standards",
      "Edge case handling disputed",
      "Requires additional expert review"
    ],
    dissenterReasons: [
      "Insufficient testing in adverse weather",
      "Pedestrian detection accuracy concerns"
    ],
  },
];

export function CouncilDecisionHistory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterDecision, setFilterDecision] = useState<string>("all");
  const [filterFramework, setFilterFramework] = useState<string>("all");
  const [selectedDecision, setSelectedDecision] = useState<CouncilDecision | null>(null);

  const filteredDecisions = mockDecisions.filter((decision) => {
    const matchesSearch = 
      decision.reportTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      decision.sessionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDecision = filterDecision === "all" || decision.decision === filterDecision;
    const matchesFramework = filterFramework === "all" || decision.framework === filterFramework;
    return matchesSearch && matchesDecision && matchesFramework;
  });

  const getDecisionBadge = (decision: string) => {
    switch (decision) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20"><CheckCircle2 className="h-3 w-3 mr-1" /> Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20"><XCircle className="h-3 w-3 mr-1" /> Rejected</Badge>;
      case "deadlocked":
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20"><AlertTriangle className="h-3 w-3 mr-1" /> Deadlocked</Badge>;
      default:
        return <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20"><Clock className="h-3 w-3 mr-1" /> Pending</Badge>;
    }
  };

  const stats = {
    total: mockDecisions.length,
    approved: mockDecisions.filter(d => d.decision === "approved").length,
    rejected: mockDecisions.filter(d => d.decision === "rejected").length,
    deadlocked: mockDecisions.filter(d => d.decision === "deadlocked").length,
    avgConsensus: Math.round(mockDecisions.reduce((acc, d) => acc + d.consensusPercentage, 0) / mockDecisions.length),
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Decisions</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
            <p className="text-xs text-muted-foreground">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground">Rejected</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-yellow-500">{stats.deadlocked}</div>
            <p className="text-xs text-muted-foreground">Deadlocked</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{stats.avgConsensus}%</div>
            <p className="text-xs text-muted-foreground">Avg Consensus</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Council Decision History
          </CardTitle>
          <CardDescription>
            Browse and analyze past Byzantine Council voting sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by report title or session ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDecision} onValueChange={setFilterDecision}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Decision" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Decisions</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="deadlocked">Deadlocked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterFramework} onValueChange={setFilterFramework}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Framework" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Frameworks</SelectItem>
                <SelectItem value="EU AI Act">EU AI Act</SelectItem>
                <SelectItem value="NIST AI RMF">NIST AI RMF</SelectItem>
                <SelectItem value="ISO 42001">ISO 42001</SelectItem>
                <SelectItem value="IEEE 7000">IEEE 7000</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Decision Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Session</TableHead>
                  <TableHead>Report</TableHead>
                  <TableHead>Framework</TableHead>
                  <TableHead>Decision</TableHead>
                  <TableHead>Consensus</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDecisions.map((decision) => (
                  <TableRow key={decision.id}>
                    <TableCell className="font-mono text-sm">{decision.sessionId}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{decision.reportTitle}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{decision.framework}</Badge>
                    </TableCell>
                    <TableCell>{getDecisionBadge(decision.decision)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={decision.consensusPercentage} className="w-16 h-2" />
                        <span className="text-sm">{decision.consensusPercentage}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{decision.duration}s</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(decision.timestamp, "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedDecision(decision)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Council Decision Details</DialogTitle>
                            <DialogDescription>
                              Session {decision.sessionId}
                            </DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="max-h-[60vh]">
                            <div className="space-y-6 p-4">
                              {/* Decision Summary */}
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-semibold">{decision.reportTitle}</h3>
                                  <p className="text-sm text-muted-foreground">{decision.framework}</p>
                                </div>
                                {getDecisionBadge(decision.decision)}
                              </div>

                              {/* Voting Breakdown */}
                              <div className="grid grid-cols-3 gap-4">
                                <Card>
                                  <CardContent className="pt-4 text-center">
                                    <TrendingUp className="h-6 w-6 mx-auto text-green-500 mb-2" />
                                    <div className="text-2xl font-bold text-green-500">{decision.votesFor}</div>
                                    <p className="text-xs text-muted-foreground">Votes For</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-4 text-center">
                                    <TrendingDown className="h-6 w-6 mx-auto text-red-500 mb-2" />
                                    <div className="text-2xl font-bold text-red-500">{decision.votesAgainst}</div>
                                    <p className="text-xs text-muted-foreground">Votes Against</p>
                                  </CardContent>
                                </Card>
                                <Card>
                                  <CardContent className="pt-4 text-center">
                                    <Users className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                                    <div className="text-2xl font-bold">{decision.abstentions}</div>
                                    <p className="text-xs text-muted-foreground">Abstentions</p>
                                  </CardContent>
                                </Card>
                              </div>

                              {/* Key Findings */}
                              <div>
                                <h4 className="font-semibold mb-2">Key Findings</h4>
                                <ul className="space-y-2">
                                  {decision.keyFindings.map((finding, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <ChevronRight className="h-4 w-4 mt-0.5 text-primary" />
                                      {finding}
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Dissenter Reasons */}
                              {decision.dissenterReasons && decision.dissenterReasons.length > 0 && (
                                <div>
                                  <h4 className="font-semibold mb-2 text-yellow-500">Dissenting Opinions</h4>
                                  <ul className="space-y-2">
                                    {decision.dissenterReasons.map((reason, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                        <AlertTriangle className="h-4 w-4 mt-0.5 text-yellow-500" />
                                        {reason}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}

                              {/* Session Metadata */}
                              <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4" />
                                  {format(decision.timestamp, "PPpp")}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4" />
                                  Duration: {decision.duration}s
                                </div>
                              </div>
                            </div>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredDecisions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No decisions found matching your filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default CouncilDecisionHistory;
