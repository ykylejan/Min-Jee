"use client";

import ProductItem from "@/components/ProductItem";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { images } from "@/constants";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

const invoices = [
    {
        invoice: "INV001",
        paymentStatus: "Paid",
        totalAmount: "$250.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV002",
        paymentStatus: "Pending",
        totalAmount: "$150.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV003",
        paymentStatus: "Unpaid",
        totalAmount: "$350.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV004",
        paymentStatus: "Paid",
        totalAmount: "$450.00",
        paymentMethod: "Credit Card",
    },
    {
        invoice: "INV005",
        paymentStatus: "Paid",
        totalAmount: "$550.00",
        paymentMethod: "PayPal",
    },
    {
        invoice: "INV006",
        paymentStatus: "Pending",
        totalAmount: "$200.00",
        paymentMethod: "Bank Transfer",
    },
    {
        invoice: "INV007",
        paymentStatus: "Unpaid",
        totalAmount: "$300.00",
        paymentMethod: "Credit Card",
    },
];

const page = () => {
    const router = useRouter();
    const handleRowClick = (id: string) => {
        router.push(`/playground/${id}`);
    };

    const handClick = () => {
        console.log("button pressed yesyes");
        router.push("/playground/park");
    };

    const [date, setDate] = React.useState<Date>();

    return (
        <div className="">
            {/* <Card>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {invoices.map((invoice) => (
                            <TableRow key={invoice.invoice}>
                                <TableCell className="font-medium">
                                    {invoice.invoice}
                                </TableCell>
                                <TableCell>{invoice.paymentStatus}</TableCell>
                                <TableCell>{invoice.paymentMethod}</TableCell>
                                <TableCell className="text-right">
                                    {invoice.totalAmount}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">
                                $2,500.00
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </Card> */}

            {/* <Card>
                <Table>
                    <TableCaption>A list of your recent invoices.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[100px]">Invoice</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow
                            className="hover:cursor-pointer"
                            onClick={() => handleRowClick("park")}
                        >
                            <TableCell className="font-medium">
                                INV001
                            </TableCell>
                            <TableCell>Paid</TableCell>
                            <TableCell>Credit Card</TableCell>
                            <TableCell className="text-right">
                                $250.00
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </Card>

            <Button onClick={handClick}>Press Me</Button> */}

            {/* <Carousel
                opts={{
                    align: "start",
                }}
                className="w-full max-w-3xl"
            >
                <CarouselContent>
                    {Array.from({ length: 5 }).map((_, index) => (
                        <CarouselItem
                            key={index}
                            className="md:basis-1/2 lg:basis-1/3"
                        >
                            <div className="p-1">
                                <Card>
                                    <CardContent className="flex aspect-square items-center justify-center p-0">
                                        <img src="/placeholderProduct.png" alt="placeholder" className="rounded-lg"/>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel> */}

            {/* <Sheet>
                <SheetTrigger>Open</SheetTrigger>
                <SheetContent className="bg-[#778768]/70 border-[#778768]/70">
                    <SheetHeader>
                        <SheetTitle>Are you absolutely sure?</SheetTitle>
                        <SheetDescription>
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet> */}

            {/* <ScrollArea className="h-[200px] w-[350px] rounded-md border p-4">
                Jokester began sneaking into the castle in the middle of the
                night and leaving jokes all over the place: under the king's
                pillow, in his soup, even in the royal toilet. The king was
                furious, but he couldn't seem to stop Jokester. And then, one
                day, the people of the kingdom discovered that the jokes left by
                Jokester were so funny that they couldn't help but laugh. And
                once they started laughing, they couldn't stop.
            </ScrollArea> */}

            {/* <div className="bg-slate-300 aspect-square max-w-64 rounded-md mb-3">
            </div> */}
            {/* <div className="max-w-64">
                <img
                    src="/placeholderProduct.png"
                    alt="product_image"
                    className="aspect-square rounded-md mb-3"
                />
                <h1 className="text-2xl font-afacad_medium">
                    Half-Sized Food Warmer
                </h1>
                <h1 className="text-lg font-afacad">PHP 7.00 - per day</h1>
            </div> */}

            {/* <ScrollArea>
                <div className="flex space-x-8 mb-8">
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                    <ProductItem />
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea> */}

            {/* <img src="landingimage2.png" alt="landing_image" className="bg-auto"/> */}

            {/* <div className="bg-black h-screen w-full bg-cover bg-center">
                <img
                    src="/landingimage2.png"
                    alt="landing"
                    className="w-full h-full object-cover"
                />
            </div>
            <h1 className="text-green-500 text-8xl font-bold flex justify-center items-center absolute inset-0">
                Prayge
            </h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1>
            <h1>scroll</h1> */}

            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-[240px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        initialFocus
                    />
                </PopoverContent>
            </Popover>

            <RadioGroup defaultValue="option-one">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Option One</Label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Option Two</Label>
                </div>
            </RadioGroup>

            <Textarea placeholder="Write here" />

            <div className="animate-pulse">
                <div className="rounded-full bg-slate-700 h-10 w-10"></div>
            </div>

            

        </div>
    );
};

export default page;
