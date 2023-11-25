import { forwardRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface Props {
  label: string;
  onClick?: () => void;
}

const DateButton = forwardRef(
  ({ label, onClick }: Props, ref: React.Ref<HTMLButtonElement>) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className="flex justify-between w-56 pl-4 pr-1 py-1 text-sm font-medium items-center text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
      >
        {label}
        <ChevronDownIcon className="h-6 w-6" />
      </button>
    );
  }
);

DateButton.displayName = "DateButton";

export default DateButton;
