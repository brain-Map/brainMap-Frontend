import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CustomButtonProps {
  // Text content
  text: string;

  border?: string;
  type?:string;
  
  // Colors
  backgroundColor?: string;
  textColor?: string;
  hoverBackgroundColor?: string;
  
  // Dimensions
  width?: string;
  height?: string;
  
  // Icon
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  
  // Behavior
  onClick?: () => void;
  disabled?: boolean;
  
  // Additional styling
  rounded?: string;
  className?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  text,
  border,
  backgroundColor = 'bg-blue-300',
  textColor = 'text-gray-800',
  hoverBackgroundColor = 'hover:bg-blue-400',
  width = 'w-auto',
  height = 'h-12',
  icon: Icon,
  iconPosition = 'right',
  iconSize = 20,
  onClick,
  disabled = false,
  rounded = 'rounded-[10]',
  className = ''
}) => {
  const baseClasses = `
    ${backgroundColor} 
    ${textColor} 
    ${hoverBackgroundColor}
    ${width} 
    ${height} 
    ${rounded}
    ${border ? border : ''}
    px-8 
    font-semibold 
    text-md
    transition-all 
    duration-200 
    ease-in-out
    flex 
    items-center 
    justify-center 
    gap-3
    shadow-sm
    hover:shadow-md
    active:scale-95
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2 
    focus:ring-blue-500
    ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      onClick={onClick}
      disabled={disabled}

      className={baseClasses}
    >
      {Icon && iconPosition === 'left' && (
        <Icon size={iconSize} />
      )}
      
      <span>{text}</span>
      
      {Icon && iconPosition === 'right' && (
        <Icon size={iconSize} />
      )}
    </button>
  );
};

export default CustomButton;


    //   <CustomButton
    //             text="Pricing"
    //             backgroundColor="none"
    //             border='border border-white'
    //             textColor="text-white"
    //             hoverBackgroundColor="hover:bg-white hover:text-black"
    //             icon={TrendingUp }
    //             onClick={() => handleClick('Get Started')}
    //           />