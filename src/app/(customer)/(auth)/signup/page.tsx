"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import "dotenv/config";
import axios from "axios";

const formSchema = z
  .object({
    first_name: z.string().min(2, "First name must be at least 2 characters"),
    last_name: z.string().min(2, "Last name must be at least 2 characters"),
    contact_number: z.string().min(10, "Please enter a valid phone number"),
    email: z.string().email("Please enter a valid email"),
    address: z.string().min(2, "Address must be at least 2 characters"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    passwordConf: z.string(),
  })
  .refine((data) => data.password === data.passwordConf, {
    message: "Passwords don't match",
    path: ["passwordConf"],
  });

type FormData = z.infer<typeof formSchema>;

const API_URL = process.env.API_URL || "http://localhost:8000/api/v1";

const SignUpPage = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        `${API_URL}/auth/register`,
        {
          first_name: data.first_name,
          last_name: data.last_name,
          contact_number: data.contact_number,
          email: data.email,
          address: data.address,
          password: data.password,
          password_confirmation: data.passwordConf, // Changed to match common backend expectations
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      toast("Registration Successful", {
        description:
          "You have successfully registered. Please log in to your account.",
        className: "bg-green-500/80 border border-none text-white",
      });

      reset();
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Registration error:", err);

      if (err.response) {
        // Handle server response errors
        if (err.response.status === 422) {
          // Handle validation errors
          const errorMessages = Object.values(err.response.data.errors)
            .flat()
            .join(", ");
          setError(errorMessages);
          toast("Registration Unsuccessful", {
            description:
              errorMessages || "Please check your input and try again.",
            className: "bg-green-500/80 border border-none text-white",
          });
        } else {
          setError(err.response.data.message || "Registration failed");
          toast("Registration Unsuccessful", {
            description:
              err.response.data.message ||
              "Your registration is unsuccessful. Please try again.",
            className: "bg-green-500/80 border border-none text-white",
          });
        }
      } else {
        setError(err.message || "Something went wrong");
        toast("Error", {
          description: "Network error occurred. Please try again.",
          className: "bg-green-500/80 border border-none text-white",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-[80px]">
      <div className="flex flex-col justify-center items-center pt-[80px]">
        <h1 className="font-intersemibold text-2xl">Sign Up</h1>
        <h1 className="font-interlight text-sm text-[#3F454E] leading-tight max-w-[300px] text-center mt-3">
          Create your Min-jee account, and get access to an enhanced ordering
          experience
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="px-8 w-full max-w-[360px]"
        >
          {error && (
            <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm mb-4 text-center">
              {success}
            </div>
          )}

          <Input
            placeholder="First Name"
            className="bg-white w-full h-[55px] font-inter mt-6 sm:mt-8 placeholder:text-[#BDC3C9] pl-4"
            {...register("first_name")}
          />
          {errors.first_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.first_name.message}
            </p>
          )}

          <Input
            placeholder="Last Name"
            className="bg-white w-full h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9] pl-4"
            {...register("last_name")}
          />
          {errors.last_name && (
            <p className="text-red-500 text-xs mt-1">
              {errors.last_name.message}
            </p>
          )}

          <Input
            placeholder="Contact Number"
            className="bg-white w-full h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9] pl-4"
            {...register("contact_number")}
          />
          {errors.contact_number && (
            <p className="text-red-500 text-xs mt-1">
              {errors.contact_number.message}
            </p>
          )}

          <Input
            placeholder="Email"
            className="bg-white w-full h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9] pl-4"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
          <Input
            placeholder="Address"
            className="bg-white w-full h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9] pl-4"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-red-500 text-xs mt-1">
              {errors.address.message}
            </p>
          )}

          <Input
            type="password"
            placeholder="Password"
            className="bg-white w-full h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9] pl-4"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}

          <Input
            type="password"
            placeholder="Confirm Password"
            className="bg-white w-full h-[55px] font-inter mt-2 sm:mt-3 placeholder:text-[#BDC3C9] pl-4"
            {...register("passwordConf")}
          />
          {errors.passwordConf && (
            <p className="text-red-500 text-xs mt-1">
              {errors.passwordConf.message}
            </p>
          )}

          <div className="font-interlight text-sm text-[#3F454E] leading-tight max-w-[350px] text-center mt-16">
            By creating an account, you agree to Min-Jee's{" "}
            <Dialog>
              <DialogTrigger>
                <span className="underline hover:font-bold cursor-pointer">
                  Privacy Policy
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                  <DialogDescription>
                    {/* Add your actual privacy policy content here */}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
            <span> and </span>
            <Dialog>
              <DialogTrigger>
                <span className="underline hover:font-bold cursor-pointer">
                  Terms of Use
                </span>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Terms of Use</DialogTitle>
                  <DialogDescription>
                    {/* Add your actual terms of use content here */}
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            type="submit"
            className="bg-[#778768] w-full h-[55px] font-bold mt-6 sm:mt-8"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "SIGN UP"}
          </Button>
        </form>

        <h1 className="font-inter text-[13px] mt-20 mb-28">
          <span className="text-[#BDC3C9]">Already have an account? </span>
          <Link href="/login">
            <span className="text-[#50A7FF] hover:underline cursor-pointer">
              Log In.
            </span>
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default SignUpPage;
