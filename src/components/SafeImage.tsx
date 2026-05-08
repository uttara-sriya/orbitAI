"use client";

import Image, { ImageProps } from "next/image";
import { useState } from "react";

interface SafeImageProps extends ImageProps {
    fallback?: string;
}

export default function SafeImage({
    src,
    alt,
    fallback = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800", // Beautiful generic travel fallback
    ...props
}: SafeImageProps) {
    const [imgSrc, setImgSrc] = useState(src);
    const [error, setError] = useState(false);

    return (
        <Image
            {...props}
            src={error ? fallback : imgSrc}
            alt={alt}
            onError={() => {
                setError(true);
            }}
        />
    );
}
