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
          passwordConf: data.passwordConf, 
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
            className: "bg-red-500/80 border border-none text-white ",
          });
        } else {
          setError(err.response.data.message || "Registration failed");
          toast("Registration Unsuccessful", {
            description:
              err.response.data.message ||
              "Your registration is unsuccessful. Please try again.",
            className: "bg-red-500/80 border border-none text-white",
          });
        }
      } else {
        setError(err.message || "Something went wrong");
        toast("Error", {
          description: "Network error occurred. Please try again.",
          className: "bg-red-500/80 border border-none text-white",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] lg:pt-20 md:pt-16 pt-12">
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
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Privacy Policy</DialogTitle>
                  <DialogDescription asChild>
                    <div className="text-left text-sm text-gray-600 space-y-4 mt-4">
                      <p className="text-xs text-gray-400">Last Updated: March 1, 2026</p>
                      
                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">1. Information We Collect</h3>
                        <p>When you create an account or place an order with Min-Jee, we collect:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Personal information (name, email, phone number, address)</li>
                          <li>Event details (date, time, location, type of event)</li>
                          <li>Payment information (processed securely through our payment providers)</li>
                          <li>Rental preferences and order history</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">2. How We Use Your Information</h3>
                        <p>We use your information to:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Process and fulfill your rental orders and event bookings</li>
                          <li>Communicate about your orders, deliveries, and pickups</li>
                          <li>Send booking confirmations and reminders</li>
                          <li>Improve our services and customer experience</li>
                          <li>Send promotional offers (with your consent)</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">3. Information Sharing</h3>
                        <p>We do not sell your personal information. We may share your information with:</p>
                        <ul className="list-disc pl-5 mt-1 space-y-1">
                          <li>Delivery partners to fulfill your orders</li>
                          <li>Payment processors to complete transactions</li>
                          <li>Service providers who assist our operations</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">4. Data Security</h3>
                        <p>We implement appropriate security measures to protect your personal information from unauthorized access, alteration, or disclosure.</p>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">5. Your Rights</h3>
                        <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">6. Contact Us</h3>
                        <p>For privacy-related inquiries, please contact our support team through the app or website.</p>
                      </section>
                    </div>
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
              <DialogContent className="max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Terms of Use</DialogTitle>
                  <DialogDescription asChild>
                    <div className="text-left text-sm text-gray-600 space-y-4 mt-4">
                      <p className="text-xs text-gray-400">Last Updated: March 1, 2026</p>
                      
                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">1. Acceptance of Terms</h3>
                        <p>By accessing or using Min-Jee's services, you agree to be bound by these Terms of Use. If you do not agree, please do not use our services.</p>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">2. Services Overview</h3>
                        <p>Min-Jee provides party rental equipment and event booking services. Our offerings include but are not limited to tables, chairs, linens, decorations, and event coordination services.</p>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">3. Rental Terms</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>Rental Period:</strong> Standard rental period is specified at checkout. Extensions may incur additional charges.</li>
                          <li><strong>Condition of Items:</strong> Items must be returned in the same condition as received. You are responsible for any damage, loss, or excessive cleaning required.</li>
                          <li><strong>Delivery & Pickup:</strong> Delivery and pickup times are estimates. We will communicate any changes promptly.</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">4. Booking & Payment</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li>A deposit may be required to confirm your booking</li>
                          <li>Full payment is due as specified in your order confirmation</li>
                          <li>Prices are subject to change but confirmed orders will honor the quoted price</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">5. Cancellation Policy</h3>
                        <ul className="list-disc pl-5 space-y-1">
                          <li><strong>More than 7 days before event:</strong> Full refund minus processing fees</li>
                          <li><strong>3-7 days before event:</strong> 50% refund</li>
                          <li><strong>Less than 3 days before event:</strong> No refund</li>
                        </ul>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">6. Liability</h3>
                        <p>You agree to use rented items responsibly. Min-Jee is not liable for injuries or damages resulting from misuse of rental items. Users are responsible for ensuring items are used safely and appropriately.</p>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">7. Account Responsibility</h3>
                        <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</p>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">8. Modifications</h3>
                        <p>Min-Jee reserves the right to modify these terms at any time. Continued use of our services constitutes acceptance of updated terms.</p>
                      </section>

                      <section>
                        <h3 className="font-semibold text-gray-800 mb-2">9. Contact</h3>
                        <p>For questions about these terms, please contact our customer support team.</p>
                      </section>
                    </div>
                  </DialogDescription>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <Button
            type="submit"
            className="bg-camouflage-400 w-full h-[55px] font-bold mt-6 sm:mt-8"
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
