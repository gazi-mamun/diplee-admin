"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { useState } from "react";
import { Button } from "../ui/button";
import Dropzone from "@/components/Dropzone";
import axios, { AxiosError } from "axios";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

type Image = {
  id: number;
  url: string;
  type: string;
  productId: string;
};

function ProductImgGal({
  data,
  productId,
  primaryProductImage,
}: {
  data: [Image];
  productId: string;
  primaryProductImage: string;
}) {
  const [images, setImages] = useState<any>([]);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let formData = new FormData();

    {
      images?.map((image: File) => {
        formData.append("images", image);
      });
    }

    try {
      const res = await axios.patch(
        `https://api.diplee.com/products/${productId}`,
        formData,
        { withCredentials: true }
      );
      if (res) {
        router.refresh();
        setImages([]);
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  const removeImage = (selectedImage: File) => {
    const newImages = [...images];

    const filteredImages = newImages.filter((img: File) => {
      return img != selectedImage;
    });

    setImages(filteredImages);
  };

  const formatFileSize = (bytes: any, decimalPoint: any) => {
    if (bytes === 0) return "0 Bytes";
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  const handleDelete = async (id: any) => {
    try {
      const res = await axios.delete(
        `https://api.diplee.com/product-images/${id}`,
        { withCredentials: true }
      );
      if (res) {
        router.refresh();
        toast.success("Image has been successfully deleted");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };
  const makePrimary = async (id: any) => {
    try {
      const res = await axios.patch(
        `https://api.diplee.com/product-images/${id}`,
        { type: "PRIMARY" },
        { withCredentials: true }
      );
      if (res) {
        router.refresh();
        toast.success("The image has been set as the primary product image");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      } else {
        throw error;
      }
    }
  };

  return (
    <div className="my-5">
      <form onSubmit={handleSubmit} className="mb-5 w-full">
        <Dropzone images={images} setImages={setImages} />
        <ol className="mt-4">
          {images.map((image: File, index: number) => (
            <li key={index} className="flex items-center">
              <p>
                {index + 1}. {image.name} ({formatFileSize(image.size, 2)})
              </p>
              <div
                className="ml-4 cursor-pointer hover:bg-gray-100 p-3 rounded"
                onClick={() => removeImage(image)}
              >
                <Trash2 size={18} color="red" />
              </div>
            </li>
          ))}
        </ol>
        {images?.length > 0 && <Button type="submit">Upload</Button>}
      </form>
      <div className="mt-10 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {data.map((image) => (
          <div key={image?.id}>
            <BlurImage
              image={image}
              primaryProductImage={primaryProductImage}
            />
            <div className="pt-3">
              {image.type == "PRIMARY" || primaryProductImage == image.url ? (
                <Button
                  className="w-full rounded-none"
                  variant="destructive"
                  onClick={() => handleDelete(image?.id)}
                >
                  Delete
                </Button>
              ) : (
                <>
                  <Button
                    className="w-1/2 rounded-none"
                    variant="default"
                    onClick={() => makePrimary(image?.id)}
                  >
                    Make it Primary
                  </Button>
                  <Button
                    className="w-1/2 rounded-none"
                    variant="destructive"
                    onClick={() => handleDelete(image?.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BlurImage({
  image,
  primaryProductImage,
}: {
  image: Image;
  primaryProductImage: string;
}) {
  const [isLoading, setLoading] = useState(true);

  return (
    <div className="group">
      <div
        className={`aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-200 border-2
      ${primaryProductImage == image?.url && "border-black"}`}
      >
        <Image
          alt=""
          src={`https://api.diplee.com/${image?.url}`}
          fill
          style={{ objectFit: "cover" }}
          sizes="100%"
          className={cn(
            "duration-700 ease-in-out group-hover:opacity-75 cursor-pointer",
            isLoading
              ? "scale-110 blur-2xl grayscale"
              : "scale-100 blur-0 grayscale-0"
          )}
          onLoad={() => setLoading(false)}
        />
      </div>
    </div>
  );
}

export default ProductImgGal;
