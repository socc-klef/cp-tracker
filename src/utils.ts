// utils.ts

// Function to add an item to localStorage with simple encryption (base64 encoding)
export function addLocalItem(key: string, value: string): void {
  const encodedValue = btoa(value); // Base64 encode the value
  localStorage.setItem(key, encodedValue);
}

// Function to get an item from localStorage with simple decryption (base64 decoding)
export function getLocalItem(key: string): string | null {
  const encodedValue = localStorage.getItem(key);
  if (encodedValue) {
    return atob(encodedValue); // Base64 decode the value
  }
  return null;
}
