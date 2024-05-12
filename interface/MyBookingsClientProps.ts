import { Booking, Hotel, Room } from "@prisma/client";

export interface MyBookingsClientProps {
booking: Booking & {Room:Room | null} & {Hotel:Hotel | null}
}
