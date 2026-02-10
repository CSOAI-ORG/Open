import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart,
  Calendar,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download
} from 'lucide-react';

// Mock analytics data
const ANALYTICS_DATA = {
  overview: {
    totalSessions: 1247,
    avgConsensusTime: '4.2 min',
    avgConsensusRate: 94.7,
    totalVotesCast: 41151,
  },
  monthlyTrend: [
    { month: 'Aug', sessions: 156, consensusRate: 92.3 },
    { month: 'Sep', sessions: 178, consensusRate: 93.8 },
    { month: 'Oct', sessions: 201, consensusRate: 94.1 },
    { month: 'Nov', sessions: 223, consensusRate: 95.2 },
    { month: 'Dec', sessions: 245, consensusRate: 94.9 },
    { month: 'Jan', sessions: 244, consensusRate: 94.7 },
  ],
  decisionBreakdown: {
    approved: 847,
    rejected: 289,
    conditional: 98,
    deadlocked: 13,
  },
  categoryBreakdown: [
    { category: 'Model Deployment', count: 412, avgTime: '3.8 min' },
    { category: 'Healthcare AI', count: 234, avgTime: '5.1 min' },
    { category: 'Financial AI', count: 198, avgTime: '4.5 min' },
    { category: 'Transportation', count: 156, avgTime: '6.2 min' },
    { category: 'Education', count: 134, avgTime: '3.2 min' },
    { category: 'Other', count: 113, avgTime: '4.0 min' },
  ],
  agentPerformance: [
    { agent: 'Ethics Guardian', accuracy: 97.2, participation: 99.8 },
    { agent: 'Bias Detector', accuracy: 96.8, participation: 99.5 },
    { agent: 'Safety Sentinel', accuracy: 98.1, participation: 99.9 },
    { agent: 'EU AI Act Analyst', accuracy: 97.5, participation: 99.7 },
    { agent: 'NIST RMF Specialist', accuracy: 96.9, participation: 99.6 },
  ],
  riskDistribution: {
    low: 423,
    medium: 512,
    high: 234,
    critical: 78,
  }
};

