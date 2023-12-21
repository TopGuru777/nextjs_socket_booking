import { useCallback, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";
import Dropdown from "@/app/components/CustomInputs/DropDown";
import EditEvent from "./EditEvent";
import EventDetails from "./EventDetails";
import { ServiceType, StatusType } from "@/app/types";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { EventType } from "@/app/types";
import { updateBooking, updateCustomer, createCustomer } from "@/app/services";
import { ClientToServerEvents, ServerToClientEvents } from "@/app/types/socket";
import EditCustomerForm from "../../Dialogs/EditCustomerForm";
import { Dialog } from "@headlessui/react";
import CustomerForm from "../../Dialogs/CustomerForm";
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

interface Props {
  event: EventType,
  status: StatusType[];
  services: ServiceType[];
  onClose: () => void;
  onUpdateEvent: (event: EventType) => void;
  onDeleteConfirm: (eventId: string) => void;
}

const Event = ({
  event,
  status,
  services,
  onClose,
  onUpdateEvent,
  onDeleteConfirm,
}: Props) => {
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


  const handleSelect = useCallback(
    (value: string) => {
      setSelected(value);
      const selectedStatus = statusOptions.find(
        (option) => option.value === value
      );
      socket?.emit("updateStatus", value);
      onUpdateEvent &&
        onUpdateEvent({ ...event, status: selectedStatus?.label as string });
      updateBooking({
        type: "node--booking",
        id: event.id,
        relationships: {
          field_status: {
            data: [
              {
                type: "taxonomy_term--status",
                id: value,
              },
            ],
          },
        },
      });
      onClose && onClose();
    },
    [event, statusOptions, onUpdateEvent, onClose]
  );

  const handleEdit = useCallback(() => {
    setShowEdit(!showEdit);
  }, [showEdit]);

  const handleEditCustomer = (data: any) => {
    setCustomer(data);
    setEditCustomer(true);
    setShowEdit(false);
  }

  const closeEditingCustomer = () => {
    setEditCustomer(false);
    setShowEdit(true);
  }

  const handleAddGuest = async (values: any) => {
    const name = `${values?.first_name} ${values?.last_name}`;
    const response = await createCustomer({
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
    const customerData = response.data.attributes
    setCustomer({
      name: `${customerData.field_first_name} ${customerData.field_last_name}`,
      email: customerData.field_email_address,
      first_name: customerData.field_first_name,
      last_name: customerData.field_last_name,
      phone: customerData.field_phone,
      nid: customerData.drupal_internal__nid,
      uuid: response.data.id
    });
    handleNewGuestClose();
  }

  const handleNewGuestClose = () => {
    setNewGuest(false);
    setShowEdit(true);
  }

  const handleCreateCustomer = (value: string) => {
    setPhoneInput(value);
    setNewGuest(true);
    setShowEdit(false);
  }

  const handleUpdateCustomer = async (values: any) => {

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
    console.log('-----data----', customerData);
    let response = await updateCustomer(customerData);
    console.log('----response----', response);
    values.name = `${values.first_name} ${values.last_name}`;
    values.id = customer.uuid;
    setCustomer(values);
    closeEditingCustomer();
  }

  useEffect(() => {
    if (!socket) {
      void fetch("/api/socket");
      socket = io();
      socket.on("connect", () => {
        console.log("connected");
      });
      socket.on("updateStatus", (msg) => {
        console.log(msg);
      });
      socket.on("userServerConnection", () => {
        console.log("a user connected (client)");
      });
      socket.on("userServerDisconnection", (socketid: string) => {
        console.log(socketid);
      });
    }
    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
    };
  }, []);
  console.log(event, "eventevent");
  return (
    <div className="w-full bg-white text-black shadow-3xl rounded border border-gray-200">
      {/* <div className="event-triangle" {...props.arrowProps} /> */}
      {!newGuest &&
        <div className="pt-5 pr-4 pl-6 pb-1 relative">
          <div className="flex items-center justify-between pr-3">
            <h3 className="font-sans font-bold">Appointment</h3>
            <Dropdown
              selected={selected}
              options={statusOptions}
              className="rounded-md bg-gray-300 py-1"
              showArrow={false}
              onSelect={handleSelect}
            />
          </div>
          <button
            className="absolute z-10 top-[8px] right-[8px]"
            onClick={onClose}
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </div>
      }
      {!newGuest && !showEditCustomer && !showEdit && (
        <EventDetails
          event={event}
          onEdit={handleEdit}
          onDeleteConfirm={() => onDeleteConfirm(event.id)}
        />
      )}
      {!showEditCustomer && showEdit && (
        <EditEvent
          event={event}
          services={services}
          onClose={onClose}
          customer={customer}
          onUpdateEvent={onUpdateEvent}
          editCustomer={handleEditCustomer}
          onNewCustomer={handleCreateCustomer}
        />
      )}
      {showEditCustomer && <EditCustomerForm data={customer} onSubmit={handleUpdateCustomer} />}
      {
        newGuest && (
          <>
            <Dialog.Title
              as="div"
              className="flex justify-between handle items-center shrink-0 p-4 bg-gray-200 text-blue-gray-900 antialiased font-sans text-lg font-semibold leading-snug"
              style={{ cursor: "move" }}
              id="draggable-dialog-title"
            >
              Add Guest
              <button onClick={handleNewGuestClose}>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </Dialog.Title>
            <CustomerForm onSubmit={handleAddGuest} phone={phoneInput} />
          </>
        )}
    </div>
  );
};

export default Event;
