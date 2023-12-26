import { updateBooking as updateBookingBackend } from "@/app/api/services";
import moment from "moment";
import { onBookingRescheduled } from "@/app/api/socket";


export const rescheduleAppointment = async (event: any, db: any, socket: any) => {
  const selectedStaff = event.selectedStaff;
  updateBookingBackend({
    type: "node--booking",
    id: event.id,
    attributes: {
      title: event.name,
      field_date_range: {
        value: moment(event.new_start).format(),
        end_value: moment(event.new_end).format(),
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

  const previousData = await db.collections.bookings.findOne(event.id).exec();

  console.log('@reschedule prev data@', previousData);
  const updatedBooking = {
    ...previousData._data,
    date_range: `${moment.utc(event.new_start).format('YYYY-MM-DDTHH:mm:ss')} - ${moment.utc(event.new_end).format('YYYY-MM-DDTHH:mm:ss')}`,
    staff_id: selectedStaff.staff_id.toString(),
    staff_title: selectedStaff?.staff_name,
  }
  
  await db.collections.bookings.upsert(updatedBooking);
  onBookingRescheduled(updatedBooking, socket);
}