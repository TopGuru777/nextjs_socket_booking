export const BookingSchema = {
  version: 0,
  title: 'Booking Schema',
  primaryKey: {
      // where should the composed string be stored
      key: 'uuid',
      // fields that will be used to create the composed key
      fields: [
        'uuid'
      ],
      // separator which is used to concat the fields values.
      separator: '|'
  },
  type: 'object',
  properties: {
      uuid: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      },
      nid: {
        type: 'string'
      },
      customer_email: {
        type: 'string'
      },
      customer_first_name: {
        type: 'string'
      },
      customer_last_name: {
        type: 'string'
      },
      customer_phone: {
        type: 'string'
      },
      customer_uuid: {
        type: 'string'
      },
      date_range: {
        type: 'string'
      },
      service_cost: {
        type: 'string'
      },
      service_duration: {
        type: 'string'
      },
      service_name: {
        type: 'string'
      },
      staff_id: {
        type: 'string'
      },
      staff_title: {
        type: 'string'
      },
      status : {
        type: 'string'
      }
  },
  required: [
    'uuid',
    'nid',
    'customer_email',
    'customer_first_name',
    'customer_last_name',
    'customer_phone',
    'customer_uuid',
    'date_range',
    'service_cost',
    'service_duration',
    'service_name',
    'staff_id',
    'staff_title',
    'status'
  ]
};
