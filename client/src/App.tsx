import { useState } from 'react';
import '../src/styles/App.scss';
import type { DownloadFormat } from './types/form.types';
import { useFormValidation } from './hooks/useFormValidation';
import { FormField, TextAreaField } from './components/FormField';
import { DownloadButtons } from './components/DownloadButtons';
import { downloadEstimate } from './services/api.service';

function App() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    form,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields
  } = useFormValidation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      return;
    }

    // Form is valid, proceed with submission
    console.log('Form is valid, ready to submit:', form);
  };

  const handleDownload = async (format: DownloadFormat) => {
    if (!validateAllFields()) {
      alert('Please fix all validation errors before downloading');
      return;
    }

    setIsSubmitting(true);
    
    try {
      await downloadEstimate(format, form);
    } catch (error) {
      console.error('Download error:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Failed to download file'}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="form-container">
      <h2>HVAC Estimate Form</h2>
      <form onSubmit={handleSubmit}>
        <FormField
          label="Unit Number"
          name="unitNumber"
          type="text"
          value={form.unitNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.unitNumber}
          touched={touched.has('unitNumber')}
          required
        />

        <FormField
          label="Model Number"
          name="modelNumber"
          type="text"
          value={form.modelNumber}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.modelNumber}
          touched={touched.has('modelNumber')}
          required
        />

        <FormField
          label="Location"
          name="location"
          type="text"
          value={form.location}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.location}
          touched={touched.has('location')}
          required
        />

        <TextAreaField
          label="Issue Description"
          name="issue"
          value={form.issue}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.issue}
          touched={touched.has('issue')}
          rows={4}
          placeholder="Describe the HVAC issue in detail..."
          maxLength={500}
          required
        />

        <FormField
          label="Labor ($)"
          name="laborCost"
          type="number"
          value={form.laborCost}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.laborCost}
          touched={touched.has('laborCost')}
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <FormField
          label="Parts ($)"
          name="partsCost"
          type="number"
          value={form.partsCost}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.partsCost}
          touched={touched.has('partsCost')}
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <FormField
          label="Service Fee ($)"
          name="serviceFee"
          type="number"
          value={form.serviceFee}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.serviceFee}
          touched={touched.has('serviceFee')}
          min="0"
          step="0.01"
          placeholder="0.00"
        />

        <div className="form-field total-field">
          <label>Total Estimate ($)</label>
          <input 
            type="text" 
            value={`$${form.totalCost.toFixed(2)}`} 
            readOnly 
            className="total-input"
          />
        </div>

        <DownloadButtons
          onDownload={handleDownload}
          isSubmitting={isSubmitting}
        />
      </form>
    </div>
  )
}

export default App
