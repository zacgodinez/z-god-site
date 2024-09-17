import { useEffect, useMemo, useState } from 'preact/hooks';
import DropDown from '~/components/ui/components/DropDown';

const LOCAL_STORAGE_THEME = 'theme';

export default function ToggleTheme() {
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | undefined>(undefined);

  // Function to save the selected option's value to localStorage
  const saveToLocalStorage = (value: string) => {
    localStorage.setItem(LOCAL_STORAGE_THEME, value);
  };

  // Function to load the selected option from localStorage
  const loadFromLocalStorage = () => {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_THEME);
    if (storedValue) {
      const foundOption = themeOptions.find((option) => option.value === storedValue);
      if (foundOption) {
        setSelectedOption(foundOption);
      }
    }
  };

  const setTheme = (theme: string) => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  // Handle option selection and store the value in localStorage
  const handleOptionSelected = (opt: { value: string; label: string }) => {
    setSelectedOption(opt);
    saveToLocalStorage(opt.value);
    setTheme(opt.value);
  };

  const themeOptions = useMemo(
    () => [
      { value: 'light', label: 'Light' },
      { value: 'dark', label: 'Dark' },
      { value: 'system', label: 'System' },
    ],
    []
  );

  // Load the selected option from localStorage when the component mounts
  useEffect(() => {
    loadFromLocalStorage();
  }, []);

  return (
    <DropDown
      onSelectedOption={handleOptionSelected}
      selectedOption={selectedOption}
      options={themeOptions}
      customTrigger={
        <div class="flex shrink-0 cursor-pointer items-center gap-1 text-xs text-muted-foreground !outline-primary !transition-all hover:text-primary-action focus:outline-none focus-visible:outline">
          <span class="underline decoration-1 underline-offset-4 outline-2 outline-offset-2">Theme</span>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="inline-block size-3">
            <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-1.9C4.045 12.733 2 10.352 2 7.5a4.5 4.5 0 018-2.828A4.5 4.5 0 0118 7.5c0 2.852-2.044 5.233-3.885 6.82a22.049 22.049 0 01-3.744 2.582l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z"></path>
          </svg>
        </div>
      }
    />
  );
}
