import { useEffect, useRef, useState } from 'preact/hooks';
import { type JSX } from 'preact';

export interface Option {
  value: string;
  label: string;
}

export interface Props {
  options: Option[];
  selectedOption?: Option | undefined;
  placeholder?: string | undefined;
  onSelectedOption?: (option: Option) => void;
  customTrigger?: JSX.Element;
}

export default function DropDown({
  options,
  selectedOption,
  placeholder = 'select',
  onSelectedOption,
  customTrigger,
}: Props) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const [openUpwards, setOpenUpwards] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

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

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, []);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [options]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setOpenUpwards(entry.intersectionRatio < 1);
      },
      {
        root: null,
        // TODO: need to measure properly
        rootMargin: '-128px',
        threshold: 1.0,
      }
    );

    if (dropdownRef.current) {
      observer.observe(dropdownRef.current);
    }

    return () => {
      if (dropdownRef.current) {
        observer.unobserve(dropdownRef.current);
      }
    };
  }, [isOpen]);

  const dropdownPositionClasses = openUpwards ? 'bottom-full mb-1' : 'top-full mt-1';

  const defaultTrigger = (
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
  );

  return (
    <div ref={dropdownRef} class="relative inline-block w-full max-w-[200px]">
      <style>{`
        .dropdown-menu {
          transition: max-height 0.3s ease-out, opacity 0.2s ease-out;
          max-height: 0;
          opacity: 0;
          overflow: hidden;
        }
        .dropdown-menu.open {
          opacity: 1;
        }
      `}</style>
      {customTrigger ? <div onClick={toggleDropdown}>{customTrigger}</div> : defaultTrigger}
      <div
        // eslint-disable-next-line tailwindcss/no-custom-classname
        class={`dropdown-menu ${dropdownPositionClasses} absolute right-0 z-10 w-full min-w-32 rounded-md border bg-popover shadow-md dark:shadow-lg md:left-0  ${
          isOpen ? 'open' : ''
        }`}
        style={{ maxHeight: isOpen ? `${contentHeight}px` : '0px' }}
      >
        <div ref={contentRef} class="py-1.5">
          {options.map((option) => (
            <div
              key={option.value}
              onClick={() => selectOption(option)}
              class="relative flex cursor-pointer select-none items-center justify-between px-3 py-1.5 text-sm transition-all data-[disabled]:pointer-events-none data-[disabled]:opacity-50 hover:bg-accent focus:text-accent-foreground"
            >
              <span>{option.label}</span>
              {selectedOption?.value === option.value && (
                <svg class="size-3 text-green-500" viewBox="0 0 20 20" fill="currentColor">
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
      </div>
    </div>
  );
}
