import { useState } from 'react';
import type { FormData, FormErrors } from '../types/form.types';
import { validateField, validateForm } from '../utils/validation';

const initialFormData: FormData = {
  unitNumber: '',
  modelNumber: '',
  location: '',
  issue: '',
  laborCost: "",
  partsCost: "",
  serviceFee: "",
  totalCost: 0,
};

export const useFormValidation = () => {
  const [form, setForm] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());

  const calculateTotal = (updatedForm: FormData): number => {
    const labor = Number(updatedForm.laborCost) || 0;
    const parts = Number(updatedForm.partsCost) || 0;
    const service = Number(updatedForm.serviceFee) || 0;
    return labor + parts + service;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    updatedForm.totalCost = calculateTotal(updatedForm);
    setForm(updatedForm);

    // Validate field on change if it has been touched
    if (touched.has(name)) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTouched(prev => new Set(prev).add(name));
    
    const error = validateField(name, value);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const validateAllFields = (): boolean => {
    const allFields = new Set([
      'unitNumber', 
      'modelNumber', 
      'location', 
      'issue', 
      'laborCost', 
      'partsCost', 
      'serviceFee'
    ]);
    setTouched(allFields);

    const validationErrors = validateForm(form);
    setErrors(validationErrors);
    
    return Object.keys(validationErrors).length === 0;
  };

  const resetForm = () => {
    setForm(initialFormData);
    setErrors({});
    setTouched(new Set());
  };

  return {
    form,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields,
    resetForm
  };
};
