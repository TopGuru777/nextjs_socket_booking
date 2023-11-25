import {useState} from 'react';
import DatePicker from "react-datepicker";
import TextButton from "./date-button";

interface Props {
    value: Date;
    onChange: (date: Date) => void;
}

const SelectDateDropdown = ({value, onChange}: Props) => {
  const handleChange = (date: Date) => {
    console.log(date);
    onChange(date);
  };
  return (
    <DatePicker
      selected={value}
      onChange={handleChange}
      dateFormat="EEE, LLL d"
      customInput={<TextButton />}
    />
  );
};

export default SelectDateDropdown;
