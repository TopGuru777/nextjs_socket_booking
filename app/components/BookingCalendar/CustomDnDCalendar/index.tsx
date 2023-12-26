import {
  Calendar as ReactCalendar,
  Views,
  momentLocalizer,
  type DateLocalizer,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import Toolbar from "../ToolBar";
import { useEffect, useState } from "react";

const DragAndDropCalendar = withDragAndDrop(ReactCalendar);

interface Props {
  localizer: DateLocalizer;
  staffIdAccessor: any;
  staffNameAccessor: any;
  calendarEvents: any[];
  staffs: any[];
  defaultDate: any;
  defaultView: any;
  slotPropGetter: any;
  eventPropGetter: any;
  slotGroupPropGetter: any;
  handleMoveEvent: any;
  eventWrapper: any;
  onSelectSlot: any;
  onNavigate: any;
}

const CustomDnDCalendar = ({
  localizer,
  staffs,
  calendarEvents,
  staffIdAccessor,
  staffNameAccessor,
  defaultDate,
  defaultView,
  slotPropGetter,
  eventPropGetter,
  slotGroupPropGetter,
  eventWrapper,
  handleMoveEvent,
  onSelectSlot,
  onNavigate
}: Props) => {
  return (

    <DragAndDropCalendar
      localizer={localizer}
      step={15}
      timeslots={4}
      events={calendarEvents}
      formats={{
        dayHeaderFormat: "MMM DD, YYYY",
      }}
      resizable={false}
      resources={staffs}
      resourceIdAccessor={staffIdAccessor}
      resourceTitleAccessor={staffNameAccessor}
      defaultDate={defaultDate}
      defaultView={defaultView}
      scrollToTime={new Date(1972, 0, 1, 8)}
      views={[Views.DAY, Views.WEEK]}
      selectable
      slotPropGetter={slotPropGetter}
      showMultiDayTimes={true}
      //when creating new appointment
      onSelectSlot={onSelectSlot}
      onEventDrop={handleMoveEvent}
      draggableAccessor={() => true}
      eventPropGetter={eventPropGetter}
      slotGroupPropGetter={slotGroupPropGetter}
      onNavigate={onNavigate}
      components={{
        toolbar: Toolbar,
        //Wrapper for showing event and handling select event
        eventWrapper: eventWrapper,
      }}
    />
  )
}


export default CustomDnDCalendar;