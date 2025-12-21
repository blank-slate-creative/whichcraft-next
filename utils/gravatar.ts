import MD5 from 'crypto-js/md5';

export async function getGravatarUrl(email: string, size: number = 120) {
  // Convert email to lowercase and trim whitespace
  const cleanEmail = email.toLowerCase().trim();

  // Create MD5 hash of the email using crypto-js
  const hash = MD5(cleanEmail).toString();

  // Construct Gravatar URL with size parameter and a default image
  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=mp`;
}
