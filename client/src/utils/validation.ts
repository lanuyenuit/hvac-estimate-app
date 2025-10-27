import type { FormData } from '../types/form.types';

export const validateField = (name: string, value: any): string | undefined => {
  switch (name) {
    case 'unitNumber':
      if (!value || value.trim() === '') {
        return 'Unit number is required';
      }
      if (value.length < 2) {
        return 'Unit number must be at least 2 characters';
      }
      if (value.length > 50) {
        return 'Unit number must not exceed 50 characters';
      }
      break;

    case 'modelNumber':
      if (!value || value.trim() === '') {
        return 'Model number is required';
      }
      if (value.length < 2) {
        return 'Model number must be at least 2 characters';
      }
      if (value.length > 50) {
        return 'Model number must not exceed 50 characters';
      }
      break;

    case 'location':
      if (!value || value.trim() === '') {
        return 'Location is required';
      }
      if (value.length < 3) {
        return 'Location must be at least 3 characters';
      }
      if (value.length > 100) {
        return 'Location must not exceed 100 characters';
      }
      break;

    case 'issue':
      if (!value || value.trim() === '') {
        return 'Issue description is required';
      }
      if (value.length < 10) {
        return 'Issue description must be at least 10 characters';
      }
      if (value.length > 500) {
        return 'Issue description must not exceed 500 characters';
      }
      break;

    case 'laborCost':
      if (value !== '' && value !== 0) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return 'Labor cost must be a valid number';
        }
        if (numValue < 0) {
          return 'Labor cost cannot be negative';
        }
        if (numValue > 999999.99) {
          return 'Labor cost is too high';
        }
      }
      break;

    case 'partsCost':
      if (value !== '' && value !== 0) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return 'Parts cost must be a valid number';
        }
        if (numValue < 0) {
          return 'Parts cost cannot be negative';
        }
        if (numValue > 999999.99) {
          return 'Parts cost is too high';
        }
      }
      break;

    case 'serviceFee':
      if (value !== '' && value !== 0) {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          return 'Service fee must be a valid number';
        }
        if (numValue < 0) {
          return 'Service fee cannot be negative';
        }
        if (numValue > 999999.99) {
          return 'Service fee is too high';
        }
      }
      break;
  }
  return undefined;
};

export const validateForm = (form: FormData): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};
  
  Object.keys(form).forEach((key) => {
    if (key !== 'totalCost') {
      const error = validateField(key, form[key as keyof FormData]);
      if (error) {
        errors[key] = error;
      }
    }
  });

  // Validate that at least one cost field has a value
  const hasAnyCost = Number(form.laborCost || 0) > 0 || 
                     Number(form.partsCost || 0) > 0 || 
                     Number(form.serviceFee || 0) > 0;
  
  if (!hasAnyCost) {
    errors.laborCost = 'At least one cost field must have a value greater than 0';
  }

  return errors;
};
