        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <Progress 
            value={progress} 
            className="h-3"
            indicatorClassName={getProgressBgColor(progress)}
          />
          {showDetailed && (
            <p className="text-xs text-muted-foreground text-right">
              {progress >= 100 ? 'All modules completed' : `${100 - progress}% remaining`}
            </p>
          )}
        </div>

        {/* Time Stats */}
        {showDetailed && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            {/* Time Spent */}