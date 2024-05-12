import { getBookingsByHotelOwnerId } from "@/actions/getBookingsByHotelOwnerId";
import { getBookingsByUserId } from "@/actions/getBookingsByUserId";
import MyBookingsClient from "@/components/booking/MyBookingsClient";
import React from "react";

const page = async () => {
  const bookingsFromVisitors = await getBookingsByHotelOwnerId();
  const bookingsIHaveMade = await getBookingsByUserId();

  if (!bookingsFromVisitors || !bookingsIHaveMade)
    return <div>No Bookings Found</div>;
  return (
    <div className="flex flex-col gap-7 mb-5">
      {!!bookingsIHaveMade?.length && (
        <div className="mt-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-4  underline">
            Here are Bookings you have made
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsIHaveMade.map((booking) => (
              <MyBookingsClient key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}
      {!!bookingsFromVisitors?.length && (
        <div className="mt-4">
          <h2 className="text-xl md:text-2xl font-semibold mb-4  underline">
            Here are Bookings visitors made on your property
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {bookingsIHaveMade.map((booking) => (
              <MyBookingsClient key={booking.id} booking={booking} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
