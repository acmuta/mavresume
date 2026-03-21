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
    <div className="grid w-full items-center gap-2">
      {label && (
        <label
          htmlFor={id}
          className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#89a5ff]"
        >
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
        className="h-12 w-full rounded-2xl border border-[#2b3242] bg-[#10121a]/88 px-4 text-sm text-white placeholder:text-[#6d7895] outline-none transition focus:border-[#4b5a82] focus:bg-[#161b25] hover:border-[#3f4a67]"
      />
      {description && (
        <label htmlFor={id} className="text-sm leading-relaxed text-[#6d7895]">
          {description}
        </label>
      )}
    </div>
  );
};
