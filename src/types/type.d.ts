declare interface ProductProps {
    image: any;
    name: string;
    price: string;
    className?: string;
}

declare interface OrderItemProps {
    name: string;
    date: string;
    address: string;
    children?: any;
    onClick?: any;
}

declare interface OrderSideItemProps {
    name: string;
    category: string;
    quantity: number;
    price: number;
    id: string;
    image: any;
}

declare interface SubtotalProps {
    amount: number;
}

declare interface EditAccountProps {
    firstname?: string;
    lastname?: string;
    email?: string;
    contactNumber?: string;
    password?: string;
    address?: string;
}