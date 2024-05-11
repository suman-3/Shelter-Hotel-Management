import * as z from "zod";
const RoomFormSchema = z.object({
  title: z.string().min(3, {
    message: "Title must be at least 3 characters long",
  }),
  description: z.string().min(10, {
    message: "Description must be atleast 10 characters long",
  }),
  bedCount: z.coerce.number().min(1, {
    message: "Bed Count is required and must be atleast 1",
  }),
  bathroomCount: z.coerce.number().min(1, {
    message: "Bed Count is required and must be atleast 1",
  }),
  guestCount: z.coerce.number().min(1, {
    message: "Guest Count is Required",
  }),
  kingBed: z.coerce.number().min(0),
  queenBed: z.coerce.number().min(0),
  image: z.string().min(1, {
    message: "Image is required",
  }),
  breakFastPrice: z.coerce.number().optional(),
  roomPrice: z.coerce.number().min(1, {
    message: "Room Price is required",
  }),
  roomService: z.boolean().optional(),
  TV: z.boolean().optional(),
  balcony: z.boolean().optional(),
  freeWifi: z.boolean().optional(),
  cityView: z.boolean().optional(),
  oceanView: z.boolean().optional(),
  forestView: z.boolean().optional(),
  mountainView: z.boolean().optional(),
  airCondition: z.boolean().optional(),
  soundProofed: z.boolean().optional(),
});

export default RoomFormSchema;