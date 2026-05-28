export interface Appointment {
  id?: number;
  patientId: number;
  doctorId: number;
  appointmentDate: string;
  symptoms: string;
  status?: string;
  patientName?: string;
  doctorName?: string;
}
