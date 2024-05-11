import { BookRoomStore, RoomDataType } from "@/interface/BookRoomStore";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const useBookRooms = create<BookRoomStore>()(
  persist(
    (set) => ({
      bookingRoomData: null,
      paymentIntent: null,
      clientSecret: undefined,
      setRoomData: (data: RoomDataType) => {
        set({ bookingRoomData: data });
      },
      setPaymentIntent: (paymentIntent: string) => set({ paymentIntent }),
      setClientSecret: (clientSecret: string) => set({ clientSecret }),
      resetBookRoom: () =>
        set({
          bookingRoomData: null,
          paymentIntent: null,
          clientSecret: undefined,
        }),
    }),
    {
      name: "BookRoom",
    }
  )
);


export default useBookRooms;