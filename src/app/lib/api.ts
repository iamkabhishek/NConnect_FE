/**
 * API Utility Client for NConnect Authentication and Onboarding Flow
 */

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://xj555ln9ja.execute-api.ap-south-1.amazonaws.com';
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '4d8dj537u5t23j8jghhag067hn';
const COGNITO_REGION = process.env.NEXT_PUBLIC_COGNITO_REGION || 'ap-south-1';

export interface SendOtpResponse {
  success: boolean;
  session: string;
  message: string;
}

export interface VerifyOtpResponse {
  token: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

/**
 * Sanitizes and retrieves the ID token from local storage.
 * Prevents 401 errors caused by hidden characters or accidental quotes.
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('nconnect_id_token');
  if (!token) return null;
  
  // Robust sanitization: trim and remove any surrounding literal quotes
  return token.trim().replace(/^"|"$/g, '');
}

export interface UserMeResponse {
  userId: string;
  customUserId: string;
  tenantId: string | null;
  customTenantId: string | null;
  slug: string | null;
  status: string | null;
  role: string | null;
  permissions: string[];
  name: string | null;
  workspaceName: string | null;
  needsOnboarding: boolean;
}

export interface CompleteOnboardingResponse {
  tenantId: string;
  customTenantId: string;
  slug: string;
  message: string;
}

/**
 * Initiates email passwordless authentication. Sends an OTP code to the email.
 */
export async function sendOtp(email: string, flow?: 'signin' | 'signup'): Promise<SendOtpResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/passwordless/otp`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, flow }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to send OTP code.');
  }

  return data as SendOtpResponse;
}

/**
 * Verifies email OTP code against the Cognito custom challenge flow.
 */
export async function verifyOtp(email: string, otp: string, session: string): Promise<VerifyOtpResponse> {
  const response = await fetch(`${API_URL}/api/v1/auth/passwordless/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, otp, session }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Invalid or expired OTP code.');
  }

  return data as VerifyOtpResponse;
}

/**
 * Retrieves the currently authenticated user's profile and workspace state.
 */
export async function getMe(token?: string): Promise<UserMeResponse> {
  const activeToken = token || getStoredToken();
  if (!activeToken) {
    throw new Error('Authentication token is missing.');
  }

  const response = await fetch(`${API_URL}/api/v1/auth/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${activeToken.trim().replace(/^"|"$/g, '')}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch user profile.');
  }

  return data as UserMeResponse;
}

/**
 * Completes onboarding by creating a new workspace tenant for the user.
 */
export async function completeOnboarding(
  token: string,
  workspaceName: string,
  orgName: string,
  purpose?: string,
  description?: string,
  color?: string,
  firstName?: string,
  lastName?: string
): Promise<CompleteOnboardingResponse> {
  const response = await fetch(`${API_URL}/api/v1/onboarding/complete`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, '')}`,
    },
    body: JSON.stringify({ workspaceName, orgName, purpose, description, color, firstName, lastName }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to complete workspace onboarding.');
  }

  return data as CompleteOnboardingResponse;
}

/**
 * Updates the user's name, avatar, or agency name in the database.
 */
export async function updateProfile(token: string, name?: string, orgName?: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/v1/users/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, '')}`,
    },
    body: JSON.stringify({ name, orgName }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update user profile.');
  }

  return data;
}

/**
 * Executes a client-side AWS Cognito REFRESH_TOKEN_AUTH token refresh flow over REST.
 * This obtains a fresh ID Token containing the updated custom:tenantId claim without requiring repeat OTP.
 */
export async function refreshCognitoTokens(refreshToken: string): Promise<VerifyOtpResponse> {
  const response = await fetch(`https://cognito-idp.${COGNITO_REGION}.amazonaws.com/`, {
    method: 'POST',
    headers: {
      'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth',
      'Content-Type': 'application/x-amz-json-1.1',
    },
    body: JSON.stringify({
      ClientId: COGNITO_CLIENT_ID,
      AuthFlow: 'REFRESH_TOKEN_AUTH',
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Cognito token refresh failed.');
  }

  const authResult = data.AuthenticationResult;
  if (!authResult || !authResult.IdToken) {
    throw new Error('Cognito token refresh returned an empty response.');
  }

  return {
    token: authResult.IdToken,
    accessToken: authResult.AccessToken,
    // Refresh token is occasionally not returned during refresh, fallback to previous one
    refreshToken: authResult.RefreshToken || refreshToken,
    expiresIn: authResult.ExpiresIn || 3600,
  };
}

/**
 * Fetches the user profile from /api/v1/users/profile
 */
export async function getProfile(token: string): Promise<any> {
  const response = await fetch(`${API_URL}/api/v1/users/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.trim().replace(/^"|"$/g, '')}`,
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to fetch user profile.');
  }

  return data;
}

