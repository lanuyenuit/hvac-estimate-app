interface FormFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  min?: string;
  step?: string;
}

export const FormField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  type = 'text',
  required = false,
  error,
  touched,
  placeholder,
  min,
  step
}: FormFieldProps) => {
  const hasError = error && touched;

  return (
    <div className="form-field">
      <label>
        {label} {required && '*'}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={hasError ? 'error' : ''}
        placeholder={placeholder}
        min={min}
        step={step}
        required={required}
      />
      {hasError && (
        <span className="error-message">{error}</span>
      )}
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  error?: string;
  touched?: boolean;
  placeholder?: string;
  rows?: number;
  maxLength?: number;
  showCounter?: boolean;
}

export const TextAreaField = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  required = false,
  error,
  touched,
  placeholder,
  rows = 4,
  maxLength = 500,
  showCounter = true
}: TextAreaFieldProps) => {
  const hasError = error && touched;

  return (
    <div className="form-field">
      <label>
        {label} {required && '*'}
      </label>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={hasError ? 'error' : ''}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        required={required}
      />
      {hasError && (
        <span className="error-message">{error}</span>
      )}
      {showCounter && (
        <small className="field-hint">
          {value.length}/{maxLength} characters
        </small>
      )}
    </div>
  );
};
