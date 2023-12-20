import React, { Fragment } from 'react'
import { Dialog, Transition, Tab } from "@headlessui/react";
import Draggable from "react-draggable";
import { classNames } from "@utils/helper";
import Event from '../../BookingCalendar/Event';
import { EventType, ServiceType, StatusType } from "@/app/types";

type Props = {
    open: boolean;
    event: EventType,
    status: StatusType[];
    services: ServiceType[];
    onUpdateEvent: (event: EventType) => void;
    onDeleteConfirm: (eventId: string) => void;
    onClose: () => void;
}

export default function EventDialog({
    open,
    event,
    status,
    services,
    onUpdateEvent,
    onDeleteConfirm,
    onClose
}: Props) {
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
                <Draggable axis="both" cancel='textarea, input, select, button'>
                    <div className="fixed inset-0 cursor-move">
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
                                    <Event
                                        event={event}
                                        status={status}
                                        services={services}
                                        onClose={onClose}
                                        onUpdateEvent={onUpdateEvent}
                                        onDeleteConfirm={onDeleteConfirm}
                                    />
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Draggable>
            </Dialog>
        </Transition>
    )
}