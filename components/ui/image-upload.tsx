'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { uploadImageAction } from '@/app/actions';

interface ImageUploadProps {
  imageUrl?: string;
  onImageChange: (imageUrl: string) => void;
  className?: string;
  label?: string;
  helpText?: string;
}

export function ImageUpload({
  imageUrl,
  onImageChange,
  className,
  label = 'Image',
  helpText = 'Upload an image for this beverage',
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleRemoveImage = () => {
    onImageChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);

      // Create a temporary URL for preview
      const tempImageUrl = URL.createObjectURL(file);
      onImageChange(tempImageUrl);

      // Upload to storage service
      const formData = new FormData();
      formData.append('file', file);

      const result = await uploadImageAction(formData);

      if (result.error) {
        console.error('Upload failed:', result.error);
        // Optional: revert to previous image or show error state
      } else if (result.imageUrl) {
        // Update with permanent URL from storage
        onImageChange(result.imageUrl);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={cn('space-y-1.5 sm:space-y-2', className)}>
      <Label>{label}</Label>
      <div className="flex flex-col gap-2">
        {imageUrl ? (
          <div className="relative w-full h-32 bg-muted rounded-md overflow-hidden">
            <img src={imageUrl} alt="Uploaded image" className="w-full h-full object-contain" />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-1 right-1 h-6 w-6"
              onClick={handleRemoveImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center w-full">
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-md cursor-pointer bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Click to upload</p>
                {helpText && <div className="text-xs text-muted-foreground">{helpText}</div>}
              </div>
              <input
                id="image-upload"
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isUploading}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
}
