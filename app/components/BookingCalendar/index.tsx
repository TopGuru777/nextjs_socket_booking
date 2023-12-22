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
import AppointmentWrapperContainer from "./AppointmentWrapperContainer";
import AppointmentCreateDialog from "../Dialogs/Appointment/AppointmentCreateDialog";
import DeleteConfirmDialog from "../Dialogs/DeleteConfirmDialog";
import { ServiceType, StatusType, EventType, BookingType, StaffType } from "@/app/types";
import { updateBooking } from "@/app/api/services";
import AppointmentDetailsDialog from "../Dialogs/Appointment/AppointmentDetailsDialog";
import { useRxDB } from "@/app/db";
import mt from "moment-timezone";

interface Props {
  defaultDate: Date;
  localizer?: DateLocalizer;
  staffIdAccessor?: any;
  staffNameAccessor?: any;
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


/**
 * 
 * @param data
 * @returns new-formatted & sorted staff list for calendar
 */
const getStaff = (data: StaffType[]): any[] => {
  return data
    .map((staff) => ({
      staff_id: Number(staff.id),
      uuid: staff.uuid,
      staff_name: staff.title,
    }))
    .sort((a: any, b: any) => a.staff_id - b.staff_id);
};


/**
 * 
 * @param events 
 * @returns new formatted booking appointment
 */
const getEvents = (events: BookingType[]): any[] => {
  return events?.map((booking: BookingType) => {
    const dateRange = booking.date_range.split(" - ");

    /**
     * convert to new local timezone
     */
    const start_date = mt.tz(dateRange[0] + "Z", "America/New_York").format();
    const end_date = mt.tz(dateRange[1] + "Z", "America/New_York").format();
    return {
      id: booking.uuid,
      customer_id: booking.customer_uuid,
      service: booking.service_name,
      cost: booking.service_cost,
      duration: booking.service_duration,
      name: `${booking.customer_first_name} ${booking.customer_last_name}`,
      phone: booking.customer_phone,
      email: booking.customer_email,
      title: `${booking.customer_first_name} ${booking.customer_last_name}`,
      start: new Date(start_date),
      end: new Date(end_date),
      resourceId: Number(booking.staff_id),
      staff_name: booking.staff_title,
      status: booking.status,
      customer_first_name: booking.customer_first_name,
      customer_last_name: booking.customer_last_name
    };
  });
};

const Calender = ({
  defaultDate,
  localizer = defaultLocalizer,
  staffIdAccessor,
  staffNameAccessor,
}: Props) => {
  const db: any = useRxDB();

  const [services, setServices] = useState<ServiceType[]>([]);
  const [status, setStatus] = useState<StatusType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);

  const asPath = useMemo(() => window.location.hash.slice(1).split("/"), []);
  const [calenderEvents, setCalenderEvents] =
    useState<Array<EventType>>(events);
  const [isOpenEvent, setIsOpenEvent] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    staffId: string | number;
    start: Date;
    end: Date;
  } | null>(null);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const randomColor =
    randomColors[Math.floor(Math.random() * randomColors.length)];

  //load data from indexeddb

  const loadDataFromIndexedDB = async () => {
    const serviceList = await db.collections.services.exportJSON();
    setServices(serviceList.docs);
    const statusList = await db.collections.statuses.exportJSON();
    setStatus(statusList.docs);
    const staffList = await db.collections.staffs.exportJSON();
    setStaffs(getStaff(staffList.docs));
    const bookingList = await db.collections.bookings.exportJSON();
    setEvents(getEvents(bookingList.docs));
  }

  useEffect(() => {
    if (db != null) {
      loadDataFromIndexedDB();
    }
  }, [db]);

  // update calendar based on events
  useEffect(() => {
    setCalenderEvents(events);
    console.log('@calendar events@', events);
    console.log('@resources@', staffs);
  }, [events])


  /**
   * @desc open appointment creating dialog
   */

  const handleOpenModal = useCallback(() => {
    setIsOpen(true);
  }, []);


  /**
   * @desc delete appointment
   */

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

  /**
   * @desc close appointment creating dialog
   */
  const handleCloseModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  /**
   * @desc reschedule on update
   */
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
        const selectedStaff = staffs?.find(
          (staff) => staff.staff_id === resourceId
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
                  id: selectedStaff?.uuid,
                },
              ],
            },
          },
        });
        return [...filtered, { ...existing, start, end, resourceId }];
      });
    },
    [staffs]
  );

  /**
   * @desc add new appointment to calendar
   */
  const handleAddEvent = useCallback((event: EventType) => {
    setCalenderEvents((prev) => {
      return [...prev, event];
    });
  }, []);

  /**
   * @desc update appointment to calendar
   */
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

  /**
   * @desc delete appointment from calendar
   */
  const handleDeleteEvent = useCallback(() => {
    setCalenderEvents((prev) => {
      return prev.filter((item) => item.id !== selectedEvent);
    });
    setIsOpenEvent(false);
  }, [selectedEvent]);

  /**
   * @desc formatting appointment appearance on calendar
   */
  const slotPropGetter = useCallback(
    (date: Date, resourceId?: any) => {
      const currentResource = staffs?.find(
        (staff) => Number(staff.staff_id) === Number(resourceId)
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
    [staffs]
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

  /**
   * 
   * @param event
   * @desc open appointment details dialog
   */
  const selectEventHandler = (event: any) => {
    setActiveEvent(event);
    setIsOpenEvent(true);
  }

  /**
   * @desc close appointment details dialog
   */
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
        onSelectSlot={(event) => {
          setSelectedSlot({
            staffId: event.resourceId as number,
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
          //Wrapper for showing event and handling select event
          eventWrapper: AppointmentWrapperContainer({
            onSelectEvent: selectEventHandler,
          }),
        }}
      />
      <AppointmentCreateDialog
        open={isOpen}
        staffs={staffs}
        staffId={selectedSlot?.staffId as number}
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
      <AppointmentDetailsDialog
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
