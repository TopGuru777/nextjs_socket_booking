import Popper from "@components/Popper";
import React, { PropsWithChildren, ReactElement, useState } from "react";
import { type EventWrapperProps } from "react-big-calendar";
import OutsideClickHandler from "react-outside-click-handler";
import { EventType, ServiceType, StatusType } from "@/app/types";
import Event from "../event";

interface Props extends EventWrapperProps<any> {
  status: StatusType[];
  services: ServiceType[];
  children?: ReactElement<any, any> | undefined;
  onUpdateEvent: (event: EventType) => void;
  onDeleteConfirm: (eventId: string) => void;
  onSelectEvent: (event: any) => void;
}

const EventWrapper = (props: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const data = props.event;
  const handleClick = () => {
    console.log('---data---', data);
    props.onSelectEvent(data);

    // setOpen(!open);
  };
  const customElement = (
    <div
      className="flex w-full h-full flex-col text-black font-medium font-mono"
      onClick={handleClick}
    >
      <span>{data.title}</span>
      <span className="mt-2">
        {data.service} ${data.cost}
      </span>
      {data.status && (
        <div className="absolute right-1 bottom-1 bg-white px-2 py-1 font-mono font-semibold text-[10px] rounded-lg">
          {data.status}
        </div>
      )}
    </div>
  );

  const eventElement = React.cloneElement(
    props?.children?.props?.children,
    {},
    <Popper
      hidePopper={!open}
      popperComponent={
        <OutsideClickHandler
          onOutsideClick={() => {
            setOpen(false);
          }}
        >
          <Event
            event={data}
            status={props.status}
            services={props.services}
            onClose={handleClick}
            onUpdateEvent={props.onUpdateEvent}
            onDeleteConfirm={props.onDeleteConfirm}
          />
        </OutsideClickHandler>
      }
      targetComponent={customElement}
    />
  );

  const wrapper = React.cloneElement(
    props?.children as ReactElement,
    {},
    eventElement
  );
  return wrapper;
};

export default EventWrapper;
