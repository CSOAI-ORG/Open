import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Home, Bug, ChevronDown, ChevronUp } from "lucide-react";
import { Component, ReactNode } from "react";
import * as Sentry from "@sentry/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
  showDetails: boolean;
  eventId: string | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false,
      eventId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for development
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    
    // Report to Sentry
    const eventId = Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
        errorBoundary: true,
      },
      tags: {
        errorType: "react_error_boundary",
      },
    });
    
    this.setState({ 
      errorInfo,
      eventId 
    });

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  handleReportFeedback = () => {
    if (this.state.eventId) {
      Sentry.showReportDialog({ eventId: this.state.eventId });
    }
  };

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }));
  };

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex items-center justify-center min-h-screen p-4 bg-background">
          <Card className="w-full max-w-lg">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-3 rounded-full bg-destructive/10">
                <AlertTriangle className="h-8 w-8 text-destructive" />
              </div>
              <CardTitle className="text-2xl">Something went wrong</CardTitle>
              <CardDescription>
                An unexpected error occurred. Our team has been notified and is working on a fix.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Error Summary */}
              <div className="p-4 rounded-lg bg-muted">
                <p className="text-sm font-medium text-muted-foreground">
                  Error: {this.state.error?.message || "Unknown error"}
                </p>
              </div>

              {/* Expandable Details */}
              <div>
                <button
                  onClick={this.toggleDetails}
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {this.state.showDetails ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  {this.state.showDetails ? "Hide" : "Show"} technical details
                </button>
                
                {this.state.showDetails && (
                  <div className="mt-3 p-4 rounded-lg bg-muted/50 overflow-auto max-h-48">
                    <pre className="text-xs text-muted-foreground whitespace-pre-wrap break-words">
                      {this.state.error?.stack}
                    </pre>
                    {this.state.errorInfo?.componentStack && (
                      <pre className="mt-2 text-xs text-muted-foreground whitespace-pre-wrap break-words">
                        Component Stack:{this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                )}
              </div>

              {/* Event ID for support */}
              {this.state.eventId && (
                <p className="text-xs text-muted-foreground text-center">
                  Error ID: <code className="bg-muted px-1 py-0.5 rounded">{this.state.eventId}</code>
                </p>
              )}
            </CardContent>

            <CardFooter className="flex flex-col gap-2">
              <div className="flex gap-2 w-full">
                <Button
                  onClick={this.handleReload}
                  className="flex-1"
                  variant="default"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
              
              {this.state.eventId && (
                <Button
                  onClick={this.handleReportFeedback}
                  variant="ghost"
                  className="w-full text-muted-foreground"
                >
                  <Bug className="h-4 w-4 mr-2" />
                  Report this issue
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  fallback?: ReactNode
) {
  return function WithErrorBoundary(props: P) {
    return (
      <ErrorBoundary fallback={fallback}>
        <WrappedComponent {...props} />
      </ErrorBoundary>
    );
  };
}

// Async error boundary for Suspense components
export function AsyncErrorBoundary({ 
  children, 
  fallback 
}: { 
  children: ReactNode; 
  fallback?: ReactNode;
}) {
  return (
    <ErrorBoundary fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
}

export default ErrorBoundary;
