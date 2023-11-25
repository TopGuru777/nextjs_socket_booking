import { useState } from "react";
import AddCustomerForm from "./add-customer-form";
import CustomerForm from "./customer-form";
import { CustomerType } from "@/types";

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
        <AddCustomerForm
          onClick={handleClick}
          onSubmit={onSubmit}
        />
      )}
      {showNewCustomer && <CustomerForm onClose={handleClick} onSubmit={(values) => onSubmit(values, true)} />}
    </>
  );
};

export default CustomerPanel;