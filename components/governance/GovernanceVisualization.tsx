          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The CSRAI ecosystem: A comprehensive framework showing how human councils, 
            regulatory bodies, governance pipelines, and AI analysts work together in 
            synchronized harmony to ensure responsible AI development.
          </p>
        </div>

        {/* Visualization Container */}
        <div className="relative w-full aspect-square max-w-4xl mx-auto mb-8">
          <svg
            viewBox="0 0 1000 1000"
            className="w-full h-full drop-shadow-lg"
            style={{ filter: "drop-shadow(0 20px 25px rgba(0,0,0,0.15))" }}
          >
            <defs>
              {/* Gradients for connections */}
              <linearGradient
                id="gradient-connection"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.5" />
              </linearGradient>
              <linearGradient
                id="gradient-ring"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.3" />
              </linearGradient>

              {/* Ring backgrounds */}
              <circle
                id="ring-1"
                cx="500"
                cy="500"
                r="80"
                fill="none"
                stroke="url(#gradient-connection)"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <circle
                id="ring-2"
                cx="500"
                cy="500"
                r="150"
                fill="none"
                stroke="url(#gradient-ring)"
                strokeWidth="0.5"
                opacity="0.15"
              />
              <circle
                id="ring-3"
                cx="500"
                cy="500"
                r="220"
                fill="none"
                stroke="url(#gradient-ring)"
                strokeWidth="0.5"
                opacity="0.15"
              />
              <circle
                id="ring-4"
                cx="500"
                cy="500"
                r="290"
                fill="none"
                stroke="url(#gradient-ring)"
                strokeWidth="0.5"
                opacity="0.15"
              />
              <circle
                id="ring-5"