export interface Doctor {
  id?: number;
  fullName?: string;
  specialization: string;
  experienceYears: number;
  consultationFee: number;
  isAvailable?: boolean;
  userId?: string;
}
