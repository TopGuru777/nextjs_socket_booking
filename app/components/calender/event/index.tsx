import { useCallback, useEffect, useMemo, useState } from "react";
import io, { Socket } from "socket.io-client";
import Dropdown from "@components/Dropdown";
import EditEvent from "./edit-event";
import EventDetails from "./event-details";
import { ServiceType, StatusType } from "@/app/types";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { EventType } from "@/app/types";
import { updateBooking, updateCustomer } from "@/app/services";
import { ClientToServerEvents, ServerToClientEvents } from "@/app/types/socket";
import EditCustomerForm from "../../dialogs/appointment/edit-customer-form";
let socket: Socket<ServerToClientEvents, ClientToServerEvents> | null = null;

interface Props {
  event: EventType;
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
    phone: event.phone
  });
  const [showEditCustomer, setEditCustomer] = useState<boolean>(false);
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<string>("");
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
      {!showEditCustomer && !showEdit && (
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
        />
      )}
      {showEditCustomer && <EditCustomerForm data={customer} onSubmit={handleUpdateCustomer} />}
    </div>
  );
};

export default Event;
