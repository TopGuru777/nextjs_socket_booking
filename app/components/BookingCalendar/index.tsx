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
import AppointmentWrapperContainer from "./AppointmentWrapperContainer";
import AppointmentCreateDialog from "../Dialogs/Appointment/AppointmentCreateDialog";
import DeleteConfirmDialog from "../Dialogs/DeleteConfirmDialog";
import { ServiceType, StatusType, EventType, BookingType, StaffType } from "@/app/types";
import { updateBooking } from "@/app/api/services";
import AppointmentDetailsDialog from "../Dialogs/Appointment/AppointmentDetailsDialog";
import { fetchBookings, fetchCustomerList, fetchServices, fetchStaffList, fetchStatusList, useRxDB } from "@/app/db";
import mt from "moment-timezone";
import RescheduleConfirmDialog from "../Dialogs/RescheduleConfirmDialog";
import CustomDnDCalendar from "./CustomDnDCalendar";
import useBookingCalendarStore from "@/app/store";
import { io } from "socket.io-client";

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



const Calendar = ({
  defaultDate,
  localizer = defaultLocalizer,
  staffIdAccessor,
  staffNameAccessor,
}: Props) => {
  //RxDB instance for indexeddb operation
  const db: any = useRxDB();

  const [services, setServices] = useState<ServiceType[]>([]);
  const [status, setStatus] = useState<StatusType[]>([]);
  const [events, setEvents] = useState<EventType[]>([]);
  const [staffs, setStaffs] = useState<any[]>([]);

  const asPath = window.location.hash.slice(1).split("/");
  const [calendarEvents, setCalendarEvents] =
    useState<Array<EventType>>(events);
  const [isOpenEvent, setIsOpenEvent] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [deleteConfirm, setDeleteConfirm] = useState<boolean>(false);
  const [rescheduleConfirm, setRescheduleConfirm] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [eventToReschedule, setEventToReschedule] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<{
    staffId: string | number;
    start: Date;
    end: Date;
  } | null>(null);
  const [activeEvent, setActiveEvent] = useState<any>(null);
  const randomColor =
    randomColors[Math.floor(Math.random() * randomColors.length)];

  //Store for containing global level data
  const { setSocket, currentStaff, setCurrentStaff, staffList, setStaffList, currentView, startDate, endDate, setStartDate, setEndDate } = useBookingCalendarStore(
    (state) => state
  );

  const initializeSocket = async () => {
    await fetch("/api/socket");
    // let socket: any = io("http://localhost:3001");

    let socket = io("/", {
      path: "/api/socketio"
    });

    socket.emit("join_room", "global_room");
    socket.on("booking_created", (data: any) => {
      console.log("@booking_created@", data);
      db.collections.bookings.upsert(data);
    })
    socket.on("booking_updated", (data: any) => {
      console.log("@booking_updated@", data);
      db.collections.bookings.upsert(data);
    })
    socket.on("booking_rescheduled", (data: any) => {
      console.log("@booking_rescheduled@", data);
      db.collections.bookings.upsert(data);
    })
    socket.on("booking_status_updated", (data: any) => {
      console.log("@booking_status_updated@", data);
      db.collections.bookings.upsert(data);
    })
    socket.on("customer_updated", (data: any) => {
      console.log("@customer_updated@", data);
      db.collections.customers.upsert(data);
    })
    socket.on("customer_created", (data: any) => {
      console.log("@customer_created@", data);
      db.collections.customers.upsert(data);
    })
    setSocket(socket);
    return () => {
      socket.disconnect();
      setSocket(null);
    }
  }

  useEffect(() => {
    initializeSocket();
  }, [db])


  useEffect(() => {
    setStaffList(staffs);
  }, [staffs])

  useEffect(() => {
    let serviceSubscription: any;
    let staffSubscription: any;
    let statusSubscription: any;
    let bookingSubscription: any;

    const fetchAndObserve = async () => {
      if (db != null) {

        // Subscribe to the services collection
        serviceSubscription = db.collections.services.find().$.subscribe((newServices: any) => {
          if (newServices) {
            console.log('@new services', newServices.map((service: any) => service.toJSON()))
            setServices(newServices.map((service: any) => service.toJSON()));
          }
        });

        // Subscribe to the statuses collection
        statusSubscription = db.collections.statuses.find().$.subscribe((newStatuses: any) => {
          if (newStatuses) {
            console.log('@new statuses', newStatuses.map((status: any) => status.toJSON()))
            setStatus(newStatuses.map((status: any) => status.toJSON()));
          }
        });

        // Subscribe to the staffs collection
        staffSubscription = db.collections.staffs.find().$.subscribe((newStaffs: any) => {
          if (newStaffs) {
            console.log('@new staffs@', getStaff(newStaffs.map((staff: any) => staff.toJSON())));
            setStaffs(getStaff(newStaffs.map((staff: any) => staff.toJSON())));
          }
        });

        // Subscribe to the bookings collection
        bookingSubscription = db.collections.bookings.find().$.subscribe((newBookings: any) => {
          if (newBookings) {
            console.log('@new bookings@', getEvents(newBookings.map((booking: any) => booking.toJSON())));
            setEvents(getEvents(newBookings.map((booking: any) => booking.toJSON())));
          }
        });


        fetchServices(db);
        fetchBookings(moment().subtract(15, 'days').toDate(), moment().add(15, 'days').toDate(), db)
          .then((res) => {
            setStartDate(moment().subtract(15, 'days').toDate());
            setEndDate(moment().add(15, 'days').toDate());
          });
        fetchStaffList(db);
        fetchStatusList(db);
        fetchCustomerList(db);
      };
    }

    fetchAndObserve();

    // Cleanup subscriptions on unmount
    return () => {
      if (serviceSubscription) {
        serviceSubscription.unsubscribe();
      }
      if (statusSubscription) {
        statusSubscription.unsubscribe();
      }
      if (staffSubscription) {
        staffSubscription.unsubscribe();
      }
      if (bookingSubscription) {
        bookingSubscription.unsubscribe();
      }
    };
  }, [db]);

  // update calendar based on events

  const handleSetEvents = useCallback((events: any) => {
    setCalendarEvents((prev) => {
      return [...events];
    });
  }, [])

  useEffect(() => {
    handleSetEvents(events);
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
   * @desc close appointment rescheduling dialog
   */
  const handleCloseRescheduleDialog = useCallback(() => {
    setRescheduleConfirm(false);
  }, []);

  /**
   * @desc reschedule on update
   */
  const handleMoveEvent = ({
    event,
    start,
    end,
    resourceId,
    isAllDay: droppedOnAllDaySlot = false,
  }: any) => {
    const selectedStaff = staffs?.find(
      (staff) => staff.staff_id === resourceId
    );
    const currentEvent: any = events.find((ev: { id: any }) => ev.id === event.id) ?? {};
    const newEvent: any = { ...currentEvent, new_start: start, new_end: end, selectedStaff: selectedStaff };
    setCalendarEvents((prev: any) => {
      const currentEvent: any = prev.find((ev: { id: any }) => ev.id === event.id) ?? {};
      const filtered = prev.filter((ev: { id: any }) => ev.id !== event.id);
      return [...filtered, { ...currentEvent, start, end, resourceId }];
    });
    setEventToReschedule(newEvent);
    setRescheduleConfirm(true);
  };

  /**
   * 
   * @param event previous event
   */
  const handleCancelReschedule = (event: any) => {
    setCalendarEvents((prev: any) => {
      const filtered = prev.filter((ev: { id: any }) => ev.id !== event.id);
      return [...filtered, { ...event }];
    });
    handleCloseRescheduleDialog();
  }

  /**
   * @desc add new appointment to calendar
   */
  const handleAddEvent = useCallback((event: EventType) => {
    setCalendarEvents((prev) => {
      return [...prev, event];
    });
  }, []);

  /**
   * @desc update appointment to calendar
   */
  const handleEventUpdated = useCallback(() => {
    setIsOpenEvent(false);
  }, []);

  /**
   * @desc delete appointment from calendar
   */
  const handleDeleteEvent = useCallback(() => {
    setCalendarEvents((prev) => {
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

  useEffect(() => {
    console.log("@rerender");
  });



  /**
   * @desc close appointment details dialog
   */
  const onCloseEvent = () => {
    setIsOpenEvent(false);
  }

  /**
   * 
   * @param newDate 
   */
  const handleNavigate = async (newDate: Date) => {
    if (newDate < startDate) {
      console.log('lower fetch');
      const newStartDate = moment(newDate).subtract(15, 'days').toDate()
      await fetchBookings(newStartDate, newDate, db);
      setStartDate(newStartDate);
    }

    if (newDate > endDate) {
      console.log('upper fetch');
      const newEndDate = moment(newDate).add(15, 'days').toDate()
      await fetchBookings(newDate, newEndDate, db);
      setEndDate(newEndDate);
    }
  }

  const defaultView = asPath[0] === "weekly" ? Views.WEEK : Views.DAY;
  const calendarStaffs = currentView == Views.WEEK ? [currentStaff] : staffs;

  return (
    <>
      <CustomDnDCalendar
        localizer={localizer}
        calendarEvents={calendarEvents}
        staffs={calendarStaffs}
        staffIdAccessor={staffIdAccessor}
        staffNameAccessor={staffNameAccessor}
        defaultDate={defaultDate}
        defaultView={defaultView}
        slotPropGetter={slotPropGetter}
        onNavigate={handleNavigate}
        //when creating new appointment
        onSelectSlot={(event: any) => {
          setSelectedSlot({
            staffId: event.resourceId as number,
            start: event.start,
            end: event.end,
          });
          handleOpenModal();
        }}
        handleMoveEvent={handleMoveEvent}
        eventPropGetter={eventPropGetter}
        slotGroupPropGetter={slotGroupPropGetter}
        eventWrapper={AppointmentWrapperContainer({
          onSelectEvent: selectEventHandler,
        })}
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
        staffs={staffs}
        onAppointmentUpdated={handleEventUpdated}
        onDeleteConfirm={handleDeleteConfirm}
        onClose={onCloseEvent}
      />
      <RescheduleConfirmDialog
        open={rescheduleConfirm}
        event={eventToReschedule}
        onCancel={handleCancelReschedule}
        onReschedule={handleCloseRescheduleDialog}
      />
    </>
  );
};

export default Calendar;
