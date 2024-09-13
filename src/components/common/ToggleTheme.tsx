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
    <div>
      <p>Selected Theme: {selectedOption ? selectedOption.label : 'None'}</p>
      <DropDown onSelectedOption={handleOptionSelected} selectedOption={selectedOption} options={themeOptions} />
    </div>
  );
}
