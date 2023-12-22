export const CustomerSchema = {
  version: 0,
  title: 'Customer Schema',
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
      email: {
          type: 'string'
      },
      first_name: {
          type: 'string'
      },
      last_name: {
          type: 'string'
      },
      phone: {
          type: 'string'
      },
  },
  required: [
    'uuid',
    'nid',
    'email',
    'first_name',
    'last_name',
    'phone',
  ]
};
