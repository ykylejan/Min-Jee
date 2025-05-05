import halfsizedFoodWarmer from "../assets/images/halfsizedFoodWarmer.png";
import fullsizedFoodWarmer from "../assets/images/fullsizedFoodWarmer.png";
import ovalFoodWarmer from "../assets/images/ovalFoodWarmer.png";
import glassGoblet from "../assets/images/glassGoblet.png";
import glassCylinder from "../assets/images/glassCylinder.png";
import balloonArrangement from "../assets/images/balloonArrangement.png";
import foodCatering from "../assets/images/foodCatering.png";
import christmasParty from "../assets/images/christmasParty.png";

import landingImage from "../assets/images/landingimage.png";
import landingDim from "../assets/images/landingdim.png";
import landingPackage1 from "../assets/images/landingPackage1.png";
import landingPackage2 from "../assets/images/landingPackage2.png";

import gcash from "../assets/icons/gcash.png";
import gcashActive from "../assets/icons/gcash-active.png";
import wallet from "../assets/icons/wallet.png";
import walletActive from "../assets/icons/wallet-active.png";

import logoleaf from "../assets/icons/leaflogo.svg";

export const images = {
    halfsizedFoodWarmer,
    fullsizedFoodWarmer,
    ovalFoodWarmer,

    landingImage,
    landingDim,
    landingPackage1,
    landingPackage2,
};

export const icons = {
    gcash,
    gcashActive,
    wallet,
    walletActive,
    logoleaf,
};

export const ProductsDataSample = [
    {
        id: "halfsized-food-warmer",
        name: "Half-Sized Food Warmer",
        category: "Rentals",
        price: 50.00,
        image: halfsizedFoodWarmer,
    },
    {
        id: "fullsized-food-warmer",
        name: "Full-Sized Food Warmer",
        category: "Rentals",
        price: 75.00,
        image: fullsizedFoodWarmer,
    },
    {
        id: "oval-food-warmer",
        name: "Oval Food Warmer",
        category: "Rentals",
        price: 70.00,
        image: ovalFoodWarmer,
    },
    {
        id: "glass-goblet",
        name: "Glass Goblet",
        category: "Rentals",
        price: 5.00,
        image: glassGoblet,
    },
    {
        id: "glass-cylinder",
        name: "Glass Cylinder",
        category: "Rentals",
        price: 5.00,
        image: glassCylinder,
    },
    {
        id: "balloon-arrangement",
        name: "Balloon Arrangement",
        category: "Services",
        price: 5.00,
        image: balloonArrangement,
    },
    {
        id: "food-catering",
        name: "Food Catering",
        category: "Services",
        price: 5.00,
        image: foodCatering,
    },
    {
        id: "christmas-party",
        name: "Christmas Party",
        category: "Events",
        price: 5.00,
        image: christmasParty,
    },
];

export const BasketlistSample = [
    {
        id: 1,
        name: "Half-Sized Food Warmer",
        category: "Rental",
        quantity: 1,
        price: 70.00,
        image: halfsizedFoodWarmer,
    },
    {
        id: 2,
        name: "Glass Goblet",
        category: "Rental",
        quantity: 24,
        price: 10.00,
        image: glassGoblet,
    },
    {
        id: 3,
        name: "Food Catering",
        category: "Services",
        quantity: 1,
        price: 750.00,
        image: foodCatering,
    },

];

export const AccountSample = [
    {
        id: 1,
        firstName: "Art",
        lastName: "Montebon",
        email: "arkiart@gmail.com",
        contactNumber: "09963355454",
        password: "Test123!",
        address: "No location addresss",
    },
]


export const AllProductsSample = [
    {
        id: 1,
        productName: "Plastic Chair",
        category: "Rental",
        price: "5.00",
        currentQuantity: 120,
        maxQuantity: 200 
    },
    {
        id: 2,
        productName: "Square Table",
        category: "Rental",
        price: "35.00",
        currentQuantity: 9,
        maxQuantity: 165 
    },
]

export const AllCustomerSample = [
    {
        id: "2552fc27-9126-4c84-b341-8ddb580d13a1",
        customerName: "Aurram Blade",
        phoneNumber: "0998 765 4321",
        bookings: 8,
        email: "kyldellatan@gmail.com",
        status: "Active"
    },
    {
        id: 2,
        customerName: "Arboria Blade",
        phoneNumber: "0999 999 9999",
        bookings: 3,
        email: "arboria@gmail.com",
        status: "Active"
    },
    {
        id: 3,
        customerName: "Catasia Blade",
        phoneNumber: "0999 999 9999",
        bookings: 17,
        email: "arboria@gmail.com",
        status: "Inactive"
    },
]

export const AllPartnerSample = [
    {
        id: "0697f676-9049-4325-83a8-41b87674b4bc",
        partnerName: "Meteor Light",
        phoneNumber: "09987654321",
        category: "Catering",
        address: "03 Black Shroud, New Gridania, Aldenard",
    },
    {
        id: 2,
        partnerName: "Azem Crystal",
        phoneNumber: "09977545412",
        category: "Technicals",
        address: "The Mother Crystal, ???",
    }
]

export const AllHistorySample = [
    {
        id: 1,
        customerName: "Sean Arnado",
        phoneNumber: "099876565655",
        catergory: "Event",
        paymentStatus: "Completed",
    },
    {
        id: 2,
        customerName: "Sean Arnado",
        phoneNumber: "099876565655",
        catergory: "Event",
        paymentStatus: "Pending",
    },
]
