import { getHotelById } from "@/actions/getHotelById";
import Container from "@/components/Container";
import AddHotelForm from "@/components/hotel/AddHotelForm";
import { HotelPageProps } from "@/interface/HotelPageProps ";

import { auth } from "@clerk/nextjs/server";
import React from "react";


const Hotel = async ({ params }: HotelPageProps) => {
  const hotel = await getHotelById(params.hotelId);
  const { userId } = auth();

  if (!userId) {
    return <div>Unauthorized</div>;
  }

  if (hotel && hotel.userId !== userId) {
    return <div>Access Denide...</div>;
  }
  return (
    <div>
      <Container>
      <AddHotelForm hotel={hotel} />
      </Container>
    </div>
  );
};

export default Hotel;
