import { BookRoomStore, RoomDataType } from "@/interface/BookRoomStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookRooms = create<BookRoomStore>()(
  persist(
    (set) => ({
      bookingRoomData: null,
      paymentIntentId: null,
      clientSecret: undefined,
      setRoomData: (data: RoomDataType) => {
        set({ bookingRoomData: data });
      },
      setPaymentIntentId: (paymentIntentId: string) => set({ paymentIntentId }),
      setClientSecret: (clientSecret: string) => set({ clientSecret }),
      resetBookRoom: () =>
        set({
          bookingRoomData: null,
          paymentIntentId: null,
          clientSecret: undefined,
        }),
    }),
    {
      name: "BookRoom",
    }
  )
);

export default useBookRooms;
