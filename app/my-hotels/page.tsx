import { getHotelsByUserId } from "@/actions/getHotelsByUserId";
import HotelList from "@/components/hotel/HotelList";
import React from "react";

const page = async () => {
  const hotels = await getHotelsByUserId();

  if (!hotels) return <div>No Hotels Found.</div>;
  return (
    <div className="mt-3">
      <h2 className="text-2xl font-semibold underline">
        Here are your properties
      </h2>
      <HotelList hotels={hotels} />
    </div>
  );
};

export default page;
