'use server';

import { createClient } from '@/utils/supabase/server';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export const signUpAction = async (prevState: any, formData: FormData) => {
  const email = formData.get('email')?.toString();
  const password = formData.get('password')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');

  if (!email || !password) {
    return { error: 'Email and password are required' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    console.error(error.code + ' ' + error.message);
    return { error: error.message };
  } else {
    return {
      success: 'Thanks for signing up! Please check your email for a verification link.',
    };
  }
};

export const signInAction = async (prevState: { error?: string } = {}, formData: FormData) => {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect('/');
};

export const forgotPasswordAction = async (prevState: any, formData: FormData) => {
  const email = formData.get('email')?.toString();
  const supabase = await createClient();
  const origin = (await headers()).get('origin');
  const callbackUrl = formData.get('callbackUrl')?.toString();

  if (!email) {
    return { error: 'Email is required' };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?redirect_to=/reset-password`,
  });

  if (error) {
    console.error(error.message);
    return { error: 'Could not reset password' };
  }

  if (callbackUrl) {
    return { success: true, redirect: callbackUrl };
  }

  return {
    success: 'Check your email for a link to reset your password.',
  };
};

export const resetPasswordAction = async (prevState: any, formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password || !confirmPassword) {
    return {
      error: 'Password and confirm password are required',
    };
  }

  if (password !== confirmPassword) {
    return {
      error: 'Passwords do not match',
    };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
  });

  if (error) {
    return {
      error: 'Password update failed',
    };
  }

  return {
    success: 'Password updated',
  };
};

export const signOutAction = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  return { redirect: '/sign-in' };
};

export const uploadImageAction = async (formData: FormData) => {
  const supabase = await createClient();
  const file = formData.get('file') as File;

  if (!file) {
    return { error: 'No file provided' };
  }

  try {
    // Get the current user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return { error: 'Authentication required to upload images' };
    }

    // Generate a unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    // Include user ID in the path for better organization and security
    const userId = session.user.id;
    const filePath = `${userId}/beverage-images/${fileName}`;

    // Convert file to arrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    // Upload to Supabase Storage - ensure bucket name is consistent
    const bucketName = 'user_images';
    const { data, error } = await supabase.storage.from(bucketName).upload(filePath, buffer, {
      contentType: file.type,
      upsert: true, // Allow overwriting if file exists
    });

    if (error) {
      console.error('Error uploading image:', error);
      return { error: 'Failed to upload image: ' + error.message };
    }

    // Get the public URL from the same bucket
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return { success: true, imageUrl: publicUrl };
  } catch (error) {
    console.error('Unexpected error during image upload:', error);
    return { error: 'An unexpected error occurred during upload' };
  }
};
