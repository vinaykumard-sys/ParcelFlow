export interface SocietyPilotRequest {
  fullName: string;
  societyName: string;
  city: string;
  totalFlats: number;
  phone: string;
  email: string;
  role: 'rwa_member' | 'resident' | 'facility_manager';
  notes?: string;
}

export interface UserAuthModalState {
  isOpen: boolean;
  type: 'pilot' | 'society_login' | 'resident_login' | 'download_app';
}
