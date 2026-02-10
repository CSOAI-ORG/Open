                    
                    {/* Vote Distribution */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-16 text-emerald-600 font-medium">Approve</span>
                        <Progress 
                          value={(session.approveVotes / 33) * 100} 
                          className="h-2 flex-1" 
                        />
                        <span className="w-8 text-right font-medium">{session.approveVotes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-16 text-red-600 font-medium">Reject</span>
                        <Progress 
                          value={(session.rejectVotes / 33) * 100} 
                          className="h-2 flex-1" 
                        />
                        <span className="w-8 text-right font-medium">{session.rejectVotes}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="w-16 text-amber-600 font-medium">Escalate</span>
                        <Progress 
                          value={(session.escalateVotes / 33) * 100} 
                          className="h-2 flex-1" 
                        />
                        <span className="w-8 text-right font-medium">{session.escalateVotes}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Total votes: {session.totalVotes}/33</span>
                      <span>Consensus threshold: 67% (22 votes)</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="font-medium mb-2">No voting sessions yet</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Trigger a council vote to see the 33-agent Byzantine consensus in action.
                </p>
                <Button onClick={() => setIsVoteDialogOpen(true)}>
                  <Zap className="h-4 w-4 mr-2" />
                  Start First Vote
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}