"use client";
import React from "react";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSubmit?: (e: React.FormEvent) => void;
  placeholder?: string;
  submitLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  valid?: boolean;
  className?: string;
};

export default function PillInput({
  value,
  onChange,
  onSubmit,
  placeholder = "Paste HF URL or org/model",
  submitLabel = "Submit",
  loading = false,
  disabled = false,
  valid = true,
  className = "",
}: Props) {
  const isDisabled = disabled || loading || !valid;
  return (
    <form onSubmit={onSubmit} className={`mx-auto ${className}`}>
      <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-5 py-4 shadow-sm backdrop-blur ring-1 ring-black/5">
        <span className="select-none text-gray-400 transition-transform hover:scale-110">+</span>
        <input
          type="text"
          className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-400 transition-shadow focus-visible:ring-2 focus-visible:ring-blue-500/30 rounded-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled || loading}
          aria-label={placeholder}
        />
        <div className="mx-1 hidden h-6 w-px bg-gray-200 md:block" />
        <button
          type="submit"
          disabled={isDisabled}
          className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition-shadow focus-visible:ring-2 focus-visible:ring-blue-500/40 ${
            isDisabled ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? `${submitLabel}…` : submitLabel}
        </button>
      </div>
    </form>
  );
}

