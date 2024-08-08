'use client'
import React, { useRef, useEffect, useState } from "react";
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform, AnimatePresence } from "framer-motion";
import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";

// InfiniteMovingCards Component
export const InfiniteMovingCards = ({ items, direction = "left", speed = "fast", pauseOnHover = true }) => {
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
        return direction === "right" ? -maxX - currentX : -currentX;
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
        <div ref={containerRef} className="relative overflow-hidden w-full">
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

// UserCard Component
const UserCard = ({ user, onClick }) => (
    <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
            <CardItem translateZ="50" className="text-xl font-bold text-neutral-600 dark:text-white">
                {user.name}
            </CardItem>
            <CardItem as="p" translateZ="60" className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300">
                {user.description}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
                <Button onClick={(e) => onClick(user, { x: e.clientX, y: e.clientY })} className="rounded-full">
                    View Details
                </Button>
            </CardItem>
        </CardBody>
    </CardContainer>
);

// UserModal Component
const UserModal = ({ user, onClose, position }) => {
    const modalRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const modalVariants = {
        initial: {
            opacity: 0,
            scale: 0.8,
            x: position.x - window.innerWidth / 2,
            y: position.y - window.innerHeight / 2,
        },
        animate: {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
            },
        },
        exit: {
            opacity: 0,
            scale: 0.8,
            x: position.x - window.innerWidth / 2,
            y: position.y - window.innerHeight / 2,
            transition: {
                type: "spring",
                damping: 25,
                stiffness: 300,
                duration: 0.2,
            },
        },
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div
                    ref={modalRef}
                    className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full m-4"
                    variants={modalVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <h2 className="text-2xl font-bold mb-4 dark:text-white">{user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">{user.description}</p>
                    <p className="text-gray-800 dark:text-gray-200 mb-4">
                        Additional details about {user.name} can go here.
                    </p>
                    <Button onClick={onClose}>Close</Button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// CenterMap Component
const CenterMap = ({ coords }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(coords, 15, { animate: true });
    }, [coords, map]);
    return null;
};

// User Icon
const userIcon = new L.Icon({
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

// Main Component
export default function Home() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [showAllUsers, setShowAllUsers] = useState(true);

    const users = [
        { name: "User 1", description: "Description for User 1", coords: [26.030384, 75.482068] },
        { name: "User 2", description: "Description for User 2", coords: [50.052235, 118.243683] },
        { name: "User 3", description: "Description for User 3", coords: [26.856684, 75.599286] },
        { name: "User 4", description: "Description for User 4", coords: [29.760427, -95.369804] },
        { name: "User 5", description: "Description for User 5", coords: [27.483498, 77.709430] },
    ];

    const handleUserClick = (user, position) => {
        setSelectedUser(user);
        setModalPosition(position);
        setShowAllUsers(false);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
        setShowAllUsers(true);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            <div className="absolute inset-0 z-0">
                <MapContainer
                    center={[40.73061, -73.935242]}
                    zoom={13}
                    style={{ height: "100vh" }}
                    scrollWheelZoom={true}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {showAllUsers && users.map((user, index) => (
                        <Marker key={index} position={user.coords} icon={userIcon}>
                            <Popup>
                                <div onClick={(e) => handleUserClick(user, { x: e.clientX, y: e.clientY })}>
                                    <h3 className="text-lg font-semibold">{user.name}</h3>
                                    <p>{user.description}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    {!showAllUsers && selectedUser && (
                        <>
                            <Marker position={selectedUser.coords} icon={userIcon}>
                                <Popup>
                                    <div onClick={(e) => handleUserClick(selectedUser, { x: e.clientX, y: e.clientY })}>
                                        <h3 className="text-lg font-semibold">{selectedUser.name}</h3>
                                        <p>{selectedUser.description}</p>
                                    </div>
                                </Popup>
                            </Marker>
                            <CenterMap coords={selectedUser.coords} />
                        </>
                    )}
                </MapContainer>
            </div>
            <div className="relative z-10 flex flex-col items-center justify-between h-full">
                <motion.div
                    className="flex-grow flex items-center justify-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl font-bold text-white drop-shadow-lg">
                        Welcome to Rent Website
                    </h1>
                </motion.div>
                <div className="w-full bg-black bg-opacity-50 p-4">
                    <InfiniteMovingCards
                        items={users.map((user, index) => (
                            <UserCard key={index} user={user} onClick={handleUserClick} />
                        ))}
                        direction="right"
                        speed="slow"
                    />
                </div>
            </div>
            {selectedUser && (
                <UserModal user={selectedUser} onClose={handleCloseModal} position={modalPosition} />
            )}
            <div className="absolute top-4 right-4 z-20">
                <Button onClick={() => setShowAllUsers(true)}>Show All Users</Button>
            </div>
        </div>
    );
}
