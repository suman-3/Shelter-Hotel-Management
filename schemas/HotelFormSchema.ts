import * as z from "zod";

const HotlFormSchema = z.object({
    title: z.string().min(3, {
        message: "Title must be atleast 3 characters long",
    }),
    description: z.string().min(10, {
        message: "Description must be atleast 10 characters long",
    }),
    image: z.string().min(1, {
        message: "Image is required",
    }),
    country: z.string().min(1, {
        message: "Country is required",
    }),
    state: z.string().optional(),
    city: z.string().optional(),
    locationDescription: z.string().min(10, {
        message: "Location is required",
    }),
    gym: z.boolean().optional(),
    spa: z.boolean().optional(),
    bar: z.boolean().optional(),
    laundry: z.boolean().optional(),
    restaurent: z.boolean().optional(),
    shopping: z.boolean().optional(),
    freeParking: z.boolean().optional(),
    bikeRental: z.boolean().optional(),
    freeWifi: z.boolean().optional(),
    movieNights: z.boolean().optional(),
    swimmingPool: z.boolean().optional(),
    coffeeShop: z.boolean().optional(),
});

export default HotlFormSchema