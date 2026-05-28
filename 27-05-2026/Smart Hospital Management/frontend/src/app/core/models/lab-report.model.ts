export interface LabReport {
  id?: number;
  patientId: number;
  testName: string;
  result: string;
  filePath: string;
  uploadedAt?: string;
  patientName?: string;
}
