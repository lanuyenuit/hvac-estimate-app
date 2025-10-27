import type { DownloadFormat } from '../types/form.types';

interface DownloadButtonsProps {
  onDownload: (format: DownloadFormat) => void;
  isSubmitting: boolean;
}

export const DownloadButtons = ({ onDownload, isSubmitting }: DownloadButtonsProps) => {
  return (
    <div className="btn-group">
      <button
        type="button"
        className="btn btn-pdf"
        onClick={() => onDownload('pdf')}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Generating...' : 'Download PDF'}
      </button>
      <button
        type="button"
        className="btn btn-excel"
        onClick={() => onDownload('excel')}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Generating...' : 'Download Excel'}
      </button>
    </div>
  );
};
