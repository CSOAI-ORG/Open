import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  FileText, 
  Users, 
  BarChart3, 
  Bell, 
  Search, 
  Plus,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Inbox,
  FolderOpen,
  Calendar,
  MessageSquare,
  Award,
  Settings
} from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ 
  title, 
  description, 
  icon, 
  action, 
  secondaryAction 
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {icon && (
          <div className="p-4 rounded-full bg-muted mb-4">
            {icon}
          </div>
        )}
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
        <div className="flex gap-3">
          {action && (
            <Button onClick={action.onClick}>
              <Plus className="h-4 w-4 mr-2" />
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick}>
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function NoReportsEmpty({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      title="No Compliance Reports"
      description="You haven't created any compliance reports yet. Start by creating your first report to begin tracking AI compliance."
      icon={<FileText className="h-8 w-8 text-muted-foreground" />}
      action={onCreate ? { label: "Create Report", onClick: onCreate } : undefined}
    />
  );
}

export function NoUsersEmpty({ onInvite }: { onInvite?: () => void }) {
  return (
    <EmptyState
      title="No Team Members"
      description="Invite team members to collaborate on compliance management and share insights across your organization."
      icon={<Users className="h-8 w-8 text-muted-foreground" />}
      action={onInvite ? { label: "Invite Members", onClick: onInvite } : undefined}
    />
  );
}

export function NoDataEmpty({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <EmptyState
      title="No Data Available"
      description="There's no data to display at the moment. This could be because you're just getting started or data is still being processed."
      icon={<BarChart3 className="h-8 w-8 text-muted-foreground" />}
      action={onRefresh ? { label: "Refresh", onClick: onRefresh } : undefined}
    />
  );
}

export function NoNotificationsEmpty() {
  return (
    <EmptyState
      title="All Caught Up!"
      description="You have no new notifications. We'll let you know when something important happens."
      icon={<Bell className="h-8 w-8 text-muted-foreground" />}
    />
  );
}

export function NoSearchResultsEmpty({ query, onClear }: { query: string; onClear?: () => void }) {
  return (
    <EmptyState
      title="No Results Found"
      description={`We couldn't find anything matching "${query}". Try adjusting your search terms or filters.`}
      icon={<Search className="h-8 w-8 text-muted-foreground" />}
      action={onClear ? { label: "Clear Search", onClick: onClear } : undefined}
    />
  );
}

export function ErrorEmpty({ 
  message, 
  onRetry 
}: { 
  message?: string; 
  onRetry?: () => void 
}) {
  return (
    <EmptyState
      title="Something Went Wrong"
      description={message || "An error occurred while loading this content. Please try again."}
      icon={<AlertCircle className="h-8 w-8 text-destructive" />}
      action={onRetry ? { label: "Try Again", onClick: onRetry } : undefined}
    />
  );
}

export function SuccessEmpty({ 
  title, 
  message, 
  onContinue 
}: { 
  title?: string;
  message?: string; 
  onContinue?: () => void 
}) {
  return (
    <EmptyState
      title={title || "Success!"}
      description={message || "The operation completed successfully."}
      icon={<CheckCircle2 className="h-8 w-8 text-green-500" />}
      action={onContinue ? { label: "Continue", onClick: onContinue } : undefined}
    />
  );
}

export function NoMessagesEmpty({ onCompose }: { onCompose?: () => void }) {
  return (
    <EmptyState
      title="No Messages"
      description="Your inbox is empty. Start a conversation or wait for messages from your team."
      icon={<Inbox className="h-8 w-8 text-muted-foreground" />}
      action={onCompose ? { label: "Compose Message", onClick: onCompose } : undefined}
    />
  );
}

export function NoFilesEmpty({ onUpload }: { onUpload?: () => void }) {
  return (
    <EmptyState
      title="No Files"
      description="No files have been uploaded yet. Upload documents to get started."
      icon={<FolderOpen className="h-8 w-8 text-muted-foreground" />}
      action={onUpload ? { label: "Upload Files", onClick: onUpload } : undefined}
    />
  );
}

export function NoEventsEmpty({ onCreate }: { onCreate?: () => void }) {
  return (
    <EmptyState
      title="No Upcoming Events"
      description="You don't have any scheduled events. Create one to stay organized."
      icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
      action={onCreate ? { label: "Create Event", onClick: onCreate } : undefined}
    />
  );
}

export function NoCommentsEmpty({ onComment }: { onComment?: () => void }) {
  return (
    <EmptyState
      title="No Comments Yet"
      description="Be the first to start the conversation!"
      icon={<MessageSquare className="h-8 w-8 text-muted-foreground" />}
      action={onComment ? { label: "Add Comment", onClick: onComment } : undefined}
    />
  );
}

export function NoCertificatesEmpty({ onLearnMore }: { onLearnMore?: () => void }) {
  return (
    <EmptyState
      title="No Certificates"
      description="Complete compliance assessments to earn certificates and showcase your achievements."
      icon={<Award className="h-8 w-8 text-muted-foreground" />}
      action={onLearnMore ? { label: "Learn More", onClick: onLearnMore } : undefined}
    />
  );
}

export function MaintenanceEmpty() {
  return (
    <EmptyState
      title="Under Maintenance"
      description="We're performing scheduled maintenance. Please check back shortly."
      icon={<Settings className="h-8 w-8 text-muted-foreground animate-spin" />}
    />
  );
}

export function LoadingEmpty() {
  return (
    <EmptyState
      title="Loading..."
      description="Please wait while we fetch your data."
      icon={<RefreshCw className="h-8 w-8 text-muted-foreground animate-spin" />}
    />
  );
}

export default EmptyState;
