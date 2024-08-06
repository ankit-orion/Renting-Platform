"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GoogleMapsEmbed } from '@next/third-parties/google';
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Button } from "@/components/ui/button";

const users = [
    { name: "User 1", description: "Description for User 1", coords: [26.030384, 75.482068] },
    { name: "User 2", description: "Description for User 2", coords: [50.052235, 118.243683] },
    { name: "User 3", description: "Description for User 3", coords: [26.856684, 75.599286] },
    { name: "User 4", description: "Description for User 4", coords: [29.760427, -95.369804] },
    { name: "User 5", description: "Description for User 5", coords: [51.507351, -0.127758] },
];

const UserCard = ({ user, onClick }) => (
    <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
            <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
            >
                {user.name}
            </CardItem>
            <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
            >
                {user.description}
            </CardItem>
            <CardItem translateZ="100" className="w-full mt-4">
                <Button
                    onClick={(e) => onClick(user, { x: e.clientX, y: e.clientY })}
                    className="rounded-full"
                >
                    View Details
                </Button>
            </CardItem>
        </CardBody>
    </CardContainer>
);

const UserModal = ({ user, onClose, position }) => {
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
                    <Button onClick={onClose}>
                        Close
                    </Button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const CustomSlider = ({ value, onChange, min, max }) => {
    const handleChange = (e) => {
        onChange(Number(e.target.value));
    };

    return (
        <div className="w-full">
            <input
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between mt-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">{min + 1}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{value + 1}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{max + 1}</span>
            </div>
        </div>
    );
};

export default function Home() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [currentUserIndex, setCurrentUserIndex] = useState(0);

    const handleUserClick = (user, position) => {
        setSelectedUser(user);
        setModalPosition(position);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    const handleSliderChange = (value) => {
        setCurrentUserIndex(value);
    };

    const currentUser = users[currentUserIndex];

    return (
        <div className="relative w-full h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
            <div className="absolute inset-0 z-0">
                <GoogleMapsEmbed
                    apiKey="AIzaSyC5KJ8XCFe-_6wnbz8aF4wxBFO9dkVdvJw"
                    height="100vh"
                    width="100%"
                    mode="place"
                    q={`${currentUser.coords[0]},${currentUser.coords[1]}`}
                />
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
                    <UserCard user={currentUser} onClick={handleUserClick} />
                    <div className="mt-4">
                        <CustomSlider
                            value={currentUserIndex}
                            onChange={handleSliderChange}
                            min={0}
                            max={users.length - 1}
                        />
                    </div>
                </div>
            </div>
            {selectedUser && (
                <UserModal
                    user={selectedUser}
                    onClose={handleCloseModal}
                    position={modalPosition}
                />
            )}
        </div>
    );
}
