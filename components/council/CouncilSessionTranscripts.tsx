/**
 * Council Session Transcripts Page
 * Displays detailed logs of Byzantine Council voting sessions for transparency
 */

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import {
  FileText,
  Search,
  Filter,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Users,
  ChevronRight,
  ChevronDown,
  Download,
  Eye,
  Shield,
  Scale,
  Brain,
  ArrowLeft,
  RefreshCw,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "@/components/DashboardLayout";
import { JoinCouncilCTA } from "@/components/JoinCouncilCTA";

// Helper to format dates
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Helper to format duration
const formatDuration = (ms: number | null) => {
  if (!ms) return "N/A";
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

// Decision badge component
const DecisionBadge = ({ decision }: { decision: string | null }) => {
  switch (decision) {
    case "approved":
      return (
        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/30">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Approved
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/30">
          <XCircle className="h-3 w-3 mr-1" />
          Rejected
        </Badge>
      );
    case "escalated":
      return (
        <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/30">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Escalated
        </Badge>
      );
    case "no_consensus":
      return (
        <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/30">
          <Clock className="h-3 w-3 mr-1" />
          No Consensus
        </Badge>
      );
    default:
      return (
        <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/30">
          <Clock className="h-3 w-3 mr-1" />
          In Progress
        </Badge>
      );
  }
};

// Subject type badge
const SubjectTypeBadge = ({ type }: { type: string }) => {
  const config: Record<string, { icon: any; color: string; label: string }> = {
    watchdog_report: { icon: Eye, color: "purple", label: "Watchdog Report" },
    assessment: { icon: FileText, color: "blue", label: "Assessment" },
    policy_proposal: { icon: Scale, color: "emerald", label: "Policy Proposal" },
    system_review: { icon: Shield, color: "amber", label: "System Review" },
  };
  
  const { icon: Icon, color, label } = config[type] || { icon: FileText, color: "gray", label: type };
  
  return (
    <Badge className={`bg-${color}-500/10 text-${color}-600 border-${color}-500/30`}>
      <Icon className="h-3 w-3 mr-1" />
      {label}
    </Badge>
  );
};

// Transcript detail modal
function TranscriptDetailModal({ transcriptId }: { transcriptId: number }) {
  const { data: transcript, isLoading: loadingTranscript } = trpc.councilTranscripts.getById.useQuery({ id: transcriptId });
  const { data: votes, isLoading: loadingVotes } = trpc.councilTranscripts.getVotes.useQuery({ transcriptId });
  const { data: events, isLoading: loadingEvents } = trpc.councilTranscripts.getEvents.useQuery({ transcriptId });

  if (loadingTranscript || loadingVotes || loadingEvents) {
    return (
      <div className="flex items-center justify-center py-12">
        <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!transcript) {
    return <div className="text-center py-12 text-muted-foreground">Transcript not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <SubjectTypeBadge type={transcript.subject_type} />
          <DecisionBadge decision={transcript.final_decision} />
        </div>
        <h3 className="text-xl font-bold">{transcript.subject_title}</h3>
        {transcript.subject_description && (
          <p className="text-muted-foreground">{transcript.subject_description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{transcript.approve_votes}</p>
            <p className="text-xs text-muted-foreground">Approve</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{transcript.reject_votes}</p>
            <p className="text-xs text-muted-foreground">Reject</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{transcript.escalate_votes}</p>
            <p className="text-xs text-muted-foreground">Escalate</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{formatDuration(transcript.duration_ms)}</p>
            <p className="text-xs text-muted-foreground">Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Vote Progress */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Vote Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-emerald-600">Approve</span>
              <span>{transcript.approve_votes}/{transcript.total_agents}</span>
            </div>
            <Progress value={(transcript.approve_votes / transcript.total_agents) * 100} className="h-2 bg-emerald-100" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-red-600">Reject</span>
              <span>{transcript.reject_votes}/{transcript.total_agents}</span>
            </div>
            <Progress value={(transcript.reject_votes / transcript.total_agents) * 100} className="h-2 bg-red-100" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-600">Escalate</span>
              <span>{transcript.escalate_votes}/{transcript.total_agents}</span>
            </div>
            <Progress value={(transcript.escalate_votes / transcript.total_agents) * 100} className="h-2 bg-amber-100" />
          </div>
        </CardContent>
      </Card>

      {/* Tabs for Votes and Events */}
      <Tabs defaultValue="votes">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="votes">Agent Votes ({votes?.length || 0})</TabsTrigger>
          <TabsTrigger value="events">Timeline ({events?.length || 0})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="votes">
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {votes?.map((vote: any) => (
                <Card key={vote.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        vote.agent_type === 'guardian' ? 'bg-emerald-500/10' :
                        vote.agent_type === 'arbiter' ? 'bg-purple-500/10' : 'bg-blue-500/10'
                      }`}>
                        {vote.agent_type === 'guardian' ? <Shield className="h-5 w-5 text-emerald-600" /> :
                         vote.agent_type === 'arbiter' ? <Scale className="h-5 w-5 text-purple-600" /> :
                         <FileText className="h-5 w-5 text-blue-600" />}
                      </div>
                      <div>
                        <p className="font-medium">{vote.agent_name}</p>
                        <p className="text-xs text-muted-foreground">{vote.agent_provider} • {vote.agent_type}</p>
                      </div>
                    </div>
                    <Badge className={
                      vote.vote === 'approve' ? 'bg-emerald-500/10 text-emerald-600' :
                      vote.vote === 'reject' ? 'bg-red-500/10 text-red-600' :
                      'bg-amber-500/10 text-amber-600'
                    }>
                      {vote.vote}
                    </Badge>
                  </div>
                  {vote.reasoning && (
                    <p className="mt-3 text-sm text-muted-foreground">{vote.reasoning}</p>
                  )}
                  {vote.confidence && (
                    <div className="mt-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Confidence:</span>
                      <Progress value={vote.confidence * 100} className="h-1.5 w-20" />
                      <span className="text-xs font-medium">{(vote.confidence * 100).toFixed(0)}%</span>
                    </div>
                  )}
                </Card>
              ))}
              {(!votes || votes.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No votes recorded yet
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        
        <TabsContent value="events">
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {events?.map((event: any, idx: number) => (
                <div key={event.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full ${
                      event.event_type === 'session_started' ? 'bg-blue-500' :
                      event.event_type === 'session_completed' ? 'bg-emerald-500' :
                      event.event_type === 'error_occurred' ? 'bg-red-500' :
                      'bg-gray-400'
                    }`} />
                    {idx < (events?.length || 0) - 1 && <div className="w-0.5 h-full bg-gray-200 mt-1" />}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{event.event_type.replace(/_/g, ' ')}</p>
                      <span className="text-xs text-muted-foreground">{formatDate(event.occurred_at)}</span>
                    </div>
                    {event.event_description && (
                      <p className="text-sm text-muted-foreground mt-1">{event.event_description}</p>
                    )}
                    {event.actor_name && (
                      <p className="text-xs text-muted-foreground mt-1">By: {event.actor_name}</p>
                    )}
                  </div>
                </div>
              ))}
              {(!events || events.length === 0) && (
                <div className="text-center py-8 text-muted-foreground">
                  No events recorded yet
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Human Review Section */}
      {transcript.human_review_required === 'yes' && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-amber-600" />
              Human Review
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transcript.human_reviewer_name ? (
              <div className="space-y-2">
                <p className="text-sm">Reviewed by: <strong>{transcript.human_reviewer_name}</strong></p>
                {transcript.human_decision && (
                  <p className="text-sm text-muted-foreground">{transcript.human_decision}</p>
                )}
                {transcript.human_reviewed_at && (
                  <p className="text-xs text-muted-foreground">Reviewed at: {formatDate(transcript.human_reviewed_at)}</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-amber-600">Awaiting human review</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function CouncilSessionTranscripts() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [subjectType, setSubjectType] = useState<string | undefined>();
  const [finalDecision, setFinalDecision] = useState<string | undefined>();
  const [selectedTranscript, setSelectedTranscript] = useState<number | null>(null);

  // Fetch transcripts
  const { data, isLoading, refetch } = trpc.councilTranscripts.list.useQuery({
    page,
    limit: 10,
    search: search || undefined,
    subjectType: subjectType as any,
    finalDecision: finalDecision as any,
  });

  // Fetch stats
  const { data: stats } = trpc.councilTranscripts.getStats.useQuery();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-muted-foreground mb-2">
              <Link href="/agent-council">
                <Button variant="ghost" size="sm" className="gap-1">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Council
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold">Council Session Transcripts</h1>
            <p className="text-muted-foreground mt-1">
              Detailed logs of Byzantine Council voting sessions for transparency and audit
            </p>
          </div>
          <Button onClick={() => refetch()} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.total_sessions || 0}</p>
                  <p className="text-xs text-muted-foreground">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.approved_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Approved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.rejected_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Rejected</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats?.escalated_count || 0}</p>
                  <p className="text-xs text-muted-foreground">Escalated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <Select value={subjectType || "all"} onValueChange={(v) => setSubjectType(v === "all" ? undefined : v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Subject Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="watchdog_report">Watchdog Report</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="policy_proposal">Policy Proposal</SelectItem>
                  <SelectItem value="system_review">System Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={finalDecision || "all"} onValueChange={(v) => setFinalDecision(v === "all" ? undefined : v)}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Decision" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Decisions</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                  <SelectItem value="no_consensus">No Consensus</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Transcripts List */}
        <Card>
          <CardHeader>
            <CardTitle>Session Transcripts</CardTitle>
            <CardDescription>
              {data?.pagination.total || 0} sessions found
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : data?.transcripts && data.transcripts.length > 0 ? (
              <div className="space-y-3">
                {data.transcripts.map((transcript: any) => (
                  <motion.div
                    key={transcript.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedTranscript(transcript.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <SubjectTypeBadge type={transcript.subject_type} />
                          <DecisionBadge decision={transcript.final_decision} />
                          {transcript.consensus_reached === 'yes' && (
                            <Badge variant="outline" className="text-emerald-600 border-emerald-500/30">
                              Consensus
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-semibold">{transcript.subject_title}</h3>
                        {transcript.subject_description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {transcript.subject_description}
                          </p>
                        )}
                      </div>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                    
                    <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{transcript.voting_agents}/{transcript.total_agents} votes</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(transcript.duration_ms)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDate(transcript.created_at)}</span>
                      </div>
                    </div>
                    
                    {/* Vote summary bar */}
                    <div className="mt-3 flex h-2 rounded-full overflow-hidden bg-gray-100">
                      <div
                        className="bg-emerald-500"
                        style={{ width: `${(transcript.approve_votes / transcript.total_agents) * 100}%` }}
                      />
                      <div
                        className="bg-red-500"
                        style={{ width: `${(transcript.reject_votes / transcript.total_agents) * 100}%` }}
                      />
                      <div
                        className="bg-amber-500"
                        style={{ width: `${(transcript.escalate_votes / transcript.total_agents) * 100}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No transcripts found</h3>
                <p className="text-sm text-muted-foreground">
                  Council session transcripts will appear here after voting sessions are completed.
                </p>
              </div>
            )}

            {/* Pagination */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground">
                  Page {data.pagination.page} of {data.pagination.totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                    disabled={page === data.pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Join Council CTA */}
        <JoinCouncilCTA variant="banner" />

        {/* Transcript Detail Dialog */}
        <Dialog open={selectedTranscript !== null} onOpenChange={(open) => !open && setSelectedTranscript(null)}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Session Transcript Details</DialogTitle>
            </DialogHeader>
            {selectedTranscript && <TranscriptDetailModal transcriptId={selectedTranscript} />}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
