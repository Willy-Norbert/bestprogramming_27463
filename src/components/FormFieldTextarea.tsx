import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface FormFieldTextareaProps {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onBlur?: () => void;
  rows?: number;
}

export const FormFieldTextarea: React.FC<FormFieldTextareaProps> = ({
  label,
  id,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
  error,
  onBlur,
  rows = 3,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
        rows={rows}
        className={error ? 'border-destructive' : ''}
      />
      {error && (
        <div className="flex items-center gap-1 text-sm text-destructive">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

