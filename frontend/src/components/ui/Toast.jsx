import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Button from './Button';

const Toast = ({
  id,
  type = 'info',
  title,
  message,
  duration = 5000,
  persistent = false,
  action,
  onClose,
  className,
  ...props
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!persistent && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, persistent]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  const baseClasses = [
    'relative',
    'max-w-sm',
    'w-full',
    'bg-card-bg',
    'backdrop-blur-xl',
    'border',
    'rounded-xl',
    'shadow-premium-lg',
    'p-4',
    'transition-all',
    'duration-300',
    'ease-out',
    'transform',
    'overflow-hidden',
  ];

  const typeClasses = {
    success: [
      'border-green-500/30',
      'bg-gradient-to-r',
      'from-green-600/5',
      'to-green-500/5',
    ],
    error: [
      'border-red-500/30',
      'bg-gradient-to-r',
      'from-red-600/5',
      'to-red-500/5',
    ],
    warning: [
      'border-yellow-500/30',
      'bg-gradient-to-r',
      'from-yellow-600/5',
      'to-yellow-500/5',
    ],
    info: [
      'border-blue-500/30',
      'bg-gradient-to-r',
      'from-blue-600/5',
      'to-blue-500/5',
    ],
  };

  const iconClasses = cn(
    'flex-shrink-0',
    'w-5',
    'h-5',
    'mt-0.5'
  );

  const contentClasses = cn(
    'ml-3',
    'flex-1'
  );

  const titleClasses = cn(
    'text-sm',
    'font-medium',
    'text-dark-100'
  );

  const messageClasses = cn(
    'text-sm',
    'text-dark-400',
    'mt-1'
  );

  const progressClasses = cn(
    'absolute',
    'bottom-0',
    'left-0',
    'h-1',
    'bg-gradient-to-r',
    'from-primary-500',
    'to-primary-600',
    'transition-all',
    'duration-100',
    'ease-linear',
    {
      'paused': isPaused,
    }
  );

  const icons = {
    success: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" className="text-green-500" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    error: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" className="text-red-500" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    warning: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" className="text-yellow-500" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    info: (
      <svg className={iconClasses} fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" className="text-blue-500" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        baseClasses,
        typeClasses[type],
        {
          'translate-x-0 opacity-100': isVisible,
          'translate-x-full opacity-0': !isVisible,
        },
        className
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <div className="flex items-start">
        {icons[type]}
        
        <div className={contentClasses}>
          {title && (
            <h4 className={titleClasses}>
              {title}
            </h4>
          )}
          
          {message && (
            <p className={messageClasses}>
              {message}
            </p>
          )}
          
          {action && (
            <div className="mt-3">
              {action}
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="ml-4 -mr-1 -mt-1"
          aria-label="Dismiss notification"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Button>
      </div>
      
      {!persistent && duration > 0 && (
        <div
          className={progressClasses}
          style={{
            width: isPaused ? '100%' : '0%',
            transitionDuration: `${duration}ms`,
          }}
        />
      )}
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  title: PropTypes.string,
  message: PropTypes.string,
  duration: PropTypes.number,
  persistent: PropTypes.bool,
  action: PropTypes.node,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};

// Toast Container Component
Toast.Container = function ToastContainer({ toasts, position = 'top-right', className }) {
  const positionClasses = {
    'top-right': ['top-4', 'right-4'],
    'top-left': ['top-4', 'left-4'],
    'bottom-right': ['bottom-4', 'right-4'],
    'bottom-left': ['bottom-4', 'left-4'],
    'top-center': ['top-4', 'left-1/2', '-translate-x-1/2'],
    'bottom-center': ['bottom-4', 'left-1/2', '-translate-x-1/2'],
  };

  const containerClasses = cn(
    'fixed',
    'z-50',
    'space-y-2',
    positionClasses[position],
    className
  );

  return (
    <div className={containerClasses}>
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} />
      ))}
    </div>
  );
};

Toast.Container.propTypes = {
  toasts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
    title: PropTypes.string,
    message: PropTypes.string,
    duration: PropTypes.number,
    persistent: PropTypes.bool,
    action: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  })).isRequired,
  position: PropTypes.oneOf(['top-right', 'top-left', 'bottom-right', 'bottom-left', 'top-center', 'bottom-center']),
  className: PropTypes.string,
};

export default Toast;