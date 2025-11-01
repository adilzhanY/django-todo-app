import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  className?: string;
  placeholder?: string;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  className = "",
  placeholder = "Select...",
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        handleClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 150); // Match animation duration
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    handleClose();
  };

  const toggleOpen = () => {
    if (isOpen) {
      handleClose();
    } else {
      setIsOpen(true);
    }
  };

  return (
    <>
    <style>{`
        @keyframes slideDownFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scaleY(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }
        
        @keyframes slideUpFadeOut {
          from {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
          to {
            opacity: 0;
            transform: translateY(-10px) scaleY(0.95);
          }
        }
        
        .dropdown-enter {
          animation: slideDownFadeIn 0.2s ease-out forwards;
          transform-origin: top;
        }
        
        .dropdown-exit {
          animation: slideUpFadeOut 0.15s ease-in forwards;
          transform-origin: top;
        }
      `}</style>

      <div ref={containerRef} className={`relative ${className}`}>
        {/* Select Button */}
        <button
          type="button"
          onClick={toggleOpen}
          className="w-full appearance-none p-2.5 bg-[#2a2a2a] text-gray-100 rounded-xl 
          border border-transparent focus:border-gray-500 outline-none
          shadow-[inset_0_1px_2px_rgba(255,255,255,0.05),0_1px_2px_rgba(0,0,0,0.4)]
          transition-all cursor-pointer text-left relative z-50"
        >
          <span className={!selectedOption ? "text-gray-400" : ""}>
            {selectedOption?.label || placeholder}
          </span>
        </button>

        {/* Arrow Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`absolute right-3 top-1/2 w-4 h-4 text-gray-400 pointer-events-none 
          transform -translate-y-1/2 transition-transform duration-200 ease-in-out z-50
          ${isOpen && !isClosing ? "rotate-180" : "rotate-0"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>

        {/* Dropdown Menu with Animation */}
        {isOpen && (
          <div
            className={`${isClosing ? "dropdown-exit" : "dropdown-enter"} absolute z-50 w-full mt-1 bg-[#2a2a2a]/80 backdrop-blur-md rounded-xl 
            border border-gray-700 shadow-[0_4px_6px_rgba(0,0,0,0.4)] overflow-hidden`}
          >
            <div className="max-h-60 overflow-y-auto py-1">
              {options.map((option) => (
                <div
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={`px-3 py-2 cursor-pointer transition-colors m-2 rounded-2xl select-none
                  ${option.value === value ? "bg-gray-700 text-white" : "text-gray-100 hover:bg-gray-600"}`}
                >
                  {option.label}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
