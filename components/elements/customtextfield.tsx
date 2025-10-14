import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

interface CustomTextFieldProps {
  id: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
}

export const CustomTextField: React.FC<CustomTextFieldProps> = ({
  id,
  label,
  type = "text",
  placeholder = "Enter",
  value,
  onChange,
  required = false,
}) => {
  return (
    <div className="grid w-full max-w-sm items-center gap-1">
      <label htmlFor="" className="font-semibold ">
        {label}
      </label>
      <input
        required={required}
        id={id}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="bg-[#1F2023] w-80 border py-2 px-4 rounded-lg border-dotted border-[#6F748B] focus:outline-none focus:border-[#6F748B]"
      />
    </div>
  );
};
