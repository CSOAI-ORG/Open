/**
 * Bookmarks List Component
 * Displays all user bookmarks with filtering and management options
 */

import { useState } from 'react';
import { Bookmark, Trash2, Edit, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
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
import { EmptyState } from '@/components/EmptyStates';

interface BookmarksListProps {
  courseId?: number;
}

export function BookmarksList({ courseId }: BookmarksListProps) {
  const [editingBookmark, setEditingBookmark] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState('');

  const utils = trpc.useUtils();

  // Fetch bookmarks
  const { data: bookmarks, isLoading } = trpc.bookmarks.list.useQuery(
    courseId ? { courseId } : undefined
  );

  // Delete bookmark mutation
  const deleteBookmark = trpc.bookmarks.delete.useMutation({
    onSuccess: () => {
      toast.success('Bookmark removed');
      utils.bookmarks.list.invalidate();
      utils.bookmarks.isBookmarked.invalidate();
    },
    onError: (error) => {
      toast.error('Failed to remove bookmark: ' + error.message);
    },
  });

  // Update notes mutation
  const updateNotes = trpc.bookmarks.updateNotes.useMutation({
    onSuccess: () => {
      toast.success('Notes updated');
      utils.bookmarks.list.invalidate();
      setEditingBookmark(null);
      setEditNotes('');
    },
    onError: (error) => {
      toast.error('Failed to update notes: ' + error.message);
    },
  });

  const handleDelete = (bookmarkId: number) => {
    if (confirm('Are you sure you want to remove this bookmark?')) {
      deleteBookmark.mutate({ bookmarkId });
    }
  };

  const handleEditNotes = (bookmark: any) => {
    setEditingBookmark(bookmark.id);
    setEditNotes(bookmark.notes || '');
  };

  const handleSaveNotes = () => {
    if (editingBookmark) {
      updateNotes.mutate({
        bookmarkId: editingBookmark,
        notes: editNotes,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <EmptyState
        icon={Bookmark}
        title="No bookmarks yet"
        description="Start bookmarking sections in your courses to quickly access them later."
      />
    );
  }

  return (
    <>
      <div className="space-y-4">
        {bookmarks.map((bookmark: any) => (
          <Card key={bookmark.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Bookmark className="h-4 w-4 text-yellow-500" />
                    <Badge variant="outline">Module {bookmark.moduleId}</Badge>
                  </div>
                  <CardTitle className="text-lg">{bookmark.sectionTitle}</CardTitle>
                  <CardDescription className="mt-1">
                    {new Date(bookmark.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEditNotes(bookmark)}
                    title="Edit notes"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(bookmark.id)}
                    disabled={deleteBookmark.isPending}
                    title="Remove bookmark"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            {bookmark.notes && (
              <CardContent>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {bookmark.notes}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <Dialog open={editingBookmark !== null} onOpenChange={() => setEditingBookmark(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Bookmark Notes</DialogTitle>
            <DialogDescription>
              Update your notes for this bookmark.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-notes">Notes</Label>
              <Textarea
                id="edit-notes"
                placeholder="Add your notes here..."
                value={editNotes}
                onChange={(e) => setEditNotes(e.target.value)}
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditingBookmark(null)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveNotes}
              disabled={updateNotes.isPending}
            >
              {updateNotes.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
