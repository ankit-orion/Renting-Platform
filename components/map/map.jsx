"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import mapImage from "@/public/assests/images/mapImage.png";
import Slider from "react-slick";
import { motion, AnimatePresence } from "framer-motion";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const UserCard = ({ user, onClick }) => (
    <motion.div
        className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md m-2 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={(e) => onClick(user, { x: e.clientX, y: e.clientY })}
    >
        <h3 className="text-xl font-semibold">{user.name}</h3>
        <p className="text-gray-600">{user.description}</p>
    </motion.div>
);

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
                    className="bg-white p-6 rounded-lg max-w-md w-full m-4"
                    variants={modalVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                >
                    <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
                    <p className="text-gray-600 mb-4">{user.description}</p>
                    <p className="text-gray-800 mb-4">
                        Additional details about {user.name} can go here.
                    </p>
                    <button
                        onClick={onClose}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Close
                    </button>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default function MapComponent() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                },
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                },
            },
        ],
    };

    const users = [
        { name: "User 1", description: "Description for User 1" },
        { name: "User 2", description: "Description for User 2" },
        { name: "User 3", description: "Description for User 3" },
        { name: "User 4", description: "Description for User 4" },
        { name: "User 5", description: "Description for User 5" },
    ];

    const handleUserClick = (user, position) => {
        setSelectedUser(user);
        setModalPosition(position);
    };

    const handleCloseModal = () => {
        setSelectedUser(null);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden">
            <motion.div
                className="absolute inset-0 z-0"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            >
                <Image
                    src={mapImage}
                    alt={"Map_Background"}
                    layout="fill"
                    objectFit="cover"
                    priority={true}
                    className="opacity-80"
                />
            </motion.div>
            <div className="relative z-10 flex flex-col items-center justify-between h-full">
                <motion.div
                    className="flex-grow flex items-center justify-center"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6 }}
                >
                    <h1 className="text-6xl font-bold text-white">
                        Welcome to Rent Website
                    </h1>
                </motion.div>
                <div className="w-full bg-black bg-opacity-50 p-4">
                    <Slider {...settings}>
                        {users.map((user, index) => (
                            <UserCard key={index} user={user} onClick={handleUserClick} />
                        ))}
                    </Slider>
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
