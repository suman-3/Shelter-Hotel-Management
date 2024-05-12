import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

export const getBookingsByHotelOwnerId = async () => {
  try {
    const { userId } = auth();

    if (!userId) {
      throw new Error("Unauthorized");
    }

    const bookings = await prismadb.booking.findMany({
      where: { hotelOwnerId: userId },
      include: { Room: true, Hotel: true },
      orderBy: { bookedAt: "desc" },
    });

    if (!bookings) null;
    return bookings;
  } catch (error: any) {
    throw new Error(error);
  }
};
