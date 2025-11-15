import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Spinner = ({
  size = 'md',
  variant = 'default',
  className,
  label,
  ...props
}) => {
  const baseClasses = [
    'animate-spin',
    'rounded-full',
    'border-2',
    'border-transparent',
  ];

  const sizeClasses = {
    xs: ['w-4', 'h-4'],
    sm: ['w-5', 'h-5'],
    md: ['w-6', 'h-6'],
    lg: ['w-8', 'h-8'],
    xl: ['w-12', 'h-12'],
    '2xl': ['w-16', 'h-16'],
  };

  const variantClasses = {
    default: ['border-t-primary-500'],
    success: ['border-t-green-500'],
    warning: ['border-t-yellow-500'],
    danger: ['border-t-red-500'],
    info: ['border-t-blue-500'],
    white: ['border-t-white'],
    gradient: [
      'border-t-transparent',
      'border-r-transparent',
      'border-b-transparent',
      'border-l-primary-500',
      'bg-gradient-premium',
      'bg-size-300',
      'animate-gradient',
    ],
  };

  const classes = cn(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    className
  );

  const containerClasses = cn(
    'flex',
    'flex-col',
    'items-center',
    'justify-center',
    'space-y-2'
  );

  const labelClasses = cn(
    'text-sm',
    'text-dark-400',
    'animate-pulse'
  );

  const SpinnerComponent = (
    <svg
      className={classes}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  if (label) {
    return (
      <div className={containerClasses}>
        {SpinnerComponent}
        <span className={labelClasses}>{label}</span>
      </div>
    );
  }

  return SpinnerComponent;
};

Spinner.propTypes = {
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info', 'white', 'gradient']),
  className: PropTypes.string,
  label: PropTypes.string,
};

// Pulse Spinner Component
Spinner.Pulse = function PulseSpinner({ size = 'md', className, ...props }) {
  const baseClasses = [
    'animate-pulse',
    'rounded-full',
    'bg-gradient-premium',
    'bg-size-300',
    'animate-gradient',
  ];

  const sizeClasses = {
    xs: ['w-4', 'h-4'],
    sm: ['w-5', 'h-5'],
    md: ['w-6', 'h-6'],
    lg: ['w-8', 'h-8'],
    xl: ['w-12', 'h-12'],
    '2xl': ['w-16', 'h-16'],
  };

  const classes = cn(
    baseClasses,
    sizeClasses[size],
    className
  );

  return <div className={classes} {...props} />;
};

// Dots Spinner Component
Spinner.Dots = function DotsSpinner({ size = 'md', className, ...props }) {
  const baseClasses = [
    'flex',
    'space-x-1',
  ];

  const dotSizeClasses = {
    xs: ['w-1', 'h-1'],
    sm: ['w-1.5', 'h-1.5'],
    md: ['w-2', 'h-2'],
    lg: ['w-3', 'h-3'],
    xl: ['w-4', 'h-4'],
    '2xl': ['w-6', 'h-6'],
  };

  const dotClasses = cn(
    'rounded-full',
    'bg-primary-500',
    'animate-bounce',
    dotSizeClasses[size]
  );

  return (
    <div className={cn(baseClasses, className)} {...props}>
      <div className={cn(dotClasses, 'animation-delay-0')} />
      <div className={cn(dotClasses, 'animation-delay-200')} />
      <div className={cn(dotClasses, 'animation-delay-400')} />
    </div>
  );
};

export default Spinner;