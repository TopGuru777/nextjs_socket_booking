import { useCallback, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";
import Dropdown from "@/app/components/CustomInputs/DropDown";
import AppointmentEditForm from "../AppointmentEditForm";
import { ServiceType, StatusType } from "@/app/types";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { EventType } from "@/app/types";
import { ClientToServerEvents, ServerToClientEvents } from "@/app/types/socket";
import CustomerEditForm from "../../Customer/CustomerEditForm";
import CustomerCreateForm from "../../Customer/CustomerCreateForm";
import { Dialog } from "@headlessui/react";
import AppointmentDetailsContent from "../AppointmentDetailsContent";
import { updateCustomer, createCustomer } from "../AppointmentCreateDialog/helpers";
import { useRxDB } from "@/app/db";
import { updateAppointmentStatus } from "../AppointmentEditForm/helpers";
import useBookingCalendarStore from "@/app/store";

let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

interface Props {
  event: EventType,
  status: StatusType[];
  services: ServiceType[];
  staffs: any[];
  onClose: () => void;
  onAppointmentUpdated: () => void;
  onDeleteConfirm: (eventId: string) => void;
}

const AppointmentDetailsForm = ({
  event,
  status,
  services,
  staffs,
  onClose,
  onAppointmentUpdated,
  onDeleteConfirm,
}: Props) => {
  //RxDB instance to access indexeddb
  const db = useRxDB();
  //socket client for socket.io communication
  const { socket } = useBookingCalendarStore((state) => state);
  const [customer, setCustomer] = useState<any>({
    name: event.name,
    email: event.email,
    phone: event.phone,
    first_name: event.customer_first_name,
    last_name: event.customer_last_name,
    uuid: event.customer_id
  });
  const [showEditCustomer, setEditCustomer] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");
  const [newGuest, setNewGuest] = useState<boolean>(false);
  const [phoneInput, setPhoneInput] = useState<string>("");

  /**
   * @returns mapped status options
   * @desc get status options array for dropdown from status list
   */
  const statusOptions = useMemo(() => {
    return status?.map((value: StatusType) => {
      if (event.status === value.name) {
        setSelected(value.uuid);
      }
      return {
        label: value.name,
        value: value.uuid,
      };
    });
  }, [status, event.status]);

  /**
   * @desc change appointment status
   * @enum Paid, Confirmed, Running Rate
   */
  const handleSelect = useCallback(
    (value: string) => {
      const selectedStatus: any = status.find(
        (state) => state.uuid === value
      );
      updateAppointmentStatus(selectedStatus, event.id, db, socket);
      onAppointmentUpdated();
      onClose && onClose();
    },
    [event, statusOptions, onAppointmentUpdated, onClose]
  );

  /**
   * @desc start editing appointment
   */
  const handleEditAppointment = useCallback(() => {
    setShowEdit(!showEdit);
  }, [showEdit]);

  /**
   * 
   * @param data customer data
   * @desc start editing customer
   */

  const handleSetEditCustomer = (data: any) => {
    setCustomer(data);
    setEditCustomer(true);
    setShowEdit(false);
  }

  /**
   * @desc stop editing customer
   */

  const handleFinishEditCustomer = () => {
    setEditCustomer(false);
    setShowEdit(true);
  }

  /**
   * @desc stop creating customer
   */

  const handleCreateCustomerClose = () => {
    setNewGuest(false);
    setShowEdit(true);
  }

  /**
   * 
   * @param value phone number
   * @desc start creating customer
   */
  const handleSetCreateCustomer = (value: string) => {
    setPhoneInput(value);
    setNewGuest(true);
    setShowEdit(false);
  }

  /**
   * 
   * @param values customer data
   * @desc create new customer
   */
  const handleCreateCustomer = async (values: any) => {
    const customerData = await createCustomer(values, db, socket);
    setCustomer({ ...customerData, name: `${customerData.first_name} ${customerData.last_name}` });
    handleCreateCustomerClose();
  }

  /**
   * 
   * @param values customer data
   * @desc edit customer
   */
  const handleUpdateCustomer = async (values: any) => {
    let updatedData = await updateCustomer(values, customer, db, socket);
    setCustomer({ ...updatedData, name: `${updatedData.first_name} ${updatedData.last_name}` });
    handleFinishEditCustomer();
  }

  return (
    <div className="w-full bg-white text-black shadow-3xl rounded border border-gray-200">
      {/* <div className="event-triangle" {...props.arrowProps} /> */}
      {!newGuest &&
        <div className="pt-5 pr-4 pl-6 pb-1 relative">
          <div className="flex items-center justify-between pr-3">
            <h3 className="font-sans font-bold">Appointment Details</h3>
            <Dropdown
              selected={selected}
              options={statusOptions}
              className="rounded-md bg-gray-300 py-1"
              showArrow={false}
              onSelect={handleSelect}
            />
          </div>
          <button className="absolute z-10 top-[8px] right-[8px]" onClick={onClose}>
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      }
      {!newGuest && !showEditCustomer && !showEdit && (
        <AppointmentDetailsContent
          event={event}
          onEdit={handleEditAppointment}
          onDeleteConfirm={() => onDeleteConfirm(event.id)}
        />
      )}
      {!showEditCustomer && showEdit && (
        <AppointmentEditForm
          event={event}
          services={services}
          onClose={onClose}
          staffs={staffs}
          customer={customer}
          onUpdated={onAppointmentUpdated}
          onEditCustomer={handleSetEditCustomer}
          onNewCustomer={handleSetCreateCustomer}
        />
      )}
      {showEditCustomer && <CustomerEditForm data={customer} onSubmit={handleUpdateCustomer} />}
      {newGuest && (
        <>
          <Dialog.Title
            as="div"
            className="flex justify-between handle items-center shrink-0 p-4 bg-gray-200 text-blue-gray-900 antialiased font-sans text-lg font-semibold leading-snug"
            style={{ cursor: "move" }}
            id="draggable-dialog-title"
          >
            Add Guest
            <button onClick={handleCreateCustomerClose}>
              <XMarkIcon className="h-6 w-6" />
            </button>
          </Dialog.Title>
          <CustomerCreateForm onSubmit={handleCreateCustomer} phone={phoneInput} />
        </>
      )}
    </div>
  );
};

export default AppointmentDetailsForm;
