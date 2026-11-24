import { MEDIA_BASE_URL } from './constants';

const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300" fill="%23f3f4f6"><rect width="400" height="300" fill="%23f5ede3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="16" fill="%23a76a45">No Image Available</text></svg>';

/**
 * Resolves full URL for images stored as relative paths on the backend
 */
export function resolveImageUrl(path) {
  if (!path) return DEFAULT_PLACEHOLDER;
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('data:')) {
    return path;
  }
  // Remove leading slash if any before joining with baseUrl
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${MEDIA_BASE_URL}${encodeURI(cleanPath)}`;
}

/**
 * Convert a File object to base64 string and filename for API payload
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve({ base64: '', fileName: '' });
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result;
      // Strip metadata prefix (data:image/png;base64,) if backend needs raw base64
      // Backend handles raw base64 string
      const base64String = result.split(',')[1] || result;
      resolve({
        base64: base64String,
        dataUrl: result,
        fileName: file.name,
      });
    };
    reader.onerror = (error) => reject(error);
  });
}
