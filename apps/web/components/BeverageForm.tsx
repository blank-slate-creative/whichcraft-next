'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import * as React from 'react';
import { Loader2 } from 'lucide-react';
import { ImageUpload } from '@/components/ui/image-upload';
import { useFormStatus } from 'react-dom';

export interface BeverageData {
  name: string;
  producer: string;
  type: string;
  style?: string;
  notes?: string;
  liked: boolean | null;
  abv?: number | string;
  untappd_beer_id?: number;
  untappd_brewery_id?: number;
  image_url?: string;
}

export interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

interface BeverageFormProps {
  initialBeverageData?: BeverageData;
  onBeverageDataChange?: (data: BeverageData) => void;
  beverageData: BeverageData;
  formState: FormState;
  formAction: (formData: FormData) => void;
  submitButtonText?: string;
  showSearch?: boolean;
  children?: React.ReactNode;
}

function SubmitButton({ text = 'Save Beverage' }: { text?: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto min-w-[120px]">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        text
      )}
    </Button>
  );
}

export default function BeverageForm({
  beverageData,
  onBeverageDataChange,
  formState,
  formAction,
  submitButtonText = 'Save Beverage',
  showSearch = false,
  children,
}: BeverageFormProps) {
  // Handle beverage data changes
  const handleDataChange = (newData: Partial<BeverageData>) => {
    if (onBeverageDataChange) {
      onBeverageDataChange({ ...beverageData, ...newData });
    }
  };

  return (
    <form action={formAction} className="space-y-6 sm:space-y-8">
      {/* Search Section (conditionally rendered) */}
      {showSearch && children}

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
              onChange={e => handleDataChange({ name: e.target.value })}
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
              onChange={e => handleDataChange({ producer: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5 sm:space-y-2">
            <Label>Type*</Label>
            <RadioGroup
              value={beverageData.type}
              onValueChange={(value: string) => handleDataChange({ type: value })}
              className="flex flex-wrap items-center gap-3 sm:gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="form-type-beer" value="Beer" />
                <Label htmlFor="form-type-beer" className="font-normal">
                  Beer
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="form-type-wine" value="Wine" />
                <Label htmlFor="form-type-wine" className="font-normal">
                  Wine
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="form-type-other" value="Other" />
                <Label htmlFor="form-type-other" className="font-normal">
                  Other
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <Label htmlFor="style">Style</Label>
            <Input
              id="style"
              name="style"
              placeholder="e.g. Pale Ale, Sauvignon Blanc"
              value={beverageData.style || ''}
              onChange={e => handleDataChange({ style: e.target.value })}
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
              value={beverageData.abv || ''}
              onChange={e => handleDataChange({ abv: e.target.value })}
            />
          </div>

          <div className="space-y-1.5 sm:space-y-2">
            <ImageUpload
              imageUrl={beverageData.image_url}
              onImageChange={imageUrl => handleDataChange({ image_url: imageUrl })}
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
              onClick={() => handleDataChange({ liked: true })}
              className="flex items-center space-x-2 flex-1 sm:flex-none justify-center"
              size="sm"
            >
              <span>👍</span>
              <span>Like</span>
            </Button>
            <Button
              type="button"
              variant={beverageData.liked === false ? 'default' : 'outline'}
              onClick={() => handleDataChange({ liked: false })}
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
            value={beverageData.notes || ''}
            onChange={e => handleDataChange({ notes: e.target.value })}
          />
        </div>
      </div>

      {/* Form status messages */}
      {formState.status === 'error' && (
        <div className="text-destructive-foreground border-l-2 border-destructive-foreground px-3 sm:px-4 py-2 bg-destructive/10 rounded text-sm">
          {formState.message}
        </div>
      )}

      {/* Hidden fields for form state */}
      <input type="hidden" name="type" value={beverageData.type} />
      <input
        type="hidden"
        name="liked"
        value={beverageData.liked === null ? '' : String(beverageData.liked)}
      />
      <input type="hidden" name="untappd_beer_id" value={beverageData.untappd_beer_id || ''} />
      <input
        type="hidden"
        name="untappd_brewery_id"
        value={beverageData.untappd_brewery_id || ''}
      />
      <input type="hidden" name="image_url" value={beverageData.image_url || ''} />

      {/* Submit Button */}
      <div className="flex justify-center sm:justify-end">
        <SubmitButton text={submitButtonText} />
      </div>
    </form>
  );
}
