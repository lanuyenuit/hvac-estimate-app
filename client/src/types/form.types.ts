export interface FormData {
  unitNumber: string;
  modelNumber: string;
  location: string;
  issue: string;
  laborCost: number | "";
  partsCost: number | "";
  serviceFee: number | "";
  totalCost: number;
}

export interface FormErrors {
  unitNumber?: string;
  modelNumber?: string;
  location?: string;
  issue?: string;
  laborCost?: string;
  partsCost?: string;
  serviceFee?: string;
}

export type DownloadFormat = 'pdf' | 'excel';
