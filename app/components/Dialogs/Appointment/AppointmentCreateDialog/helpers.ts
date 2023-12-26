import { createBooking, createCustomer as createCustomerBackend, updateCustomer as updateCustomerBackend } from "@/app/api/services";
import { onBookingCreated, onCustomerCreated, onCustomerUpdated } from "@/app/api/socket";
import moment from "moment";

/**
 * 
 * @param values appointment details
 * @param customer customer data
 * @param db rxdb instance
 * @returns response from server
 */

export const createAppointment = async (values: any, customer: any, db: any, socket: any) => {
  const selectedService = values.selectedService;
  const selectedStaff = values.selectedStaff;
  const selectedStatus = values.selectedStatus;
  const name = values.fullname;
  const startTime = values.startTime;
  const endTime = values.endTime;
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
    },
  };
  if (values.status) {
    relationships = {
      ...relationships,
      field_status: {
        data: [
          {
            type: "taxonomy_term--status",
            id: values.status,
          },
        ],
      },
    };
  }
  if (customer.uuid) {
    relationships = {
      ...relationships,
      field_customer: {
        data: [
          {
            type: "node--customers",
            id: customer.uuid,
          },
        ],
      },
    };
  }
  const response = await createBooking({
    type: "node--booking",
    attributes: {
      title: customer.name || name,
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

  const createdData = {
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
    status: selectedStatus ?? ""
  };

  db.collections.bookings.upsert(createdData);
  onBookingCreated(createdData, socket);
  return response;
};

/**
 * 
 * @param values new customer data
 * @param customer customer data(use uuid)
 * @param db rxdb instance
 * @returns updated data
 */

export const updateCustomer = async (values: any, customer: any, db: any, socket: any) => {
  let customerData: any = {
    type: "node--customers",
    id: customer.uuid,
    attributes: {
      title: `${values.first_name} ${values.last_name}`,
      field_email_address: values.email,
      field_first_name: values.first_name,
      field_last_name: values.last_name,
      field_phone: values.phone
    }
  }
  let response = await updateCustomerBackend(customerData);
  let updatedData = {
    uuid: response.data.id,
    nid: response.data.attributes.drupal_internal__nid,
    email: response.data.attributes.field_email_address,
    first_name: response.data.attributes.field_first_name,
    last_name: response.data.attributes.field_last_name,
    phone: response.data.attributes.field_phone,
  };
  db.collections.customers.upsert(updatedData);
  onCustomerUpdated(updatedData, socket);
  return updatedData;
}

/**
 * 
 * @param values customer data
 * @param db rxdb instance
 * @returns created data
 */

export const createCustomer = async (values: any, db: any, socket: any) => {
  const name = `${values?.first_name} ${values?.last_name}`;
  const response = await createCustomerBackend({
    type: "node--customers",
    attributes: {
      title: name,
      field_first_name: values.first_name,
      field_last_name: values.last_name,
      field_email_address: values.email,
      field_phone: values.phone,
      body: null,
    },
  });
  
  let createdData = {
    uuid: response.data.id,
    nid: response.data.attributes.drupal_internal__nid,
    email: response.data.attributes.field_email_address,
    first_name: response.data.attributes.field_first_name,
    last_name: response.data.attributes.field_last_name,
    phone: response.data.attributes.field_phone,
  };
  db.collections.customers.upsert(createdData);
  onCustomerCreated(createdData, socket);

  return createdData;
}