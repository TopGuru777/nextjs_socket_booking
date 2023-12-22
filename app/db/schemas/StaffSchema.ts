export const StaffSchema = {
  version: 0,
  title: 'Staff Schema',
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
      id: {
          type: 'string'
      },
      title: {
          type: 'string'
      },
  },
  required: [
    'uuid', 
    'id',
    'title'
  ]
};
