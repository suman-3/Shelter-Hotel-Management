"use client";
import { HotelWithRooms } from "@/interface/AddHotelFormProps";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

import React from "react";
import Container from "../Container";
import Image from "next/image";
import AmenityItem from "../room/AmenityItem";
import { Car, Dumbbell, MapPin, Waves } from "lucide-react";
import useLocation from "@/hooks/useLocation";
import { Button } from "../ui/button";

const HotelCard = ({ hotel }: { hotel: HotelWithRooms }) => {
  const pathname = usePathname();
  const isMyHotels = pathname.includes("my-hotels");
  const router = useRouter();

  const { getCountryByCode } = useLocation();
  const country = getCountryByCode(hotel.country);

  return (
    <div
      onClick={() => {
        router.push(`/hotel-details/${hotel.id}`);
      }}
      className={cn(
        "cursor-pointer col-span-1 transition hover:-translate-y-[2px] hover:z-20 duration-300 hover:shadow-lg rounded-lg",
        isMyHotels && "cursor-default"
      )}
    >
      <div className="flex gap-2 bg-background/50 border border-primary/10 rounded-lg">
        <div className="flex-1 aspect-square overflow-hidden relative w-full h-[210px] rounded-s-lg">
          <Image
            src={hotel.image}
            alt={hotel.title}
            fill
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 flex flex-col justify-between h-[210px] gap-1 p-1 py-2 text-sm">
          <h2 className="font-semibold text-xl">{hotel.title}</h2>
          <p className="text-primary/90">
            {hotel.description.substring(0, 45)}...
          </p>
          <div className="text-primary/90">
            <AmenityItem>
              <MapPin className="h-4 w-4" />
              {country?.name},{hotel.city}
            </AmenityItem>
            {hotel.gym && (
              <AmenityItem>
                <Dumbbell className="h-4 w-4" />
                Gym
              </AmenityItem>
            )}
            {hotel.swimmingPool && (
              <AmenityItem>
                <Waves className="h-4 w-4" />
                Pool
              </AmenityItem>
            )}
            {hotel.freeParking && (
              <AmenityItem>
                <Car className="h-4 w-4" />
                Free Parking
              </AmenityItem>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {hotel?.rooms[0]?.roomPrice && (
                <>
                  <div className="font-semibold text-base">
                    ₹{hotel?.rooms[0]?.roomPrice}
                  </div>
                  <div className="text-xs">/24 hrs</div>
                </>
              )}
            </div>
            {isMyHotels && (
              <Button
                onClick={() => {
                  router.push(`/hotel/${hotel.id}`);
                }}
                variant="outline"
              >
                Edit
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;
