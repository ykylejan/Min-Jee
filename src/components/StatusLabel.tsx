import React from "react";

interface StatusProps {
    label: string;
    size?: "default" | "sm";
}

// Define styles for each status
const statusStyles: Record<
    string,
    { bg: string; border: string; text: string }
> = {
    pending: { bg: "#FFE4B9", border: "#FEC15F", text: "#FF9D00" },
    verified: { bg: "#A6E7D8", border: "#00B087", text: "#008767" },
    rejected: { bg: "#FFC5C5", border: "#DF0404", text: "#DF0404" },
    completed: { bg: "#F9FBFF", border: "#D2D6DA", text: "#6B7280" },
};

const StatusLabel = ({ label, size = "default" }: StatusProps) => {
    const styles = statusStyles[label.toLowerCase()] || statusStyles["pending"]; // Default if the label doesn't match (aka customer didnt place order yet)

    const sizeClasses = size === "sm" 
        ? "px-2.5 py-0.5 text-xs" 
        : "px-5 h-7 w-28 text-[13px]";

    return (
        <div
            className={`border rounded-full flex items-center justify-center ${sizeClasses}`}
            style={{ backgroundColor: styles.bg, borderColor: styles.border }}
        >
            <span
                className={`font-interbold whitespace-nowrap`}
                style={{ color: styles.text }}
            >
                {label}
            </span>
        </div>
    );
};

export default StatusLabel;
