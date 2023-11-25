import { useForm, Controller } from "react-hook-form";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface Props {
  onSubmit: (values: any) => void;
  onClose: () => void;
}

const CustomerForm = ({ onSubmit, onClose }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
    },
  });
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="relative p-4 text-blue-gray-500 antialiased font-sans text-base font-light leading-relaxed border-t border-t-blue-gray-100 border-b border-b-blue-gray-100">
        <button type="button" className="absolute right-3" onClick={onClose}>
          <XMarkIcon className="h-4 w-4" />
        </button>
        <Controller
          control={control}
          name="first_name"
          render={({ field }) => (
            <div className="mb-3">
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                First Name
              </label>
              <input
                {...field}
                id="first_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter first name"
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="last_name"
          render={({ field }) => (
            <div className="mb-3">
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Last Name
              </label>
              <input
                {...field}
                id="last_name"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter last name"
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="email"
          render={({ field }) => (
            <div className="mb-3">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email address
              </label>
              <input
                {...field}
                type="email"
                id="email"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Enter email"
              />
            </div>
          )}
        />
        <Controller
          control={control}
          name="phone"
          rules={{
            minLength: 10,
            maxLength: 10,
          }}
          render={({ field }) => (
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Phone number
              </label>
              <input
                type="tel"
                id="phone"
                {...field}
                maxLength={10}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="123-45-678"
                required
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
          Save Appointment
        </button>
      </div>
    </form>
  );
};

export default CustomerForm;
