export interface Patient {
  id?: number;
  fullName?: string;
  age: number;
  gender: string;
  bloodGroup: string;
  emergencyContact: string;
  medicalHistory: string;
  userId?: string;
}
