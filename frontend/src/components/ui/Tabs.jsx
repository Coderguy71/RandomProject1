import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Tabs = ({
  tabs,
  defaultTab = 0,
  variant = 'default',
  size = 'md',
  orientation = 'horizontal',
  className,
  tabsClassName,
  contentClassName,
  onChange,
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleTabChange = (index) => {
    setActiveTab(index);
    onChange?.(index, tabs[index]);
  };

  const baseClasses = cn('w-full', className);

  const tabsContainerClasses = cn(
    'flex',
    {
      'flex-row space-x-1': orientation === 'horizontal',
      'flex-col space-y-1': orientation === 'vertical',
    },
    tabsClassName
  );

  const tabClasses = (index) => cn(
    'relative',
    'font-medium',
    'transition-all',
    'duration-200',
    'ease-out',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2',
    'focus:ring-offset-dark-950',
    'rounded-lg',
    {
      // Default variant
      'px-4 py-2 text-sm': variant === 'default' && size === 'md',
      'px-3 py-1.5 text-xs': variant === 'default' && size === 'sm',
      'px-5 py-2.5 text-base': variant === 'default' && size === 'lg',
      'bg-dark-800 text-dark-300 hover:bg-dark-700 hover:text-dark-100': variant === 'default',
      'bg-primary-600 text-white shadow-premium': variant === 'default' && activeTab === index,

      // Pills variant
      'px-4 py-2 text-sm': variant === 'pills' && size === 'md',
      'px-3 py-1.5 text-xs': variant === 'pills' && size === 'sm',
      'px-5 py-2.5 text-base': variant === 'pills' && size === 'lg',
      'bg-dark-800/50 text-dark-400 hover:bg-dark-800 hover:text-dark-300 border border-dark-700': variant === 'pills',
      'bg-gradient-premium text-white border-primary-500/30': variant === 'pills' && activeTab === index,

      // Underline variant
      'px-4 py-2 text-sm border-b-2 -mb-0.5': variant === 'underline' && size === 'md',
      'px-3 py-1.5 text-xs border-b-2 -mb-0.5': variant === 'underline' && size === 'sm',
      'px-5 py-2.5 text-base border-b-2 -mb-0.5': variant === 'underline' && size === 'lg',
      'text-dark-400 border-transparent hover:text-dark-300': variant === 'underline',
      'text-primary-400 border-primary-500': variant === 'underline' && activeTab === index,
    }
  );

  const contentClasses = cn(
    'mt-6',
    'animate-fade-in',
    contentClassName
  );

  const activeTabContent = tabs[activeTab]?.content;

  return (
    <div className={baseClasses} {...props}>
      {/* Tab Navigation */}
      <div className={tabsContainerClasses} role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id || index}
            className={tabClasses(index)}
            onClick={() => handleTabChange(index)}
            role="tab"
            aria-selected={activeTab === index}
            aria-controls={`tabpanel-${index}`}
            disabled={tab.disabled}
          >
            {tab.icon && (
              <span className="mr-2">
                {tab.icon}
              </span>
            )}
            {tab.label}
            {tab.badge && (
              <span className="ml-2">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div
        className={contentClasses}
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTabContent}
      </div>
    </div>
  );
};

Tabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.node.isRequired,
      content: PropTypes.node.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.node,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  defaultTab: PropTypes.number,
  variant: PropTypes.oneOf(['default', 'pills', 'underline']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
  tabsClassName: PropTypes.string,
  contentClassName: PropTypes.string,
  onChange: PropTypes.func,
};

// Tab Panel Component (for manual control)
Tabs.Panel = function TabPanel({ children, isActive, className, ...props }) {
  const classes = cn(
    'animate-fade-in',
    {
      'hidden': !isActive,
      'block': isActive,
    },
    className
  );

  return (
    <div className={classes} role="tabpanel" {...props}>
      {children}
    </div>
  );
};

Tabs.Panel.propTypes = {
  children: PropTypes.node.isRequired,
  isActive: PropTypes.bool,
  className: PropTypes.string,
};

export default Tabs;