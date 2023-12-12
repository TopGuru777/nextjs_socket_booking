/* eslint-disable react/display-name */
import { type EventWrapperProps } from "react-big-calendar";
import EventWrapper from "./event-wrapper";
import { EventType, ServiceType, StatusType } from "@/app/types";

interface Props {
  status: StatusType[];
  services: ServiceType[];
  onUpdateEvent: (event: EventType) => void;
  onDeleteConfirm: (eventId: string) => void;
  onSelectEvent: (event: any) => void;
}

const EventWrapperContainer =
  ({ status, services, onUpdateEvent, onDeleteConfirm, onSelectEvent }: Props) =>
    (props: EventWrapperProps) => {
      return (
        <EventWrapper
          {...props}
          status={status}
          services={services}
          onUpdateEvent={onUpdateEvent}
          onDeleteConfirm={onDeleteConfirm}
          onSelectEvent={onSelectEvent}
        />
      );
    };

EventWrapperContainer.displayName = "EventWrapperContainer";

export default EventWrapperContainer;