export function CouncilVotingAnalytics() {
  const [timeRange, setTimeRange] = useState('6m');

  const total = Object.values(ANALYTICS_DATA.decisionBreakdown).reduce((a, b) => a + b, 0);
  const approvalRate = ((ANALYTICS_DATA.decisionBreakdown.approved / total) * 100).toFixed(1);

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{ANALYTICS_DATA.overview.totalSessions.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
              </div>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+12.3% from last period</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{ANALYTICS_DATA.overview.avgConsensusTime}</p>
                <p className="text-sm text-muted-foreground">Avg Decision Time</p>
              </div>
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingDown className="w-4 h-4" />
              <span>-8.2% faster</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{ANALYTICS_DATA.overview.avgConsensusRate}%</p>
                <p className="text-sm text-muted-foreground">Consensus Rate</p>
              </div>
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
              <TrendingUp className="w-4 h-4" />
              <span>+1.2% improvement</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{ANALYTICS_DATA.overview.totalVotesCast.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Votes Cast</p>
              </div>
              <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
                <PieChart className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <span>33 agents × {ANALYTICS_DATA.overview.totalSessions} sessions</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Voting Analytics</h3>
        <div className="flex items-center gap-2">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Decision Breakdown */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Decision Breakdown</CardTitle>
            <CardDescription>Distribution of council decisions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Visual Bar */}
              <div className="h-8 rounded-full overflow-hidden flex">
                <div 
                  className="bg-green-500 h-full" 
                  style={{ width: `${(ANALYTICS_DATA.decisionBreakdown.approved / total) * 100}%` }}
                  title={`Approved: ${ANALYTICS_DATA.decisionBreakdown.approved}`}
                />
                <div 
                  className="bg-red-500 h-full" 
                  style={{ width: `${(ANALYTICS_DATA.decisionBreakdown.rejected / total) * 100}%` }}
                  title={`Rejected: ${ANALYTICS_DATA.decisionBreakdown.rejected}`}
                />
                <div 
                  className="bg-yellow-500 h-full" 
                  style={{ width: `${(ANALYTICS_DATA.decisionBreakdown.conditional / total) * 100}%` }}
                  title={`Conditional: ${ANALYTICS_DATA.decisionBreakdown.conditional}`}
                />
                <div 
                  className="bg-gray-400 h-full" 
                  style={{ width: `${(ANALYTICS_DATA.decisionBreakdown.deadlocked / total) * 100}%` }}
                  title={`Deadlocked: ${ANALYTICS_DATA.decisionBreakdown.deadlocked}`}
                />
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-sm">Approved</span>
                  <span className="text-sm font-bold ml-auto">{ANALYTICS_DATA.decisionBreakdown.approved}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-sm">Rejected</span>
                  <span className="text-sm font-bold ml-auto">{ANALYTICS_DATA.decisionBreakdown.rejected}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-sm">Conditional</span>
                  <span className="text-sm font-bold ml-auto">{ANALYTICS_DATA.decisionBreakdown.conditional}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400 rounded-full" />
                  <span className="text-sm">Deadlocked</span>
                  <span className="text-sm font-bold ml-auto">{ANALYTICS_DATA.decisionBreakdown.deadlocked}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <p className="text-center">
                  <span className="text-3xl font-bold text-green-600">{approvalRate}%</span>
                  <span className="text-muted-foreground ml-2">Approval Rate</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Level Distribution</CardTitle>
            <CardDescription>Cases by assessed risk level</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(ANALYTICS_DATA.riskDistribution).map(([level, count]) => {
                const colors: Record<string, string> = {
                  low: 'bg-green-500',
                  medium: 'bg-yellow-500',
                  high: 'bg-orange-500',
                  critical: 'bg-red-500',
                };
                const percentage = ((count / total) * 100).toFixed(1);
                return (
                  <div key={level} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{level} Risk</span>
                      <span className="font-medium">{count} ({percentage}%)</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${colors[level]} rounded-full transition-all`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Cases by Category</CardTitle>
          <CardDescription>Distribution of council sessions across AI application domains</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ANALYTICS_DATA.categoryBreakdown.map((cat) => (
              <div key={cat.category} className="text-center p-4 rounded-lg bg-muted/50">
                <p className="text-2xl font-bold">{cat.count}</p>
                <p className="text-sm font-medium truncate">{cat.category}</p>
                <p className="text-xs text-muted-foreground">Avg: {cat.avgTime}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Trend</CardTitle>
          <CardDescription>Session volume and consensus rate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Simple bar chart representation */}
            <div className="flex items-end gap-2 h-40">
              {ANALYTICS_DATA.monthlyTrend.map((month) => (
                <div key={month.month} className="flex-1 flex flex-col items-center gap-1">
                  <div 
                    className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                    style={{ height: `${(month.sessions / 250) * 100}%` }}
                    title={`${month.sessions} sessions`}
                  />
                  <span className="text-xs text-muted-foreground">{month.month}</span>
                </div>
              ))}
            </div>
            
            {/* Consensus rate line */}
            <div className="flex items-center justify-between text-sm">
              {ANALYTICS_DATA.monthlyTrend.map((month) => (
                <div key={month.month} className="text-center">
                  <Badge variant={month.consensusRate >= 94 ? 'default' : 'secondary'}>
                    {month.consensusRate}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top Performing Agents */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Agents</CardTitle>
          <CardDescription>Agent accuracy and participation rates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {ANALYTICS_DATA.agentPerformance.map((agent, index) => (
              <div key={agent.agent} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{agent.agent}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      {agent.accuracy}% accuracy
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-blue-500" />
                      {agent.participation}% participation
                    </span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Top Performer
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
