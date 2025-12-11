// Form validation fonksiyonları

// E-mail validasyonu
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Fotoğraf dosyası validasyonu
export function isValidImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  // Dosya tipi kontrolü
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Sadece JPG, PNG veya WEBP formatında fotoğraf yükleyebilirsiniz.',
    };
  }

  // Dosya boyutu kontrolü (10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Fotoğraf boyutu 10MB\'dan küçük olmalıdır.',
    };
  }

  return { valid: true };
}

// İsim validasyonu
export function isValidName(name: string): boolean {
  return name.trim().length >= 2;
}

// Slug validasyonu
export function isValidSlug(slug: string): boolean {
  const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugRegex.test(slug) && slug.length >= 3;
}