import { BookingType, ServiceType, StaffType } from "@/app/types";
import {
  getBookingList,
  getServiceList,
  getStaffList,
  getStatusList,
} from "@/app/services";
import dynamic from "next/dynamic";
import mt from "moment-timezone";
import { RxDBProvider } from "./db";

const BookingCalender = dynamic(() => import("@/app/components/BookingCalendar"), {
  ssr: false,
});

/**
 * 
 * @param data
 * @returns new-formatted & sorted staff/provider list for calendar
 */
const getStaff = (data: StaffType[]) => {
  return data
    .map((staff) => ({
      resourceId: Number(staff.id),
      uuid: staff.uuid,
      resourceTitle: staff.title,
    }))
    .sort((a: any, b: any) => a.resourceId - b.resourceId);
};


/**
 * 
 * @param events 
 * @returns new formatted booking appointment
 */
const getEvents = (events: BookingType[]) => {
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
      staff_title: booking.staff_title,
      status: booking.status,
      customer_first_name: booking.customer_first_name,
      customer_last_name: booking.customer_last_name
    };
  });
};

export default async function Home() {
  const defaultDate = new Date();
  //fetched staff list
  const staffList = await getStaffList();
  //fetched service list
  const serviceData = await getServiceList();
  //fetched booking list
  const bookingList = await getBookingList();

  const statusList = await getStatusList();
  //formarted staff/providers for calendar
  const providers = getStaff(staffList);
  //formated booking list for calendar
  const events = getEvents(bookingList);

  return (
    <RxDBProvider>
      <main className="bg-white">
        <section className="h-screen">
          <BookingCalender
            defaultDate={defaultDate}
            events={events}
            providers={providers as []}
            services={serviceData as ServiceType[]}
            status={statusList}
            providerIdAccessor="resourceId"
            providerTitleAccessor="resourceTitle"
          />
        </section>
      </main>
    </RxDBProvider>
  );
}
