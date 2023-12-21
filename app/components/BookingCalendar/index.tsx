"use client"
import React, { useCallback, useMemo, useState, useEffect } from "react";
import {
  Calendar as ReactCalendar,
  Views,
  momentLocalizer,
  type DateLocalizer,
} from "react-big-calendar";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import moment from "moment";
import Toolbar from "./ToolBar";
import EventWrapperContainer from "./EventWrapperContainer";
import AppoinmentDialog from "../Dialogs/Appointment";
import DeleteConfirmDialog from "../Dialogs/DeleteConfirm";
import { ServiceType, StatusType, EventType, ResourceType } from "@/app/types";
import { updateBooking } from "@/app/services";
import EventDialog from "../Dialogs/Event";
import { useRxDB } from "@/app/db";

interface Props {
  events: Array<EventType>;
  defaultDate: Date;
  localizer?: DateLocalizer;
  resources?: Array<ResourceType>;
  resourceIdAccessor?: any;
  resourceTitleAccessor?: any;
  services: ServiceType[];
  status: Array<StatusType>;
}
moment.locale("en-US");
const defaultLocalizer = momentLocalizer(moment);
const DragAndDropCalendar = withDragAndDrop(ReactCalendar);

const randomColors = [
  "114, 213, 209",
  "121, 216, 22",
  "67, 144, 199",
  "227, 204, 136",
  "206, 236, 131",
  "38, 214, 30",
];

