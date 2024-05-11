"use client";
import { AddRoomFormProps } from "@/interface/AddRommFormProps";
import RoomFormSchema from "@/schemas/RoomFormSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import {
  AirVent,
  CirclePlus,
  EarOff,
  HeartHandshake,
  Home,
  Loader2,
  Monitor,
  Mountain,
  PencilLine,
  Save,
  Ship,
  Trees,
  UsersRound,
  Wifi,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { UploadButton } from "../uploadthing";
import { useToast } from "../ui/use-toast";
import axios from "axios";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const AddRoomForm = ({ hotel, room, handleDialogueOpen }: AddRoomFormProps) => {
  const [image, setImage] = useState<string | undefined>(room?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof RoomFormSchema>>({
    resolver: zodResolver(RoomFormSchema),
    defaultValues: room || {
      title: "",
      description: "",
      bedCount: 0,
      guestCount: 0,
      bathroomCount: 0,
      kingBed: 0,
      queenBed: 0,
      image: "",
      breakFastPrice: 0,
      roomPrice: 0,
      roomService: false,
      TV: false,
      balcony: false,
      freeWifi: false,
      cityView: false,
      oceanView: false,
      forestView: false,
      mountainView: false,
      airCondition: false,
      soundProofed: false,
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

  function onSubmit(values: z.infer<typeof RoomFormSchema>) {
    setIsLoading(true);
    if (hotel && room) {
      //update room
      axios
        .patch(`/api/room/${room.id}`, { ...values })
        .then((res) => {
          toast({
            variant: "success",
            description: "Room Updated",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
        })
        .catch((error) => {
          toast({
            variant: "destructive",
            description: `ERROR! ${error.message}`,
          });
          setIsLoading(false);
        });
    } else {
      if (!hotel) return;
      //create room
      axios
        .post("/api/room", { ...values, hotelId: hotel.id })
        .then((res) => {
          toast({
            variant: "success",
            description: "🎉 Room created ",
          });
          router.refresh();
          setIsLoading(false);
          handleDialogueOpen();
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

  return (
    <div className="max-h-[75vh] overflow-y-auto px-2 pb-4">
      <Form {...form}>
        <form className="space-y-3">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Room Title *</FormLabel>
                <FormDescription>Provide your Room name</FormDescription>
                <FormControl>
                  <Input placeholder="Double Room" {...field} />
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
                <FormLabel>Room Description *</FormLabel>
                <FormDescription>
                  Is there anything special about this room
                </FormDescription>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Double bed room with ocean view"
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            <FormLabel>Choose Room Amenities</FormLabel>
            <FormDescription>
              Whats make this room a good chose?
            </FormDescription>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <FormField
                control={form.control}
                name="roomService"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>24hrs Room Service</FormLabel>
                        <HeartHandshake size={16} className="text-gray-600" />
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="TV"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>TV</FormLabel>
                        <Monitor size={16} className="text-gray-600" />
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="balcony"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>Balcony</FormLabel>
                        <Home size={16} className="text-gray-600" />
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
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
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
                name="cityView"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>City View</FormLabel>
                        <UsersRound size={16} className="text-gray-600" />
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="oceanView"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>Ocean View</FormLabel>
                        <Ship size={16} className="text-gray-600" />
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="forestView"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>Forest View</FormLabel>
                        <Trees size={16} className="text-gray-600" />
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="mountainView"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>Mountain View</FormLabel>
                        <Mountain size={16} className="text-gray-600" />
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="airCondition"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>Air Condition</FormLabel>
                        <AirVent size={16} className="text-gray-600" />
                      </span>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="soundProofed"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center gap-2 border p-3 rounded-lg">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <span className="flex items-center gap-2">
                        <FormLabel>Sound Proofed</FormLabel>
                        <EarOff size={16} className="text-gray-600" />
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
                  Upload a banner image for your room
                </FormDescription>
                <FormControl>
                  {image ? (
                    <>
                      <div className="relative max-w-[900px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4 border-2 border-dotted border-gray-400 rounded-sm">
                        <Image
                          src={image}
                          alt="room banner"
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

          <div className="flex flex-row gap-6">
            <div className="flex-1 flex flex-col gap-2 mt-2">
              <FormField
                control={form.control}
                name="roomPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Room Price in INR *</FormLabel>
                    <FormDescription>
                      State the price for staying in this room for 24 hours
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bedCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bed Count *</FormLabel>
                    <FormDescription>
                      How many beds are available in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Guest Count *</FormLabel>
                    <FormDescription>
                      How many gets are allowed in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={12} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bathroomCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathroom Count *</FormLabel>
                    <FormDescription>
                      How many bathrooms are in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={4} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex-1 flex flex-col gap-2 mt-2">
              <FormField
                control={form.control}
                name="breakFastPrice"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-1">
                    <FormLabel>Breakfast Price in INR</FormLabel>
                    <FormDescription>
                      State the price for Breakfast
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>King Bed</FormLabel>
                    <FormDescription>
                      How many King beds are available in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="queenBed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Queen Bed</FormLabel>
                    <FormDescription>
                      How many Queen beds are available in this room?
                    </FormDescription>
                    <FormControl>
                      <Input type="number" min={0} max={8} {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="pt-4 pb-2">
            {room ? (
              <Button
                onClick={form.handleSubmit(onSubmit)}
                type="button"
                disabled={isLoading}
                className="w-[150px]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin h-4 w-4" />
                    Updating
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  type="button"
                  disabled={isLoading}
                  className="w-[150px]"
                  onClick={form.handleSubmit(onSubmit)}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 animate-spin h-4 w-4" />
                      Creating
                    </>
                  ) : (
                    <>
                      <CirclePlus className="mr-2 h-4 w-4" />
                      Create Room
                    </>
                  )}
                </Button>
              </>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddRoomForm;
