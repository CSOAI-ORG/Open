  // Fetch analytics data with filters
  const { data: incidentTrends, isLoading: incidentsLoading } = trpc.analytics.getIncidentTrends.useQuery({
    startDate,
    endDate,
    groupBy,
    aiSystemId: selectedAISystem !== 'all' ? parseInt(selectedAISystem) : undefined,
    incidentType: selectedIncidentType !== 'all' ? selectedIncidentType : undefined,
    severity: selectedSeverity !== 'all' ? selectedSeverity : undefined,
  });

  const { data: complianceHistory, isLoading: complianceLoading } = trpc.analytics.getComplianceHistory.useQuery({
    startDate,
    endDate,
    frameworkId: selectedFramework !== 'all' ? parseInt(selectedFramework) : undefined,
    aiSystemId: selectedAISystem !== 'all' ? parseInt(selectedAISystem) : undefined,
  });

  const { data: userActivity, isLoading: activityLoading } = trpc.analytics.getUserActivityMetrics.useQuery({
    startDate,
    endDate,