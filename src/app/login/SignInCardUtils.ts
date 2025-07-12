import { createClient } from "@/lib/supabase/client";

const supabaseClient = createClient();

export async function loginWithProvider(provider: 'google' | 'github') {
  try {
    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (error) {
      console.error(`${provider} login error:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`${provider} login error:`, error);
    return null;
  }
}

export async function sendOTP(email: string) {
  try {
    const { data, error } = await supabaseClient.auth.signInWithOtp({
      email,
    });

    if (error) {
      console.error('OTP send error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('OTP send error:', error);
    return null;
  }
}

export async function verifyOTP(email: string, token: string) {
  try {
    const { data, error } = await supabaseClient.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });

    if (error) {
      console.error('OTP verification error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('OTP verification error:', error);
    return null;
  }
}

export const loginWithEmailPassword = async (email: string, password: string) => {
  console.log('Starting email and password login process...');
  
  const { data, error } = await supabaseClient.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) {
    console.log('An error occurred during the email login process.');
    console.error('Login Error:', error.message);
    return null;
  }

  console.log('Email login successful. Data received:', data);
  return data;
};

export const signupWithEmailPassword = async (email: string, password: string) => {
  console.log('Starting email and password signup process...');
  
  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.log('An error occurred during the email signup process.');
    console.error('Signup Error:', error.message);
    return null;
  }

  console.log('Email signup successful. Data received:', data);
  return data;
};
