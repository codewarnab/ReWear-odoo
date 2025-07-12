import { ReactNode } from 'react';

interface CustomButtonProps {
  children: ReactNode;
  variant?: 'black' | 'white';
  onClick?: () => void;
  className?: string;
}

export default function CustomButton({ 
  children, 
  variant = 'black', 
  onClick, 
  className = '' 
}: CustomButtonProps) {
  const baseStyles = `
    font-family: inherit
    px-6
    py-3
    font-size: 17px
    font-weight: 500
    rounded-2xl
    border: none
    letter-spacing: 0.05em
    flex
    items-center
    overflow-hidden
    relative
    h-12
    min-w-[180px]
    cursor-pointer
    transition-all
    duration-300
    group
  `;

  const variants = {
    black: `
      bg-black
      text-white
      shadow-lg
    `,
    white: `
      bg-white
      text-black
      shadow-lg
      border-2
      border-black
    `
  };

  const iconVariants = {
    black: `
      bg-white
      shadow-md
    `,
    white: `
      bg-black
      shadow-md
    `
  };

  const iconColors = {
    black: 'text-black',
    white: 'text-white'
  };

  return (
    <button
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${className}
      `}
      onClick={onClick}
    >
      <span className="relative z-20 mr-10">
        {children}
      </span>
      <div className={`
        ${iconVariants[variant]}
        absolute
        right-2
        flex
        items-center
        justify-center
        h-8
        w-8
        rounded-xl
        transition-all
        duration-300
        ease-out
        group-hover:w-[calc(100%-1rem)]
        group-hover:left-2
        group-hover:right-2
        group-active:scale-95
        z-10
      `}>
        <svg
          height="20"
          width="20"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          className={`
            transition-transform
            duration-300
            group-hover:translate-x-1
            ${iconColors[variant]}
          `}
        >
          <path d="M0 0h24v24H0z" fill="none"></path>
          <path
            d="M16.172 11l-5.364-5.364 1.414-1.414L20 12l-7.778 7.778-1.414-1.414L16.172 13H4v-2z"
            fill="currentColor"
          ></path>
        </svg>
      </div>
    </button>
  );
}
