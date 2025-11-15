import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Card = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  glow = false,
  gradient = false,
  border = true,
  shadow = true,
  ...props
}) => {
  const baseClasses = [
    'rounded-2xl',
    'transition-all',
    'duration-300',
    'ease-out',
  ];

  const variantClasses = {
    default: [
      'bg-card-bg',
      'backdrop-blur-md',
      'border',
      'border-card-border',
    ],
    glass: [
      'bg-glass-medium',
      'backdrop-blur-xl',
      'border',
      'border-white/10',
    ],
    dark: [
      'bg-dark-800',
      'border',
      'border-dark-700',
    ],
    gradient: [
      'bg-gradient-premium',
      'bg-size-300',
      'animate-gradient',
      'border',
      'border-primary-500/20',
    ],
  };

  const paddingClasses = {
    none: [],
    sm: ['p-4'],
    md: ['p-6'],
    lg: ['p-8'],
    xl: ['p-10'],
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    paddingClasses[padding],
    {
      'hover:shadow-premium-lg hover:-translate-y-1 hover:border-primary-500/40': hover,
      'shadow-glow': glow,
      'shadow-premium': shadow && !hover,
      'shadow-none': !shadow,
      'border-0': !border,
    },
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'glass', 'dark', 'gradient']),
  padding: PropTypes.oneOf(['none', 'sm', 'md', 'lg', 'xl']),
  hover: PropTypes.bool,
  glow: PropTypes.bool,
  gradient: PropTypes.bool,
  border: PropTypes.bool,
  shadow: PropTypes.bool,
};

// Card Header Component
Card.Header = function CardHeader({ children, className, ...props }) {
  const classes = cn(
    'flex items-center justify-between mb-6',
    className
  );
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Title Component
Card.Title = function CardTitle({ children, className, ...props }) {
  const classes = cn(
    'text-xl font-semibold text-dark-100',
    className
  );
  return (
    <h3 className={classes} {...props}>
      {children}
    </h3>
  );
};

// Card Description Component
Card.Description = function CardDescription({ children, className, ...props }) {
  const classes = cn(
    'text-sm text-dark-400 mt-1',
    className
  );
  return (
    <p className={classes} {...props}>
      {children}
    </p>
  );
};

// Card Content Component
Card.Content = function CardContent({ children, className, ...props }) {
  const classes = cn(
    'text-dark-200',
    className
  );
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Footer Component
Card.Footer = function CardFooter({ children, className, ...props }) {
  const classes = cn(
    'flex items-center justify-between mt-6 pt-6 border-t border-dark-700',
    className
  );
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

export default Card;