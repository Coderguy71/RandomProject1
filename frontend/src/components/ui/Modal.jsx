import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Button from './Button';

const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnBackdrop = true,
  closeOnEscape = true,
  footer,
  className,
  ...props
}) => {
  const modalRef = useRef(null);
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      // Store the previously focused element
      previousFocusRef.current = document.activeElement;
      
      // Focus the modal
      modalRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      if (closeOnEscape) {
        const handleEscape = (e) => {
          if (e.key === 'Escape') {
            onClose();
          }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    } else {
      // Restore body scroll
      document.body.style.overflow = '';
      
      // Restore focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }
  }, [isOpen, onClose, closeOnEscape]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && closeOnBackdrop) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const sizeClasses = {
    xs: ['max-w-sm'],
    sm: ['max-w-md'],
    md: ['max-w-lg'],
    lg: ['max-w-2xl'],
    xl: ['max-w-4xl'],
    full: ['max-w-full', 'mx-4'],
  };

  const modalClasses = cn(
    'fixed',
    'inset-0',
    'z-50',
    'flex',
    'items-center',
    'justify-center',
    'p-4',
    'animate-fade-in'
  );

  const backdropClasses = cn(
    'absolute',
    'inset-0',
    'bg-dark-950/80',
    'backdrop-blur-sm',
    '-z-10'
  );

  const contentClasses = cn(
    'relative',
    'bg-card-bg',
    'backdrop-blur-xl',
    'border',
    'border-card-border',
    'rounded-2xl',
    'shadow-premium-lg',
    'w-full',
    'max-h-[90vh]',
    'flex',
    'flex-col',
    'animate-scale-in',
    'overflow-hidden',
    sizeClasses[size],
    className
  );

  const headerClasses = cn(
    'px-6',
    'py-4',
    'border-b',
    'border-dark-700',
    'flex',
    'items-start',
    'justify-between'
  );

  const titleClasses = cn(
    'text-xl',
    'font-semibold',
    'text-dark-100'
  );

  const descriptionClasses = cn(
    'text-sm',
    'text-dark-400',
    'mt-1'
  );

  const bodyClasses = cn(
    'px-6',
    'py-4',
    'flex-1',
    'overflow-y-auto'
  );

  const footerClasses = cn(
    'px-6',
    'py-4',
    'border-t',
    'border-dark-700',
    'flex',
    'items-center',
    'justify-end',
    'space-x-3'
  );

  return (
    <div className={modalClasses} onClick={handleBackdropClick} {...props}>
      <div className={backdropClasses} />
      
      <div
        ref={modalRef}
        className={contentClasses}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className={headerClasses}>
            <div>
              {title && (
                <h2 id="modal-title" className={titleClasses}>
                  {title}
                </h2>
              )}
              {description && (
                <p id="modal-description" className={descriptionClasses}>
                  {description}
                </p>
              )}
            </div>
            
            {showCloseButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="ml-4 -mr-2"
                aria-label="Close modal"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            )}
          </div>
        )}
        
        {/* Body */}
        <div className={bodyClasses}>
          {children}
        </div>
        
        {/* Footer */}
        {footer && (
          <div className={footerClasses}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.node,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'full']),
  showCloseButton: PropTypes.bool,
  closeOnBackdrop: PropTypes.bool,
  closeOnEscape: PropTypes.bool,
  footer: PropTypes.node,
  className: PropTypes.string,
};

export default Modal;