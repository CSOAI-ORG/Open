/**
 * ResolveIncidentDialog - Dialog for resolving Watchdog incidents with detailed notes
 * Allows admins/analysts to provide resolution notes, date, and responsible party info
 */

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface ResolveIncidentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  incidentId: number;
  incidentTitle: string;
  onSuccess?: () => void;
}

export default function ResolveIncidentDialog({
  open,
  onOpenChange,
  incidentId,
  incidentTitle,
  onSuccess,
}: ResolveIncidentDialogProps) {
  const [status, setStatus] = useState<'resolved' | 'dismissed'>('resolved');
  const [resolutionNotes, setResolutionNotes] = useState('');

  const resolveMutation = trpc.watchdogIncidents.resolve.useMutation({
    onSuccess: () => {
      toast.success(
        status === 'resolved' 
          ? 'Incident resolved successfully' 
          : 'Incident dismissed successfully'
      );
      onOpenChange(false);
      setResolutionNotes('');
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(`Failed to resolve incident: ${error.message}`);
    },
  });

  const handleSubmit = () => {
    if (resolutionNotes.length < 10) {
      toast.error('Please provide detailed resolution notes (at least 10 characters)');
      return;
    }

    resolveMutation.mutate({
      id: incidentId,
      resolutionNotes,
      status,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {status === 'resolved' ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <XCircle className="h-5 w-5 text-gray-600" />
            )}
            {status === 'resolved' ? 'Resolve Incident' : 'Dismiss Incident'}
          </DialogTitle>
          <DialogDescription>
            Provide details about how this incident was addressed.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label className="text-sm font-medium text-muted-foreground">Incident</Label>
            <p className="text-sm font-semibold mt-1">{incidentTitle}</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Resolution Status</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as 'resolved' | 'dismissed')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resolved">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    Resolved - Issue has been fixed
                  </span>
                </SelectItem>
                <SelectItem value="dismissed">
                  <span className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-gray-600" />
                    Dismissed - Not a valid issue
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              {status === 'resolved' ? 'Resolution Notes' : 'Dismissal Reason'}
            </Label>
            <Textarea
              id="notes"
              placeholder={
                status === 'resolved'
                  ? 'Describe how the issue was resolved, what actions were taken, and any follow-up steps...'
                  : 'Explain why this incident is being dismissed (e.g., duplicate, not reproducible, out of scope)...'
              }
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground">
              {resolutionNotes.length}/10 characters minimum
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={resolutionNotes.length < 10 || resolveMutation.isPending}
            className={status === 'resolved' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            {resolveMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : status === 'resolved' ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Resolve Incident
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Dismiss Incident
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
