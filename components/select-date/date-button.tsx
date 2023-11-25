import { forwardRef } from "react";
import { ChevronUpDownIcon } from "@heroicons/react/20/solid";

interface Props {
  value?: string;
  onClick?: () => void;
}

const DateButton = forwardRef(
  ({ value, onClick }: Props, ref: React.Ref<HTMLButtonElement>) => {
    return (
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className="flex h-9 py-1.5 pl-3 pr-10 justify-between w-full rounded-md text-sm font-medium items-center text-gray-900 bg-white border border-gray-200  dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500 dark:focus:text-white"
      >
        {value}
        <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
        </span>
      </button>
    );
  }
);

DateButton.displayName = "DateButton";

export default DateButton;
