export interface FieldProps {
  value: string;
  name: string;
  type: string;
  onChange: (newValue: string, name: string) => void;
  error?: string;
}
