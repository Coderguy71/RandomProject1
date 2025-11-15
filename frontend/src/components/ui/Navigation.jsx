import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Navigation = ({
  items,
  activeItem,
  orientation = 'horizontal',
  variant = 'default',
  size = 'md',
  className,
  onItemClick,
  ...props
}) => {
  const isVertical = orientation === 'vertical';

  const baseClasses = cn(
    'flex',
    {
      'flex-row items-center space-x-1': !isVertical,
      'flex-col space-y-1': isVertical,
    },
    className
  );

  const itemClasses = (item, index) => cn(
    'relative',
    'group',
    'flex',
    'items-center',
    'transition-all',
    'duration-200',
    'ease-out',
    'rounded-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2',
    'focus:ring-offset-dark-950',
    {
      // Default variant
      'px-4 py-2': variant === 'default' && size === 'md',
      'px-3 py-1.5': variant === 'default' && size === 'sm',
      'px-5 py-2.5': variant === 'default' && size === 'lg',
      'text-dark-300 hover:bg-dark-800 hover:text-dark-100': variant === 'default',
      'bg-primary-600/10 text-primary-300 border-l-2 border-primary-500': variant === 'default' && activeItem === item.id && isVertical,
      'bg-primary-600 text-white shadow-premium': variant === 'default' && activeItem === item.id && !isVertical,

      // Pills variant
      'px-4 py-2': variant === 'pills' && size === 'md',
      'px-3 py-1.5': variant === 'pills' && size === 'sm',
      'px-5 py-2.5': variant === 'pills' && size === 'lg',
      'bg-dark-800/30 text-dark-400 hover:bg-dark-800/50 hover:text-dark-300': variant === 'pills',
      'bg-gradient-premium text-white shadow-glow': variant === 'pills' && activeItem === item.id,

      // Minimal variant
      'px-3 py-1.5': variant === 'minimal' && size === 'md',
      'px-2 py-1': variant === 'minimal' && size === 'sm',
      'px-4 py-2': variant === 'minimal' && size === 'lg',
      'text-dark-400 hover:text-primary-400': variant === 'minimal',
      'text-primary-400 font-medium': variant === 'minimal' && activeItem === item.id,
    }
  );

  const iconClasses = cn(
    'transition-transform',
    'duration-200',
    'group-hover:scale-110',
    {
      'w-4 h-4': size === 'sm',
      'w-5 h-5': size === 'md',
      'w-6 h-6': size === 'lg',
      'mr-2': !isVertical,
      'mr-3': isVertical,
    }
  );

  const badgeClasses = cn(
    'ml-2',
    'px-1.5',
    'py-0.5',
    'text-xs',
    'font-medium',
    'rounded-full',
    'bg-primary-600/20',
    'text-primary-300',
    'border',
    'border-primary-500/30'
  );

  const activeIndicatorClasses = cn(
    'absolute',
    'bottom-0',
    'left-0',
    'right-0',
    'h-0.5',
    'bg-gradient-premium',
    'transform',
    'origin-left',
    'transition-transform',
    'duration-300',
    {
      'scale-x-100': activeItem === item.id,
      'scale-x-0': activeItem !== item.id,
    }
  );

  const handleClick = (item) => {
    onItemClick?.(item);
  };

  return (
    <nav className={baseClasses} {...props}>
      {items.map((item) => (
        <button
          key={item.id}
          className={itemClasses(item)}
          onClick={() => handleClick(item)}
          disabled={item.disabled}
        >
          {item.icon && (
            <span className={iconClasses}>
              {item.icon}
            </span>
          )}
          
          <span className="flex-1 text-left">
            {item.label}
          </span>
          
          {item.badge && (
            <span className={badgeClasses}>
              {item.badge}
            </span>
          )}
          
          {variant === 'default' && !isVertical && activeItem === item.id && (
            <div className={activeIndicatorClasses} />
          )}
        </button>
      ))}
    </nav>
  );
};

Navigation.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.node.isRequired,
      icon: PropTypes.node,
      badge: PropTypes.node,
      disabled: PropTypes.bool,
    })
  ).isRequired,
  activeItem: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  variant: PropTypes.oneOf(['default', 'pills', 'minimal']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  onItemClick: PropTypes.func,
};

// Navigation Item Component (for individual items)
Navigation.Item = function NavigationItem({
  item,
  isActive,
  variant = 'default',
  size = 'md',
  onClick,
  className,
  ...props
}) {
  const itemClasses = cn(
    'relative',
    'group',
    'flex',
    'items-center',
    'transition-all',
    'duration-200',
    'ease-out',
    'rounded-lg',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-primary-500',
    'focus:ring-offset-2',
    'focus:ring-offset-dark-950',
    {
      // Default variant
      'px-4 py-2': variant === 'default' && size === 'md',
      'px-3 py-1.5': variant === 'default' && size === 'sm',
      'px-5 py-2.5': variant === 'default' && size === 'lg',
      'text-dark-300 hover:bg-dark-800 hover:text-dark-100': variant === 'default',
      'bg-primary-600 text-white shadow-premium': variant === 'default' && isActive,

      // Pills variant
      'px-4 py-2': variant === 'pills' && size === 'md',
      'px-3 py-1.5': variant === 'pills' && size === 'sm',
      'px-5 py-2.5': variant === 'pills' && size === 'lg',
      'bg-dark-800/30 text-dark-400 hover:bg-dark-800/50 hover:text-dark-300': variant === 'pills',
      'bg-gradient-premium text-white shadow-glow': variant === 'pills' && isActive,

      // Minimal variant
      'px-3 py-1.5': variant === 'minimal' && size === 'md',
      'px-2 py-1': variant === 'minimal' && size === 'sm',
      'px-4 py-2': variant === 'minimal' && size === 'lg',
      'text-dark-400 hover:text-primary-400': variant === 'minimal',
      'text-primary-400 font-medium': variant === 'minimal' && isActive,
    },
    className
  );

  const iconClasses = cn(
    'transition-transform',
    'duration-200',
    'group-hover:scale-110',
    {
      'w-4 h-4': size === 'sm',
      'w-5 h-5': size === 'md',
      'w-6 h-6': size === 'lg',
      'mr-2': true,
    }
  );

  return (
    <button
      className={itemClasses}
      onClick={() => onClick?.(item)}
      disabled={item.disabled}
      {...props}
    >
      {item.icon && (
        <span className={iconClasses}>
          {item.icon}
        </span>
      )}
      
      <span className="flex-1 text-left">
        {item.label}
      </span>
      
      {item.badge && (
        <span className="ml-2 px-1.5 py-0.5 text-xs font-medium rounded-full bg-primary-600/20 text-primary-300 border border-primary-500/30">
          {item.badge}
        </span>
      )}
    </button>
  );
};

Navigation.Item.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.node.isRequired,
    icon: PropTypes.node,
    badge: PropTypes.node,
    disabled: PropTypes.bool,
  }).isRequired,
  isActive: PropTypes.bool,
  variant: PropTypes.oneOf(['default', 'pills', 'minimal']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Navigation;