"use client";
import * as z from "zod";
import {
  AddHotelFormProps,
  HotelWithRooms,
} from "@/interface/AddHotelFormProps";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PartyPopper, Terminal } from "lucide-react";
import { GiShoppingBag } from "react-icons/gi";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import HotlFormSchema from "@/schemas/HotelFormSchema";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  Bike,
  Car,
  CirclePlus,
  Coffee,
  Dumbbell,
  Eye,
  Loader2,
  MonitorPlay,
  PencilLine,
  ShoppingBag,
  Sparkle,
  Trash,
  Utensils,
  WashingMachine,
  Waves,
  Wifi,
  Wine,
  XCircle,
} from "lucide-react";
import { UploadButton } from "../uploadthing";
import Image from "next/image";
import { Button } from "../ui/button";
import { useToast } from "../ui/use-toast";
import useLocation from "@/hooks/useLocation";
import { ICity, IState } from "country-state-city";
import { useRouter } from "next/navigation";
import { ToastAction } from "../ui/toast";
import { HotelPageProps } from "@/interface/HotelPageProps ";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import AddRoomForm from "../room/AddRoomForm";
import { Separator } from "../ui/separator";
import RoomCard from "../room/RoomCard";
import { FaSpa } from "react-icons/fa";

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isHotelDeleting, setIsHotelDeleting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const {
    getAllCountries,
    getCountryByCode,
    getStateByCode,
    getCountryStates,
    getStateCities,
  } = useLocation();

  const { toast } = useToast();
  const router = useRouter();
  const countries = getAllCountries();

  const form = useForm<z.infer<typeof HotlFormSchema>>({
    resolver: zodResolver(HotlFormSchema),
    defaultValues: hotel || {
      title: "",
      description: "",
      image: "",
      country: "",
      state: "",
      city: "",
      locationDescription: "",
      gym: false,
      spa: false,
      bar: false,
      laundry: false,
      restaurent: false,
      shopping: false,
      freeParking: false,
      bikeRental: false,
      freeWifi: false,
      movieNights: false,
      swimmingPool: false,
      coffeeShop: false,
    },
  });

  useEffect(() => {
    if (typeof image === "string" && image.length > 0) {
      form.setValue("image", image, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [image]);

  useEffect(() => {
    const selectedCountry = form.watch("country");
    const countryStates = getCountryStates(selectedCountry);
    if (countryStates) {
      setStates(countryStates);
    }
  }, [form.watch("country")]);

  useEffect(() => {
    const selectedState = form.watch("state");
    const selectedCountry = form.watch("country");
    const stateCities = getStateCities(selectedCountry, selectedState);
    if (stateCities) {
      setCities(stateCities);
    }
  }, [form.watch("state")]);

  function onSubmit(values: z.infer<typeof HotlFormSchema>) {
    setIsLoading(true);
    if (hotel) {
      //update hotel
      axios
        .patch(`/api/hotel/${hotel.id}`, values)
        .then((res) => {
          toast({
            variant: "success",
            description: "Hotel updated successfully",
          });
          router.push(`/hotel/${hotel.id}`);
          setIsLoading(false);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
          setIsLoading(false);
        });
    } else {
      //create hotel
      axios
        .post("/api/hotel", values)
        .then((res) => {
          toast({
            variant: "success",
            description: "🎉 Hotel created ",
          });
          router.push(`/hotel/${res.data.id}`);
          setIsLoading(false);
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
          setIsLoading(false);
        });
    }
  }

  const handleDeleteHotel = async (hotel: HotelWithRooms) => {
    setIsHotelDeleting(true);

    // const getImageKey = (src: string) => src.substring(src.lastIndexOf("/") + 1);
    try {
      // const imagekey = getImageKey(hotel.image);
      deleteImageWhileDeletingHotel(hotel.image);
      await axios.delete(`/api/hotel/${hotel.id}`);
      router.push("/hotel/new");
      setIsHotelDeleting(false);
      toast({
        variant: "success",
        description: "Hotel deleted successfully",
      });
    } catch (error: any) {
      console.log(error);

      setIsHotelDeleting(false);
      toast({
        variant: "destructive",
        description: `ERROR! ${error.message}`,
      });
    }
  };

  const handleImageDelete = (image: string) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", {
        imageKey,
      })
      .then((res) => {
        if (res.data.success) {
          setImage("");
          toast({
            variant: "success",
            description: "Image deleted successfully",
          });
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: `ERROR! ${error.message}`,
        });
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  const deleteImageWhileDeletingHotel = (image: string) => {
    setImageIsDeleting(true);
    const imageKey = image.substring(image.lastIndexOf("/") + 1);
    axios
      .post("/api/uploadthing/delete", {
        imageKey,
      })
      .then((res) => {
        if (res.data.success) {
          setImage("");
        }
      })
      .catch((error) => {
        toast({
          variant: "destructive",
          description: `ERROR! ${error.message}`,
        });
      })
      .finally(() => {
        setImageIsDeleting(false);
      });
  };

  const handleDialogueOpen = () => {
    setOpenDialog((prev) => !prev);
  };
  return (
    <div suppressHydrationWarning>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <h3 className="text-lg underline">
            {hotel ? "Update your hotel" : "Describe your hotel"}
          </h3>
          <div className="flex flex-col md:flex-row gap-5 md:gap-8">
            <div className="flex-1 flex flex-col gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Title *</FormLabel>
                    <FormDescription>Provide your Hotel name</FormDescription>
                    <FormControl>
                      <Input placeholder="Beach Hotel" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hotel Description *</FormLabel>
                    <FormDescription>
                      Provide a detailed description of hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Beach Hotel is parked with many awesome amenitie"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <div>
                <FormLabel>Choose Amenities</FormLabel>
                <FormDescription className="mt-1">
                  Select Popular Amenities in your hotel
                </FormDescription>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
                  <FormField
                    control={form.control}
                    name="gym"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>GYM</FormLabel>
                            <Dumbbell size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="spa"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>SPA</FormLabel>
                            <FaSpa size={18} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bar"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>BAR</FormLabel>
                            <Wine size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="laundry"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Laundry</FormLabel>
                            <WashingMachine
                              size={16}
                              className="text-gray-600"
                            />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="restaurent"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Restaurent</FormLabel>
                            <Utensils size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="shopping"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Shopping</FormLabel>
                            <GiShoppingBag
                              size={16}
                              className="text-gray-600"
                            />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="freeParking"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Free Parking</FormLabel>
                            <Car size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bikeRental"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Bike Rent</FormLabel>
                            <Bike size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="freeWifi"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Free Wifi</FormLabel>
                            <Wifi size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="movieNights"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Movie Nights</FormLabel>
                            <MonitorPlay size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="swimmingPool"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel className="line-clamp-1">
                              Swimming Pool
                            </FormLabel>
                            <Waves size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="coffeeShop"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2 border p-2 rounded-md border-gray-600 dark:border-slate-400">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Coffee Shop</FormLabel>
                            <Coffee size={16} className="text-gray-600" />
                          </span>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2 mt-4">
                    <FormLabel>Upload an Image *</FormLabel>
                    <FormDescription>
                      Upload a beautiful image of your hotel
                    </FormDescription>
                    <FormControl>
                      {image ? (
                        <>
                          <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4 border-2 border-dotted border-gray-400 rounded-sm">
                            <Image
                              src={image}
                              alt="hotel banner"
                              fill
                              className="object-contain p-2"
                            />
                            <Button
                              type="button"
                              size="icon"
                              variant="ghost"
                              className="absolute right-0 top-0 "
                              onClick={() => handleImageDelete(image)}
                            >
                              {imageIsDeleting ? (
                                <Loader2 className="animate-spin" size={20} />
                              ) : (
                                <XCircle size={20} />
                              )}
                            </Button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center max-w-[4000px] border-2 border-dotted border-primary/50 justify-center pt-6 pb-3  rounded-sm">
                            <UploadButton
                              endpoint="imageUploader"
                              onClientUploadComplete={(res) => {
                                setImage(res[0].url);
                                toast({
                                  variant: "success",
                                  description: "Image uploaded successfully",
                                });
                              }}
                              onUploadError={(error: Error) => {
                                toast({
                                  variant: `destructive`,
                                  description: `ERROR! ${error.message}`,
                                });
                              }}
                            />
                          </div>
                        </>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Country *</FormLabel>
                      <FormDescription className="text-[12px]">
                        In Which country is your property Located?
                      </FormDescription>
                      <Select
                        disabled={isLoading}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select Your Country"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countries.map((country) => (
                            <SelectItem
                              key={country.isoCode}
                              value={country.isoCode}
                            >
                              {country.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select State *</FormLabel>
                      <FormDescription className="text-[12px]">
                        In Which state is your property Located?
                      </FormDescription>
                      <Select
                        disabled={isLoading || states.length < 1}
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue
                            defaultValue={field.value}
                            placeholder="Select Your State"
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem
                              key={state.isoCode}
                              value={state.isoCode}
                            >
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select City </FormLabel>
                    <FormDescription className="text-[12px]">
                      In Which town/city is your property Located?
                    </FormDescription>
                    <Select
                      disabled={isLoading || cities.length < 1}
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="bg-background">
                        <SelectValue
                          defaultValue={field.value}
                          placeholder="Select Your City"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Description *</FormLabel>
                    <FormDescription>
                      Provide a detailed location description of your hotel
                    </FormDescription>
                    <FormControl>
                      <Textarea
                        className="resize-none"
                        placeholder="Located at the very end of the beach, with a beautiful view of the ocean."
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {hotel && !hotel.rooms.length && (
                <Alert className="bg-purple-500 text-white">
                  <PartyPopper className="h-4 w-4 stroke-white" />
                  <AlertTitle>One last step!</AlertTitle>
                  <div className="flex flex-row gap-8">
                    <AlertDescription>
                      Your hotel was created successfully 🔥
                      <div>
                        Please add some rooms to complete your hotel setup
                      </div>
                    </AlertDescription>
                    {hotel && (
                      <Button
                        type="button"
                        className="w-[120px]"
                        onClick={() =>
                          router.push(`/hotel-details/${hotel.id}`)
                        }
                      >
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </Button>
                    )}
                  </div>
                </Alert>
              )}
              <div className="flex justify-between gap-2 flex-wrap">
                {hotel ? (
                  <Button disabled={isLoading} className="w-[150px]">
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 animate-spin h-4 w-4" />
                        Updating
                      </>
                    ) : (
                      <>
                        <PencilLine className="mr-2 h-4 w-4" />
                        Update Details
                      </>
                    )}
                  </Button>
                ) : (
                  <>
                    <Button disabled={isLoading} className="w-[120px]">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 animate-spin h-4 w-4" />
                          Creating
                        </>
                      ) : (
                        <>
                          <CirclePlus className="mr-2 h-4 w-4" />
                          Create Hotel
                        </>
                      )}
                    </Button>
                  </>
                )}
                {hotel && (
                  <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger>
                      <Button type="button" className="w-[150px]">
                        <CirclePlus className="w-4 h-4 mr-2" />
                        Add Room
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[900px] w-[90%]">
                      <DialogHeader className="px-2">
                        <DialogTitle>Add A Room</DialogTitle>
                        <DialogDescription>
                          Add details about a room in your hotel
                        </DialogDescription>
                      </DialogHeader>
                      <AddRoomForm
                        hotel={hotel}
                        handleDialogueOpen={handleDialogueOpen}
                      />
                    </DialogContent>
                  </Dialog>
                )}

                {hotel && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        type="button"
                        className="w-[150px]"
                        disabled={isHotelDeleting || isLoading}
                      >
                        {isHotelDeleting ? (
                          <>
                            <Loader2 className="mr-1 animate-spin h-4 w-4" />
                            Deleting
                          </>
                        ) : (
                          <>
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Hotel
                          </>
                        )}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-[400px] w-[90%] rounded-lg">
                      <DialogHeader>
                        <DialogTitle>Delete Hotel</DialogTitle>
                        <DialogDescription>
                          Are you sure , you want to delete the hotel?
                        </DialogDescription>
                      </DialogHeader>

                      <DialogFooter className="justify-center gap-8 lg:gap-5 flex-row sm:justify-center">
                        <DialogClose asChild>
                          <Button
                            type="button"
                            variant="outline"
                            className="w-[100px]"
                          >
                            Close
                          </Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            type="button"
                            disabled={isHotelDeleting || isLoading}
                            onClick={() => handleDeleteHotel(hotel)}
                            className="w-[100px]"
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              {hotel && !!hotel.rooms.length && (
                <div>
                  <Separator />
                  <h3 className="text-lg font-semibold my-4">Hotel Rooms</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {hotel.rooms.map((room) => (
                      <RoomCard key={room.id} hotel={hotel} room={room} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
