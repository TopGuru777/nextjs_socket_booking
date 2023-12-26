import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import AppointmentCreateDetailPanel from "../AppointmentCreateDetailPanel";
import { ServiceType, StatusType } from "@/app/types";
import moment from "moment";
import Draggable from "react-draggable";
import { classNames } from "@utils/helper";
import CustomerCreateForm from "../../Customer/CustomerCreateForm";
import CustomerEditForm from "../../Customer/CustomerEditForm";
import { createAppointment, createCustomer, updateCustomer } from "./helpers";
import { useRxDB } from "@/app/db";

interface Props {
  open: boolean;
  startEvent: Date;
  staffs: any[];
  staffId: number | string;
  services: ServiceType[];
  status: StatusType[];
  addEvent: (value: any) => void;
  onClose: () => void;
}

const AppointmentCreateDialog = ({
  open,
  staffs,
  staffId,
  services,
  status,
  startEvent,
  addEvent,
  onClose,
}: Props) => {
  const db = useRxDB();
  const [formValues, setFormValues] = useState({
    staffId: "",
    service: "",
    startDate: "",
    startTime: "",
    endTime: "",
    note: "",
    status: ""
  });
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const staffList = staffs.map((staff: any) => ({
    label: staff.staff_name,
    value: staff.staff_id,
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
    const updatedData = await updateCustomer(values, customer, db);
    setCustomer({ ...updatedData, name: `${updatedData.first_name} ${updatedData.last_name}` })
    closeEditingCustomer();
  }

  const handleCreateCustomer = async (values: any) => {
    const customerData = await createCustomer(values, db);
    setCustomer({ ...customerData, name: `${customerData.first_name} ${customerData.last_name}` });
    setNewGuest(false);
  }

  /**
   * 
   * @param values appointment data
   * @desc create an appointment
   */
  const handleSubmit = async (values: any) => {
    const selectedService = services.find(
      (service) => service.uuid === values.service
    );
    const selectedStaff = staffs.find(
      (staff) => staff.staff_id === values.staffId
    );
    const selectedStatus = status.find(
      (value) => value.uuid === values.status
    );
    const name = `${customer?.first_name} ${customer?.last_name}`;
    const startTime = moment(values.startTime).format();
    const endTime = moment(values.endTime).format();
    createAppointment({ ...values, selectedService, selectedStaff, selectedStatus, fullname: name, startTime, endTime }, customer, db);
    handleClose();
  };

  /**
   * 
   * @param values appointment data
   * @desc save form values when switching dialog to edit or create customer dialog
   */
  const saveFormValues = async (values: any) => {
    setFormValues(values);
  }

  const handleClose = () => {
    onClose();
    setFormValues({
      staffId: "",
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
                          Create Appointment
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
                          >Details</div>
                        </div>
                        <div>
                          <AppointmentCreateDetailPanel
                            startEvent={startEvent as Date}
                            staffId={staffId as number}
                            services={services}
                            status={status}
                            staffs={staffList}
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
                        <CustomerCreateForm onSubmit={handleCreateCustomer} phone={newPhone} />
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

                      <CustomerEditForm data={customer} onSubmit={handleUpdateCustomer} />
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

export default AppointmentCreateDialog;
