import { updateBooking as updateBookingBackend} from "@/app/api/services";
import moment from "moment";
import { onBookingUpdated, onBookingStatusUpdated } from "@/app/api/socket";

/**
 * 
 * @param values appointment data
 * @desc update appointment
 */

export const updateAppointment = async (values: any, db: any, socket: any) => {
  const selectedService = values.selectedService;
  const selectedStaff = values.selectedStaff;
  const startTime = values.startTime;
  const endTime = values.endTime;

  const customer = values.customer;
  const appointment = values.appointment;

  let data = {
    ...appointment,
    service: selectedService?.title as string,
    start: moment(startTime).toDate(),
    end: moment(endTime).toDate(),
    phone: values.customer.phone || customer.phone,
    email: values.customer.email || customer.email,
  };
  const title = values.customer.name || customer.name;
  let relationships: any = {
    field_service: {
      data: [
        {
          type: "node--services",
          id: values.service,
        },
      ],
    },
    field_staff: {
      data: [
        {
          type: "node--staffs",
          id: selectedStaff?.uuid,
        },
      ],
    }
  };
  if (title) {
    data = {
      ...data,
      title,
      name: title,
    };
  }
  if (values.customer.uuid || customer.uuid) {
    relationships = {
      ...relationships,
      field_customer: {
        data: [
          {
            type: "node--customers",
            id: values.customer.uuid || customer.uuid,
          },
        ],
      },
    };
  }
  const response = await updateBookingBackend({
    type: "node--booking",
    id: appointment.id,
    attributes: {
      title: appointment.title,
      field_date_range: {
        value: startTime,
        end_value: endTime,
        duration: Number(selectedService?.duration),
        rrule: null,
        rrule_index: null,
        timezone: "UTC",
      },
    },
    relationships,
  });

  console.log('@booking updated@', response);

  const previousData = await db.collections.bookings.findOne(response.data.id).exec();

  console.log('@prev data@', previousData);

  const updatedBooking = {
    uuid: response.data.id,
    nid: response.data.attributes.drupal_internal__nid.toString(),
    customer_email: customer.email,
    customer_first_name: customer.first_name,
    customer_last_name: customer.last_name,
    customer_phone: customer.phone,
    customer_uuid: customer.uuid,
    date_range: `${moment.utc(response.data.attributes.field_date_range.value).format('YYYY-MM-DDTHH:mm:ss')} - ${moment.utc(response.data.attributes.field_date_range.end_value).format('YYYY-MM-DDTHH:mm:ss')}`,
    service_cost: selectedService.cost,
    service_duration: selectedService.duration,
    service_name: selectedService.title,
    staff_id: selectedStaff.staff_id.toString(),
    staff_title: selectedStaff?.staff_name,
    status: previousData.status
  }
  
  await db.collections.bookings.upsert(updatedBooking);
  onBookingUpdated(updatedBooking, socket);

  return response;
};

/**
 * @param values appointment status, appointment id
 */

export const updateAppointmentStatus = async (value: any, id: string, db: any, socket: any) => {
  console.log('@status vaue@', value);
  const response: any = await updateBookingBackend({
    type: "node--booking",
    id: id,
    relationships: {
      field_status: {
        data: [
          {
            type: "taxonomy_term--status",
            id: value.uuid.toString(),
          },
        ],
      },
    },
  });
  console.log(`@appointment status updated@`, response);

  const previousData = await db.collections.bookings.findOne(response.data.id).exec();
  
  const updatedBooking = {
    ...previousData._data,
    status: value.name,
  }
  await db.collections.bookings.upsert(updatedBooking);

  onBookingStatusUpdated(updatedBooking, socket);
}