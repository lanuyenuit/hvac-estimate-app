import type { FormData, DownloadFormat } from '../types/form.types';

// Automatically detect environment and use correct API URL
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hvac-estimate-backend.onrender.com'
  : 'http://localhost:3000';

console.log('🔗 API Base URL:', API_BASE_URL);

export const downloadEstimate = async (
  format: DownloadFormat, 
  formData: FormData
): Promise<void> => {
  const response = await fetch(
    `${API_BASE_URL}/api/estimate/download?format=${format}`, 
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to generate ${format.toUpperCase()} file`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  const today = new Date().toISOString().split('T')[0];
  
  a.href = url;
  a.download = format === 'pdf' 
    ? `hvac-estimate-${today}.pdf` 
    : `hvac-estimate-${today}.xlsx`;
  
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
