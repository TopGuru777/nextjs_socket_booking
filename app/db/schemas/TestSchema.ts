export const HumanSchema = {
  version: 0,
  title: 'human schema with composite primary',
  primaryKey: {
      // where should the composed string be stored
      key: 'id',
      // fields that will be used to create the composed key
      fields: [
          'firstName',
          'lastName'
      ],
      // separator which is used to concat the fields values.
      separator: '|'
  },
  type: 'object',
  properties: {
      id: {
          type: 'string',
          maxLength: 100 // <- the primary key must have set maxLength
      },
      firstName: {
          type: 'string'
      },
      lastName: {
          type: 'string'
      }
  },
  required: [
    'id', 
    'firstName',
    'lastName'
  ]
};