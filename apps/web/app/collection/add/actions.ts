'use server';

import { redirect } from 'next/navigation';
import { serverBeverageApi } from '@/utils/server-api';
import { revalidatePath } from 'next/cache';

interface FormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
}

export async function saveBeverageAction(
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
    // Create beverage using the server API utility
    await serverBeverageApi.create({
      name,
      producer: formData.get('producer') as string,
      type,
      style: formData.get('style') as string,
      notes: formData.get('notes') as string,
      liked: liked === 'true',
      abv: parseFloat(formData.get('abv') as string),
      untappd_beer_id: parseInt(formData.get('untappd_beer_id') as string),
      untappd_brewery_id: parseInt(formData.get('untappd_brewery_id') as string),
      image_url: formData.get('image_url') as string,
    });

    // Revalidate the collection path to update the cache
    revalidatePath('/collection');

    // Return success state instead of redirecting here
    return {
      status: 'success',
      message: 'Beverage saved successfully!',
    };
  } catch (error) {
    console.error('Error saving beverage:', error);
    return {
      status: 'error',
      message: 'Failed to save beverage. Please try again.',
    };
  }
}

// Keep the redirectToCollection function for client-side use
export async function redirectToCollection() {
  revalidatePath('/collection');
  redirect('/collection');
}
