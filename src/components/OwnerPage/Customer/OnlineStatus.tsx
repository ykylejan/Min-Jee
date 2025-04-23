import React from 'react'


interface OnlineStatusProps {
    status: string;
}

const OnlineStatus = ({ status }: OnlineStatusProps) => {
    return (
        <div>
            {status === "Active" ? (
                <div className="flex items-center gap-x-3">
                    <div className="rounded-full bg-[#A6E7D8] border border-[#008767] w-2 h-2" />
                    <h1>{status}</h1>
                </div>
            ) : status === "Inactive" ? (
                <div className="flex items-center gap-x-3">
                    <div className="rounded-full bg-[#FFC5C5] border border-[#DF0404] w-2 h-2" />
                    <h1>{status}</h1>
                </div>
            ) : (
                <div className="">

                </div>
            )}
        </div >
    )
}

export default OnlineStatus