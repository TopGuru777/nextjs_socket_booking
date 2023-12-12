import { useForm, Controller } from "react-hook-form";
import moment from "moment";
import SelectDropdown from "@components/SelectDropdown";
import SelectDateDropdown from "@/app/components/select-date";
import Dropdown from "@components/Dropdown";
import { ServiceType, StatusType } from "@/app/types";
import SelectTimeDropdown from "@/app/components/select-time";
import AutoComplete from "../../AutoComplete";
import { searchCustomer } from "@/app/services";
import { AutoCompleteNew } from "../../AutoCompleteNew";
import data from "../../data.json"
// import { searchCustomer } from "@/app/services";

interface Props {
  startEvent: Date;
  resourceId: number;
  status: Array<StatusType>;
  providers: { label: string; value: string }[];
  services: ServiceType[];
  data: any;
  customer: any;
  onSubmit: (values: any) => void;
  onAddGuest: () => void;
  saveValues: (values: any) => void;
  onSetCustomer: (values: any) => void;
  onEditCustomer: () => void;
}

const DetailPanel = ({
  startEvent,
  resourceId,
  providers,
  status,
  services,
  onSubmit,
  onAddGuest,
  saveValues,
  onSetCustomer,
  onEditCustomer,
  data,
  customer
}: Props) => {
  console.log('----->>data>>----', data);
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      resourceId: data.resourceId || resourceId,
      service: data.service || "",
      startDate: data.startEvent || startEvent,
      startTime: data.startTime || moment(startEvent).valueOf(),
      endTime: data.endTime || moment(startEvent).valueOf(),
      note: data.note || "",
      status: data.status || null,
    },
  });
  const statusOptions = status.map((value) => ({
    label: value.name,
    value: value.uuid,
  }));
  const serviceOptions = services.map((service: ServiceType) => ({
    label: service.title,
    value: service.uuid,
  }));


  const handleChange = async (text: string) => {
    // setValue(text);
    console.log("Ghaleda dai ", text)
    // setCursor(-1);
    if (text.trim().length > 2) {
      // setLoading(true);
      searchCustomer(text)
        .then((response) => {
          console.log("niroj Ghale")
          // setLoading(false);
          // setOptions(
          //   response?.map((option: CustomerType) => ({
          //     ...option,
          //     id: option.uuid,
          //     name: `${option.first_name} ${option.last_name}`,
          //   }))
          // );
        })
        .catch((error) => {
          console.log(error);
          // setLoading(false);
        });
      // if (!showOptions) {
      //   setShowOptions(true);
      // }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative p-4 text-blue-gray-500 antialiased font-sans text-base font-light leading-relaxed border-t border-t-blue-gray-100 border-b border-b-blue-gray-100">
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <div className="absolute top-[-35px] right-0">
              <Dropdown
                selected={value}
                options={statusOptions}
                onSelect={onChange}
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="resourceId"
          rules={{
            required: true,
          }}
          render={({ field: { onChange, value } }) => (
            <div className="mb-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Provider
              </label>
              <SelectDropdown
                selected={value}
                options={providers}
                onChange={(selected) => onChange(selected.value)}
              />
            </div>
          )}
        />
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
            if (selectedService) {
              const endTime = moment(watch("startTime"))
                .add(Number(selectedService?.duration), "minutes")
                .valueOf();
              setValue("endTime", endTime as number);
            }
            return (
              <div className="mb-3">
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Service
                </label>
                <SelectDropdown
                  placeholder="Select a Service"
                  options={serviceOptions}
                  selected={value}
                  onChange={(selected) => onChange(selected.value)}
                />
                {selectedService && (
                  <div className="flex justify-between mt-1">
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-900 mr-1">
                        Cost:
                      </p>
                      <p className="text-sm font-normal text-gray-900">
                        ${selectedService.cost}
                      </p>
                    </div>
                    <div className="flex">
                      <p className="text-sm font-medium text-gray-900 mr-1">
                        Duration:
                      </p>
                      <p className="text-sm font-normal text-gray-900">
                        {selectedService.duration}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          }}
        />
        <Controller
          control={control}
          name="startDate"
          render={({ field: { onChange, value: startDate } }) => {
            const selectedService = services.find(
              (service: ServiceType) => service.uuid === watch("service")
            );
            return (
              <div className="flex mb-3">
                <div className="flex-grow w-[50%] mr-2">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Date
                  </label>
                  <SelectDateDropdown
                    value={startDate}
                    onChange={(selectedDate) => {
                      onChange(selectedDate);
                      setValue("startTime", moment(selectedDate).valueOf());
                    }}
                  />
                </div>
                <div className="flex-grow">
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Time
                  </label>
                  <div className="flex items-center gap-1">
                    <Controller
                      control={control}
                      name="startTime"
                      render={({ field: { onChange, value } }) => {
                        return (
                          <SelectTimeDropdown
                            selectedDate={startDate}
                            selectedValue={value}
                            onChange={(selectedValue) => {
                              const endTime = moment(selectedValue)
                                .add(
                                  Number(selectedService?.duration),
                                  "minutes"
                                )
                                .valueOf();
                              onChange(selectedValue);
                              setValue("endTime", endTime as number);
                              setValue(
                                "startDate",
                                moment(selectedValue).toDate()
                              );
                            }}
                          />
                        );
                      }}
                    />
                    {selectedService && (
                      <Controller
                        control={control}
                        name="endTime"
                        render={({ field: { onChange, value } }) => {
                          return (
                            <SelectTimeDropdown
                              selectedDate={startDate}
                              selectedValue={value}
                              onChange={(selectedValue) => {
                                const startTime = moment(selectedValue)
                                  .subtract(
                                    Number(selectedService?.duration),
                                    "minutes"
                                  )
                                  .valueOf();
                                onChange(selectedValue);
                                setValue("startTime", startTime as number);
                                setValue(
                                  "startDate",
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

        {/* <input
          type="search"
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShowOptions(true)}
          onKeyDown={handleNav}
          className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          placeholder="Search Customer"
        /> */}

        {/* <input
          type="search"
          onChange={(e) => handleChange(e.target.value)}
          value=""
          className="block w-full p-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white focus:ring-1 focus:ring-indigo-500 focus:outline-none"
          placeholder="Add Guest"
        /> */}

        {/* <AutoComplete onSelect={onChange} /> */}

        <AutoCompleteNew
          inputStyle={{ backgroundColor: "PaleTurquoise" }}
          optionStyle={{ backgroundColor: "LemonChiffon" }}
          iconColor="Turquoise"
          data={customer}
          onAddNew={onAddGuest}
          onSetValue={onSetCustomer}
          onEditCustomer={onEditCustomer}
          saveValues={() => saveValues(watch())}
        >
        </AutoCompleteNew>
        <Controller
          control={control}
          name="note"
          render={({ field }) => (
            <div className="mb-3">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                Notes hello
              </label>
              <textarea
                {...field}
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Notes for the Customer"
              />
            </div>
          )}
        />
      </div>
      <div className="flex items-center justify-start shrink-0 flex-wrap p-4 text-blue-gray-500">
        <button
          type="submit"
          className="inline-flex justify-center bg-blue-100 px-8 py-2 text-sm font-medium hover:bg-blue-200"
          disabled={!isValid}
        >
          Create Appointment
        </button>
      </div>
    </form>
  );
};

export default DetailPanel;
