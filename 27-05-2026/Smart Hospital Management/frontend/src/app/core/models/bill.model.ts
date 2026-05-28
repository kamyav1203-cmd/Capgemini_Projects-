export interface Bill {
  id?: number;
  patientId: number;
  amount: number;
  paymentMethod: string;
  paymentStatus?: string;
  billingDate?: string;
  patientName?: string;
}
