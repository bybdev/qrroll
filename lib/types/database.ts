// Database tipleri
export interface Wedding {
  id: string;
  slug: string;
  bride_name: string;
  groom_name: string;
  wedding_date: string;
  created_at: string;
  is_active: boolean;
}

export interface Photo {
  id: string;
  wedding_id: string;
  guest_name: string;
  message: string | null;
  photo_url: string;
  uploaded_at: string;
}

// Form tipleri
export interface UploadFormData {
  guest_name: string;
  message: string;
  photo: File | null;
}

export interface CreateWeddingFormData {
  bride_name: string;
  groom_name: string;
  wedding_date: string;
}