import { Hotel, Room } from "@prisma/client";

export interface AddRoomFormProps {
  hotel?: Hotel & {
    rooms: Room[];
  };
  room?: Room;
  handleDialogueOpen: () => void;
}
