import dynamic from "next/dynamic";
import { RxDBProvider } from "./db";

const BookingCalender = dynamic(() => import("@/app/components/BookingCalendar"), {
  ssr: false,
});

export default async function Home() {
  const defaultDate = new Date();
  return (
    <RxDBProvider>
      <main className="bg-white">
        <section className="h-screen">
          <BookingCalender
            defaultDate={defaultDate}
            staffIdAccessor="staff_id"
            staffNameAccessor="staff_name"
          />
        </section>
      </main>
    </RxDBProvider>
  );
}
