import { useState } from "react";
import AddCustomerForm from "../AddCustomerForm";
import CustomerForm from "../CustomerForm";
import { CustomerType } from "@/app/types";

interface Props {
  onSubmit: (values: CustomerType, newCustomer?: boolean) => void;
}

const CustomerPanel = ({ onSubmit }: Props) => {
  const [showNewCustomer, setNewCustomer] = useState<boolean>(false);

  const handleClick = () => {
    setNewCustomer(!showNewCustomer);
  };

  return (
    <>
      {!showNewCustomer && (
        <AddCustomerForm onClick={handleClick} onSubmit={onSubmit} />
      )}
      {showNewCustomer && (
        <CustomerForm
          // onClose={handleClick}
          phone=""
          onSubmit={(values) => onSubmit(values, true)}
        />
      )}
    </>
  );
};

export default CustomerPanel;