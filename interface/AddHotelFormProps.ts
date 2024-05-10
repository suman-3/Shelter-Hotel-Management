import { Hotel, Room } from "@prisma/client"

export type HotelWithRooms = Hotel &{
    rooms: Room[]
}

export interface AddHotelFormProps {
    hotel : HotelWithRooms | null
}

