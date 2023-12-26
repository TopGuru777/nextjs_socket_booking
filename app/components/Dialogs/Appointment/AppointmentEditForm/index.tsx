import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import SelectDropdown from "@/app/components/CustomInputs/SelectDropdown";
import SelectDateDropdown from "@/app/components/CustomInputs/SelectDateDropdown";
import { EventType, ServiceType } from "@/app/types";
import SelectTimeDropdown from "@/app/components/CustomInputs/SelectTimeDropdown";
import { AutoComplete } from "../../../CustomInputs/AutoComplete";
import { useEffect } from "react";
import { updateAppointment } from "./helpers";
import { useRxDB } from "@/app/db";

interface Props {
  event: EventType;
  customer: any;
  services: ServiceType[];
  staffs: any[];
  onClose: () => void;
  onUpdated: () => void;
  onEditCustomer: (values: any) => void;
  onNewCustomer: (value: string) => void;
}

const AppointmentEditForm = ({ event, services, staffs, customer, onClose, onUpdated, onEditCustomer, onNewCustomer }: Props) => {
  const db = useRxDB();
  const staffList = staffs.map((staff: any) => ({
    label: staff.staff_name,
    value: staff.staff_id,
  }));

  const serviceOptions = services.map((service: ServiceType) => ({
    label: service.title,
    value: service.uuid,
  }));

  const selectedService = serviceOptions.find(
    (service) => service.label === event.service
  );
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      staffId: event.resourceId ?? "0",
      service: selectedService?.value,
      eventDate: event.start,
      customer: customer,
      startTime: moment(event.start).valueOf(),
      endTime: moment(event.end).valueOf(),
    },
  });

  const handleSubmitValues = (values: any) => {
    const selectedService = services.find((service) => service.uuid === values.service);
    const selectedStaff = staffs.find((staff) => staff.staff_id === values.staffId);
    const startTime = moment(values.startTime).format();
    const endTime = moment(values.endTime).format();

    const updatedData = updateAppointment({ ...values, selectedService, selectedStaff, startTime, endTime, appointment: event, customer }, db);
    onUpdated();
    onClose && onClose();
  };

  return (
    <form onSubmit={handleSubmit(handleSubmitValues)}>
      <div className="px-5 py-4">
        <Controller
          control={control}
          name="service"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => {
            const selectedService = services.find(
              (service: ServiceType) => service.uuid === value
            );
            useEffect(() => {
              const selectedService = services.find(
                (service: ServiceType) => service.uuid === value
              );
              if (selectedService) {
                const endTime = moment(watch("startTime"))
                  .add(Number(selectedService?.duration), "minutes")
                  .valueOf();
                setValue("endTime", endTime as number);
              }
            }, [value])


            return (
              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Service</label>
                <SelectDropdown
                  placeholder="Select a Service"
                  options={serviceOptions}
                  selected={value || ""}
                  onChange={(selected) => onChange(selected.value)}
                />
                {selectedService && (
                  <div className="flex justify-between mt-1">
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-900 mr-1">Cost:</p>
                      <p className="text-sm font-normal text-gray-900">${selectedService.cost}</p>
                    </div>
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-900 mr-1">Duration:</p>
                      <p className="text-sm font-normal text-gray-900">{selectedService.duration}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />

        <Controller
          control={control}
          name="staffId"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <div className="mb-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Provider</label>
              <SelectDropdown selected={value} options={staffList} onChange={(selected) => onChange(selected.value)} />
            </div>
          )}
        />
        <Controller
          control={control}
          name="eventDate"
          render={({ field: { onChange, value } }) => {
            const selectedServiceItem = services.find(
              (service: ServiceType) => service.uuid === watch("service")
            );
            return (
              <div className="flex mb-3">
                <div className="flex-grow w-[50%] mr-2">
                  <label htmlFor="eventDate" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Date</label>
                  <SelectDateDropdown value={value} onChange={onChange} />
                </div>
                <div className="flex-grow">
                  <label htmlFor="time" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Time</label>
                  <div className="flex items-center gap-1">
                    <Controller
                      control={control}
                      name="startTime"
                      render={({ field: { onChange, value } }) => {
                        return (
                          <SelectTimeDropdown
                            selectedDate={event.start}
                            selectedValue={value}
                            onChange={(selectedValue) => {
                              const endTime = moment(selectedValue)
                                .add(
                                  Number(selectedServiceItem?.duration),
                                  "minutes"
                                )
                                .valueOf();
                              onChange(selectedValue);
                              setValue("endTime", endTime as number);
                              setValue(
                                "eventDate",
                                moment(selectedValue).toDate()
                              );
                            }}
                          />
                        );
                      }}
                    />
                    {selectedServiceItem && (
                      <Controller
                        control={control}
                        name="endTime"
                        render={({ field: { onChange, value } }) => {
                          return (
                            <SelectTimeDropdown
                              selectedDate={event.start}
                              selectedValue={value}
                              onChange={(selectedValue) => {
                                const startTime = moment(selectedValue)
                                  .subtract(
                                    Number(selectedServiceItem?.duration),
                                    "minutes"
                                  )
                                  .valueOf();
                                onChange(selectedValue);
                                setValue("startTime", startTime as number);
                                setValue(
                                  "eventDate",
                                  moment(startTime).toDate()
                                );
                              }}
                            />
                          );
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="customer"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <div>
              <label htmlFor="customer" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Customer</label>
              <AutoComplete
                inputStyle={{ backgroundColor: "PaleTurquoise" }}
                optionStyle={{ backgroundColor: "LemonChiffon" }}
                iconColor="Turquoise"
                data={value}
                onAddNew={onNewCustomer}
                onSetValue={onChange}
                onEditCustomer={() => onEditCustomer(value)}
                saveValues={() => { }}
              />
            </div>
          )}
        />
      </div>
      <div className="flex h-[60px] pt-2 pb-5 pl-4 pr-4 w-full items-center justify-end">
        <button disabled={!isValid} className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-3xl text-sm px-5 py-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">Save</button>
      </div>
    </form>
  );
};

export default AppointmentEditForm;
