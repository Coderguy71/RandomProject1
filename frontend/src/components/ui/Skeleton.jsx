import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Skeleton = ({
  variant = 'text',
  width,
  height,
  className,
  animation = 'pulse',
  lines = 1,
  circle = false,
  ...props
}) => {
  const baseClasses = cn(
    'rounded',
    'bg-dark-800',
    'overflow-hidden',
    'relative',
    {
      'animate-pulse': animation === 'pulse',
      'animate-skeleton': animation === 'wave',
    }
  );

  const variantClasses = {
    text: [
      'h-4',
      'rounded-md',
    ],
    circular: [
      'rounded-full',
    ],
    rectangular: [
      'rounded-lg',
    ],
    avatar: [
      'w-10',
      'h-10',
      'rounded-full',
    ],
    button: [
      'h-10',
      'rounded-lg',
    ],
    card: [
      'rounded-xl',
    ],
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    {
      'w-10 h-10': variant === 'avatar',
      'w-full': !width && variant !== 'avatar',
      'h-4': !height && variant === 'text',
      'rounded-full': circle,
    },
    className
  );

  const style = {
    width: width || (variant === 'avatar' ? '2.5rem' : undefined),
    height: height || (variant === 'avatar' ? '2.5rem' : undefined),
    ...props.style,
  };

  // For text lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses.text,
              {
                'w-3/4': index === lines - 1, // Last line is shorter
                'w-full': index < lines - 1,
              }
            )}
            style={style}
          />
        ))}
      </div>
    );
  }

  // For card skeleton with multiple elements
  if (variant === 'card') {
    return (
      <div className={cn('p-4 space-y-4', className)} {...props}>
        {/* Header */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-dark-800 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-dark-800 rounded-md animate-pulse w-3/4" />
            <div className="h-3 bg-dark-800 rounded-md animate-pulse w-1/2" />
          </div>
        </div>
        
        {/* Content */}
        <div className="space-y-2">
          <div className="h-4 bg-dark-800 rounded-md animate-pulse" />
          <div className="h-4 bg-dark-800 rounded-md animate-pulse w-5/6" />
          <div className="h-4 bg-dark-800 rounded-md animate-pulse w-4/6" />
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center pt-4">
          <div className="h-8 bg-dark-800 rounded-lg animate-pulse w-20" />
          <div className="h-8 bg-dark-800 rounded-lg animate-pulse w-24" />
        </div>
      </div>
    );
  }

  // For list item skeleton
  if (variant === 'list') {
    return (
      <div className={cn('flex items-center space-x-3 p-3', className)} {...props}>
        <div className="w-10 h-10 rounded-full bg-dark-800 animate-pulse flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-dark-800 rounded-md animate-pulse w-3/4" />
          <div className="h-3 bg-dark-800 rounded-md animate-pulse w-1/2" />
        </div>
        <div className="h-6 bg-dark-800 rounded-md animate-pulse w-16" />
      </div>
    );
  }

  // For table skeleton
  if (variant === 'table') {
    return (
      <div className={cn('space-y-2', className)} {...props}>
        {/* Header */}
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-8 bg-dark-800 rounded-md animate-pulse" />
          ))}
        </div>
        
        {/* Rows */}
        {Array.from({ length: lines }).map((_, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <div key={colIndex} className="h-6 bg-dark-800 rounded-md animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={classes} style={style} {...props}>
      {/* Shimmer effect for wave animation */}
      {animation === 'wave' && (
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-gradient" />
      )}
    </div>
  );
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(['text', 'circular', 'rectangular', 'avatar', 'button', 'card', 'list', 'table']),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  animation: PropTypes.oneOf(['pulse', 'wave', 'none']),
  lines: PropTypes.number,
  circle: PropTypes.bool,
};

// Skeleton Group Component
Skeleton.Group = function SkeletonGroup({ children, className, ...props }) {
  const classes = cn('space-y-4', className);
  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Skeleton.Group.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Skeleton;