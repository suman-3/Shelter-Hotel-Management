"use client";
import * as z from "zod";
import { AddHotelFormProps } from "@/interface/AddHotelFormProps";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  Coffee,
  Dumbbell,
  Loader2,
  MonitorPlay,
  ShoppingBag,
  Sparkle,
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

const AddHotelForm = ({ hotel }: AddHotelFormProps) => {
  const [image, setImage] = useState<string | undefined>(hotel?.image);
  const [imageIsDeleting, setImageIsDeleting] = useState(false);
  const [states, setStates] = useState<IState[]>([]);
  const [cities, setCities] = useState<ICity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    getAllCountries,
    getCountryByCode,
    getStateByCode,
    getCountryStates,
    getStateCities,
  } = useLocation();

  const { toast } = useToast();

  const countries = getAllCountries();

  const form = useForm<z.infer<typeof HotlFormSchema>>({
    resolver: zodResolver(HotlFormSchema),
    defaultValues: {
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
    console.log(values);
  }

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

  return (
    <div>
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>SPA</FormLabel>
                            <Sparkle size={16} className="text-gray-600" />
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Shopping</FormLabel>
                            <ShoppingBag size={16} className="text-gray-600" />
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
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
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <span className="flex items-center gap-2">
                            <FormLabel>Swimming Pool</FormLabel>
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
                        <div className="flex items-center gap-2">
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
                          <div className="relative max-w-[400px] min-w-[200px] max-h-[400px] min-h-[200px] mt-4 border-2 border-dotted border-gray-400">
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
                          <div className="flex flex-col items-center max-w-[4000px] border-2 border-dotted border-primary/50 rounded justify-center pt-6 pb-3">
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
              </div>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AddHotelForm;
