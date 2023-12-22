import Popper from "@/app/components/CustomInputs/Popper";
import React, { PropsWithChildren, ReactElement, useState } from "react";
import { type EventWrapperProps } from "react-big-calendar";

interface Props extends EventWrapperProps<any> {
  children?: ReactElement<any, any> | undefined;
  onSelectEvent: (event: any) => void;
}

const AppointmentWrapper = (props: Props) => {
  const data = props.event;
  const handleClick = () => {
    props.onSelectEvent(data);
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
    customElement
  );

  const wrapper = React.cloneElement(
    props?.children as ReactElement,
    {},
    eventElement
  );
  return wrapper;
};

export default AppointmentWrapper;
