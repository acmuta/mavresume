import React from "react";

interface CustomTextFieldProps {
  id: string;
  label: string;
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
      <label htmlFor="" className="font-semibold">
        {label}
      </label>
      <input
        required={required}
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="bg-[#1F2023] min-w-[5rem] max-w-[30rem] border py-2 px-3 rounded-lg border-dotted border-[#6F748B] focus:outline-none focus:border-[#6F748B]"


      />
      <label htmlFor="" className="text-sm text-gray-500">{description}</label>
    </div>
  );
};
