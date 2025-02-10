import React from "react";

interface StatusProps {
    label: string;
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

const StatusLabel = ({ label }: StatusProps) => {
    const styles = statusStyles[label.toLowerCase()] || statusStyles["pending"]; // Default to "pending" if the label doesn't match

    return (
        <div
            className={`border px-5 rounded-full flex items-center justify-center w-28 h-7`}
            style={{ backgroundColor: styles.bg, borderColor: styles.border }}
        >
            <h1
                className="text-[13px] font-interbold"
                style={{ color: styles.text }}
            >
                {label}
            </h1>
        </div>
    );
};

export default StatusLabel;
