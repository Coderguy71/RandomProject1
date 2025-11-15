import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Stepper = ({
  steps,
  currentStep = 0,
  orientation = 'horizontal',
  size = 'md',
  variant = 'default',
  className,
  onStepClick,
  ...props
}) => {
  const isVertical = orientation === 'vertical';

  const baseClasses = cn(
    'flex',
    {
      'flex-row items-center space-x-4': !isVertical,
      'flex-col space-y-4': isVertical,
    },
    className
  );

  const connectorClasses = cn(
    'flex-1',
    {
      'h-0.5': !isVertical,
      'w-0.5 h-8': isVertical,
    }
  );

  const getConnectorColor = (index) => {
    if (index < currentStep) {
      return 'bg-primary-500';
    } else if (index === currentStep - 1) {
      return 'bg-gradient-to-r from-primary-500 to-primary-400';
    }
    return 'bg-dark-700';
  };

  const stepClasses = (index) => cn(
    'relative',
    'flex',
    'items-center',
    'transition-all',
    'duration-300',
    {
      'flex-col text-center': !isVertical,
      'flex-row items-start space-x-4': isVertical,
    }
  );

  const stepIndicatorClasses = (index) => cn(
    'relative',
    'flex',
    'items-center',
    'justify-center',
    'rounded-full',
    'font-medium',
    'transition-all',
    'duration-300',
    'border-2',
    {
      'w-8 h-8 text-xs': size === 'sm',
      'w-10 h-10 text-sm': size === 'md',
      'w-12 h-12 text-base': size === 'lg',
    },
    {
      // Default variant
      'bg-dark-800 border-dark-600 text-dark-400': variant === 'default' && index > currentStep,
      'bg-primary-600 border-primary-500 text-white shadow-premium': variant === 'default' && index === currentStep,
      'bg-primary-500 border-primary-400 text-white': variant === 'default' && index < currentStep,

      // Gradient variant
      'bg-dark-800 border-dark-600 text-dark-400': variant === 'gradient' && index > currentStep,
      'bg-gradient-premium border-primary-500 text-white shadow-glow animate-gradient': variant === 'gradient' && index === currentStep,
      'bg-gradient-to-r from-primary-600 to-primary-500 border-primary-400 text-white': variant === 'gradient' && index < currentStep,
    }
  );

  const stepLabelClasses = (index) => cn(
    'absolute',
    'whitespace-nowrap',
    'transition-all',
    'duration-300',
    {
      'top-full mt-2 left-1/2 -translate-x-1/2': !isVertical,
      'top-1/2 left-full ml-4 -translate-y-1/2': isVertical,
    },
    {
      'text-xs': size === 'sm',
      'text-sm': size === 'md',
      'text-base': size === 'lg',
    },
    {
      'text-dark-500': index > currentStep,
      'text-primary-400 font-medium': index === currentStep,
      'text-dark-300': index < currentStep,
    }
  );

  const isClickable = onStepClick && typeof onStepClick === 'function';
  const stepClickableClasses = (index) => cn(
    {
      'cursor-pointer hover:scale-105': isClickable && index <= currentStep,
      'cursor-not-allowed opacity-60': !isClickable || index > currentStep,
    }
  );

  return (
    <div className={baseClasses} {...props}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id || index}>
          {/* Step */}
          <div className={stepClasses(index)}>
            <div
              className={cn(
                stepIndicatorClasses(index),
                stepClickableClasses(index)
              )}
              onClick={() => isClickable && index <= currentStep && onStepClick(index)}
              role={isClickable ? 'button' : undefined}
              tabIndex={isClickable && index <= currentStep ? 0 : undefined}
            >
              {index < currentStep ? (
                // Completed step - checkmark
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                // Current or future step - number
                <span>{index + 1}</span>
              )}
            </div>
            
            {/* Step Label */}
            <div className={stepLabelClasses(index)}>
              {step.label}
            </div>
          </div>

          {/* Connector */}
          {index < steps.length - 1 && (
            <div
              className={cn(connectorClasses, getConnectorColor(index))}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

Stepper.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node.isRequired,
    })
  ).isRequired,
  currentStep: PropTypes.number,
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.oneOf(['default', 'gradient']),
  className: PropTypes.string,
  onStepClick: PropTypes.func,
};

// Step Content Component
Stepper.Content = function StepperContent({ steps, currentStep, className, ...props }) {
  const classes = cn(
    'mt-8',
    'animate-fade-in',
    className
  );

  return (
    <div className={classes} {...props}>
      {steps[currentStep]?.content}
    </div>
  );
};

Stepper.Content.propTypes = {
  steps: PropTypes.arrayOf(
    PropTypes.shape({
      content: PropTypes.node,
    })
  ).isRequired,
  currentStep: PropTypes.number,
  className: PropTypes.string,
};

export default Stepper;