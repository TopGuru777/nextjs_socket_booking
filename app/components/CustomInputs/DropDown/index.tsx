import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { classNames } from "@utils/helper";

interface Props {
  selected: string | null;
  options: Array<{ label: string; value: string }>;
  className?: string;
  showArrow?: boolean;
  onSelect: (selected: string) => void;
}

const Dropdown = ({
  selected,
  options,
  className,
  showArrow = true,
  onSelect,
}: Props) => {
  const selectedValue = options.find((option) => option.value === selected);
  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className={`inline-flex w-full justify-center gap-x-1.5 px-3 text-xs items-center font-semibold text-gray-900 ${className}`}
        >
          {selectedValue ? selectedValue.label : "No Label"}
          {showArrow && (
            <ChevronDownIcon
              className="-mr-1 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          )}
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-[5px] z-10 mt-2 w-[100px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-0">
            {options &&
              options.map((option) => {
                return (
                  <Menu.Item key={option.value}>
                    {({ active }) => (
                      <button
                        type="button"
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block w-full px-2 py-2 text-left text-xs font-semibold"
                        )}
                        onClick={() => onSelect(option.value)}
                      >
                        {option.label}
                      </button>
                    )}
                  </Menu.Item>
                );
              })}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
