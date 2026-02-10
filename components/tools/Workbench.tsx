                    <div>
                      <Badge className={severityColors[selectedCase.report?.severity || "medium"]} variant="secondary">
                        {selectedCase.report?.severity || "medium"} severity
                      </Badge>
                      <CardTitle className="mt-2">{selectedCase.report?.title}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Reported by user • {selectedCase.report?.companyName || "Unknown Company"}
                      </p>
                    </div>
                    <Badge variant="outline" className="gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeRemaining(selectedCase.assignment?.dueAt)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Incident Description */}
                  <div>
                    <h4 className="font-medium mb-2">Incident Description</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-4 rounded-lg">
                      {selectedCase.report?.description || "No description provided."}
                    </p>
                  </div>

                  {/* Council Votes */}
                  {selectedCase.councilVotes && selectedCase.councilVotes.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-3">33-Agent Council Votes</h4>
                      <div className="space-y-2">
                        {(() => {
                          const approveCount = selectedCase.councilVotes.filter(v => v.vote === "approve").length;
                          const rejectCount = selectedCase.councilVotes.filter(v => v.vote === "reject").length;
                          const escalateCount = selectedCase.councilVotes.filter(v => v.vote === "escalate").length;
                          const total = selectedCase.councilVotes.length || 33;
                          
                          return (
                            <>
                              <div className="flex items-center gap-3">
                                <span className="text-sm w-20">Approve</span>
                                <Progress value={(approveCount / total) * 100} className="flex-1 h-2" />
                                <span className="text-sm text-muted-foreground w-8">{approveCount}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm w-20">Reject</span>
                                <Progress value={(rejectCount / total) * 100} className="flex-1 h-2" />
                                <span className="text-sm text-muted-foreground w-8">{rejectCount}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-sm w-20">Escalate</span>
                                <Progress value={(escalateCount / total) * 100} className="flex-1 h-2" />
                                <span className="text-sm text-muted-foreground w-8">{escalateCount}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        No consensus reached (22/33 required). Human review needed.
                      </p>
                    </div>
                  )}

                  {/* Your Decision */}
                  <div>
                    <h4 className="font-medium mb-3">Your Decision</h4>
                    <div className="grid grid-cols-4 gap-3 mb-4">
                      <Button
                        variant={decision === "approve" ? "default" : "outline"}
                        className={`flex-col h-auto py-4 ${
                          decision === "approve" ? "bg-green-600 hover:bg-green-700" : ""
                        }`}
                        onClick={() => setDecision("approve")}
                      >
                        <ThumbsUp className="h-5 w-5 mb-1" />
                        <span className="text-xs">Approve</span>
                      </Button>
                      <Button
                        variant={decision === "reject" ? "default" : "outline"}
                        className={`flex-col h-auto py-4 ${
                          decision === "reject" ? "bg-red-600 hover:bg-red-700" : ""
                        }`}
                        onClick={() => setDecision("reject")}
                      >
                        <ThumbsDown className="h-5 w-5 mb-1" />
                        <span className="text-xs">Reject</span>
                      </Button>
                      <Button
                        variant={decision === "escalate" ? "default" : "outline"}
                        className={`flex-col h-auto py-4 ${
                          decision === "escalate" ? "bg-orange-600 hover:bg-orange-700" : ""
                        }`}
                        onClick={() => setDecision("escalate")}
                      >
                        <ArrowUpRight className="h-5 w-5 mb-1" />
                        <span className="text-xs">Escalate</span>
                      </Button>
                      <Button
                        variant={decision === "needs_more_info" ? "default" : "outline"}
                        className={`flex-col h-auto py-4 ${
                          decision === "needs_more_info" ? "bg-emerald-600 hover:bg-emerald-700" : ""
                        }`}
                        onClick={() => setDecision("needs_more_info")}
                      >
                        <HelpCircle className="h-5 w-5 mb-1" />
                        <span className="text-xs">Need Info</span>
                      </Button>
                    </div>

                    <div className="mb-4">
                      <label className="text-sm font-medium mb-2 block">Confidence Level</label>
                      <Select value={confidence} onValueChange={setConfidence}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Confidence</SelectItem>
                          <SelectItem value="medium">Medium Confidence</SelectItem>
                          <SelectItem value="high">High Confidence</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Textarea
                      placeholder="Provide your reasoning for this decision (minimum 50 characters)..."
                      value={reasoning}
                      onChange={(e) => setReasoning(e.target.value)}
                      className="min-h-[100px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {reasoning.length}/50 characters minimum
                    </p>
                  </div>

                  {/* Submit */}
                  <Button 
                    data-testid="workbench-submit-decision-button"
                    className="w-full" 
                    size="lg"
                    onClick={handleSubmitDecision}
                    disabled={!decision || reasoning.length < 50 || submitDecisionMutation.isPending}
                  >
                    {submitDecisionMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Submit Decision
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-full flex items-center justify-center">
                <CardContent className="text-center py-12">
                  <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="font-medium text-lg mb-2">Select a Case to Review</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose a case from the queue to view details and submit your decision
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
