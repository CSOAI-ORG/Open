/**
 * Bookmark Button Component
 * Allows users to bookmark specific sections within course modules
 */

import { useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BookmarkButtonProps {
  courseId: number;
  moduleId: number;
  sectionId?: string;
  sectionTitle: string;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
}

export function BookmarkButton({
  courseId,
  moduleId,
  sectionId,
  sectionTitle,
  variant = 'ghost',
  size = 'sm',
  showLabel = false,
}: BookmarkButtonProps) {
  const [showNotesDialog, setShowNotesDialog] = useState(false);
  const [notes, setNotes] = useState('');

  const utils = trpc.useUtils();

  // Check if already bookmarked
  const { data: bookmarkStatus } = trpc.bookmarks.isBookmarked.useQuery({
    courseId,
    moduleId,
    sectionId,
  });

  // Create bookmark mutation
  const createBookmark = trpc.bookmarks.create.useMutation({
    onSuccess: () => {
      toast.success('Bookmark added successfully');
      utils.bookmarks.isBookmarked.invalidate();
      utils.bookmarks.list.invalidate();
      setShowNotesDialog(false);
      setNotes('');
    },
    onError: (error) => {
      toast.error('Failed to add bookmark: ' + error.message);
    },
  });

  // Delete bookmark mutation
  const deleteBookmark = trpc.bookmarks.delete.useMutation({
    onSuccess: () => {
      toast.success('Bookmark removed');
      utils.bookmarks.isBookmarked.invalidate();
      utils.bookmarks.list.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to remove bookmark: ' + error.message);
    },
  });

  const isBookmarked = bookmarkStatus?.isBookmarked || false;
  const bookmarkId = bookmarkStatus?.bookmarkId;

  const handleToggleBookmark = () => {
    if (isBookmarked && bookmarkId) {
      // Remove bookmark
      deleteBookmark.mutate({ bookmarkId });
    } else {
      // Show notes dialog before creating bookmark
      setShowNotesDialog(true);
    }
  };

  const handleCreateBookmark = () => {
    createBookmark.mutate({
      courseId,
      moduleId,
      sectionId,
      sectionTitle,
      notes: notes.trim() || undefined,
    });
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleToggleBookmark}
        disabled={createBookmark.isPending || deleteBookmark.isPending}
        className="gap-2"
      >
        {isBookmarked ? (
          <BookmarkCheck className="h-4 w-4 text-yellow-500" />
        ) : (
          <Bookmark className="h-4 w-4" />
        )}
        {showLabel && (
          <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
        )}
      </Button>

      <Dialog open={showNotesDialog} onOpenChange={setShowNotesDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Bookmark</DialogTitle>
            <DialogDescription>
              Add optional notes to help you remember why you bookmarked this section.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="section-title">Section</Label>
              <div className="text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-md">
                {sectionTitle}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add your notes here..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowNotesDialog(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateBookmark}
              disabled={createBookmark.isPending}
            >
              {createBookmark.isPending ? 'Adding...' : 'Add Bookmark'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
