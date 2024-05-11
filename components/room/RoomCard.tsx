"use client";

import { RoomCardProps } from "@/interface/RoomCardProps";
import React from "react";

const RoomCard = ({ hotel, room, bookings = [] }: RoomCardProps) => {
  return (
    <div>{room.title}</div>
  )
};

export default RoomCard;
