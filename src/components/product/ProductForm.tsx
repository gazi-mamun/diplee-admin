"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { array, z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams, useRouter } from "next/navigation";
import { useGlobalContext } from "@/context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import toast from "react-hot-toast";

// coerce.
const formSchema = z.object({
  category: z.string(),
  sku: z.string(),
  name: z.string().min(4).max(150),
  description: z.string().min(10).max(2000),
  price: z.number().positive(),
  sale: z.optional(z.boolean()),
  discount: z.optional(z.number()),
  speciality: z.optional(z.string()),
});

export function ProductForm({ type = "add" }: { type: string }) {
  const { selectedProduct, setSelectedProduct } = useGlobalContext();
  const [categories, setCategories] = useState<any>([]);
  const params = useParams();

  const router = useRouter();

  useEffect(() => {
    const getProduct = async (id: string) => {
      try {
        const res = await axios.get(`https://api.diplee.com/products/${id}`);
        setSelectedProduct(res.data);
        form.reset(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    const getCategories = async () => {
      try {
        const res = await axios.get(`https://api.diplee.com/categories`);
        setCategories(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getCategories();

    if (type === "update" && selectedProduct === null) {
      getProduct(params.id.toString());
    }
    console.log();
  }, []);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: undefined,
      sku: undefined,
      name: undefined,
      description: undefined,
      price: undefined,
      sale: false,
      discount: 0,
      speciality: "regular",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      if (type === "add") {
        const res = await axios.post(
          "https://api.diplee.com/products",
          {
            ...values,
          },
          { withCredentials: true }
        );

        if (res) {
          router.push("/products");
        }
      } else {
        const res = await axios.patch(
          `https://api.diplee.com/products/${selectedProduct.id}`,
          {
            ...values,
          },
          { withCredentials: true }
        );

        if (res) {
          const fullurl = window.location.href;
          const url = fullurl.replace("products/update", "products/details");
          router.push(url);
          router.refresh();
        }
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  }

  const isEmpty = (value: string | null | undefined) => {
    return value == null || value.trim() === "";
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-[200px] mt-2">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((cat: any) => (
                      <SelectItem
                        key={cat.id}
                        className={`${
                          cat.name === selectedProduct?.category &&
                          "text-green-500"
                        }`}
                        value={cat.name}
                        disabled={
                          cat.name === selectedProduct?.category && true
                        }
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="ex: 1001" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="ex: HFI mens shirt" {...field} />
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
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="ex: This is a fine product"
                  id="description"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: 1299.99"
                  {...field}
                  type="number"
                  {...form.register("price", {
                    valueAsNumber: !isEmpty("price"),
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sale"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale</FormLabel>
              <RadioGroup
                // @ts-ignore
                defaultValue={field.value}
                onValueChange={field.onChange}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    // @ts-ignore
                    value={false}
                    id="option-one"
                  />
                  <Label htmlFor="option-one">False</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    // @ts-ignore
                    value={true}
                    id="option-two"
                  />
                  <Label htmlFor="option-two">True</Label>
                </div>
              </RadioGroup>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input
                  placeholder="ex: 250.00"
                  {...field}
                  type="number"
                  {...form.register("discount", {
                    valueAsNumber: !isEmpty("discount"),
                  })}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="speciality"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Speciality</FormLabel>
              <FormControl>
                <Input placeholder="ex: regular" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
