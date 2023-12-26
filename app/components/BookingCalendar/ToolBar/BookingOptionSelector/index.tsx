import { useRouter } from 'next/navigation';
import { useState } from "react";
import { format } from 'date-fns';
import { type View } from "react-big-calendar";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import useBookingCalendarStore from '@/app/store';

interface Props {
  view: string;
  date: Date;
  onView: (selected: View) => void;
}

const options = [
  { label: "Daily", value: "day" },
  { label: "Weekly", value: "week" },
];

const BookingOptionSelector = ({ view, date, onView }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(view);

  const { setCurrentView } = useBookingCalendarStore(state => state);

  const { currentStaff, setCurrentStaff, staffList } = useBookingCalendarStore(
    (state) => state
  );

  const handleClick = () => {
    setOpen(!open);
  };

  const handleChange = (value: View) => {
    const selectedItem = options.find((item) => item.value === value);
    setCurrentStaff(staffList[0]);
    onView(value);
    setSelected(value);
    setOpen(false);
    setCurrentView(value);
    router.replace(`/#${selectedItem?.label.toLowerCase()}/0/${format(date, 'ddMMyyyy')}`)
  };

  const selectedValue = options.find((item) => item.value === selected);
  return (
    <div>
      <button
        id="states-button"
        data-dropdown-toggle="dropdown-states"
        className="justify-between flex-shrink-0 z-10 inline-flex items-center w-24 py-1 px-4 text-sm font-medium text-center text-gray-500"
        type="button"
        onClick={handleClick}
      >
        {selectedValue?.label} <ChevronDownIcon className="h-6 w-6" />
      </button>
      <div
        id="dropdown-states"
        className={`z-50 absolute bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 ${open ? "block" : "hidden"
          }`}
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="states-button"
        >
          {options.map((option) => {
            return (
              <li key={option.value}>
                <button
                  type="button"
                  className="inline-flex w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
                  onClick={() => handleChange(option.value as View)}
                >
                  <div className="inline-flex items-center">{option.label}</div>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BookingOptionSelector;
