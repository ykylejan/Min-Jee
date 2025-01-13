import * as React from "react";
import { cn } from "@/lib/utils";
import { Input } from "./input";
import { Minus, Plus } from "lucide-react";


const QuantityInput = React.forwardRef<
    HTMLInputElement,
    React.ComponentProps<"input">
>(({ className, placeholder, ...props }, ref) => {
    const [value, setValue] = React.useState<number | string>("");

    const handleIncrement = () => {
        setValue((prev) => (prev === "" ? 1 : +prev + 1));
    };

    const handleDecrement = () => {
        setValue((prev) => (prev === "" ? 0 : Math.max(+prev - 1, 0)));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const parsedValue = parseInt(inputValue, 10);
        setValue(
            inputValue === ""
                ? ""
                : isNaN(parsedValue)
                ? 0
                : Math.max(parsedValue, 0)
        );
    };

    return (
        <div className="relative flex items-center w-full">
            <Input
                ref={ref}
                {...props}
                value={value}
                onChange={handleChange}
                placeholder={value === "" ? placeholder : undefined}
                className={cn(
                    "pr-12 pl-5",
                    className
                )}
            />

            <div className="absolute right-1 flex space-x-1">
                <button
                    type="button"
                    onClick={handleDecrement}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Minus size={18} />
                </button>

                <button
                    type="button"
                    onClick={handleIncrement}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );
});

QuantityInput.displayName = "QuantityInput";

QuantityInput.displayName = "QuantityInput";

export { QuantityInput };
