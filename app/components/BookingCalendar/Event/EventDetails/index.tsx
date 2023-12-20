import { Fragment } from "react";
import moment from "moment";
import { EventType } from "@/app/types";

interface Props {
  event: EventType;
  onEdit: () => void;
  onDeleteConfirm: () => void;
}

const EventDetails = ({ event, onEdit, onDeleteConfirm }: Props) => {
  return (
    <Fragment>
      <div className="px-5 py-4">
        <div className="flex">
          <h3 className="font-semibold text-sm font-sans ml-1">
            {event?.service}
          </h3>
        </div>
        <div className="flex mt-2">
          <div className="flex items-center">
            <h3 className="font-semibold text-sm font-sans ml-1 text-gray-600">
              Cost:
            </h3>
            <p className="font-sans text-sm ml-2">${event?.cost}</p>
          </div>
          <div className="flex items-center ml-4">
            <h3 className="font-semibold text-sm font-sans ml-1 text-gray-600">
              Duration:
            </h3>
            <p className="font-sans text-sm ml-2">{event?.duration}</p>
            <p className="font-sans text-sm ml-2">mins</p>
          </div>
        </div>
        <div className="flex justify-between mt-6">
          <h3 className="font-semibold text-sm font-sans ml-1 text-gray-600">
            {moment(event.start).format("ddd DD MMM")}
          </h3>
          <div className="flex items-center">
            <h3 className="font-semibold text-sm font-sans ml-1 text-gray-600">
              {moment(event.start).format("hh:mm A")}
            </h3>
            <span className="mx-4">-</span>
            <h3 className="font-semibold text-sm font-sans ml-1 text-gray-600">
              {moment(event.end).format("hh:mm A")}
            </h3>
          </div>
        </div>
        <div className="flex mt-6 flex-col">
          <h3 className="font-semibold text-sm font-sans ml-1 text-gray-600">
            {event.name}
          </h3>
          <h3 className="font-semibold text-sm font-sans ml-1 text-gray-600">
            {event.email}
          </h3>
          <h3 className="font-semibold text-sm font-sans ml-1 text-gray-600">
            {event.phone}
          </h3>
        </div>
        <div className="flex">
          <h3 className="font-semibold text-sm font-sans ml-1">
            {event.staff_title}
          </h3>
        </div>
      </div>


      <div className="flex h-[60px] pt-2 pb-5 pl-4 pr-4 w-full items-center justify-end">
        <button
          className="hover:bg-gray-200 h-8 font-normal text-sm font-sans text-indigo-950 rounded-3xl px-2"
          onClick={onDeleteConfirm}
        >
          Delete
        </button>
        <button
          className="hover:bg-gray-200 h-8 font-normal text-sm font-sans text-indigo-950 rounded-3xl px-2"
          onClick={onEdit}
        >
          Edit
        </button>
      </div>
    </Fragment>
  );
};

export default EventDetails;
