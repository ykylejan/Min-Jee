import React from 'react'

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


const OrderStatusTable = ({ label }: StatusProps) => {
    const styles = statusStyles[label.toLowerCase()] || statusStyles["pending"];

    return (
        <div
            className="border w-28 px-4 py-2 rounded-lg"
            style={{ backgroundColor: styles.bg, borderColor: styles.border }}
        >

            <h1
                className="font-interbold text-center"
                style={{ color: styles.text }}
            >
                {label}
            </h1>
        </div>
    )
}

export default OrderStatusTable