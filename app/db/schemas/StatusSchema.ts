export const StatusSchema = {
  version: 0,
  title: 'Status Schema',
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
      name: {
          type: 'string'
      }
  },
  required: [
    'uuid',
    'name'
  ]
};
