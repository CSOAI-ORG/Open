  },
};

export function CouncilMemberCard({ member, isAnimating, currentVote }: CouncilMemberCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const config = agentTypeConfig[member.type];
  const Icon = config.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all duration-300 hover:shadow-lg",
          config.borderColor,
          isExpanded && "ring-2 ring-primary/20",
          isAnimating && currentVote && "animate-pulse"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardContent className="p-4">
          {/* Header - Always visible */}
          <div className="flex items-center gap-3">
            <div className={cn("p-2.5 rounded-xl", config.bgColor)}>
              <Icon className={cn("h-5 w-5", config.color)} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground truncate">{member.name}</h3>
                {currentVote && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className={cn("p-1 rounded-full", voteConfig[currentVote].bgColor)}
                  >
                    {(() => {
                      const VoteIcon = voteConfig[currentVote].icon;
                      return <VoteIcon className={cn("h-3 w-3", voteConfig[currentVote].color)} />;
                    })()}
                  </motion.div>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs font-normal">
                {member.provider}
              </Badge>
              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </div>
          </div>

          {/* Expanded Content */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-border space-y-4">
                  {/* Agent Details */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Brain className="h-3 w-3" /> Model
                      </p>
                      <p className="text-sm font-medium">{member.model}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Sparkles className="h-3 w-3" /> Specialty
                      </p>
                      <p className="text-sm font-medium">{member.specialty}</p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <p className="text-lg font-bold text-foreground">{member.totalVotes}</p>
                      <p className="text-xs text-muted-foreground">Total Votes</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <p className="text-lg font-bold text-emerald-600">{member.approvalRate}%</p>
                      <p className="text-xs text-muted-foreground">Approval Rate</p>
                    </div>
                    <div className="p-3 rounded-lg bg-secondary/50 text-center">
                      <p className="text-lg font-bold text-primary">{member.avgConfidence}%</p>
                      <p className="text-xs text-muted-foreground">Avg Confidence</p>
                    </div>
                  </div>

                  {/* Recent Voting History */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Recent Voting History
                    </h4>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {member.recentVotes.length > 0 ? (
                        member.recentVotes.map((vote, idx) => {
                          const voteInfo = voteConfig[vote.vote];
                          const VoteIcon = voteInfo.icon;
                          return (
                            <motion.div
                              key={vote.sessionId}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.05 }}
                              className="p-3 rounded-lg bg-secondary/30 space-y-2"
                            >
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium truncate">{vote.sessionTitle}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {new Date(vote.timestamp).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge className={cn("shrink-0", voteInfo.bgColor, voteInfo.color, "border-0")}>
                                  <VoteIcon className="h-3 w-3 mr-1" />
                                  {voteInfo.label}
                                </Badge>
                              </div>
                              
                              {/* Confidence bar */}
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground w-20">Confidence</span>
                                <Progress value={vote.confidence * 100} className="h-1.5 flex-1" />
                                <span className="text-xs font-medium w-10 text-right">
                                  {Math.round(vote.confidence * 100)}%
                                </span>
                              </div>

                              {/* Rationale */}
                              <p className="text-xs text-muted-foreground italic line-clamp-2">
                                "{vote.rationale}"