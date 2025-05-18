"use client";

import React, { useEffect, useState, Fragment } from "react";
import { useQuery } from "@apollo/client";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import Link from "next/link";
import { Slash } from "lucide-react";
import { IoMdHome } from "react-icons/io";
import { MdContentCopy } from "react-icons/md";
import { RootState } from "@/redux/store";
// UI Components (from your design system)
import RentalsSection from "@/components/RentalsSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// GraphQL
import apolloClient from "@/graphql/apolloClient";
import { GET_RENTAL_BY_ID } from "@/graphql/products";

// Redux
import { addToCart } from "@/redux/slices/cartSlice";

interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  placeholder?: string;
  className?: string;
  max?: number;
  disabled?: boolean;
}

const QuantityInput: React.FC<QuantityInputProps> = ({
  value,
  onChange,
  placeholder,
  className,
  max,
  disabled,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    if (!isNaN(val)) {
      if (max !== undefined) {
        onChange(Math.max(1, Math.min(val, max)));
      } else {
        onChange(Math.max(1, val));
      }
    }
  };

  return (
    <input
      type="number"
      min={1}
      max={max}
      disabled={disabled}
      className={`border border-gray-300 rounded px-4 py-2 text-base w-full ${className}`}
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
};

interface PageProps {
  params: Promise<{ id: string }>;
}

const Page = ({ params }: PageProps) => {
  const { id } = React.use(params);
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [rentalQuantity, setRentalQuantity] = useState<number>(1);
  const [isMounted, setIsMounted] = useState(false);

  const {
    data: rentalData,
    loading: rentalLoading,
    error: rentalError,
  } = useQuery(GET_RENTAL_BY_ID, {
    variables: { id },
    client: apolloClient,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const formatPrice = (price: any) => {
    if (typeof price === "number") {
      return price.toFixed(2);
    }
    if (typeof price === "string") {
      const num = parseFloat(price);
      return isNaN(num) ? price : num.toFixed(2);
    }
    return price;
  };

  const handleAddToCart = () => {
    if (!rentalData?.getRentalsById) return;

    const rental = rentalData.getRentalsById;

    const cartItem = cartItems.find((item) => item.id === rental.id);
    const existingQuantity = cartItem ? cartItem.quantity : 0;
    const totalQuantity = existingQuantity + rentalQuantity;

    if (totalQuantity > rental.currentQuantity) {
      const remaining = rental.currentQuantity - existingQuantity;
      toast.error(
        remaining > 0
          ? `Only ${remaining} more ${rental.name}(s) can be added to your cart.`
          : `${rental.name} is already fully added to your cart.`
      );
      return;
    }

    dispatch(
      addToCart({
        id: rental.id,
        name: rental.name,
        price: rental.price,
        quantity: rentalQuantity,
        image: rental.img,
        category: "rental",
      })
    );
    toast.success(`${rentalQuantity} ${rental.name}(s) added to cart`);
  };

  const handleQuantityChange = (value: number) => {
    if (!rentalData?.getRentalsById) return;

    const maxQuantity = rentalData.getRentalsById.currentQuantity;
    const newValue = Math.max(1, Math.min(value, maxQuantity));
    setRentalQuantity(newValue);
  };

  if (!isMounted) return null;
  if (rentalLoading)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">Loading...</div>
    );
  if (rentalError)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
        Error: {rentalError.message}
      </div>
    );
  if (!rentalData?.getRentalsById)
    return (
      <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
        Rental not found
      </div>
    );

  const rental = rentalData.getRentalsById;
  const isOutOfStock = rental.currentQuantity === 0;

  return (
    <div className="min-h-screen bg-[#FFFBF5] px-24 pt-44">
      <div className="flex gap-x-12 justify-center">
        <Fragment key={rental.id}>
          <div>
            <img
              src={rental.img || "/src/assets/images/halfsizedFoodWarmer.png"}
              alt={rental.name}
              className="aspect-square h-[500px] rounded-md object-cover"
            />
          </div>

          <div className="font-afacad w-1/2 px-10">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="text-lg">
                    <IoMdHome />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <Link href={"/shop"}>Shop</Link>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <Slash />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-lg">
                    {rental.name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center space-x-8 mt-3 justify-between">
              <div>
                <h1 className="text-5xl font-afacad_semibold">{rental.name}</h1>
                <h1 className="text-3xl font-afacad">
                  PHP {formatPrice(rental.price)}
                </h1>
              </div>

              <MdContentCopy
                size={25}
                className="text-[#6B7280] hover:text-black cursor-pointer"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Link copied to clipboard");
                }}
              />
            </div>

            <div className="mt-16">
              <h1 className="font-afacad_semibold text-md">Quantity</h1>
              <QuantityInput
                placeholder="Enter the amount to rent"
                className="h-12 !text-base bg-white"
                value={rentalQuantity}
                onChange={handleQuantityChange}
                max={rental.currentQuantity}
                disabled={isOutOfStock}
              />
              {isOutOfStock ? (
                <p className="text-sm text-red-500 mt-1">Out of stock</p>
              ) : (
                <p className="text-sm text-gray-500 mt-1">
                  {rental.currentQuantity} available
                </p>
              )}
            </div>

            <Button
              className="bg-[#0F172A] font-poppins_bold w-full rounded-3xl h-12 mt-5 hover:bg-[#1E293B]"
              onClick={() => {
                handleAddToCart();
                console.log(rental.id);
              }}
              disabled={isOutOfStock || rentalQuantity <= 0}
            >
              {isOutOfStock ? "Out of Stock" : "Add to basket"}
            </Button>

            <div className="mt-16">
              <h1 className="font-afacad_semibold mb-2">Description</h1>
              <p className="text-stone-800">
                {rental.description || "No description available"}
              </p>
            </div>

            <div className="mt-16">
              <h1 className="font-afacad_semibold text-base">Categories</h1>
              <Badge variant="outline" className="text-[#6B7280] font-afacad">
                Rental
              </Badge>
            </div>
          </div>
        </Fragment>
      </div>

      <div className="px-12 pt-32">
        <RentalsSection label="Related Items" />
      </div>
    </div>
  );
};

export default Page;
