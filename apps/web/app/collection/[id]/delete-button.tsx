'use client';

import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { deleteBeverageAction } from '../actions';
import { useRouter } from 'next/navigation';

interface DeleteButtonProps {
  id: string | number;
  name: string;
}

export function DeleteButton({ id, name }: DeleteButtonProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);

    try {
      // Perform the delete operation
      const result = await deleteBeverageAction(id.toString());

      if (result.success) {
        // Close the dialog
        setIsOpen(false);
        // Redirect to collection
        router.push('/collection');
      } else {
        setError(result.message || 'Failed to delete beverage');
      }
    } catch (err) {
      console.error('Delete error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Trash className="h-4 w-4" />
        Delete
      </Button>

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