const Calender = ({
  events,
  defaultDate,
  localizer = defaultLocalizer,
  resources,
  services,
  status,
  resourceIdAccessor,
  resourceTitleAccessor,
}: Props) => {
  const db: any = useRxDB();
  const asPath = useMemo(() => window.location.hash.slice(1).split("/"), []);
  const [calenderEvents, setCalenderEvents] =
    useState<Array<EventType>>(events);
  const [isOpenEvent, setIsOpenEvent] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    resourceId: string | number;
    start: Date;
    end: Date;
  } | null>(null);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const randomColor =
    randomColors[Math.floor(Math.random() * randomColors.length)];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     const db = await getDb();
  //     setDB(db);
  //   }
  //   fetchData();
  // }, []);

  // useEffect(() => {
  //   if (db != null) {
  //     db.collections.heroes.upsert({
  //       firstName: "Dee",
  //       lastName: "Juan"
  //     }).then(function (result: any) {
  //       console.log("Upserted", result);
  //     }).catch(function (error: any) {
  //       console.log("UPsert failed", error);
  //     });
  //   }
  // }, []);

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleDeleteConfirm = useCallback(
    (eventId?: string) => {
      setDeleteConfirm(!deleteConfirm);
      if (eventId) {
        console.log(eventId);
        setSelectedEvent(eventId);
      } else {
        setSelectedEvent(null);
      }
    },
    [deleteConfirm]
  );

  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleMoveEvent = useCallback(
    ({
      event,
      start,
      end,
      resourceId,
      isAllDay: droppedOnAllDaySlot = false,
    }: any) => {
      // const names = name.split(" ");
      const { allDay } = event;
      if (!allDay && droppedOnAllDaySlot) {
        event.allDay = true;
      }
      setCalenderEvents((prev: any) => {
        const selectedResource = resources?.find(
          (resource) => resource.resourceId === resourceId
        );
        const existing =
          prev.find((ev: { id: any }) => ev.id === event.id) ?? {};
        const filtered = prev.filter((ev: { id: any }) => ev.id !== event.id);
        updateBooking({
          type: "node--booking",
          id: existing.id,
          attributes: {
            title: existing.name,
            field_date_range: {
              value: moment(start).format(),
              end_value: moment(end).format(),
              rrule: null,
              rrule_index: null,
              timezone: "UTC",
            }
          },
          relationships: {
            field_staff: {
              data: [
                {
                  type: "node--staffs",
                  id: selectedResource?.uuid,
                },
              ],
            },
          },
        });
        return [...filtered, { ...existing, start, end, resourceId }];
      });
    },
    [resources]
  );

  const handleAddEvent = useCallback((event: EventType) => {
    setCalenderEvents((prev) => {
      return [...prev, event];
    });
  }, []);

  const handleUpdateEvent = useCallback((event: EventType) => {
    setCalenderEvents((prev) => {
      return prev.map((item) => {
        if (item.id === event.id) {
          return event;
        }
        return item;
      });
    });
    setIsOpenEvent(false);
  }, []);

  const handleDeleteEvent = useCallback(() => {
    setCalenderEvents((prev) => {
      return prev.filter((item) => item.id !== selectedEvent);
    });
    setIsOpenEvent(false);
  }, [selectedEvent]);

  const slotPropGetter = useCallback(
    (date: Date, resourceId?: any) => {
      const currentResource = resources?.find(
        (resource) => Number(resource.resourceId) === Number(resourceId)
      );
      const startTime = currentResource?.start;
      const endTime = currentResource?.end;
      return {
        ...(moment(date).hour() > Number(startTime) &&
          moment(date).hour() < Number(endTime) && {
          style: {
            backgroundColor: "#eef0f2",
            color: "black",
          },
        }),
      };
    },
    [resources]
  );

  const eventPropGetter = useCallback(() => {
    return {
      style: {
        borderLeft: `5px solid rgba(${randomColor}, 1)`,
        borderColor: `rgba(${randomColor}, 1)`,
        backgroundColor: `rgba(${randomColor}, 0.5)`,
      },
    };
  }, [randomColor]);

  const slotGroupPropGetter = useCallback(
    () => ({
      style: {
        minHeight: 88,
      },
    }),
    []
  );

  const selectEventHandler = (event: any) => {
    setActiveEvent(event);
    setIsOpenEvent(true);
  }

  const onCloseEvent = () => {
    setIsOpenEvent(false);
  }

  const defaultView = asPath[0] === "weekly" ? Views.WEEK : Views.DAY;
  return (
    <>
      <DragAndDropCalendar
        localizer={localizer}
        step={15}
        timeslots={4}
        events={calenderEvents}
        formats={{
          dayHeaderFormat: "MMM DD, YYYY",
        }}
        resizable={false}
        resources={resources}
        resourceIdAccessor={resourceIdAccessor}
        resourceTitleAccessor={resourceTitleAccessor}
        defaultDate={defaultDate}
        defaultView={defaultView}
        scrollToTime={new Date(1972, 0, 1, 8)}
        views={[Views.DAY, Views.WEEK]}
        selectable
        slotPropGetter={slotPropGetter}
        showMultiDayTimes={true}
        onSelectSlot={(event) => {
          setSelectedSlot({
            resourceId: event.resourceId as number,
            start: event.start,
            end: event.end,
          });
          handleOpenModal();
        }}
        onEventDrop={handleMoveEvent}
        draggableAccessor={() => true}
        eventPropGetter={eventPropGetter}
        slotGroupPropGetter={slotGroupPropGetter}
        components={{
          toolbar: Toolbar,
          eventWrapper: EventWrapperContainer({
            status,
            services,
            onUpdateEvent: handleUpdateEvent,
            onDeleteConfirm: handleDeleteConfirm,
            onSelectEvent: selectEventHandler,
          }),
        }}
      />
      <AppoinmentDialog
        open={isOpen}
        resources={resources as ResourceType[]}
        resourceId={selectedSlot?.resourceId as number}
        startEvent={selectedSlot?.start as Date}
        services={services}
        status={status}
        addEvent={handleAddEvent}
        onClose={handleCloseModal}
      />
      <DeleteConfirmDialog
        open={deleteConfirm}
        selectedEvent={selectedEvent}
        onDelete={handleDeleteEvent}
        onClose={handleDeleteConfirm}
      />
      <EventDialog
        open={isOpenEvent}
        event={activeEvent}
        status={status}
        services={services}
        onUpdateEvent={handleUpdateEvent}
        onDeleteConfirm={handleDeleteConfirm}
        onClose={onCloseEvent}
      />
    </>
  );
};

export default Calender;
