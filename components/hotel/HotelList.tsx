import { HotelWithRooms } from "@/interface/AddHotelFormProps";
import React from "react";
import HotelCard from "./HotelCard";

const HotelList = ({ hotels }: { hotels: HotelWithRooms[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 lg:gap-y-10 mt-4 px-4 lg:px-10">
      {hotels.map((hotel) => (
        <div key={hotel.id}>
          <HotelCard hotel={hotel} />
        </div>
      ))}
    </div>
  );
};

export default HotelList;
