"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { icons } from "@/constants";
import { toast } from "sonner";
import api from "@/app/utils/api";
import { jwtDecode } from "jwt-decode"; // import this
import { loginSuccess } from "@/redux/slices/authSlice"; // import loginSuccess action
import { useAppDispatch, useAppSelector } from "@/redux/hooks"; // import your custom hook
import Cookies from "js-cookie";
import axios from "axios";
// Validation schema remains the same
const formSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type FormData = z.infer<typeof formSchema>;

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          username: data.email,
          password: data.password,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const { access_token } = response.data;

      // Decode the JWT to get user info
      const decodedToken: {
        sub: string;
        role: "customer" | "owner";
        exp: number;
        iat: number;
      } = jwtDecode(access_token);

      // Dispatch login success to Redux
      dispatch(
        loginSuccess({
          user: {
            id: decodedToken.sub,
            email: data.email,
          },
          accessToken: access_token,
          role: decodedToken.role,
        })
      );
      // axios.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      Cookies.set("accessToken", access_token, { expires: 7 });
      // api.defaults.headers.common["Authorization"] = `Bearer ${access_token}`;
      // Cookies.set("role", decodedToken.role, { expires: 7 });

      toast("Login Successful", {
        description: "You have been logged in successfully.",
        className: "bg-green-500/80 border border-none text-white",
      });
      
      if (decodedToken.role === "owner") {
        router.push("/orders");
      } else if (decodedToken.role === "customer") {
        router.push("/account");
      }
    } catch (err: any) {
      console.error("Login error:", err);

      let errorMessage = "Something went wrong. Please try again.";
      if (err.response) {
        if (err.response.status === 401) {
          errorMessage = "Invalid email or password.";
        } else if (err.response.status === 422) {
          errorMessage = "Validation error. Please check your input.";
        } else if (err.response.data?.message) {
          errorMessage = err.response.data.message;
        }
      }

      toast("Login Failed", {
        description: errorMessage,
        className: "bg-red-500/80 border border-none text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] pt-16">
      <div className="flex flex-col justify-center items-center pt-[80px]">
        <img
          src={icons.logoleaf.src}
          alt="logo"
          className="w-24 h-24 sm:w-auto sm:h-auto"
        />
        <h1 className="font-intersemibold text-2xl mt-6 sm:mt-8 text-center">
          Log in to Min-Jee
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full px-8 max-w-[360px]"
        >
          <div className="mb-4">
            <Input
              placeholder="Email"
              className="bg-white w-full h-[55px] font-inter mt-6 sm:mt-8 placeholder:text-[#BDC3C9] pl-4"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4 relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="bg-white w-full h-[55px] font-inter placeholder:text-[#BDC3C9] pr-10 pl-4"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="bg-camouflage-400 w-full h-[55px] font-bold mt-6 sm:mt-8"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "CONTINUE"}
          </Button>
        </form>

        <h1 className="font-inter text-[13px] mt-16 sm:mt-20 mb-16 sm:mb-28 text-center">
          <span className="text-[#BDC3C9]">Don't have an account? </span>
          <Link href="/signup">
            <span className="text-[#50A7FF] hover:underline cursor-pointer">
              Sign up!
            </span>
          </Link>
        </h1>
      </div>
    </div>
  );
};

export default LoginPage;
