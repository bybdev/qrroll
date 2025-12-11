// Türkçe karakterleri URL-safe hale getirir
// Örnek: "Ahmet & Selin" → "ahmet-selin"
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Türkçe karakterleri değiştir
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/İ/g, 'i')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    // Özel karakterleri tire ile değiştir
    .replace(/[^a-z0-9]+/g, '-')
    // Başta ve sondaki tireleri kaldır
    .replace(/^-+|-+$/g, '');
}