import { getHotelById } from "@/actions/getHotelById";
import HotelDetailsClient from "@/components/hotel/HotelDetailsClient";
import { HotelDetailsProps } from "@/interface/HotelDetailsProps";

import React from "react";

const page = async ({ params }: HotelDetailsProps) => {
  const hotel = await getHotelById(params.hotelId);

  if (!hotel) return <div>Oop! Hotel with the given Id not found.</div>;
  return (
    <div>
      <HotelDetailsClient hotel={hotel} />
    </div>
  );
};

export default page;
