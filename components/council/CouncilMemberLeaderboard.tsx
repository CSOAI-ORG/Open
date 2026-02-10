import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp, 
  Target,
  Brain,
  Shield,
  Zap,
  Award,
  ChevronUp,
  ChevronDown,
  Minus
} from "lucide-react";

interface CouncilMember {
  id: number;
  name: string;
  avatar?: string;
  role: string;
  specialty: string;
  stats: {
    totalVotes: number;
    accuracyRate: number;
    consensusAlignment: number;
    responseTime: number; // average in seconds
    dissentsExplained: number;
    impactScore: number;
  };
  rank: number;
  previousRank: number;
  badges: string[];
  isAI: boolean;
}

// Mock data for demonstration
const mockMembers: CouncilMember[] = [
  {
    id: 1,
    name: "Agent Alpha",
    role: "Lead Compliance Analyst",
    specialty: "EU AI Act",
    stats: {
      totalVotes: 1247,
      accuracyRate: 98.2,
      consensusAlignment: 94.5,
      responseTime: 2.3,
      dissentsExplained: 156,
      impactScore: 9.8,
    },
    rank: 1,
    previousRank: 1,
    badges: ["Top Performer", "Consensus Builder", "Speed Demon"],
    isAI: true,
  },
  {
    id: 2,
    name: "Agent Beta",
    role: "Risk Assessment Specialist",
    specialty: "NIST AI RMF",
    stats: {
      totalVotes: 1189,
      accuracyRate: 97.8,
      consensusAlignment: 92.1,
      responseTime: 2.8,
      dissentsExplained: 142,
      impactScore: 9.5,
    },
    rank: 2,
    previousRank: 3,
    badges: ["Rising Star", "Detail Oriented"],
    isAI: true,
  },
  {
    id: 3,
    name: "Agent Gamma",
    role: "Ethics Evaluator",
    specialty: "IEEE 7000",
    stats: {
      totalVotes: 1156,
      accuracyRate: 96.9,
      consensusAlignment: 91.8,
      responseTime: 3.1,
      dissentsExplained: 189,
      impactScore: 9.3,
    },
    rank: 3,
    previousRank: 2,
    badges: ["Ethical Guardian", "Thorough Analyst"],
    isAI: true,
  },
  {
    id: 4,
    name: "Dr. Sarah Chen",
    role: "Human Oversight",
    specialty: "Cross-Framework",
    stats: {
      totalVotes: 892,
      accuracyRate: 99.1,
      consensusAlignment: 88.4,
      responseTime: 45.2,
      dissentsExplained: 78,
      impactScore: 9.7,
    },
    rank: 4,
    previousRank: 4,
    badges: ["Human Expert", "Quality Assurance"],
    isAI: false,
  },
  {
    id: 5,
    name: "Agent Delta",
    role: "Security Analyst",
    specialty: "ISO 42001",
    stats: {
      totalVotes: 1098,
      accuracyRate: 95.6,
      consensusAlignment: 93.2,
      responseTime: 2.5,
      dissentsExplained: 134,
      impactScore: 9.1,
    },
    rank: 5,
    previousRank: 6,
    badges: ["Security Expert", "Fast Responder"],
    isAI: true,
  },
];

