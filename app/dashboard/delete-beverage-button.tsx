'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { TooltipButton } from '@/components/ui/tooltip-button';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteBeverageAction } from './actions';
import { useBeverages } from './beverage-context';

interface DeleteBeverageButtonProps {
  id: string | number;
  name: string;
}

export function DeleteBeverageButton({ id, name }: DeleteBeverageButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { deleteBeverage } = useBeverages();

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    // Optimistically update UI
    deleteBeverage(id);

    // Close the dialog immediately for better UX
    setIsOpen(false);

    try {
      // Actually perform the delete operation
      const result = await deleteBeverageAction(id.toString());

      if (!result.success) {
        // If the delete failed, we should show an error toast or notification
        // For now, we'll just log to console
        console.error('Delete failed:', result.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
      // In a real app, you might want to show a toast notification here
      // and potentially revert the optimistic update
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <TooltipButton
        tooltip="Delete"
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={() => setIsOpen(true)}
      >
        <Trash className="h-4 w-4" />
      </TooltipButton>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Beverage</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
