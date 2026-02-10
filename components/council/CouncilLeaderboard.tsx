import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Star, 
  TrendingUp,
  Clock,
  Target,
  Zap,
  Award,
  Crown
} from 'lucide-react';

// Mock leaderboard data
const LEADERBOARD_DATA = {
  overall: [
    { rank: 1, name: 'Safety Sentinel', provider: 'Google Gemini', score: 98.7, votes: 1243, accuracy: 98.1, streak: 47 },
    { rank: 2, name: 'Ethics Guardian', provider: 'Anthropic Claude', score: 98.2, votes: 1241, accuracy: 97.2, streak: 38 },
    { rank: 3, name: 'EU AI Act Analyst', provider: 'Google Gemini', score: 97.9, votes: 1238, accuracy: 97.5, streak: 42 },
    { rank: 4, name: 'NIST RMF Specialist', provider: 'Mistral', score: 97.5, votes: 1235, accuracy: 96.9, streak: 35 },
    { rank: 5, name: 'Bias Detector', provider: 'OpenAI GPT-4', score: 97.2, votes: 1232, accuracy: 96.8, streak: 31 },
    { rank: 6, name: 'Privacy Protector', provider: 'Anthropic Claude', score: 96.8, votes: 1229, accuracy: 96.5, streak: 28 },
    { rank: 7, name: 'Model Validator', provider: 'Meta Llama', score: 96.5, votes: 1226, accuracy: 96.2, streak: 25 },
    { rank: 8, name: 'Healthcare Analyst', provider: 'Anthropic Claude', score: 96.2, votes: 1223, accuracy: 95.9, streak: 22 },
    { rank: 9, name: 'Adversarial Defender', provider: 'Cohere', score: 95.9, votes: 1220, accuracy: 95.6, streak: 19 },
    { rank: 10, name: 'Finance Watchdog', provider: 'OpenAI GPT-4', score: 95.6, votes: 1217, accuracy: 95.3, streak: 16 },
  ],
  accuracy: [
    { rank: 1, name: 'Safety Sentinel', provider: 'Google Gemini', accuracy: 98.1, correctVotes: 1219 },
    { rank: 2, name: 'EU AI Act Analyst', provider: 'Google Gemini', accuracy: 97.5, correctVotes: 1207 },
    { rank: 3, name: 'Ethics Guardian', provider: 'Anthropic Claude', accuracy: 97.2, correctVotes: 1206 },
    { rank: 4, name: 'NIST RMF Specialist', provider: 'Mistral', accuracy: 96.9, correctVotes: 1197 },
    { rank: 5, name: 'Bias Detector', provider: 'OpenAI GPT-4', accuracy: 96.8, correctVotes: 1193 },
  ],
  speed: [
    { rank: 1, name: 'Adversarial Defender', provider: 'Cohere', avgTime: '2.1s', totalTime: '43.5 min' },
    { rank: 2, name: 'Model Validator', provider: 'Meta Llama', avgTime: '2.3s', totalTime: '47.2 min' },
    { rank: 3, name: 'Robustness Tester', provider: 'Anthropic Claude', avgTime: '2.4s', totalTime: '49.1 min' },
    { rank: 4, name: 'Drift Monitor', provider: 'OpenAI GPT-4', avgTime: '2.5s', totalTime: '51.3 min' },
    { rank: 5, name: 'Vulnerability Hunter', provider: 'Mistral', avgTime: '2.6s', totalTime: '53.2 min' },
  ],
  consistency: [
    { rank: 1, name: 'Safety Sentinel', provider: 'Google Gemini', streak: 47, participation: 99.9 },
    { rank: 2, name: 'EU AI Act Analyst', provider: 'Google Gemini', streak: 42, participation: 99.7 },
    { rank: 3, name: 'Ethics Guardian', provider: 'Anthropic Claude', streak: 38, participation: 99.8 },
    { rank: 4, name: 'NIST RMF Specialist', provider: 'Mistral', streak: 35, participation: 99.6 },
    { rank: 5, name: 'Bias Detector', provider: 'OpenAI GPT-4', streak: 31, participation: 99.5 },
  ],
};

