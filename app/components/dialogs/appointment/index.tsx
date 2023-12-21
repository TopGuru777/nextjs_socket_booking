import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ResourceType } from "@/app/components/BookingCalendar/type";
import DetailPanel from "../DetailPanel";
import CustomerPanel from "./CustomerPanel";
import { ServiceType, StatusType } from "@/app/types";
import moment from "moment";
import { createBooking, createCustomer, updateCustomer } from "@/app/services";
import Draggable from "react-draggable";
import { classNames } from "@utils/helper";
import CustomerForm from "../CustomerForm";
import EditCustomerForm from "../EditCustomerForm";

interface Props {
  open: boolean;
  startEvent: Date;
  resources: ResourceType[];
  resourceId: number | string;
  services: ServiceType[];
  status: StatusType[];
  addEvent: (value: any) => void;
  onClose: () => void;
}

const AppoinmentDialog = ({
  open,
  resources,
  resourceId,
  services,
  status,
  startEvent,
  addEvent,
  onClose,
}: Props) => {
  const [formValues, setFormValues] = useState({
    resourceId: "",
    service: "",
    startDate: "",
    startTime: "",
    endTime: "",
    note: "",
    status: ""
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const providers = resources.map((resource: ResourceType) => ({
    label: resource.resourceTitle,
    value: resource.resourceId,
  }));
  const [customer, setCustomer] = useState<any>({
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    nid: "",
    uuid: ""
  });
  const [newGuest, setNewGuest] = useState<boolean>(false);
  const [showEditCustomer, setEditCustomer] = useState<boolean>(false);
  const [newPhone, setNewPhone] = useState<string>("");

  const handleEditCustomer = () => {
    setEditCustomer(true);
  }

  const handleSetAddGuest = (value: string) => {
    setNewPhone(value);
    setNewGuest(true);
  }

  const closeEditingCustomer = () => {
    setEditCustomer(false);
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
    // console.log('-----data----', customerData);
    let response = await updateCustomer(customerData);
    // console.log('----response----', response);
    setCustomer(values);
    closeEditingCustomer();
  }

  const handleSubmit = async (values: any) => {
    const selectedService = services.find(
      (service) => service.uuid === values.service
    );
    const selectedStaff = resources.find(
      (resource) => resource.resourceId === values.resourceId
    );
    const selectedStatus = status.find(
      (value) => value.uuid === values.status
    );
    const name = `${customer?.first_name} ${customer?.last_name}`;
    const startTime = moment(values.startTime).format();
    const endTime = moment(values.endTime).format();
    let relationships: any = {
      field_service: {
        data: [
          {
            type: "node--services",
            id: values.service,
          },
        ],
      },
      field_staff: {
        data: [
          {
            type: "node--staffs",
            id: selectedStaff?.uuid,
          },
        ],
      },
    };
    if (values.status) {
      relationships = {
        ...relationships,
        field_status: {
          data: [
            {
              type: "taxonomy_term--status",
              id: values.status,
            },
          ],
        },
      };
    }
    if (customer.uuid) {
      relationships = {
        ...relationships,
        field_customer: {
          data: [
            {
              type: "node--customers",
              id: customer.uuid,
            },
          ],
        },
      };
    }
    createBooking({
      type: "node--booking",
      attributes: {
        title: customer.name || name,
        field_date_range: {
          value: startTime,
          end_value: endTime,
          duration: Number(selectedService?.duration),
          rrule: null,
          rrule_index: null,
          timezone: "UTC",
        },
      },
      relationships,
    }).then((response) => {
      addEvent({
        id: response.data.id,
        start: moment(values.startTime).toDate(),
        end: moment(values.endTime).toDate(),
        resourceId: values.resourceId,
        service: selectedService?.title,
        cost: selectedService?.cost,
        duration: selectedService?.duration,
        title: customer.name || name,
        status: selectedStatus?.name,
        name: customer.name || name,
        email: customer.email,
        phone: customer.phone,
      });
      handleClose();
    });
  };

  const saveFormValues = async (values: any) => {
    setFormValues(values);
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
    setNewGuest(false);
  }

  const handleClose = () => {
    onClose();
    setFormValues({
      resourceId: "",
      service: "",
      startDate: "",
      startTime: "",
      endTime: "",
      note: "",
      status: ""
    });
    setCustomer({
      email: "",
      first_name: "",
      last_name: "",
      phone: "",
      nid: "",
      uuid: ""
    });
    setSelectedIndex(0);
    setNewGuest(false);
  };

  const handleNewGuestClose = () => {
    setNewGuest(false);
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => { }}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>
        <Draggable axis="both" handle="#draggable-dialog-title">
          <div className="fixed inset-0">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform bg-white text-left align-middle shadow-xl transition-all">
                  {
                    !showEditCustomer && !newGuest && (
                      <>
                        <Dialog.Title
                          as="div"
                          className="flex justify-between handle items-center shrink-0 p-4 bg-gray-200 text-blue-gray-900 antialiased font-sans text-lg font-semibold leading-snug"
                          style={{ cursor: "move" }}
                          id="draggable-dialog-title"
                        >
                          Appointment
                          <button onClick={handleClose}>
                            <XMarkIcon className="h-6 w-6" />
                          </button>
                        </Dialog.Title>
                        <div className="flex space-x-1 bg-blue-900/20">
                          <div
                            className={classNames(
                              "py-2.5 px-4 mr-3 text-sm font-medium leading-5",
                              "ring-white ring-opacity-60",
                              "bg-white shadow"
                            )
                            }
                          >
                            Details
                          </div>
                        </div>
                        <div>
                          <DetailPanel
                            startEvent={startEvent as Date}
                            resourceId={resourceId as number}
                            services={services}
                            status={status}
                            providers={providers}
                            saveValues={saveFormValues}
                            data={formValues}
                            customer={customer}
                            onSubmit={handleSubmit}
                            onAddGuest={handleSetAddGuest}
                            onSetCustomer={setCustomer}
                            onEditCustomer={handleEditCustomer}
                          />
                        </div>
                      </>
                    )}
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
                        <CustomerForm onSubmit={handleAddGuest} phone={newPhone} />
                      </>
                    )}
                  {showEditCustomer && (
                    <>
                      <Dialog.Title
                        as="div"
                        className="flex justify-between handle items-center shrink-0 p-4 bg-gray-200 text-blue-gray-900 antialiased font-sans text-lg font-semibold leading-snug"
                        style={{ cursor: "move" }}
                        id="draggable-dialog-title"
                      >
                        Edit Guest
                        <button onClick={closeEditingCustomer}>
                          <XMarkIcon className="h-6 w-6" />
                        </button>
                      </Dialog.Title>

                      <EditCustomerForm data={customer} onSubmit={handleUpdateCustomer} />
                    </>
                  )}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Draggable>
      </Dialog>
    </Transition>
  );
};

export default AppoinmentDialog;
