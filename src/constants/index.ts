import halfsizedFoodWarmer from "../assets/images/halfsizedFoodWarmer.png";
import fullsizedFoodWarmer from "../assets/images/fullsizedFoodWarmer.png";
import ovalFoodWarmer from "../assets/images/ovalFoodWarmer.png";
import glassGoblet from "../assets/images/glassGoblet.png";
import glassCylinder from "../assets/images/glassCylinder.png";
import balloonArrangement from "../assets/images/balloonArrangement.png";
import foodCatering from "../assets/images/foodCatering.png";
import christmasParty from "../assets/images/christmasParty.png";

import landingImage from "../assets/images/landingimage.png";
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
        id: 1,
        name: "Half-Sized Food Warmer",
        category: "Rentals",
        price: "50.00",
        image: halfsizedFoodWarmer,
    },
    {
        id: 2,
        name: "Full-Sized Food Warmer",
        category: "Rentals",
        price: "75.00",
        image: fullsizedFoodWarmer,
    },
    {
        id: 3,
        name: "Oval Food Warmer",
        category: "Rentals",
        price: "70.00",
        image: ovalFoodWarmer,
    },
    {
        id: 4,
        name: "Glass Goblet",
        category: "Rentals",
        price: "5.00",
        image: glassGoblet,
    },
    {
        id: 5,
        name: "Glass Cylinder",
        category: "Rentals",
        price: "5.00",
        image: glassCylinder,
    },
    {
        id: 6,
        name: "Balloon Arrangement",
        category: "Services",
        price: "5.00",
        image: balloonArrangement,
    },
    {
        id: 7,
        name: "Food Catering",
        category: "Services",
        price: "5.00",
        image: foodCatering,
    },
    {
        id: 8,
        name: "Christmas Party",
        category: "Events",
        price: "5.00",
        image: christmasParty,
    },
];

export const BasketlistSample = [
    {
        name: "Half-Sized Food Warmer",
        category: "Rental",
        quantity: 1,
        price: 50.0,
        // image:
    },
];
