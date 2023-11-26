import { useState, useRef } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { CustomerType, OptionType } from "@/app/types";
import { searchCustomer } from "@/app/services";

interface Props {
  selectedValue?: string;
  onSelect: (option: CustomerType) => void;
}

const AutoComplete = ({ selectedValue, onSelect }: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<CustomerType[]>([]);
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState<string>(selectedValue || "");
  const [cursor, setCursor] = useState<number>(-1);

  const handleSelect = (option: CustomerType) => {
    onSelect && onSelect(option);
    setValue(option?.name as string);
    setShowOptions(false);
  };

  const handleChange = async (text: string) => {
    setValue(text);
    setCursor(-1);
    if (text.trim().length > 2) {
      setLoading(true);
      searchCustomer(text)
        .then((response) => {
          setLoading(false);
          setOptions(
            response?.map((option: CustomerType) => ({
              ...option,
              id: option.uuid,
              name: `${option.first_name} ${option.last_name}`,
            }))
          );
        })
        .catch((error) => {
          console.log(error);
          setLoading(false);
        });
      if (!showOptions) {
        setShowOptions(true);
      }
    }
  };

  const moveCursorDown = () => {
    if (cursor < filteredOptions.length - 1) {
      setCursor((c) => c + 1);
    }
  };

  const moveCursorUp = () => {
    if (cursor > 0) {
      setCursor((c) => c - 1);
    }
  };

  const handleNav = (e: any) => {
    switch (e.key) {
      case "ArrowUp":
        moveCursorUp();
        break;
      case "ArrowDown":
        moveCursorDown();
        break;
      case "Enter":
        if (cursor >= 0 && cursor < filteredOptions.length) {
          handleSelect(filteredOptions[cursor]);
        }
        break;
    }
  };

  const filteredOptions = options.filter(
    (option: any) =>
      option.name.toLowerCase().indexOf(value.toLowerCase()) !== -1 ||
      option.phone.toLowerCase().indexOf(value.toLowerCase()) !== -1
  );

  return (
    <div className="relative w-full" ref={elementRef}>
      <div className="relative">
        <input
          type="search"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowOptions(true)}
          onKeyDown={handleNav}
          className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          placeholder="Search Customer"
        />
        <div className="absolute inset-y-0 right-3 flex items-center pl-3 pointer-events-none">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-600" />
        </div>
      </div>
      <ul
        className={`absolute w-full max-h-64 overflow-auto mt-2 bg-white rounded-lg shadow-lg ${
          !showOptions && "hidden"
        } select-none`}
      >
        {filteredOptions.map((option: any) => {
          return (
            <li
              key={option.id}
              className="relative cursor-default select-none py-2 pl-3 pr-9 hover:bg-indigo-600 hover:text-white"
              onClick={() => handleSelect(option)}
            >
              {option.name}
            </li>
          );
        })}
        {loading && <li className="px-4 py-2 text-gray-500">Loading...</li>}
        {filteredOptions.length === 0 && !loading && (
          <li className="px-4 py-2 text-gray-500">No results</li>
        )}
      </ul>
    </div>
  );
};

export default AutoComplete;
