'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';
import * as React from 'react';
import { cn } from '@/lib/utils';
import { useFormStatus } from 'react-dom';
import { updateBeverageAction, redirectToDashboard } from './actions';
import { Beverage } from '../beverage-context';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';

// Custom Textarea component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

interface BeverageData {
  name: string;
  producer: string;
  type: string;
  style?: string;
  notes?: string;
  liked: boolean | null;
  abv?: number | string;
  image_url?: string;
}

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

// Submit button component
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto min-w-[120px]">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        'Save Changes'
      )}
    </Button>
  );
}

// Main form component
export default function EditBeverageForm({ initialBeverage }: { initialBeverage: Beverage }) {
  // Create a wrapper function to include the beverage ID in the action
  const updateWithId = React.useCallback(
    (prevState: FormState, formData: FormData) => {
      return updateBeverageAction(initialBeverage.id.toString(), prevState, formData);
    },
    [initialBeverage.id]
  );

  const [formState, formAction] = React.useActionState(updateWithId, {
    status: 'idle',
  });

  const [beverageData, setBeverageData] = useState<BeverageData>({
    name: initialBeverage.name || '',
    producer: initialBeverage.producer || '',
    type: initialBeverage.type || 'Beer',
    style: initialBeverage.style || '',
    notes: initialBeverage.notes || '',
    liked: initialBeverage.liked,
    abv: initialBeverage.abv || '',
    image_url: initialBeverage.image_url || '',
  });

  // Redirect to dashboard when form submission is successful
  React.useEffect(() => {
    if (formState.status === 'success') {
      redirectToDashboard();
    }
  }, [formState.status]);

  return (
    <form action={formAction} className="space-y-6 sm:space-y-8">
      {/* Hidden fields for form state */}
      <input type="hidden" name="type" value={beverageData.type} />
      <input
        type="hidden"
        name="liked"
        value={beverageData.liked === null ? '' : String(beverageData.liked)}
      />
      <input type="hidden" name="image_url" value={beverageData.image_url || ''} />

      {/* Basic Information */}
      <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Basic Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="name">Beverage Name*</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g. Sierra Nevada Pale Ale"
              value={beverageData.name}
              onChange={e => setBeverageData({ ...beverageData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="producer">Producer/Brewery/Winery</Label>
            <Input
              id="producer"
              name="producer"
              placeholder="e.g. Sierra Nevada Brewing Co."
              value={beverageData.producer}
              onChange={e => setBeverageData({ ...beverageData, producer: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label>Type*</Label>
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-beer"
                  checked={beverageData.type === 'Beer'}
                  onCheckedChange={() => setBeverageData({ ...beverageData, type: 'Beer' })}
                />
                <Label htmlFor="type-beer" className="font-normal">
                  Beer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-wine"
                  checked={beverageData.type === 'Wine'}
                  onCheckedChange={() => setBeverageData({ ...beverageData, type: 'Wine' })}
                />
                <Label htmlFor="type-wine" className="font-normal">
                  Wine
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="type-other"
                  checked={beverageData.type === 'Other'}
                  onCheckedChange={() => setBeverageData({ ...beverageData, type: 'Other' })}
                />
                <Label htmlFor="type-other" className="font-normal">
                  Other
                </Label>
              </div>
            </div>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="style">Style</Label>
            <Input
              id="style"
              name="style"
              placeholder="e.g. Pale Ale, Sauvignon Blanc"
              value={beverageData.style}
              onChange={e => setBeverageData({ ...beverageData, style: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="abv">ABV (%)</Label>
            <Input
              id="abv"
              name="abv"
              type="number"
              step="0.1"
              min="0"
              max="100"
              placeholder="e.g. 5.5"
              value={beverageData.abv}
              onChange={e => setBeverageData({ ...beverageData, abv: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label>Image</Label>
            <ImageUpload
              imageUrl={beverageData.image_url}
              onImageChange={imageUrl => setBeverageData({ ...beverageData, image_url: imageUrl })}
            />
          </div>
        </div>
      </div>

      {/* Rating & Notes */}
      <div className="space-y-3 sm:space-y-4 p-4 sm:p-6 bg-card rounded-lg border">
        <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">Rating & Notes</h2>

        <div className="space-y-1.5 sm:space-y-2">
          <Label>Did you like it?*</Label>
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              type="button"
              variant={beverageData.liked === true ? 'default' : 'outline'}
              onClick={() => setBeverageData({ ...beverageData, liked: true })}
              className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
              size="sm"
            >
              <span>👍</span>
              <span>Like</span>
            </Button>
            <Button
              type="button"
              variant={beverageData.liked === false ? 'default' : 'outline'}
              onClick={() => setBeverageData({ ...beverageData, liked: false })}
              className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
              size="sm"
            >
              <span>👎</span>
              <span>Dislike</span>
            </Button>
          </div>
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="notes">Tasting Notes</Label>
          <Textarea
            id="notes"
            name="notes"
            placeholder="Describe the flavor, aroma, appearance, and your overall impression..."
            rows={4}
            value={beverageData.notes}
            onChange={e => setBeverageData({ ...beverageData, notes: e.target.value })}
          />
        </div>
      </div>

      {/* Form status messages */}
      {formState.status === 'error' && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-3 sm:px-4 py-2 bg-destructive/10 rounded text-sm">
          {formState.message}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center sm:justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
