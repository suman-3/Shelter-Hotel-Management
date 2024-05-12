import useLocation from "@/hooks/useLocation";
import { HotelWithRooms } from "@/interface/AddHotelFormProps";
import { Booking } from "@prisma/client";
import Image from "next/image";
import React from "react";
import AmenityItem from "../room/AmenityItem";
import {
  Bike,
  Car,
  Coffee,
  Dumbbell,
  Locate,
  MapPin,
  MonitorPlay,
  ShoppingBag,
  Utensils,
  Waves,
  Wifi,
  Wine,
} from "lucide-react";
import { FaSpa, FaSwimmer } from "react-icons/fa";
import { GiShoppingBag } from "react-icons/gi";
import { MdLocalLaundryService } from "react-icons/md";
import RoomCard from "../room/RoomCard";
import { Skeleton } from "../ui/skeleton";

const HotelDetailsClient = ({
  hotel,
  bookings,
}: {
  hotel: HotelWithRooms;
  bookings?: Booking[];
}) => {
  const { getCountryByCode, getStateByCode } = useLocation();
  const country = getCountryByCode(hotel.country);
  const state = getStateByCode(hotel.country, hotel.state);
  return (
    <div className="flex flex-col gap-6 pb-7 mt-5">
      <div className="aspect-squareoverflow-hidden relative w-full h-[230px] md:h-[300px] rounded-lg">
        {hotel.image ? (
          <Image
          alt={hotel.title}
          src={hotel.image}
          fill
          className="object-cover rounded-lg"
        />
        ):(
          <Skeleton className="w-full h-[230px] md:h-[300px] rounded-lg bg-slate-300/80" />

        )}
      </div>
      <div className="">
        <div className="flex w-full justify-between items-center">
          <h3 className="font-semibold text-xl md:text-2xl lg:text-3xl">
            {hotel.title}
          </h3>
          <div className="font-semibold mt-1">
            <AmenityItem>
              <MapPin className="h-4 w-4" />
              {country?.name}, {state?.name}, {hotel?.city}
            </AmenityItem>
          </div>
        </div>
        <h3 className="font-semibold text-lg mt-3 md:mt-2 mb-1 underline">
          Location Details
        </h3>
        <p>{hotel.locationDescription}</p>
        <h3 className="font-semibold text-lg mt-2 md:mt-1 mb-1 underline">
          About This Hotel
        </h3>
        <p>{hotel.description}</p>
        <h3 className="font-semibold text-lg mt-2 md:mt-1 mb-1 underline">
          Popular Amenities
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 content-start text-md mt-2">
          {hotel.restaurent && (
            <AmenityItem>
              <Utensils size={20} />
              Restaurent
            </AmenityItem>
          )}
          {hotel.shopping && (
            <AmenityItem>
              <GiShoppingBag size={20} />
              Shopping
            </AmenityItem>
          )}
          {hotel.swimmingPool && (
            <AmenityItem>
              <FaSwimmer size={20} />
              Pool
            </AmenityItem>
          )}
          {hotel.freeParking && (
            <AmenityItem>
              <Car size={20} />
              Free Parking
            </AmenityItem>
          )}
          {hotel.spa && (
            <AmenityItem>
              <FaSpa size={20} />
              Spa
            </AmenityItem>
          )}
          {hotel.gym && (
            <AmenityItem>
              <Dumbbell size={20} />
              Gym
            </AmenityItem>
          )}
          {hotel.laundry && (
            <AmenityItem>
              <MdLocalLaundryService size={20} />
              Laundry
            </AmenityItem>
          )}
          {hotel.bikeRental && (
            <AmenityItem>
              <Bike size={20} />
              Bike Rent
            </AmenityItem>
          )}
          {hotel.freeWifi && (
            <AmenityItem>
              <Wifi size={20} />
              Wifi
            </AmenityItem>
          )}
          {hotel.gym && (
            <AmenityItem>
              <Wine size={20} />
              Bar
            </AmenityItem>
          )}
          {hotel.gym && (
            <AmenityItem>
              <MonitorPlay size={20} />
              Movie Nights
            </AmenityItem>
          )}
          {hotel.coffeeShop && (
            <AmenityItem>
              <Coffee size={20} />
              Coffee Shop
            </AmenityItem>
          )}
        </div>
      </div>
      <div>
        {!!hotel.rooms.length && (
          <div>
            <h3 className="text-lg underline font-semibold my-3">
              Hotel Rooms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {hotel.rooms.map((room) => {
                return <RoomCard  hotel={hotel} room={room} key={room.id} bookings={bookings} />;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelDetailsClient;
