import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const page = () => {
    return (
        <div>
            page
            <Link href="/login">
                <Button>Helloo</Button>
            </Link>
        </div>
    );
};

export default page;
