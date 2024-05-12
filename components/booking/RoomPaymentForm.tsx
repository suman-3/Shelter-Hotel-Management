"use client";
import useBookRooms from "@/hooks/useBookRoom";
import { RoomPaymentFormProps } from "@/interface/RoomPaymentFormProps";
import {
  AddressElement,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React, { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { Separator } from "../ui/separator";
import moment from "moment";
import { Button } from "../ui/button";
import { Loader, Loader2, Nfc, PartyPopper } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Booking } from "@prisma/client";
import { DateRangesType } from "@/interface/DateRangesTypeProps";
import { endOfDay, isWithinInterval, set, startOfDay } from "date-fns";

function hasOverlap(
  startDate: Date,
  endDate: Date,
  dateRanges: DateRangesType[]
) {
  const targetInterval = {
    start: startOfDay(new Date(startDate)),
    end: endOfDay(new Date(endDate)),
  };

  for (const range of dateRanges) {
    const rangeStart = startOfDay(new Date(range.startDate));
    const rangeEnd = endOfDay(new Date(range.endDate));

    if (
      isWithinInterval(targetInterval.start, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      isWithinInterval(targetInterval.end, {
        start: rangeStart,
        end: rangeEnd,
      }) ||
      (targetInterval.start < rangeStart && targetInterval.end > rangeEnd)
    ) {
      return true;
    }
  }

  return false;
}

const RoomPaymentForm = ({
  clientSecret,
  handleSetPaymentSuccess,
}: RoomPaymentFormProps) => {
  const { bookingRoomData, resetBookRoom } = useBookRooms();

  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!stripe) {
      return;
    }
    if (!clientSecret) {
      return;
    }
    handleSetPaymentSuccess(false);
    setIsLoading(false);
  }, [stripe]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements || !bookingRoomData) {
      return;
    }

    try {
      //date overlaps

      const response = await axios.get(
        `/api/booking/${bookingRoomData.room.id}`
      );
      const bookings = response.data;

      const roomBookingsDate = bookings.map((booking: Booking) => {
        return {
          startDate: booking.startDate,
          endDate: booking.endDate,
        };
      });

      const overlapFound = hasOverlap(
        bookingRoomData.startDate,
        bookingRoomData.endDate,
        roomBookingsDate
      );

      if (overlapFound) {
        setIsLoading(false);
        return toast({
          variant: "destructive",
          description: "Room is already booked for the selected dates",
        });
      }

      stripe
        .confirmPayment({ elements, redirect: "if_required" })
        .then((result) => {
          console.log(result);

          if (!result.error) {
            axios
              .patch(`/api/booking/${result.paymentIntent.id}`)
              .then((res) => {
                toast({
                  variant: "success",
                  description: "Room Reserved ✨",
                });

                router.refresh();
                resetBookRoom();
                handleSetPaymentSuccess(true);
                isLoading;
              })
              .catch((error: any) => {
                console.log(error);
                toast({
                  variant: "destructive",
                  description: `Something went wrong ${error.message}`,
                });
                setIsLoading(false);
              });
          } else {
            toast({
              variant: "destructive",
              description: `Something went wrong`,
            });
            setIsLoading(false);
          }
        });
    } catch (error: any) {
      console.log(error);
      setIsLoading(false);
    }
  };

  if (!bookingRoomData?.startDate || !bookingRoomData?.endDate) {
    return <div>Missing Reservation Dates...</div>;
  }

  const startDate = moment(bookingRoomData?.startDate).format("DD MMM YYYY");
  const endDate = moment(bookingRoomData?.endDate).format("DD MMM YYYY");

  return (
    <form onSubmit={handleSubmit} id="payment-form">
      <h2 className="font-semibold text-lg mb-1">Billing Address</h2>
      <AddressElement
        options={{
          mode: "billing",
          //   allowedCountries: ["US", "IN"],
        }}
      />
      <h2 className="font-semibold text-lg mt-2 mb-1">Payment Information</h2>
      <PaymentElement
        id="payment-element"
        options={{
          layout: "tabs",
        }}
      />
      <div className="flex flex-col gap-1">
        <Separator />
        <div className="text-sm">
          <h2 className="font-semibold mb-1 text-lg">Your Booking Summary</h2>
          <h2>You will check-in on {startDate} at 5PM</h2>
          <h2>You will check-out on {endDate} at 5PM</h2>

          {bookingRoomData?.breakFastIncluded && (
            <h2> You will served breakfast each day at 8AM</h2>
          )}
        </div>
        <Separator />
        <div className="font-semibold">
          {bookingRoomData?.breakFastIncluded && (
            <h2 className="mb-1">
              Breakfast Price : ₹{bookingRoomData?.room?.breakFastPrice}
            </h2>
          )}
          Total Price: ₹{bookingRoomData?.totalPrice}
        </div>
      </div>
      {isLoading && (
        <Alert className="bg-violet-600 text-white my-2">
          <Loader className="h-4 w-4 stroke-white animate-spin" />
          <AlertTitle>Payment Is Processing ..</AlertTitle>

          <AlertDescription>
            <div>Please stay on this page as we process your payment..</div>
          </AlertDescription>
        </Alert>
      )}
      <Button disabled={isLoading} className="mt-2 w-full">
        {isLoading ? "Processing..." : "Pay Now"}
        {isLoading ? (
          <Loader2 size={19} className="animate-spin ml-2" />
        ) : (
          <Nfc className="w-5 h-5 ml-2" />
        )}
      </Button>
    </form>
  );
};

export default RoomPaymentForm;
