import dynamic from "next/dynamic";
import { RxDBProvider } from "./db";


const BookingCalendar = dynamic(() => import("@/app/components/BookingCalendar"), {
  ssr: false,
});



export default async function Home() {

  const defaultDate = new Date();
  return (
    <RxDBProvider>
      <main className="bg-white">
        <section className="h-screen">
          <BookingCalendar
            defaultDate={defaultDate}
            staffIdAccessor="staff_id"
            staffNameAccessor="staff_name"
          />
        </section>
      </main>
    </RxDBProvider>
  );
}
