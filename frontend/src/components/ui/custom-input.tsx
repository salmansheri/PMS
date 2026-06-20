"use client";

import type React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  icon,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block font-label-caps text-on-surface-variant mb-2 uppercase text-xs"
        >
          {label}
        </label>
      )}
      <div className="relative w-full group">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={`w-full input-tech py-2.5 pr-4 text-body-md ${
            icon ? "pl-10" : "pl-4"
          } ${className}`}
          {...props}
        />
      </div>
    </div>
  );
};

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  icon?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({
  label,
  icon,
  options,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className="block font-label-caps text-on-surface-variant mb-2 uppercase text-xs"
        >
          {label}
        </label>
      )}
      <div className="relative w-full group">
        {icon && (
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant group-focus-within:text-primary transition-colors">
            {icon}
          </span>
        )}
        <select
          id={id}
          className={`w-full input-tech py-3 pr-10 text-body-md appearance-none cursor-pointer ${
            icon ? "pl-10" : "pl-4"
          } ${className}`}
          {...props}
        >
          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="bg-surface-container"
            >
              {opt.label}
            </option>
          ))}
        </select>
        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant group-hover:text-primary transition-colors">
          expand_more
        </span>
      </div>
    </div>
  );
};

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  className = "",
  id,
  ...props
}) => {
  return (
    <div className="w-full h-full flex flex-col">
      {label && (
        <label
          htmlFor={id}
          className="block font-label-caps text-on-surface-variant mb-2 uppercase text-xs"
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        className={`w-full bg-transparent border-none focus:ring-0 text-body-lg font-body-lg leading-relaxed text-on-surface placeholder:text-on-surface-variant/30 resize-none custom-scrollbar outline-none ${className}`}
        {...props}
      />
    </div>
  );
};
