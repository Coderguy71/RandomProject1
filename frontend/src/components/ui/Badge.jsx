import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  className,
  icon,
  removable = false,
  onRemove,
  ...props
}) => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'font-medium',
    'rounded-full',
    'transition-all',
    'duration-200',
  ];

  const variantClasses = {
    default: [
      'bg-primary-600/20',
      'text-primary-300',
      'border',
      'border-primary-500/30',
    ],
    success: [
      'bg-green-600/20',
      'text-green-300',
      'border',
      'border-green-500/30',
    ],
    warning: [
      'bg-yellow-600/20',
      'text-yellow-300',
      'border',
      'border-yellow-500/30',
    ],
    danger: [
      'bg-red-600/20',
      'text-red-300',
      'border',
      'border-red-500/30',
    ],
    info: [
      'bg-blue-600/20',
      'text-blue-300',
      'border',
      'border-blue-500/30',
    ],
    gradient: [
      'bg-gradient-premium',
      'text-white',
      'border',
      'border-primary-500/30',
    ],
    ghost: [
      'bg-dark-800/50',
      'text-dark-300',
      'border',
      'border-dark-600/30',
    ],
  };

  const sizeClasses = {
    xs: ['text-xs', 'px-2', 'py-0.5'],
    sm: ['text-xs', 'px-2.5', 'py-1'],
    md: ['text-sm', 'px-3', 'py-1'],
    lg: ['text-base', 'px-4', 'py-1.5'],
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  const iconClasses = cn(
    'w-3 h-3',
    {
      'mr-1': size === 'xs' || size === 'sm',
      'mr-1.5': size === 'md',
      'mr-2': size === 'lg',
    }
  );

  const removeButtonClasses = cn(
    'ml-1.5',
    'hover:bg-white/10',
    'rounded-full',
    'p-0.5',
    'transition-colors',
    'duration-200',
    'focus:outline-none',
    'focus:ring-1',
    'focus:ring-white/20'
  );

  return (
    <span className={classes} {...props}>
      {icon && <span className={iconClasses}>{icon}</span>}
      {children}
      {removable && (
        <button
          type="button"
          className={removeButtonClasses}
          onClick={onRemove}
          aria-label="Remove"
        >
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['default', 'success', 'warning', 'danger', 'info', 'gradient', 'ghost']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  className: PropTypes.string,
  icon: PropTypes.node,
  removable: PropTypes.bool,
  onRemove: PropTypes.func,
};

export default Badge;