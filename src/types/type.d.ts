declare interface ProductProps {
    image: any;
    name: string;
    price: number;
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
    image: any;
}

declare interface SubtotalProps {
    amount: number;
}