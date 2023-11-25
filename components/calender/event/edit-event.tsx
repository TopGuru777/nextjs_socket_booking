import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import AutoComplete from "@/components/autocomplete";
import SelectDropdown from "@/components/select";
import SelectDateDropdown from "@/components/select-date";
import { EventType, ServiceType } from "@/types";
import { updateBooking } from "@/services";
import SelectTimeDropdown from "@/components/select-time";

interface Props {
  event: EventType;
  services: ServiceType[];
  onClose: () => void;
  onUpdateEvent: (event: EventType) => void;
}

const EditEvent = ({ event, services, onClose, onUpdateEvent }: Props) => {
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
      service: selectedService?.value,
      eventDate: event.start,
      customer: event.name,
      startTime: moment(event.start).valueOf(),
      endTime: moment(event.end).valueOf(),
    },
  });

  const handleSubmitValues = (values: any) => {
    const selectedService = services.find(
      (service) => service.uuid === values.service
    );
    const startTime = moment(values.startTime).format();
    const endTime = moment(values.endTime).format();
    let data = {
      ...event,
      service: selectedService?.title as string,
      start: moment(values.startTime).toDate(),
      end: moment(values.endTime).toDate(),
      phone: values.customer.phone,
      email: values.customer.email,
    };
    const title = values.customer.name;
    let relationships: any = {
      field_service: {
        data: [
          {
            type: "node--services",
            id: values.service,
          },
        ],
      },
    };
    if (title) {
      data = {
        ...data,
        title,
        name: title,
      };
    }
    onUpdateEvent && onUpdateEvent(data);
    onClose && onClose();
    if (values.customer.id) {
      relationships = {
        ...relationships,
        field_customer: {
          data: [
            {
              type: "node--customers",
              id: values.customer.id,
            },
          ],
        },
      };
    }
    updateBooking({
      type: "node--booking",
      id: event.id,
      attributes: {
        title: event.title,
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
    });
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
          render={({ field: { onChange, value } }) => (
            <div className="mb-3">
              <label
                htmlFor="service"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Service
              </label>
              <SelectDropdown
                placeholder="Select a Service"
                options={serviceOptions}
                selected={value as string}
                onChange={(selected) => onChange(selected.value)}
              />
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
                  <label
                    htmlFor="eventDate"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Date
                  </label>
                  <SelectDateDropdown value={value} onChange={onChange} />
                </div>
                <div className="flex-grow">
                  <label
                    htmlFor="time"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Time
                  </label>
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
              <label
                htmlFor="customer"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Customer
              </label>
              <AutoComplete onSelect={onChange} />
            </div>
          )}
        />
      </div>
      <div className="flex h-[60px] pt-2 pb-5 pl-4 pr-4 w-full items-center justify-end">
        <button
          disabled={!isValid}
          className="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-3xl text-sm px-5 py-2 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default EditEvent;
