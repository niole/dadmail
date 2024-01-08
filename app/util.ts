export function getFromQueryParam(email: string): string {
  return `from:${email}`;
}

export const FROM_EMAILS = (process.env.EXPO_PUBLIC_FROM_EMAILS || '').split(',');
