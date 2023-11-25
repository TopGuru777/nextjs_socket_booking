import { BookingType, ServiceType, StaffType } from "@/types";
import {
  getBookingList,
  getServiceList,
  getStaffList,
  getStatusList,
} from "@/services";
import dynamic from "next/dynamic";

const BookingCalender = dynamic(() => import('@/components/calender'), {
  ssr: false,
})

const getStaff = (data: StaffType[]) => {
  return data
    .map((staff) => ({
      resourceId: Number(staff.id),
      uuid: staff.uuid,
      resourceTitle: staff.title,
    }))
    .sort((a: any, b: any) => a.resourceId - b.resourceId);
};

const getEvents = (events: BookingType[]) => {
  return events?.map((booking: BookingType) => {
    const dateRange = booking.date_range.split(" - ");
    return {
      id: booking.uuid,
      service: booking.service_name,
      cost: booking.service_cost,
      duration: booking.service_duration,
      name: `${booking.customer_first_name} ${booking.customer_last_name}`,
      phone: booking.customer_phone,
      email: booking.customer_email,
      title: `${booking.customer_first_name} ${booking.customer_last_name}`,
      start: new Date(dateRange[0]),
      end: new Date(dateRange[1]),
      resourceId: Number(booking.staff_id),
      status: booking.status,
    };
  });
};

export default async function Home() {
  const defaultDate = new Date();
  const staffList = await getStaffList();
  const serviceData = await getServiceList();
  const bookingList = await getBookingList();
  const statusList = await getStatusList();
  const resources = getStaff(staffList);
  const events = getEvents(bookingList);

  return (
    <main className="bg-white">
      <section className="h-screen">
        <BookingCalender
          defaultDate={defaultDate}
          events={events}
          resources={resources as []}
          services={serviceData as ServiceType[]}
          status={statusList}
          resourceIdAccessor="resourceId"
          resourceTitleAccessor="resourceTitle"
        />
      </section>
    </main>
  );
}