export function CouncilMemberLeaderboard() {
  const [selectedTab, setSelectedTab] = useState("overall");

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) {
      return <span className="flex items-center text-green-500 text-xs"><ChevronUp className="h-3 w-3" />{previous - current}</span>;
    } else if (current > previous) {
      return <span className="flex items-center text-red-500 text-xs"><ChevronDown className="h-3 w-3" />{current - previous}</span>;
    }
    return <span className="flex items-center text-muted-foreground text-xs"><Minus className="h-3 w-3" /></span>;
  };

  const getRankIcon = (rank: number): JSX.Element => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Medal className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const sortedByMetric = (metric: keyof CouncilMember["stats"]): CouncilMember[] => {
    return [...mockMembers].sort((a, b) => b.stats[metric] - a.stats[metric]);
  };

  return (
    <div className="space-y-6">
      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {mockMembers.slice(0, 3).map((member, index) => (
          <Card 
            key={member.id} 
            className={`relative overflow-hidden ${
              index === 0 ? "border-yellow-500/50 bg-yellow-500/5" :
              index === 1 ? "border-gray-400/50 bg-gray-400/5" :
              "border-amber-600/50 bg-amber-600/5"
            }`}
          >
            <div className="absolute top-2 right-2">
              {getRankIcon(member.rank)}
            </div>
            <CardContent className="pt-6 text-center">
              <Avatar className="h-16 w-16 mx-auto mb-3">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className={member.isAI ? "bg-primary/10" : "bg-secondary"}>
                  {member.isAI ? <Brain className="h-8 w-8" /> : member.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold">{member.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{member.specialty}</p>
              <div className="flex items-center justify-center gap-1 mb-3">
                {member.isAI ? (
                  <Badge variant="outline" className="text-xs"><Zap className="h-3 w-3 mr-1" />AI Agent</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs"><Shield className="h-3 w-3 mr-1" />Human</Badge>
                )}
              </div>
              <div className="text-2xl font-bold text-primary">{member.stats.impactScore}</div>
              <p className="text-xs text-muted-foreground">Impact Score</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Council Member Rankings
          </CardTitle>
          <CardDescription>
            Performance metrics and rankings for all 33 council members
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="overall">Overall</TabsTrigger>
              <TabsTrigger value="accuracy">Accuracy</TabsTrigger>
              <TabsTrigger value="consensus">Consensus</TabsTrigger>
              <TabsTrigger value="speed">Speed</TabsTrigger>
              <TabsTrigger value="impact">Impact</TabsTrigger>
            </TabsList>

            <TabsContent value="overall" className="space-y-4">
              {mockMembers.map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-2 w-16">
                    {getRankIcon(member.rank)}
                    {getRankChange(member.rank, member.previousRank)}
                  </div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={member.isAI ? "bg-primary/10" : "bg-secondary"}>
                      {member.isAI ? <Brain className="h-5 w-5" /> : member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium truncate">{member.name}</h4>
                      {member.isAI ? (
                        <Badge variant="outline" className="text-xs shrink-0"><Zap className="h-3 w-3" /></Badge>
                      ) : (
                        <Badge variant="secondary" className="text-xs shrink-0"><Shield className="h-3 w-3" /></Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{member.role} • {member.specialty}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-sm font-semibold">{member.stats.totalVotes}</div>
                      <div className="text-xs text-muted-foreground">Votes</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-green-500">{member.stats.accuracyRate}%</div>
                      <div className="text-xs text-muted-foreground">Accuracy</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold">{member.stats.consensusAlignment}%</div>
                      <div className="text-xs text-muted-foreground">Consensus</div>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary">{member.stats.impactScore}</div>
                      <div className="text-xs text-muted-foreground">Impact</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {member.badges.slice(0, 2).map((badge, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        <Star className="h-3 w-3 mr-1 text-yellow-500" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="accuracy" className="space-y-4">
              {sortedByMetric("accuracyRate").map((member, index) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="w-8 text-center font-bold text-muted-foreground">#{index + 1}</div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={member.isAI ? "bg-primary/10" : "bg-secondary"}>
                      {member.isAI ? <Brain className="h-5 w-5" /> : member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.specialty}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={member.stats.accuracyRate} className="w-32" />
                    <span className="text-lg font-bold text-green-500 w-16 text-right">
                      {member.stats.accuracyRate}%
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="consensus" className="space-y-4">
              {sortedByMetric("consensusAlignment").map((member, index) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="w-8 text-center font-bold text-muted-foreground">#{index + 1}</div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={member.isAI ? "bg-primary/10" : "bg-secondary"}>
                      {member.isAI ? <Brain className="h-5 w-5" /> : member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.specialty}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={member.stats.consensusAlignment} className="w-32" />
                    <span className="text-lg font-bold w-16 text-right">
                      {member.stats.consensusAlignment}%
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="speed" className="space-y-4">
              {sortedByMetric("responseTime").reverse().map((member, index) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="w-8 text-center font-bold text-muted-foreground">#{index + 1}</div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={member.isAI ? "bg-primary/10" : "bg-secondary"}>
                      {member.isAI ? <Brain className="h-5 w-5" /> : member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.specialty}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className={`h-4 w-4 ${member.stats.responseTime < 5 ? "text-green-500" : "text-muted-foreground"}`} />
                    <span className="text-lg font-bold w-16 text-right">
                      {member.stats.responseTime}s
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="impact" className="space-y-4">
              {sortedByMetric("impactScore").map((member, index) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="w-8 text-center font-bold text-muted-foreground">#{index + 1}</div>
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={member.isAI ? "bg-primary/10" : "bg-secondary"}>
                      {member.isAI ? <Brain className="h-5 w-5" /> : member.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-xs text-muted-foreground">{member.specialty}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={member.stats.impactScore * 10} className="w-32" />
                    <span className="text-lg font-bold text-primary w-16 text-right">
                      {member.stats.impactScore}
                    </span>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default CouncilMemberLeaderboard;
