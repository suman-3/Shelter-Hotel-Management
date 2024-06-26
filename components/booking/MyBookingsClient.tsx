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

import Image from "next/image";
import {
  AirVent,
  Badge,
  BadgeCheck,
  BadgeIndianRupee,
  Bath,
  BedDouble,
  BedSingle,
  EarOff,
  Eye,
  HandPlatter,
  HeartHandshake,
  History,
  Home,
  Loader2,
  MapPin,
  Monitor,
  Mountain,
  Ship,
  Sparkle,
  Trees,
  UserRoundCheck,
  UsersRound,
  UtensilsCrossed,
  Wand2,
  Wifi,
} from "lucide-react";
import { Separator } from "../ui/separator";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

import { useToast } from "../ui/use-toast";

import { differenceInCalendarDays } from "date-fns";

import { useAuth } from "@clerk/nextjs";
import useBookRooms from "@/hooks/useBookRoom";
import { MyBookingsClientProps } from "@/interface/MyBookingsClientProps";
import useLocation from "@/hooks/useLocation";
import moment from "moment";
import AmenityItem from "../room/AmenityItem";
import Link from "next/link";

const MyBookingsClient: React.FC<MyBookingsClientProps> = ({ booking }) => {
  const { userId } = useAuth();

  const { setRoomData, paymentIntentId, setClientSecret, setPaymentIntentId } =
    useBookRooms();
  const [bookingIsLoading, setBookingIsLoading] = useState(false);
  const { getCountryByCode, getStateByCode } = useLocation();
  const router = useRouter();
  const startDate = moment(booking.startDate).format("DD MMM YYYY");
  const endDate = moment(booking.endDate).format("DD MMM YYYY");
  const dayCount = differenceInCalendarDays(booking.endDate, booking.startDate);
  const { toast } = useToast();
  const { Hotel, Room } = booking;

  if (!Hotel || !Room) return <div>Missing Data ..</div>;

  const country = getCountryByCode(Hotel.country);
  const state = getStateByCode(Hotel.country, Hotel.state);

  const handleBookRoom = async () => {
    if (!userId)
      return toast({
        variant: "destructive",
        description: "Please Login to Book Room",
      });

    if (!Hotel?.userId)
      return toast({
        variant: "destructive",
        description: "Hotel Owner is not found",
      });

    setBookingIsLoading(true);

    const bookingRoomDate = {
      room: Room,
      totalPrice: booking.totalPrice,
      breakFastIncluded: booking.breakFastIncluded,
      startDate: booking.startDate,
      endDate: booking.endDate,
    };

    setRoomData(bookingRoomDate);

    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        booking: {
          hotelOwnerId: Hotel.userId,
          hotelId: Hotel.id,
          roomId: Room.id,
          startDate: bookingRoomDate.startDate,
          endDate: bookingRoomDate.endDate,
          breakFastIncluded: bookingRoomDate.breakFastIncluded,
          totalPrice: bookingRoomDate.totalPrice,
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
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{Hotel.title}</CardTitle>
        <CardDescription>
          <div className="font-semibold mt-1">
            <AmenityItem>
              <MapPin className="h-4 w-4 -ml-[2px]" />
              {country?.name}, {state?.name}, {Hotel?.city}
            </AmenityItem>
          </div>
        </CardDescription>
        <CardDescription className="pb-2 flex items-center gap-1">
          <p>{Hotel.locationDescription}</p>
        </CardDescription>
        <Separator />
        <CardTitle>{Room.title}</CardTitle>
        <CardDescription>{Room.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <div className="aspect-square overflow-hidden relative h-[200px] rounded-lg">
          <Image
            fill
            src={Room.image}
            alt={Room.title}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2 content-start text-sm">
          <AmenityItem>
            <BedSingle className="h-4 w-4" />
            {Room.bedCount} Bed{"(s)"}
          </AmenityItem>
          <AmenityItem>
            <UserRoundCheck className="h-4 w-4" />
            {Room.guestCount} Guest{"(s)"}
          </AmenityItem>

          <AmenityItem>
            <Bath className="h-4 w-4" />
            {Room.bathroomCount} Bathroom{"(s)"}
          </AmenityItem>

          {!!Room.kingBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {Room.kingBed} King Bed{"(s)"}
            </AmenityItem>
          )}
          {!!Room.queenBed && (
            <AmenityItem>
              <BedDouble className="h-4 w-4" />
              {Room.queenBed} Queen Bed{"(s)"}
            </AmenityItem>
          )}
          {Room.roomService && (
            <AmenityItem>
              <HeartHandshake className="h-4 w-4" />
              Room Services
            </AmenityItem>
          )}
          {Room.TV && (
            <AmenityItem>
              <Monitor className="h-4 w-4" />
              TV
            </AmenityItem>
          )}
          {Room.balcony && (
            <AmenityItem>
              <Home className="h-4 w-4" />
              Balcony
            </AmenityItem>
          )}
          {Room.freeWifi && (
            <AmenityItem>
              <Wifi className="h-4 w-4" />
              Free Wifi
            </AmenityItem>
          )}
          {Room.airCondition && (
            <AmenityItem>
              <AirVent className="h-4 w-4" />
              Air Condition
            </AmenityItem>
          )}
          {Room.soundProofed && (
            <AmenityItem>
              <EarOff className="h-4 w-4" />
              Sound Proof
            </AmenityItem>
          )}
          {Room.cityView && (
            <AmenityItem>
              <UsersRound className="h-4 w-4" />
              City View
            </AmenityItem>
          )}
          {Room.mountainView && (
            <AmenityItem>
              <Mountain className="h-4 w-4" />
              Mountain View
            </AmenityItem>
          )}
          {Room.oceanView && (
            <AmenityItem>
              <Ship className="h-4 w-4" />
              Ocean View
            </AmenityItem>
          )}
          {Room.forestView && (
            <AmenityItem>
              <Trees className="h-4 w-4" />
              Forest View
            </AmenityItem>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-1 justify-center">
          <div className="flex items-center gap-1">
            Room Price: <span className="font-bold">₹{Room.roomPrice}</span>
            <span className="text-xs">/24hrs</span>
          </div>
          {!!Room.breakFastPrice && (
            <div className="flex items-center gap-1">
              Breakfast Price:
              <span className="font-bold">₹{Room.breakFastPrice}</span>
            </div>
          )}
        </div>
        <Separator />
        <div className="flex flex-col gap-2">
          <CardTitle className="text-md underline">Booking Details</CardTitle>
          <div className="text-primary/90 text-sm flex flex-col gap-1 justify-start">
            <h2 className="flex gap-1 -ml-[1.5px]">
              <UserRoundCheck className="h-4 w-4" />
              Booked by&nbsp;
              <span className="font-semibold">{booking.userName}</span> for
              &nbsp;
              {dayCount} days
            </h2>
            <h2 className="flex gap-1 -ml-[2px] items-center">
              <History className="h-4 w-4" />
              Booked at - {moment(booking.bookedAt).fromNow()}
            </h2>
            <h2 className="flex gap-1 -ml-[2px]">
              <BadgeCheck className="h-4 w-4" />
              Check-in : {startDate} at 5PM
            </h2>
            <h2 className="flex gap-1 -ml-[2px]">
              <Badge className="h-4 w-4" />
              Check-out : {endDate} at 5PM
            </h2>
            {booking.breakFastIncluded && (
              <h2 className="flex gap-1 -ml-[2px]">
                <HandPlatter className="h-4 w-4" /> Breakfast will be Served
                everyday at 8AM
              </h2>
            )}
            {booking.payementStatus ? (
              <h2 className="flex gap-1 -ml-[2px] text-teal-600">
                <BadgeIndianRupee className="h-4 w-4" />
                Paid ₹{booking.totalPrice} - Room Reserved
              </h2>
            ) : (
              <h2 className="flex gap-1 -ml-[2px] text-rose-500">
                <BadgeIndianRupee className="h-4 w-4" />
                Not Paid ₹{booking.totalPrice} - Room Not Reserved
              </h2>
            )}
          </div>
        </div>
      </CardContent>
      <Separator />
      <CardFooter className="mt-4 flex flex-col gap-2">
        <Link href={`/hotel-details/${Hotel.id}`}>
          <Button
            disabled={bookingIsLoading}
            variant="outline"
            className="w-[200px]"
          >
            <Eye className="h-4 w-4 mr-1" />
            View Hotel
          </Button>
        </Link>
        {!booking.payementStatus && booking.userId === userId && (
          <Button
            disabled={bookingIsLoading}
            onClick={() => {
              handleBookRoom();
            }}
            className="w-[200px]"
          >
            {bookingIsLoading ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : (
              <BadgeIndianRupee className="h-4 w-4 mr-2" />
            )}
            <span className="mr-1">
              {bookingIsLoading ? "Processing..." : "Pay Now"}
            </span>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default MyBookingsClient;
