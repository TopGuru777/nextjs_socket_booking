import { create } from 'zustand'

export interface State {
    //staffs for weekly tab
    staffList: any[],
    setStaffList: (value: any[]) => void,
    //current staff for weekly tab
    currentStaff: any,
    setCurrentStaff: (value: any) => void,
    //current view: daily, weekly
    currentView: any,
    setCurrentView: (value: any) => void,
    startDate: Date,
    setStartDate: (value: Date) => void,
    endDate: Date,
    setEndDate: (value: Date) => void,
    socket: any,
    setSocket: (value: any) => void
};

const useBookingCalendarStore = create<State>((set) => ({
    staffList: [],
    setStaffList: (value: any[]) => set((state) => ({ staffList: value })),
    currentStaff: null,
    setCurrentStaff: (value:any) => set((state) => ({ currentStaff: value})),
    currentView: null,
    setCurrentView: (value:any) => set((state) => ({ currentView: value})),
    startDate: new Date(),
    setStartDate: (value: Date) => set((state) => ({ startDate: value})),
    endDate: new Date(),
    setEndDate: (value:Date) => set((state) => ({ endDate: value})),
    socket: null,
    setSocket: (value:any) => set((state) => ({ socket: value}))
}));

export default useBookingCalendarStore;