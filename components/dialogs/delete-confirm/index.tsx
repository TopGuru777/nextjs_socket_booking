import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { deleteBooking } from "@/services";
import { XMarkIcon } from "@heroicons/react/20/solid";

interface Props {
  open: boolean;
  selectedEvent: string | null;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteConfirmDialog = ({
  open,
  selectedEvent,
  onClose,
  onDelete,
}: Props) => {
  const handleClose = () => {
    onClose();
  };

  const handleDelete = async () => {
    deleteBooking(selectedEvent as string);
    onDelete();
    onClose();
  };

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={() => {}} className="relative z-50">
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
        <div className="fixed inset-0 overflow-y-auto">
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
                >
                  Delete appointment for good?
                  <button onClick={handleClose}>
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </Dialog.Title>
                <div className="mt-8 flex justify-end">
                  <button
                    className="hover:bg-gray-200 font-normal text-sm font-sans text-indigo-950 rounded-3xl px-4 py-2 mr-4"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-3xl border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleDelete}
                  >
                    Yes, delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteConfirmDialog;
