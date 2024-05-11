import { Booking, Hotel, Room } from "@prisma/client";

export interface RoomCardProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room: Room;
  bookings?: Booking[];
}
