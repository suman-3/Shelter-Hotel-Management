"use client";

import { RoomCardProps } from "@/interface/RoomCardProps";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import AmenityItem from "./AmenityItem";
import {
  AirVent,
  Bath,
  BedDouble,
  BedSingle,
  CirclePlus,
  Crown,
  EarOff,
  HeartHandshake,
  Home,
  Loader2,
  Monitor,
  Mountain,
  PenLine,
  Save,
  Ship,
  Trash,
  Trees,
  UserRoundCheck,
  UsersRound,
  UtensilsCrossed,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import AddRoomForm from "./AddRoomForm";
import { Room } from "@prisma/client";
import axios from "axios";

import { useToast } from "../ui/use-toast";

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const router = useRouter();
  const { toast } = useToast();

  const pathname = usePathname();
  const isHotelDetailsPage = pathname.includes("hotel-details");

  const handleDialogueOpen = () => {
    setOpenDialog((prev) => !prev);
  };

  const handleRoomDelete = async (room: Room) => {
    setIsLoading(true);
    const imageKey = room.image.substring(room.image.lastIndexOf("/") + 1);

    axios
      .post("/api/uploadthing/delete", { imageKey })
      .then(() => {
        axios
          .delete(`/api/room/${room.id}`)
          .then(() => {
            router.refresh();
            toast({
              variant: "success",
              description: "Room Deleted Successfully",
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            toast({
              variant: "destructive",
              description: "Something Went Wrong",
            });
          });
      })
      .catch(() => {
        setIsLoading(false);
        toast({
          variant: "destructive",
          description: "Something Went Wrong",
        });
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{room.title}</CardTitle>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={room.image}
            alt={room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2 content-start text-sm">
          <AmenityItem>
            <BedSingle className="h-4 w-4" />
            {room.bedCount} Bed{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <UserRoundCheck className="h-4 w-4" />
            {room.guestCount} Guest{"(s)"}
          </AmenityItem>

          <AmenityItem>
            <Bath className="h-4 w-4" />
            {room.bathroomCount} Bathroom{"(s)"}
          </AmenityItem>

          {!!room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.kingBed} King Bed{"(s)"}
            </AmenityItem>
          )}
          {!!room.queenBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {room.queenBed} Queen Bed{"(s)"}
            </AmenityItem>
          )}
          {room.roomService && (
            <AmenityItem>
              <HeartHandshake className="h-4 w-4" />
              Room Services
            </AmenityItem>
          )}
          {room.TV && (
            <AmenityItem>
              <Monitor className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Condition
            </AmenityItem>
          )}
          {room.soundProofed && (
            <AmenityItem>
              <EarOff className="h-4 w-4" />
              Sound Proof
            </AmenityItem>
          )}
          {room.cityView && (
            <AmenityItem>
              <UsersRound className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {room.mountainView && (
            <AmenityItem>
              <Mountain className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-1 justify-center">
          <div className="flex items-center gap-1">
            Room Price: <span className="font-bold">₹{room.roomPrice}</span>
            <span className="text-xs">/24hrs</span>
          </div>
          {!!room.breakFastPrice && (
            <div>
              Breakfast Price:
              <span className="font-bold">₹{room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      <CardFooter>
        {isHotelDetailsPage ? (
          <div>Hotel Details Page</div>
        ) : (
          <>
            <div className="flex flex-col gap-2 w-full justify-center items-center">
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    type="button"
                    disabled={isLoading}
                    className="w-[200px]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-1 animate-spin h-4 w-4" />
                        Deleting
                      </>
                    ) : (
                      <>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Room
                      </>
                    )}
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[400px] w-[90%] rounded-lg">
                  <DialogHeader>
                    <DialogTitle>Delete Room</DialogTitle>
                    <DialogDescription>
                      Are you sure , you want to delete the room?
                    </DialogDescription>
                  </DialogHeader>

                  <DialogFooter className="justify-center gap-8 lg:gap-5 flex-row sm:justify-center">
                    <DialogClose asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-[100px]"
                      >
                        Close
                      </Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button
                        type="button"
                        className="w-[100px]"
                        onClick={() => handleRoomDelete(room)}
                      >
                        Delete
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                <DialogTrigger>
                  <Button type="button" className="w-[200px]">
                    <PenLine className="w-4 h-4 mr-2" />
                    Update Room
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-[900px] w-[90%]">
                  <DialogHeader className="px-2">
                    <DialogTitle>Update Room</DialogTitle>
                    <DialogDescription>
                      Make changes to the room details
                    </DialogDescription>
                  </DialogHeader>
                  <AddRoomForm
                    hotel={hotel}
                    room={room}
                    handleDialogueOpen={handleDialogueOpen}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoomCard;
