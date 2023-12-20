import { Fragment, useCallback } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "@utils/helper";
import moment from "moment";

interface Props {
  selectedDate: Date;
  selectedValue: number;
  onChange: (selected: number) => void;
}

const SelectTimeDropdown = ({
  selectedValue,
  selectedDate,
  onChange,
}: Props) => {
  const renderTimes = useCallback(() => {
    let times = [];
    const intervals = 15;
    const multiplier = 1440 / intervals;
    const base = moment(selectedDate).startOf("day");
    for (let i = 0; i < multiplier; i++) {
      const currentTime = moment(base).add(i * intervals, "minutes");
      times.push(currentTime);
    }
    return times.map((time, index) => {
      const timeValue = moment(time).format("hh:mm A");
      return (
        <Listbox.Option
          key={index}
          className={({ active }) =>
            classNames(
              active ? "bg-indigo-600 text-white" : "text-gray-900",
              "relative cursor-default select-none py-2 pl-3 pr-2"
            )
          }
          value={moment(time).valueOf()}
        >
          {({ selected, active }) => (
            <>
              <div className="flex items-center">
                <span
                  className={classNames(
                    selected ? "font-semibold" : "font-normal",
                    "block truncate"
                  )}
                >
                  {timeValue}
                </span>
              </div>
              {selected ? (
                <span
                  className={classNames(
                    active ? "text-white" : "text-indigo-600",
                    "absolute inset-y-0 right-0 flex items-center pr-1"
                  )}
                >
                  <CheckIcon className="h-5 w-5" aria-hidden="true" />
                </span>
              ) : null}
            </>
          )}
        </Listbox.Option>
      );
    });
  }, [selectedDate]);

  const selectedTime = moment(selectedValue).format("hh:mm A");
  return (
    <Listbox value={selectedValue} onChange={onChange}>
      {({ open }) => {
        return (
          <div className="relative">
            <Listbox.Button className="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm sm:leading-6">
              <span className="flex items-center">
                <span className="ml-2 block truncate">{selectedTime}</span>
              </span>
              <span className="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2">
                <ChevronUpDownIcon
                  className="h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
              </span>
            </Listbox.Button>
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                {renderTimes()}
              </Listbox.Options>
            </Transition>
          </div>
        );
      }}
    </Listbox>
  );
};

export default SelectTimeDropdown;
