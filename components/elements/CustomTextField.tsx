import React from "react";

interface CustomTextFieldProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  description?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder = "Enter",
  description = "",
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="grid w-fit max-w-sm items-center gap-1 h-fit">
      {label && (
        <label htmlFor={id} className="font-semibold">
          {label}
        </label>
      )}
      <input
        required={required}
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="bg-[#1F2023] text-sm min-w-[5rem] max-w-[30rem] border py-2 px-3 rounded-lg border-dashed border-[#6F748B] focus:outline-none focus:border-white hover:text-white hover:border-white transition"
      />
      {description && (
        <label htmlFor={id} className="text-sm text-gray-500">
          {description}
        </label>
      )}
    </div>
  );
};
