"use client";

import { RoomCardProps } from "@/interface/RoomCardProps";
import React, { useEffect, useMemo, useState } from "react";
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
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import AddRoomForm from "./AddRoomForm";
import { Room } from "@prisma/client";
import axios from "axios";

import { useToast } from "../ui/use-toast";
import { DatePickerWithRange } from "./DateRangePicker";
import { DateRange } from "react-day-picker";
import {
  addDays,
  differenceInCalendarDays,
  eachDayOfInterval,
  set,
} from "date-fns";
import { Checkbox } from "../ui/checkbox";
import { useAuth } from "@clerk/nextjs";
import useBookRooms from "@/hooks/useBookRoom";

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  const { userId } = useAuth();

  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRooms();

  const [isLoading, setIsLoading] = useState(false);
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [totalPrice, setTotalPrice] = useState(room.roomPrice);
  const [includeBreakFast, setIncludeBreakFast] = useState(false);
  const [days, setDays] = useState(0);

  const router = useRouter();
  const { toast } = useToast();

  const pathname = usePathname();
  const isHotelDetailsPage = pathname.includes("hotel-details");
  const isBookRoom = pathname.includes("book-room");

  useEffect(() => {
    if (date && date.from && date.to) {
      const dayCount = differenceInCalendarDays(date.to, date.from);

      setDays(dayCount);

      if (dayCount && room.roomPrice) {
        if (includeBreakFast && room.breakFastPrice) {
          setTotalPrice(
            dayCount * room.roomPrice + dayCount * room.breakFastPrice
          );
        } else {
          setTotalPrice(dayCount * room.roomPrice);
        }
      } else {
        setTotalPrice(room.roomPrice);
      }
    }
  }, [date, room.roomPrice, includeBreakFast]);

  const disabledDates = useMemo(() => {
    let dates: Date[] = [];

    const roomBookings = bookings.filter(
      (booking) => booking.roomId === room.id
    );

    roomBookings.forEach((booking) => {
      const range = eachDayOfInterval({
        start: new Date(booking.startDate),
        end: new Date(booking.endDate),
      });

      dates = [...dates, ...range];
    });
    return dates;
  }, [bookings]);

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

  const handleBookRoom = async () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Please Login to Book Room",
      });

    if (!hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Hotel Owner is not found",
      });

    if (date?.from && date?.to) {
      setBookingIsLoading(true);
      const bookingRoomDate = {
        room,
        totalPrice,
        breakFastIncluded: includeBreakFast,
        startDate: date.from,
        endDate: date.to,
      };

      setRoomData(bookingRoomDate);

      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          booking: {
            hotelOwnerId: hotel.userId,
            hotelId: hotel.id,
            roomId: room.id,
            startDate: date.from,
            endDate: date.to,
            breakFastIncluded: includeBreakFast,
            totalPrice: totalPrice,
          },
          description: "Booking payment for hotel room",
          payment_intent_id: paymentIntentId,
        }),
      })
        .then((res) => {
          setBookingIsLoading(false);
          if (res.status === 401) {
            router.push("/sign-in");
          }
          return res.json();
        })
        .then((data) => {
          setClientSecret(data.paymentIntent.client_secret);
          setPaymentIntentId(data.paymentIntent.id);
          router.push("/book-room");
        })
        .catch((error: any) => {
          console.log("Error", error);
          return toast({
            variant: "destructive",
            description: "Something went wrong",
          });
        });
    } else {
      return toast({
        variant: "destructive",
        description: "Please Select Dates",
      });
    }
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
            <div className="flex items-center gap-1">
              Breakfast Price:
              <span className="font-bold">₹{room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
      </CardContent>
      {!isBookRoom && (
        <CardFooter>
          {isHotelDetailsPage ? (
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-semibold mb-1">Select days</h2>
                <DatePickerWithRange
                  date={date}
                  setDate={setDate}
                  disabledDates={disabledDates}
                />
              </div>
              {room.breakFastPrice > 0 && (
                <div>
                  <div className="mb-1 text-[14px]">
                    Do You Want to served breakfast everyday?
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="breakFast"
                      onCheckedChange={(value) => {
                        setIncludeBreakFast(!!value);
                      }}
                    />
                    <label
                      htmlFor="breakFast"
                      className="text-gray-600/70 text-sm"
                    >
                      Include Breakfast
                    </label>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-1">
                Total Price: <span className="font-bold">₹{totalPrice}</span>{" "}
                {days > 0 ? `for ${days} Days` : "per day"}
              </div>
              <Button
                disabled={
                  bookingIsLoading ||
                  !date ||
                  !date.from ||
                  !date.to ||
                  days < 1
                }
                type="button"
                onClick={() => handleBookRoom()}
              >
                {bookingIsLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {!date || !date.from || !date.to || days < 1
                  ? "Select Dates to Book"
                  : bookingIsLoading
                  ? "Booking"
                  : "Book Room"}
              </Button>
            </div>
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
      )}
    </Card>
  );
};

export default RoomCard;
