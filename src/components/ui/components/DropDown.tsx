import { useEffect, useRef, useState } from 'preact/hooks';

export interface Option {
  value: string;
  label: string;
}

export interface Props {
  options: Option[];
  selectedOption?: Option | undefined;
  placeholder?: string | undefined;
  onSelectedOption?: (option: Option) => void;
}

export default function DropDown({ options, selectedOption, placeholder = 'select', onSelectedOption }: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: Option) => {
    if (onSelectedOption) {
      onSelectedOption(option);
    }
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} class="relative inline-block w-full max-w-[200px]">
      <button
        onClick={toggleDropdown}
        class="w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-left focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
      >
        {selectedOption?.label || placeholder}
        <span class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
          <svg class="size-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div class="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => selectOption(option)}
              class="flex cursor-pointer items-center justify-between px-4 py-2 hover:bg-gray-100"
            >
              <span>{option.label}</span>
              {selectedOption?.value === option.value && (
                <svg class="size-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.707a1 1 0 00-1.414-1.414l-7.086 7.086L4.707 9.207a1 1 0 00-1.414 1.414l4 4a1 1 0 001.414 0l8-8z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
