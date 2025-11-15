import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

const Chart = ({
  type = 'bar',
  data,
  options = {},
  className,
  width = '100%',
  height = 300,
  ...props
}) => {
  const baseClasses = cn(
    'w-full',
    'bg-card-bg',
    'backdrop-blur-sm',
    'border',
    'border-card-border',
    'rounded-xl',
    'p-4',
    className
  );

  const renderBarChart = () => {
    const maxValue = Math.max(...data.map(item => item.value));
    const barHeight = height - 60; // Account for labels and padding

    return (
      <div className="relative h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-dark-400">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full flex items-end space-x-2">
          {data.map((item, index) => {
            const barHeightPercent = (item.value / maxValue) * 100;
            const barColor = item.color || 'primary-600';
            
            return (
              <div
                key={item.id || index}
                className="flex-1 flex flex-col items-center"
                style={{ height: `${barHeight}px` }}
              >
                {/* Bar */}
                <div
                  className={cn(
                    'w-full bg-gradient-to-t from-primary-600 to-primary-500 rounded-t-lg transition-all duration-500 hover:from-primary-500 hover:to-primary-400',
                    item.color && `from-${item.color}-600 to-${item.color}-500`
                  )}
                  style={{
                    height: `${barHeightPercent}%`,
                    animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  {/* Value label */}
                  <div className="text-xs text-white font-medium text-center pt-1">
                    {item.value}
                  </div>
                </div>
                
                {/* X-axis label */}
                <div className="text-xs text-dark-400 mt-2 text-center">
                  {item.label}
                </div>
              </div>
            );
          })}
        </div>

        {/* Grid lines */}
        <div className="absolute left-10 right-0 top-0 bottom-8 pointer-events-none">
          {[0, 0.25, 0.5, 0.75, 1].map((percent) => (
            <div
              key={percent}
              className="absolute w-full border-t border-dark-800"
              style={{ bottom: `${percent * 100}%` }}
            />
          ))}
        </div>
      </div>
    );
  };

  const renderLineChart = () => {
    const maxValue = Math.max(...data.map(item => item.value));
    const chartHeight = height - 60;
    const chartWidth = '100%';

    // Create path points
    const points = data.map((item, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - (item.value / maxValue) * 100;
      return `${x},${y}`;
    }).join(' ');

    // Create area path
    const areaPoints = `${points} 100,0 0,0`;

    return (
      <div className="relative h-full">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-dark-400">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>

        {/* Chart area */}
        <div className="ml-10 h-full relative">
          {/* Grid lines */}
          <div className="absolute inset-0">
            {[0, 0.25, 0.5, 0.75, 1].map((percent) => (
              <div
                key={percent}
                className="absolute w-full border-t border-dark-800"
                style={{ bottom: `${percent * 100}%` }}
              />
            ))}
          </div>

          {/* SVG for line chart */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            {/* Area fill */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#7C3AED" stopOpacity="0.05" />
              </linearGradient>
            </defs>
            
            <polygon
              points={areaPoints}
              fill="url(#areaGradient)"
              className="animate-fade-in"
            />
            
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke="#7C3AED"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="animate-slide-up"
              style={{
                strokeDasharray: 1000,
                strokeDashoffset: 0,
                animation: 'slideUp 1s ease-out forwards',
              }}
            />
          </svg>

          {/* Data points */}
          {data.map((item, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - (item.value / maxValue) * 100;
            
            return (
              <div
                key={item.id || index}
                className="absolute w-3 h-3 bg-primary-500 border-2 border-dark-950 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow-glow"
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                  animation: `bounceIn 0.5s ease-out ${index * 0.1 + 0.5}s both`,
                }}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-dark-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {item.label}: {item.value}
                </div>
              </div>
            );
          })}

          {/* X-axis labels */}
          <div className="absolute left-0 right-0 bottom-0 flex justify-between text-xs text-dark-400">
            {data.map((item, index) => (
              <div key={item.id || index} className="text-center">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderPieChart = () => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = 0;

    return (
      <div className="flex items-center justify-center h-full">
        <div className="relative">
          {/* Pie chart */}
          <svg
            width={Math.min(height, width) - 40}
            height={Math.min(height, width) - 40}
            viewBox="0 0 100 100"
            className="transform -rotate-90"
          >
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100;
              const angle = (percentage / 100) * 360;
              const endAngle = currentAngle + angle;
              
              const x1 = 50 + 40 * Math.cos((currentAngle * Math.PI) / 180);
              const y1 = 50 + 40 * Math.sin((currentAngle * Math.PI) / 180);
              const x2 = 50 + 40 * Math.cos((endAngle * Math.PI) / 180);
              const y2 = 50 + 40 * Math.sin((endAngle * Math.PI) / 180);
              
              const largeArcFlag = angle > 180 ? 1 : 0;
              
              const pathData = [
                `M 50 50`,
                `L ${x1} ${y1}`,
                `A 40 40 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                'Z'
              ].join(' ');
              
              const color = item.color || ['primary-600', 'accent-600', 'secondary-600', 'info-600'][index % 4];
              
              currentAngle = endAngle;
              
              return (
                <path
                  key={item.id || index}
                  d={pathData}
                  fill={` rgb(var(--tw-color-${color}))`}
                  className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                  style={{
                    animation: `scaleIn 0.5s ease-out ${index * 0.1}s both`,
                  }}
                >
                  <title>{item.label}: {item.value} ({percentage.toFixed(1)}%)</title>
                </path>
              );
            })}
          </svg>
        </div>

        {/* Legend */}
        <div className="ml-8 space-y-2">
          {data.map((item, index) => {
            const percentage = ((item.value / total) * 100).toFixed(1);
            const color = item.color || ['primary-600', 'accent-600', 'secondary-600', 'info-600'][index % 4];
            
            return (
              <div key={item.id || index} className="flex items-center space-x-2">
                <div
                  className={cn(
                    'w-3 h-3 rounded-full',
                    `bg-${color}-500`
                  )}
                />
                <span className="text-xs text-dark-300">
                  {item.label}
                </span>
                <span className="text-xs text-dark-400 ml-auto">
                  {percentage}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart();
      case 'line':
        return renderLineChart();
      case 'pie':
        return renderPieChart();
      default:
        return renderBarChart();
    }
  };

  return (
    <div
      className={baseClasses}
      style={{ width, height }}
      {...props}
    >
      {renderChart()}
    </div>
  );
};

Chart.propTypes = {
  type: PropTypes.oneOf(['bar', 'line', 'pie']),
  data: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      label: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
  options: PropTypes.object,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default Chart;