"use client";
import React, { useEffect, useState } from "react";
import { StripeElementsOptions, loadStripe } from "@stripe/stripe-js";
import useBookRooms from "@/hooks/useBookRoom";
import RoomCard from "../room/RoomCard";
import { Elements } from "@stripe/react-stripe-js";
import RoomPaymentForm from "./RoomPaymentForm";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

const BookRoomClient = () => {
  const { bookingRoomData, clientSecret } = useBookRooms();
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const { theme } = useTheme();

  const router = useRouter();

  useEffect(() => {
    setPageLoaded(true);
  }, []);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: theme === "dark" ? "night" : "stripe",
      labels: "floating",
    },
  };

  const handleSetPaymentSuccess = (value: boolean) => {
    setPaymentSuccess(value);
  };

  if (pageLoaded && !paymentSuccess && (!bookingRoomData || !clientSecret))
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-rose-500 text-center text-lg">
          Oops! This page could not be loaded ...
        </h2>
        <div className="flex gap-4 items-center mt-5">
          <Button
            onClick={() => {
              router.push("/");
            }}
          >
            Home
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              router.push("/my-bookings");
            }}
          >
            View Bookings
          </Button>
        </div>
      </div>
    );

  if (paymentSuccess)
    return (
      <div className="flex flex-col items-center">
        <h2 className="text-teal-500 text-center text-lg">Payment Success</h2>
        <Button
          onClick={() => {
            router.push("/my-bookings");
          }}
          className="mt-5"
        >
          View Bookings
        </Button>
      </div>
    );

  return (
    <div className="max-w-[700px] mx-auto mb-8">
      {clientSecret && bookingRoomData && (
        <div>
          <h3 className="text-2xl font-semibold mb-3">
            Complete payment to reserve this room
          </h3>
          <div className="mb-5">
            <RoomCard room={bookingRoomData.room} />
          </div>
          <Elements options={options} stripe={stripePromise}>
            <RoomPaymentForm
              clientSecret={clientSecret}
              handleSetPaymentSuccess={handleSetPaymentSuccess}
            />
          </Elements>
        </div>
      )}
    </div>
  );
};

export default BookRoomClient;