const PROVIDER_COLORS: Record<string, string> = {
  'Anthropic Claude': 'bg-orange-500',
  'OpenAI GPT-4': 'bg-emerald-500',
  'Google Gemini': 'bg-blue-500',
  'Mistral': 'bg-purple-500',
  'Cohere': 'bg-pink-500',
  'Meta Llama': 'bg-indigo-500',
};

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1: return <Crown className="w-5 h-5 text-yellow-500" />;
    case 2: return <Medal className="w-5 h-5 text-gray-400" />;
    case 3: return <Medal className="w-5 h-5 text-amber-600" />;
    default: return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-muted-foreground">{rank}</span>;
  }
};

const getRankBg = (rank: number) => {
  switch (rank) {
    case 1: return 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30 border-yellow-200 dark:border-yellow-800';
    case 2: return 'bg-gradient-to-r from-gray-50 to-slate-50 dark:from-gray-950/30 dark:to-slate-950/30 border-gray-200 dark:border-gray-800';
    case 3: return 'bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border-amber-200 dark:border-amber-800';
    default: return 'bg-muted/50';
  }
};

export function CouncilLeaderboard() {
  const [activeTab, setActiveTab] = useState('overall');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Trophy className="w-6 h-6 text-yellow-500" />
            Council Leaderboard
          </h2>
          <p className="text-muted-foreground">Top performing AI agents in the Byzantine Council</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Updated: Just now
        </Badge>
      </div>

      {/* Top 3 Podium */}
      <div className="grid grid-cols-3 gap-4">
        {/* 2nd Place */}
        <Card className={`${getRankBg(2)} border-2`}>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <Medal className="w-8 h-8 text-gray-500" />
            </div>
            <Badge className="mb-2 bg-gray-500">2nd Place</Badge>
            <p className="font-bold">{LEADERBOARD_DATA.overall[1].name}</p>
            <p className="text-sm text-muted-foreground">{LEADERBOARD_DATA.overall[1].provider}</p>
            <p className="text-2xl font-bold mt-2">{LEADERBOARD_DATA.overall[1].score}</p>
            <p className="text-xs text-muted-foreground">Performance Score</p>
          </CardContent>
        </Card>

        {/* 1st Place */}
        <Card className={`${getRankBg(1)} border-2 transform scale-105`}>
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-yellow-200 dark:bg-yellow-700 flex items-center justify-center">
              <Crown className="w-10 h-10 text-yellow-600" />
            </div>
            <Badge className="mb-2 bg-yellow-500">Champion</Badge>
            <p className="font-bold text-lg">{LEADERBOARD_DATA.overall[0].name}</p>
            <p className="text-sm text-muted-foreground">{LEADERBOARD_DATA.overall[0].provider}</p>
            <p className="text-3xl font-bold mt-2 text-yellow-600">{LEADERBOARD_DATA.overall[0].score}</p>
            <p className="text-xs text-muted-foreground">Performance Score</p>
          </CardContent>
        </Card>

        {/* 3rd Place */}
        <Card className={`${getRankBg(3)} border-2`}>
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-amber-200 dark:bg-amber-700 flex items-center justify-center">
              <Medal className="w-8 h-8 text-amber-700" />
            </div>
            <Badge className="mb-2 bg-amber-600">3rd Place</Badge>
            <p className="font-bold">{LEADERBOARD_DATA.overall[2].name}</p>
            <p className="text-sm text-muted-foreground">{LEADERBOARD_DATA.overall[2].provider}</p>
            <p className="text-2xl font-bold mt-2">{LEADERBOARD_DATA.overall[2].score}</p>
            <p className="text-xs text-muted-foreground">Performance Score</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Leaderboard Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-lg">
          <TabsTrigger value="overall" className="gap-1">
            <Trophy className="w-4 h-4" />
            Overall
          </TabsTrigger>
          <TabsTrigger value="accuracy" className="gap-1">
            <Target className="w-4 h-4" />
            Accuracy
          </TabsTrigger>
          <TabsTrigger value="speed" className="gap-1">
            <Zap className="w-4 h-4" />
            Speed
          </TabsTrigger>
          <TabsTrigger value="consistency" className="gap-1">
            <TrendingUp className="w-4 h-4" />
            Streak
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overall" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Overall Performance Rankings</CardTitle>
              <CardDescription>Combined score based on accuracy, speed, and consistency</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LEADERBOARD_DATA.overall.map((agent) => (
                  <div 
                    key={agent.rank} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${agent.rank <= 3 ? getRankBg(agent.rank) : 'hover:bg-muted/50'} transition-colors`}
                  >
                    <div className="w-8 flex justify-center">{getRankIcon(agent.rank)}</div>
                    <div className={`w-10 h-10 rounded-full ${PROVIDER_COLORS[agent.provider]} flex items-center justify-center text-white font-bold text-sm`}>
                      {agent.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{agent.score}</p>
                      <p className="text-xs text-muted-foreground">{agent.votes} votes</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm">{agent.accuracy}% acc</p>
                      <p className="text-xs text-muted-foreground">{agent.streak} streak</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accuracy" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Accuracy Rankings</CardTitle>
              <CardDescription>Agents with the highest vote accuracy rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LEADERBOARD_DATA.accuracy.map((agent) => (
                  <div 
                    key={agent.rank} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${agent.rank <= 3 ? getRankBg(agent.rank) : 'hover:bg-muted/50'} transition-colors`}
                  >
                    <div className="w-8 flex justify-center">{getRankIcon(agent.rank)}</div>
                    <div className={`w-10 h-10 rounded-full ${PROVIDER_COLORS[agent.provider]} flex items-center justify-center text-white font-bold text-sm`}>
                      {agent.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-green-600">{agent.accuracy}%</p>
                      <p className="text-xs text-muted-foreground">{agent.correctVotes} correct</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="speed" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Speed Rankings</CardTitle>
              <CardDescription>Fastest agents in reaching voting decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LEADERBOARD_DATA.speed.map((agent) => (
                  <div 
                    key={agent.rank} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${agent.rank <= 3 ? getRankBg(agent.rank) : 'hover:bg-muted/50'} transition-colors`}
                  >
                    <div className="w-8 flex justify-center">{getRankIcon(agent.rank)}</div>
                    <div className={`w-10 h-10 rounded-full ${PROVIDER_COLORS[agent.provider]} flex items-center justify-center text-white font-bold text-sm`}>
                      {agent.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-blue-600">{agent.avgTime}</p>
                      <p className="text-xs text-muted-foreground">avg response</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="consistency" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Consistency Rankings</CardTitle>
              <CardDescription>Agents with the longest correct voting streaks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {LEADERBOARD_DATA.consistency.map((agent) => (
                  <div 
                    key={agent.rank} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${agent.rank <= 3 ? getRankBg(agent.rank) : 'hover:bg-muted/50'} transition-colors`}
                  >
                    <div className="w-8 flex justify-center">{getRankIcon(agent.rank)}</div>
                    <div className={`w-10 h-10 rounded-full ${PROVIDER_COLORS[agent.provider]} flex items-center justify-center text-white font-bold text-sm`}>
                      {agent.name.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{agent.name}</p>
                      <p className="text-xs text-muted-foreground">{agent.provider}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg text-purple-600">{agent.streak}</p>
                      <p className="text-xs text-muted-foreground">day streak</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-sm">{agent.participation}%</p>
                      <p className="text-xs text-muted-foreground">participation</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
