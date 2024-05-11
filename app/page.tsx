
import { getHotels } from "@/actions/getHotels";
import HotelList from "@/components/hotel/HotelList";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { HomeProps } from "@/interface/HomeProps";


export default async function Home({searchParams}:HomeProps) {
  const hotels = await getHotels(searchParams);

  if(!hotels) return <div>No hotels Found ....</div>
  return (
    <div>
    <HotelList hotels={hotels}  />
    </div>
  );
}
