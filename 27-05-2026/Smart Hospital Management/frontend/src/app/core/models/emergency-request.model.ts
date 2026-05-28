export interface EmergencyRequest {
  id?: number;
  patientId: number;
  description: string;
  location: string;
  status?: string;
  requestedAt?: string;
  patientName?: string;
}
