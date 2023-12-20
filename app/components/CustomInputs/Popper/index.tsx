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

  const onStart: DraggableEventHandler = (e) => {
    /*
    if ('touches' in e) {
      e.stopPropagation();
    } else if ('stopPropagation' in e) {
      e.stopPropagation();
    }
    */
    console.log("--->>Wid<<-----");
    e.preventDefault();
  }

  if (!hidePopper) {
    popper = (
      // <Draggable onStart={onStart}>
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
      // </Draggable>
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
