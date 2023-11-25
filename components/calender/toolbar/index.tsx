import { type ToolbarProps } from "react-big-calendar";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";
import DropDown from "../dropdown";
import CustomDatePicker from "../datepicker";

const Toolbar = ({label, date, view, onNavigate, onView }: ToolbarProps) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <DropDown date={date} view={view} onView={onView} />
      <div className="flex flex-row justify-center">
        <button
          type="button"
          className="mr-4 px-4 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
          onClick={() => onNavigate("TODAY")}
        >
          Today
        </button>
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            className="px-2 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => onNavigate("PREV")}
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <CustomDatePicker selectedDate={date} label={label} onNavigate={onNavigate} />
          <button
            type="button"
            className="px-2 py-1 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white"
            onClick={() => onNavigate("NEXT")}
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
