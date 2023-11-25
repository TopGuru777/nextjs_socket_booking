export interface BookingType {
  date_range: string;
  service_name: string;
  service_cost: string;
  service_duration: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  staff_id: string;
  status: string;
  uuid: string;
}

export interface StaffType {
  id: string;
  uuid: string;
  title: string;
}

export interface ServiceType {
  id: string;
  uuid: string;
  title: string;
  cost: string;
  duration: string;
  staff: string;
}

export interface CustomerType {
  id?: string;
  uuid: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  name?: string;
}

export interface OptionType {
  name: string;
  id: string;
  phone: string;
}

export interface StatusType {
  uuid: string;
  name: string;
}

export interface StatusType {
  uuid: string;
  name: string;
}

export interface EventType {
  id: string;
  title: string;
  start: Date;
  end: Date;
  cost: string;
  service: string;
  status: string;
  resourceId?: number;
  name: string;
  phone: string;
  duration: string;
  email: string;
}

export interface ResourceType {
  resourceId: string;
  uuid: string;
  resourceTitle: string;
  start?: number;
  end?: number;
}
