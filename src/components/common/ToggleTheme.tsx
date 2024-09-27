import { useEffect, useMemo, useState } from 'preact/hooks';
import DropDown from '~/components/ui/components/DropDown';

const LOCAL_STORAGE_THEME = 'theme';

export default function ToggleTheme() {
  const [selectedOption, setSelectedOption] = useState<{ value: string; label: string } | undefined>(undefined);

  const saveToLocalStorage = (value: string) => {
    localStorage.setItem(LOCAL_STORAGE_THEME, value);
  };

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

  useEffect(() => {
    loadFromLocalStorage();

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = () => {
      if (selectedOption?.value === 'system') {
        setTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => {
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
    };
  }, [selectedOption]);

  useEffect(() => {
    if (selectedOption) {
      setTheme(selectedOption.value);
    }
  }, [selectedOption]);

  return (
    <DropDown
      onSelectedOption={handleOptionSelected}
      selectedOption={selectedOption}
      options={themeOptions}
      customTrigger={
        <button class="flex shrink-0 cursor-pointer items-center gap-1 text-muted-foreground !transition-all hover:text-primary-action">
          <span class="underline decoration-1 underline-offset-4 outline-2 outline-offset-2">Theme</span>
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="currentColor"
            class="inline-block size-3"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M10 0.833496C10.4602 0.833496 10.8333 1.2066 10.8333 1.66683V2.0835C10.8333 2.54373 10.4602 2.91683 10 2.91683C9.53975 2.91683 9.16667 2.54373 9.16667 2.0835V1.66683C9.16667 1.2066 9.53975 0.833496 10 0.833496ZM16.1866 3.39631C16.5121 3.72175 16.5121 4.24939 16.1866 4.57482L15.892 4.86945C15.5666 5.19489 15.0389 5.19489 14.7135 4.86945C14.388 4.54401 14.388 4.01638 14.7135 3.69094L15.0081 3.39631C15.3336 3.07087 15.8612 3.07087 16.1866 3.39631ZM3.81342 3.3969C4.13885 3.07146 4.66649 3.07146 4.99193 3.3969L5.28655 3.69152C5.61199 4.01696 5.61199 4.5446 5.28655 4.87004C4.96112 5.19547 4.43347 5.19547 4.10804 4.87004L3.81342 4.5754C3.48797 4.24997 3.48797 3.72234 3.81342 3.3969ZM1.25 9.5835C1.25 9.12325 1.6231 8.75016 2.08333 8.75016H2.5C2.96023 8.75016 3.33333 9.12325 3.33333 9.5835C3.33333 10.0437 2.96023 10.4168 2.5 10.4168H2.08333C1.6231 10.4168 1.25 10.0437 1.25 9.5835ZM16.6667 9.5835C16.6667 9.12325 17.0397 8.75016 17.5 8.75016H17.9167C18.3769 8.75016 18.75 9.12325 18.75 9.5835C18.75 10.0437 18.3769 10.4168 17.9167 10.4168H17.5C17.0397 10.4168 16.6667 10.0437 16.6667 9.5835ZM5.17259 14.4109C5.49802 14.7363 5.49802 15.264 5.17259 15.5894L4.75592 16.0061C4.43048 16.3315 3.90285 16.3315 3.57741 16.0061C3.25198 15.6807 3.25198 15.153 3.57741 14.8276L3.99407 14.4109C4.31952 14.0855 4.84715 14.0855 5.17259 14.4109ZM14.8274 14.4109C15.1528 14.0855 15.6805 14.0855 16.0059 14.4109L16.4226 14.8276C16.748 15.153 16.748 15.6807 16.4226 16.0061C16.0972 16.3315 15.5695 16.3315 15.2441 16.0061L14.8274 15.5894C14.502 15.264 14.502 14.7363 14.8274 14.4109Z"
              fill="currentColor"
            />
            <path
              d="M7.70801 16.8813V17.5002C7.70801 18.3056 8.36092 18.9585 9.16634 18.9585H10.833C11.6384 18.9585 12.2913 18.3056 12.2913 17.5002V16.8813H7.70801Z"
              fill="currentColor"
            />
            <path
              d="M3.95801 9.58317C3.95801 6.24645 6.66296 3.5415 9.99967 3.5415C13.3364 3.5415 16.0413 6.24645 16.0413 9.58317C16.0413 11.7796 14.8718 13.4822 13.1701 14.5068C13.0863 14.5573 13.0453 14.6251 13.0343 14.6803L12.8298 15.7025C12.8055 15.8243 12.7664 15.9398 12.7147 16.0477H7.28466C7.23292 15.9398 7.19384 15.8243 7.1695 15.7025L6.96505 14.6803C6.95401 14.6251 6.91303 14.5573 6.82929 14.5068C5.12747 13.4822 3.95801 11.7796 3.95801 9.58317Z"
              fill="currentColor"
            />
          </svg>
        </button>
      }
    />
  );
}
