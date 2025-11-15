import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const ProgressBar = ({
  value = 0,
  max = 100,
  variant = 'default',
  size = 'md',
  showLabel = false,
  label,
  animated = true,
  striped = false,
  className,
  ...props
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const baseClasses = [
    'w-full',
    'bg-dark-800/50',
    'rounded-full',
    'overflow-hidden',
    'backdrop-blur-sm',
  ];

  const sizeClasses = {
    xs: ['h-1'],
    sm: ['h-2'],
    md: ['h-3'],
    lg: ['h-4'],
    xl: ['h-6'],
  };

  const barVariantClasses = {
    default: [
      'bg-gradient-to-r',
      'from-primary-600',
      'to-primary-500',
    ],
    success: [
      'bg-gradient-to-r',
      'from-green-600',
      'to-green-500',
    ],
    warning: [
      'bg-gradient-to-r',
      'from-yellow-600',
      'to-yellow-500',
    ],
    danger: [
      'bg-gradient-to-r',
      'from-red-600',
      'to-red-500',
    ],
    info: [
      'bg-gradient-to-r',
      'from-blue-600',
      'to-blue-500',
    ],
    gradient: [
      'bg-gradient-premium',
      'bg-size-300',
    ],
  };

  const barClasses = cn(
    'h-full',
    'rounded-full',
    'transition-all',
    'duration-500',
    'ease-out',
    'relative',
    'overflow-hidden',
    barVariantClasses[variant],
    {
      'animate-gradient': animated && variant === 'gradient',
      'animate-pulse': animated && percentage < 100,
    }
  );

  const stripedClasses = cn(
    'absolute inset-0',
    'bg-gradient-to-r',
    'from-transparent',
    'via-white/10',
    'to-transparent',
    'bg-size-200',
    {
      'animate-gradient': striped && animated,
    }
  );

  const labelClasses = cn(
    'text-sm',
    'font-medium',
    'mb-2',
    'flex',
    'items-center',
    'justify-between',
  );

  const labelTextClasses = cn(
    'text-dark-300'
  );

  const labelValueClasses = cn(
    'text-primary-400',
    'font-mono'
  );

  return (
    <div className={cn('w-full', className)} {...props}>
      {(showLabel || label) && (
        <div className={labelClasses}>
          <span className={labelTextClasses}>{label || 'Progress'}</span>
          <span className={labelValueClasses}>{Math.round(percentage)}%</span>
        </div>
      )}
      
      <div className={cn(baseClasses, sizeClasses[size])}>
        <div
          className={barClasses}
          style={{ width: `${percentage}%` }}
        >
          {striped && (
            <div className={stripedClasses} />
          )}
          
          {/* Animated glow effect */}
          {animated && (
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  value: PropTypes.number,
  max: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info', 'gradient']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  showLabel: PropTypes.bool,
  label: PropTypes.string,
  animated: PropTypes.bool,
  striped: PropTypes.bool,
  className: PropTypes.string,
};

export default ProgressBar;