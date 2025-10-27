import { useState } from 'react';
import './styles/App.scss';
import { useFormValidation } from './hooks/useFormValidation';
import { downloadEstimate } from './services/api.service';
import { FormField, TextAreaField } from './components/FormField';
import { DownloadButtons } from './components/DownloadButtons';
import type { DownloadFormat } from './types/form.types';

function App() {
  const {
    form,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAllFields
  } = useFormValidation();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateAllFields()) {
      return;
    }

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
          placeholder="Describe the HVAC issue in detail..."
          required
          maxLength={500}
          showCounter
        />

        <FormField
          label="Labor"
          name="laborCost"
          type="number"
          value={form.laborCost}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.laborCost}
          touched={touched.has('laborCost')}
          placeholder="0.00"
          min="0"
          step="0.01"
        />

        <FormField
          label="Parts"
          name="partsCost"
          type="number"
          value={form.partsCost}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.partsCost}
          touched={touched.has('partsCost')}
          placeholder="0.00"
          min="0"
          step="0.01"
        />

        <FormField
          label="Service Fee"
          name="serviceFee"
          type="number"
          value={form.serviceFee}
          onChange={handleChange}
          onBlur={handleBlur}
          error={errors.serviceFee}
          touched={touched.has('serviceFee')}
          placeholder="0.00"
          min="0"
          step="0.01"
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
  );
}

export default App;
