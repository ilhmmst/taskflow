import React, { useId } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    const baseClasses =
      'w-full bg-primary/10 text-primary p-4 outline-none ' + 
      'font-medium placeholder:text-primary/30 ' +
      'border-2 border-transparent ' +
      'focus:border-primary focus:bg-white/5 ' +
      'transition-all duration-300 rounded-2xl';

    const errorClasses = error
      ? 'border-red-500 ring-2 ring-red-500/20 focus:border-red-500 focus:ring-red-500/20'
      : '';

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label
            htmlFor={inputId}
            className="text-md font-subHeading text-primary font-medium"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`${baseClasses} ${className}`.trim()}
          {...rest}
        />
        {error && (
          <p className="text-sm text-red-500 font-subHeading">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
