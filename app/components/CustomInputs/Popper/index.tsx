import React from "react";
import { Manager, Reference, Popper as DefaultPopper } from "react-popper";
import Draggable, { DraggableEventHandler } from "react-draggable";

interface Props {
  hidePopper: boolean;
  targetComponent: React.ReactElement;
  popperComponent: React.ReactElement;
}

const Popper = ({ hidePopper, targetComponent, popperComponent }: Props) => {
  let popper;

  if (!hidePopper) {
    popper = (
      <DefaultPopper placement="right-start">
        {({ ref, style, placement, arrowProps }: any) => (
          <div
            {...{ ref, style }}
            className="event-popper"
            data-placement={placement}
          >
            {React.cloneElement(
              popperComponent,
              {},
              React.cloneElement(popperComponent.props.children, { arrowProps })
            )}
          </div>
        )}
      </DefaultPopper>
    );
  }

  return (
    <Manager>
      <Reference>
        {({ ref }) => (
          <div ref={ref} style={{ width: `100%`, height: "100%" }}>
            {targetComponent}
          </div>
        )}
      </Reference>
      {popper}
    </Manager>
  );
};

export default Popper;
