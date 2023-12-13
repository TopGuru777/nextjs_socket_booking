import { useState } from "react";
// import AutoComplete from "@/app/components/AutoComplete_Old";
import { CustomerType } from "@/app/types";

interface Props {
  onSubmit: (values: CustomerType) => void;
  onClick: () => void;
}

const AddCustomerForm = ({ onClick, onSubmit }: Props) => {
  const [selected, setSelected] = useState<CustomerType | null>(null);

  const handleSubmit = () => {
    onSubmit(selected as CustomerType);
    setSelected(null);
  };

  const handleSelect = (selectedValue: CustomerType) => {
    setSelected(selectedValue);
  };

  return (
    <>
      <div className="relative p-4 text-blue-gray-500 antialiased font-sans text-base font-light leading-relaxed border-t border-t-blue-gray-100 border-b border-b-blue-gray-100">
        {/* <AutoComplete onSelect={handleSelect} /> */}
        <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
        <div className="flex items-center justify-center">
          <button
            type="button"
            className="inline-flex justify-center bg-gray-100 px-8 py-2 text-sm font-medium hover:bg-gray-200"
            onClick={onClick}
          >
            New Customer
          </button>
        </div>
      </div>
      <div className="flex items-center justify-start shrink-0 flex-wrap p-4 text-blue-gray-500">
        <button
          type="button"
          className="inline-flex justify-center bg-blue-100 px-8 py-2 text-sm font-medium hover:bg-blue-200"
          onClick={handleSubmit}
          disabled={!selected}
        >
          Save Appointment
        </button>
      </div>
    </>
  );
};

export default AddCustomerForm;
