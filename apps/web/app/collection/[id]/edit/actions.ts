'use server';

import { redirect } from 'next/navigation';
import { serverBeverageApi } from '@/utils/server-api';
import { revalidatePath } from 'next/cache';

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

export async function updateBeverageAction(
  id: string,
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Validate form
  const name = formData.get('name') as string;
  const type = formData.get('type') as string;
  const liked = formData.get('liked') as string;

  if (!name || !type || liked === undefined) {
    return {
      status: 'error',
      message: 'Please fill in all required fields and rate the beverage',
    };
  }

  try {
    // Get ABV value and convert empty string to null
    const abvValue = formData.get('abv');
    const abv = abvValue === '' || abvValue === null ? null : Number(abvValue);

    // Update beverage using the server API utility
    await serverBeverageApi.update(id, {
      name,
      producer: formData.get('producer'),
      type,
      style: formData.get('style'),
      notes: formData.get('notes'),
      liked: liked === 'true',
      abv,
      image_url: formData.get('image_url'),
    });

    // Revalidate the collection path to update the cache
    revalidatePath('/collection');

    // Return success state instead of redirecting here
    return {
      status: 'success',
      message: 'Beverage updated successfully!',
    };
  } catch (error) {
    console.error('Error updating beverage:', error);
    return {
      status: 'error',
      message: 'Failed to update beverage. Please try again.',
    };
  }
}

// Keep the redirectToCollection function for client-side use
export async function redirectToCollection() {
  revalidatePath('/collection');
  redirect('/collection');
}
