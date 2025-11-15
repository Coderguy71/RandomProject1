import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  onClick,
  type = 'button',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  ...props
}) => {
  const baseClasses = [
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-300',
    'ease-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-dark-950',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'overflow-hidden',
    'group',
  ];

  const variantClasses = {
    primary: [
      'bg-gradient-to-r',
      'from-primary-600',
      'to-primary-700',
      'text-white',
      'hover:from-primary-700',
      'hover:to-primary-800',
      'focus:ring-primary-500',
      'shadow-premium',
      'hover:shadow-premium-lg',
      'transform',
      'hover:-translate-y-0.5',
    ],
    secondary: [
      'bg-dark-800',
      'text-primary-300',
      'border',
      'border-primary-600/30',
      'hover:bg-dark-700',
      'hover:border-primary-500/50',
      'hover:text-primary-200',
      'focus:ring-primary-500',
      'shadow-glass',
      'hover:shadow-glass-sm',
    ],
    ghost: [
      'bg-transparent',
      'text-primary-400',
      'hover:bg-primary-600/10',
      'hover:text-primary-300',
      'focus:ring-primary-500',
    ],
    gradient: [
      'bg-gradient-premium',
      'bg-size-300',
      'text-white',
      'hover:shadow-glow-lg',
      'focus:ring-primary-500',
      'animate-gradient',
      'transform',
      'hover:-translate-y-0.5',
    ],
    danger: [
      'bg-gradient-to-r',
      'from-red-600',
      'to-red-700',
      'text-white',
      'hover:from-red-700',
      'hover:to-red-800',
      'focus:ring-red-500',
      'shadow-premium',
      'hover:shadow-premium-lg',
    ],
  };

  const sizeClasses = {
    xs: ['text-xs', 'px-2.5', 'py-1.5', 'rounded'],
    sm: ['text-sm', 'px-3', 'py-2', 'rounded-lg'],
    md: ['text-sm', 'px-4', 'py-2.5', 'rounded-lg'],
    lg: ['text-base', 'px-6', 'py-3', 'rounded-xl'],
    xl: ['text-lg', 'px-8', 'py-4', 'rounded-xl'],
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && 'w-full',
    className
  );

  const renderIcon = (position) => {
    if (!icon) return null;
    const IconComponent = icon;
    const iconClasses = cn(
      'transition-transform',
      'duration-300',
      position === 'left' ? 'mr-2' : 'ml-2',
      'group-hover:scale-110'
    );
    return <IconComponent className={iconClasses} />;
  };

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {/* Ripple effect overlay */}
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
      
      {/* Loading spinner */}
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
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
      )}
      
      {iconPosition === 'left' && renderIcon('left')}
      {children}
      {iconPosition === 'right' && renderIcon('right')}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'gradient', 'danger']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
  loading: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  fullWidth: PropTypes.bool,
  icon: PropTypes.elementType,
  iconPosition: PropTypes.oneOf(['left', 'right']),
};

export default Button;