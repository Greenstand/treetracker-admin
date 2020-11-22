import {Entity, model, property} from '@loopback/repository';

@model({
  settings: {
    idInjection: false,
    postgresql: {schema: 'public', table: 'planter_registrations'},
  }
})
export class PlanterRegistration extends Entity {
  @property({
    type: 'number',
    postgresql: {
      columnName: 'planter_id',
      dataType: 'integer',
    },
  })
  planterId: number;

  @property({
    type: 'date',
    required: true,
    dataType: 'timestamp without time zone',
    postgresql: {
      columnName: 'created_at',
    },
  })
  createdAt: string;

  @property({
    type: 'number',
  })
  lat?: number;

  @property({
    type: 'number',
  })
  lon?: number;

  // Define well-known properties here

  // Indexer property to allow additional data
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [prop: string]: any;

  constructor(data?: Partial<PlanterRegistration>) {
    super(data);
  }
}

export interface PlanterRegistrationRelations {
  // describe navigational properties here
}

export type PlanterRegistrationWithRelations = PlanterRegistration & PlanterRegistrationRelations;
