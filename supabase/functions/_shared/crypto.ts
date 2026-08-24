// Helper for WebCrypto AES-GCM

/** Encodes a string to a Uint8Array */
const encoder = new TextEncoder();
/** Decodes a Uint8Array to a string */
const decoder = new TextDecoder();

/**
 * Derives a CryptoKey from a base64 encoded string secret.
 */
async function getKey(secretKeyHex: string): Promise<CryptoKey> {
  // Ensure the secret key is 32 bytes (64 hex characters) for AES-256
  // For simplicity, we assume the environment variable ENCRYPTION_KEY is exactly 32 bytes (64 hex chars).
  const keyBytes = new Uint8Array(secretKeyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
  return await crypto.subtle.importKey(
    'raw',
    keyBytes,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a string using AES-GCM.
 * Returns the encrypted text (base64) and the IV (base64).
 */
export async function encryptToken(text: string, secretKeyHex: string): Promise<{ encrypted: string, iv: string }> {
  const key = await getKey(secretKeyHex);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = encoder.encode(text);
  
  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );
  
  // Convert buffer to base64
  const encryptedBase64 = btoa(String.fromCharCode(...new Uint8Array(cipherBuffer)));
  const ivBase64 = btoa(String.fromCharCode(...iv));
  
  return { encrypted: encryptedBase64, iv: ivBase64 };
}

/**
 * Decrypts a base64 encrypted string using AES-GCM and a base64 IV.
 */
export async function decryptToken(encryptedBase64: string, ivBase64: string, secretKeyHex: string): Promise<string> {
  const key = await getKey(secretKeyHex);
  const iv = new Uint8Array(atob(ivBase64).split('').map(char => char.charCodeAt(0)));
  const cipherBuffer = new Uint8Array(atob(encryptedBase64).split('').map(char => char.charCodeAt(0)));
  
  const plainBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    cipherBuffer
  );
  
  return decoder.decode(plainBuffer);
}
