import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { ResourceType } from "@/app/components/calender/type";
import DetailPanel from "./detail-panel";
import CustomerPanel from "./customer-panel";
import { ServiceType, StatusType } from "@/app/types";
import moment from "moment";
import { createBooking, createCustomer } from "@/app/services";
import Draggable from "react-draggable";
import { classNames } from "@utils/helper";

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
  const [formValues, setFormValues] = useState<any>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const providers = resources.map((resource: ResourceType) => ({
    label: resource.resourceTitle,
    value: resource.resourceId,
  }));

  const handleChangeTab = (value: number) => {
    setSelectedIndex(value);
  };

  const handleSubmit = async (values: any, newCustomer?: boolean) => {
    if (selectedIndex === 1) {
      const selectedService = services.find(
        (service) => service.uuid === formValues.service
      );
      const selectedStaff = resources.find(
        (resource) => resource.resourceId === formValues.resourceId
      );
      const selectedStatus = status.find(
        (value) => value.uuid === formValues.status
      );
      const name = `${values?.first_name} ${values?.last_name}`;
      const startTime = moment(formValues.startTime).format();
      const endTime = moment(formValues.endTime).format();
      let relationships: any = {
        field_service: {
          data: [
            {
              type: "node--services",
              id: formValues.service,
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
      if (formValues.status) {
        relationships = {
          ...relationships,
          field_status: {
            data: [
              {
                type: "taxonomy_term--status",
                id: formValues.status,
              },
            ],
          },
        };
      }
      if (values.id) {
        relationships = {
          ...relationships,
          field_customer: {
            data: [
              {
                type: "node--customers",
                id: values.id,
              },
            ],
          },
        };
      }
      createBooking({
        type: "node--booking",
        attributes: {
          title: values.name || name,
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
          start: moment(formValues.startTime).toDate(),
          end: moment(formValues.endTime).toDate(),
          resourceId: formValues.resourceId,
          service: selectedService?.title,
          cost: selectedService?.cost,
          duration: selectedService?.duration,
          title: values.name || name,
          status: selectedStatus?.name,
          name: values.name || name,
          email: values.email,
          phone: values.phone,
        });
        handleClose();
      });
      if (newCustomer) {
        createCustomer({
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
      }
    } else {
      setFormValues(values);
      setSelectedIndex(1);
    }
  };

  const handleClose = () => {
    onClose();
    setFormValues(null);
    setSelectedIndex(0);
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => {}}>
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
                  <Tab.Group
                    selectedIndex={selectedIndex}
                    onChange={handleChangeTab}
                  >
                    <Tab.List className="flex space-x-1 bg-blue-900/20">
                      <Tab
                        disabled={selectedIndex !== 0}
                        className={({ selected }) =>
                          classNames(
                            "py-2.5 px-4 mr-3 text-sm font-medium leading-5",
                            "ring-white ring-opacity-60",
                            selected ? "bg-white shadow" : "text-black-100"
                          )
                        }
                      >
                        Details
                      </Tab>
                      <Tab
                        disabled={selectedIndex !== 1}
                        className={({ selected }) =>
                          classNames(
                            "py-2.5 px-4 text-sm font-medium leading-5 text-black-700",
                            "ring-white ring-opacity-60",
                            selected ? "bg-white shadow" : "text-black-100"
                          )
                        }
                      >
                        Customer
                      </Tab>
                    </Tab.List>
                    <Tab.Panels>
                      <Tab.Panel>
                        <DetailPanel
                          startEvent={startEvent as Date}
                          resourceId={resourceId as number}
                          services={services}
                          status={status}
                          providers={providers}
                          onSubmit={handleSubmit}
                        />
                      </Tab.Panel>
                      <Tab.Panel>
                        <CustomerPanel onSubmit={handleSubmit} />
                      </Tab.Panel>
                    </Tab.Panels>
                  </Tab.Group>
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
