import React, { useState, forwardRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Input = forwardRef(({
  label,
  error,
  helperText,
  icon,
  type = 'text',
  className,
  containerClassName,
  required = false,
  disabled = false,
  loading = false,
  ...props
}, ref) => {
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const containerClasses = cn(
    'relative',
    containerClassName
  );

  const inputWrapperClasses = cn(
    'relative',
    'group',
    'transition-all',
    'duration-300'
  );

  const inputClasses = cn(
    'w-full',
    'px-4',
    'py-3',
    'bg-dark-800/50',
    'border',
    'rounded-xl',
    'text-dark-100',
    'placeholder-dark-400',
    'transition-all',
    'duration-300',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-dark-950',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'backdrop-blur-sm',
    {
      'border-primary-600/30': !error && !focused,
      'border-primary-500/50': !error && focused,
      'border-red-500/50': error,
      'focus:ring-primary-500': !error,
      'focus:ring-red-500': error,
      'shadow-glass-sm': focused,
      'hover:border-primary-500/30': !error && !focused,
      'pl-12': icon,
      'pr-12': type === 'password',
    },
    className
  );

  const labelClasses = cn(
    'block',
    'text-sm',
    'font-medium',
    'mb-2',
    'transition-colors',
    'duration-200',
    {
      'text-primary-400': !error,
      'text-red-400': error,
    }
  );

  const helperTextClasses = cn(
    'mt-2',
    'text-xs',
    'transition-colors',
    'duration-200',
    {
      'text-dark-400': !error,
      'text-red-400': error,
    }
  );

  const iconClasses = cn(
    'absolute',
    'left-4',
    'top-1/2',
    '-translate-y-1/2',
    'w-5',
    'h-5',
    'text-dark-400',
    'transition-colors',
    'duration-200',
    {
      'text-primary-500': focused,
      'text-red-500': error,
    }
  );

  const togglePasswordClasses = cn(
    'absolute',
    'right-4',
    'top-1/2',
    '-translate-y-1/2',
    'w-5',
    'h-5',
    'text-dark-400',
    'cursor-pointer',
    'transition-colors',
    'duration-200',
    'hover:text-primary-400',
    'focus:outline-none',
    {
      'text-primary-500': focused,
    }
  );

  return (
    <div className={containerClasses}>
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      
      <div className={inputWrapperClasses}>
        {icon && (
          <div className={iconClasses}>
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          disabled={disabled || loading}
          {...props}
        />
        
        {type === 'password' && (
          <button
            type="button"
            className={togglePasswordClasses}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? (
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        )}
        
        {/* Loading overlay */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-800/50 backdrop-blur-sm rounded-xl">
            <svg className="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
        )}
      </div>
      
      {(error || helperText) && (
        <p className={helperTextClasses}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  icon: PropTypes.node,
  type: PropTypes.string,
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
};

export default Input;