import React, { useRef, useEffect } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "framer-motion";

export const InfiniteMovingCards = ({
                                        items,
                                        direction = "left",
                                        speed = "fast",
                                        pauseOnHover = true,
                                    }) => {
    const containerRef = useRef(null);
    const scrollRef = useRef(null);

    const x = useMotionValue(0);
    const springConfig = { damping: 50, stiffness: 400 };
    const springX = useSpring(x, springConfig);

    const containerWidth = useMotionValue(0);
    const scrollWidth = useMotionValue(0);

    useEffect(() => {
        const measureWidths = () => {
            if (containerRef.current && scrollRef.current) {
                containerWidth.set(containerRef.current.offsetWidth);
                scrollWidth.set(scrollRef.current.scrollWidth);
            }
        };

        measureWidths();
        window.addEventListener("resize", measureWidths);

        return () => {
            window.removeEventListener("resize", measureWidths);
        };
    }, [containerWidth, scrollWidth]);

    const translateX = useTransform(springX, (currentX) => {
        const maxX = scrollWidth.get() - containerWidth.get();
        return direction === "right"
            ? -maxX - currentX
            : -currentX;
    });

    const multiplier = speed === "fast" ? 1 : speed === "slow" ? 0.5 : 0.75;

    useAnimationFrame((t) => {
        const currentX = x.get();
        const maxX = scrollWidth.get() - containerWidth.get();

        if (maxX <= 0) return;

        const newX = (currentX + multiplier) % maxX;
        x.set(newX);
    });

    return (
        <div
            ref={containerRef}
            className="relative overflow-hidden"
            style={{ width: "100%" }}
        >
            <motion.div
                ref={scrollRef}
                style={{ x: translateX }}
                className="flex gap-4 py-4"
                whileHover={pauseOnHover ? "pause" : ""}
                variants={{ pause: { animationPlayState: "paused" } }}
            >
                {items}
                {items}
            </motion.div>
        </div>
    );
};
