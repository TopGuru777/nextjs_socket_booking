/* eslint-disable react/display-name */
import { type EventWrapperProps } from "react-big-calendar";
import AppointmentWrapper from "./AppointmentWrapper";

interface Props {
  onSelectEvent: (event: any) => void;
}

const AppointmentWrapperContainer =
  ({ onSelectEvent }: Props) =>
    (props: EventWrapperProps) => {
      return (
        <AppointmentWrapper
          {...props}
          onSelectEvent={onSelectEvent}
        />
      );
    };

AppointmentWrapperContainer.displayName = "AppointmentWrapperContainer";

export default AppointmentWrapperContainer;
