import { Fragment, useState } from "react";
import { Dialog, Transition, Tab } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/20/solid";
import moment from "moment";
import { rescheduleAppointment } from "./helpers";
import { useRxDB } from "@/app/db";
import useBookingCalendarStore from "@/app/store";

interface Props {
  open: boolean;
  event: any;
  onCancel: (event: any) => void;
  onReschedule: () => void;
}

const RescheduleConfirmDialog = ({
  open,
  event,
  onCancel,
  onReschedule,
}: Props) => {
  console.log(`@move event@`, event);
  //RxDB instance for indexeddb operation
  const db = useRxDB();
  //socket client for socket.io
  const { socket } = useBookingCalendarStore((state) => state);

  const prevStartTime: Date = event?.start;
  const prevEndTime: Date = event?.end;

  const startTime: Date = event?.new_start;
  const endTime: Date = event?.new_end;

  const handleReschedule = () => {
    rescheduleAppointment(event, db, socket);
    onReschedule();
  };

  const handleCancel = () => {
    const { new_start, new_end, selectedStaff, ...prevEvent } = event;
    onCancel(prevEvent);
  }

  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={() => { }} className="relative z-50">
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
              <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between"
                >
                  Reschedule appointment?
                  <button onClick={handleCancel}>
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </Dialog.Title>
                <div className="text-[#2c343a] mt-4">
                  <ul>
                    <li className="flex items-center text-[#586874]">
                      <div className="flex items-center">
                        <span className="w-10 text-right text-[#586874] font-normal text-sm leading-5 tracking-[-0.09px] mr-2">From:</span>
                        <span className="w-[136px] font-normal text-sm leading-5 tracking-[-0.09px]">{moment(prevStartTime).format('ddd DD MMM YYYY')}</span>
                      </div>
                      <div className="items-baseline text-right flex font-normal text-sm leading-5 tracking-[-0.09px]">
                        <span className="w-[18px]">{moment(prevStartTime).format('hh')}</span>
                        <span className="w-1">:</span>
                        <span className="w-[18px]">{moment(prevStartTime).format('mm')}</span>
                        <span className="text-left w-[18px] font-normal text-[10px] leading-4">{moment(prevStartTime).format('A')}</span>
                      </div>
                      <span className="mr-6 ml-6">-</span>
                      <div className="flex items-center">
                        <span className="w-[136px] font-normal text-sm leading-5 tracking-[-0.09px]">{moment(prevEndTime).format('ddd DD MMM YYYY')}</span>
                      </div>
                      <div className="items-baseline text-right flex font-normal text-sm leading-5 tracking-[-0.09px]">
                        <span className="w-[18px]">{moment(prevEndTime).format('hh')}</span>
                        <span className="w-1">:</span>
                        <span className="w-[18px]">{moment(prevEndTime).format('mm')}</span>
                        <span className="text-left w-[18px] font-normal text-[10px] leading-4">{moment(prevEndTime).format('A')}</span>
                      </div>
                    </li>
                    <li className="flex items-center mt-4">
                      <div className="flex items-center">
                        <span className="w-10 text-right text-[#586874] font-normal text-sm leading-5 tracking-[-0.09px] mr-2">To:</span>
                        <span className="w-[136px] font-normal text-sm leading-5 tracking-[-0.09px] fw-500">{moment(startTime).format('ddd DD MMM YYYY')}</span>
                      </div>
                      <div className="items-baseline text-right flex font-normal text-sm leading-5 tracking-[-0.09px] text-[#2c343a]">
                        <span className="w-[18px]">{moment(startTime).format('hh')}</span>
                        <span className="w-1">:</span>
                        <span className="w-[18px]">{moment(startTime).format('mm')}</span>
                        <span className="text-left w-[18px] font-normal text-[10px] leading-4">{moment(startTime).format('A')}</span>
                      </div>
                      <span className="mr-6 ml-6">-</span>
                      <div className="flex items-center">
                        <span className="w-[136px] font-normal text-sm leading-5 tracking-[-0.09px] fw-500">{moment(endTime).format('ddd DD MMM YYYY')}</span>
                      </div>
                      <div className="items-baseline text-right flex font-normal text-sm leading-5 tracking-[-0.09px] text-[#2c343a]">
                        <span className="w-[18px]">{moment(endTime).format('hh')}</span>
                        <span className="w-1">:</span>
                        <span className="w-[18px]">{moment(startTime).format('mm')}</span>
                        <span className="text-left w-[18px] font-normal text-[10px] leading-4">{moment(endTime).format('A')}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    className="hover:bg-gray-200 font-normal text-sm font-sans text-indigo-950 rounded-3xl px-4 py-2 mr-4"
                    onClick={handleCancel}
                  >
                    No, keep as is
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-3xl border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={handleReschedule}
                  >
                    Yes, reschedule
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

export default RescheduleConfirmDialog;
