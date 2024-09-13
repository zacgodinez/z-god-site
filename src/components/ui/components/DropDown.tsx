import { useState } from 'preact/hooks';

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
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const selectOption = (option: Option) => {
    if (onSelectedOption) {
      onSelectedOption(option);
    }
    setIsOpen(false);
  };

  return (
    <div class="relative inline-block w-full max-w-[200px]">
      <button
        onClick={toggleDropdown}
        class="w-full bg-white border border-gray-300 rounded-md py-2 px-4 text-left focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200"
      >
        {selectedOption?.label || placeholder}
        <span class="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="none" stroke="currentColor">
            <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {isOpen && (
        <div class="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => selectOption(option)}
              class="px-4 py-2 cursor-pointer hover:bg-gray-100"
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
