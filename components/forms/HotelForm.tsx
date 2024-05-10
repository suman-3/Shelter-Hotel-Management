import React from "react";
import * as z from "zod";
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import HotlFormSchema from "@/schemas/HotelFormSchema";
import { Control, FieldPath } from "react-hook-form";
import { Input } from "../ui/input";

interface HotelFormFields {
    name: FieldPath<z.infer<typeof HotlFormSchema>>;
    placeHolder: string;
    label: string;
    control: Control<z.infer<typeof HotlFormSchema>>;
    description: string;
}
const HotelForm = ({
    name,
    placeHolder,
    label,
    control,
    description,
}: HotelFormFields) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{label}</FormLabel>
                    <FormDescription>{description}</FormDescription>
                    <FormControl>
                        <Input
                            {...field}
                            placeholder={placeHolder}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

export default HotelForm;
