import { createBooking, createCustomer as createCustomerBackend, updateCustomer as updateCustomerBackend } from "@/app/api/services";

export const createAppointment = async (values: any, customer: any) => {
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
  console.log('----create response----', response);
  return response;
};

export const updateCustomer = async (values: any, customer: any) => {
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
  let response = await updateCustomerBackend(customerData);;
}

export const createCustomer = async (values: any) => {
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
  return {...response.data.attributes, id: response.data.id};
}