import { Room } from "@prisma/client";

export type RoomDataType = {
  room: Room;
  totalPrice: number;
  breakFastIncluded: boolean;
  startDate: Date;
  endDate: Date;
};

export interface BookRoomStore {
  bookingRoomData: RoomDataType | null;
  paymentIntent: string | null;
  clientSecret: string | undefined;
  setRoomData: (data: RoomDataType) => void;
  setPaymentIntent: (paymentIntent: string) => void;
  setClientSecret: (clientSecret: string) => void;
  resetBookRoom: () => void;
}
