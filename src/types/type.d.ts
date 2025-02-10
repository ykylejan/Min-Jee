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
}