import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { hotelId: string } }
) {
  try {
    const body = await req.json();
    const { userId } = auth();

    if (!params.hotelId) {
      return new NextResponse("Hotel Id is required", { status: 401 });
    }
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const hotel = await prismadb.hotel.update({
      where: {
        id: params.hotelId,
      },
      data: {
        ...body,
        userId,
      },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.log("Error at /api/hotel/hotelId POST:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
