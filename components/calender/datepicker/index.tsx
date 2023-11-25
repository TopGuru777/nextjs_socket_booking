import { type NavigateAction } from "react-big-calendar";
import DatePicker from "react-datepicker";
import TextButton from "./date-button";

interface Props {
  label: string;
  selectedDate: Date;
  onNavigate: (value: NavigateAction, date: Date) => void;
}

const CustomDatePicker = ({ label, selectedDate, onNavigate }: Props) => {
  const handleChange = (date: Date) => {
    onNavigate('DATE', date);
  };
  return (
    <DatePicker
      selected={selectedDate}
      onChange={handleChange}
      enableTabLoop={false}
      customInput={<TextButton label={label} />}
    />
  );
};

export default CustomDatePicker;
