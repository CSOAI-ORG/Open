      high: 'bg-orange-500/20 text-orange-400',
      unacceptable: 'bg-red-500/20 text-red-400',
    };
    return colors[risk] || 'bg-gray-500/20 text-gray-400';
  };
  
  const scoreBadge = getScoreBadge(overallScore);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header */}
      <div className="border-b border-emerald-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate('/ai-systems')} className="text-emerald-700 hover:text-emerald-900">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-700 hover:bg-emerald-100">