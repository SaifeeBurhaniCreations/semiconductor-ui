
import React from 'react';

interface VisualObjectProps {
  category: 'Product' | 'Process' | 'Machine' | 'Sensor' | 'AI_Action';
  variant?: string;
  size?: number;
  className?: string;
}

export const VisualObject: React.FC<VisualObjectProps> = ({ category, variant = 'default', size = 24, className = '' }) => {
  const strokeWidth = 1.5;
  const color = "currentColor"; // Inherit text color usually

  const renderIcon = () => {
    switch (category) {
      case 'Product':
        if (variant.includes('wafer')) {
          return (
            <g>
              <circle cx="12" cy="12" r="10" stroke={color} strokeWidth={strokeWidth} fill="none" />
              <path d="M12 2 V22 M2 12 H22" stroke={color} strokeWidth={strokeWidth/2} strokeDasharray="2 2" />
              <rect x="8" y="8" width="8" height="8" stroke={color} strokeWidth={strokeWidth} fill="none" />
            </g>
          );
        }
        if (variant.includes('module') || variant.includes('package')) {
          return (
            <g>
              <rect x="4" y="4" width="16" height="16" rx="2" stroke={color} strokeWidth={strokeWidth} fill="none" />
              <rect x="8" y="8" width="8" height="8" stroke={color} strokeWidth={strokeWidth} fill="none" />
              <path d="M4 8 H2 M4 16 H2 M20 8 H22 M20 16 H22" stroke={color} strokeWidth={strokeWidth} />
            </g>
          );
        }
        return (
            <g>
                <rect x="5" y="5" width="14" height="14" stroke={color} strokeWidth={strokeWidth} fill="none" />
                <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
            </g>
        );

      case 'Machine':
        if (variant.includes('robot')) {
            return (
                <g>
                    <path d="M4 20 H20" stroke={color} strokeWidth={strokeWidth} />
                    <path d="M12 20 V14" stroke={color} strokeWidth={strokeWidth} />
                    <circle cx="12" cy="12" r="2" stroke={color} strokeWidth={strokeWidth} />
                    <path d="M12 12 L18 6" stroke={color} strokeWidth={strokeWidth} />
                    <path d="M18 6 L22 6" stroke={color} strokeWidth={strokeWidth} />
                </g>
            );
        }
        if (variant.includes('chamber')) {
            return (
                <g>
                    <path d="M4 20 H20" stroke={color} strokeWidth={strokeWidth} />
                    <path d="M5 20 V8 A7 7 0 0 1 19 8 V20" stroke={color} strokeWidth={strokeWidth} fill="none" />
                    <path d="M9 14 H15" stroke={color} strokeWidth={strokeWidth} />
                </g>
            );
        }
        return (
            <g>
                <rect x="3" y="6" width="18" height="14" rx="1" stroke={color} strokeWidth={strokeWidth} fill="none" />
                <path d="M6 6 V3 H18 V6" stroke={color} strokeWidth={strokeWidth} fill="none" />
                <circle cx="12" cy="13" r="3" stroke={color} strokeWidth={strokeWidth} />
            </g>
        );

      case 'Sensor':
        if (variant.includes('thermal')) {
            return (
                <g>
                    <path d="M12 16 A3 3 0 1 0 12 22 A3 3 0 0 0 12 16 Z" stroke={color} strokeWidth={strokeWidth} />
                    <path d="M12 16 V4" stroke={color} strokeWidth={strokeWidth} />
                    <path d="M12 8 H15 M12 11 H15" stroke={color} strokeWidth={strokeWidth} />
                </g>
            );
        }
        return (
            <g>
                <circle cx="12" cy="12" r="8" stroke={color} strokeWidth={strokeWidth} fill="none" />
                <path d="M12 12 L16 16" stroke={color} strokeWidth={strokeWidth} />
                <circle cx="12" cy="12" r="2" fill={color} />
                <path d="M4 12 H2 M22 12 H20 M12 4 V2 M12 22 V20" stroke={color} strokeWidth={strokeWidth} />
            </g>
        );

      case 'Process':
        return (
            <g>
                <path d="M12 2 V6" stroke={color} strokeWidth={strokeWidth} />
                <path d="M12 18 V22" stroke={color} strokeWidth={strokeWidth} />
                <path d="M4 12 L8 12" stroke={color} strokeWidth={strokeWidth} />
                <path d="M16 12 L20 12" stroke={color} strokeWidth={strokeWidth} />
                <rect x="8" y="8" width="8" height="8" transform="rotate(45 12 12)" stroke={color} strokeWidth={strokeWidth} fill="none" />
            </g>
        );

      case 'AI_Action':
        return (
            <g>
                <path d="M4 12 Q12 4 20 12 T4 12" stroke={color} strokeWidth={strokeWidth} fill="none" />
                <circle cx="12" cy="12" r="3" stroke={color} strokeWidth={strokeWidth} />
                <path d="M12 5 V2 M12 22 V19 M2 12 H5 M22 12 H19" stroke={color} strokeWidth={strokeWidth} />
            </g>
        );

      default:
        return <rect x="4" y="4" width="16" height="16" stroke={color} strokeWidth={strokeWidth} fill="none" />;
    }
  };

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {renderIcon()}
    </svg>
  );
};
