import React from "react";
import Particles from "react-tsparticles";
import { ArrowNarrowDownIcon } from "@heroicons/react/solid";

const LandingPage = () => {
    const particlesOptions = {
        background: {
            color: {
                value: "#000000",
            },
        },
        fpsLimit: 60,
        interactivity: {
            detectsOn: "canvas",
            events: {
                onClick: {
                    enable: true,
                    mode: "push",
                },
                onHover: {
                    enable: true,
                    mode: "repulse",
                },
                resize: true,
            },
            modes: {
                bubble: {
                    distance: 400,
                    duration: 2,
                    opacity: 0.8,
                    size: 40,
                },
                push: {
                    quantity: 4,
                },
                repulse: {
                    distance: 100,
                    duration: 0.4,
                },
            },
        },
        particles: {
            color: {
                value: "#ffffff",
            },
            links: {
                color: "#ffffff",
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
            },
            collisions: {
                enable: true,
            },
            move: {
                direction: "none",
                enable: true,
                outMode: "bounce",
                random: false,
                speed: 6,
                straight: false,
            },
            number: {
                density: {
                    enable: true,
                    value_area: 800,
                },
                value: 80,
            },
            opacity: {
                value: 0.5,
            },
            shape: {
                type: "circle",
            },
            size: {
                random: true,
                value: 5,
            },
        },
        detectRetina: true,
    };

    return (
        <div className="flex flex-col items-center justify-center w-screen h-screen">
            <Particles className="absolute inset-0 z-0" options={particlesOptions} />
            <div className="relative flex flex-col items-center justify-center z-10 px-6 md:px-24 text-center">
                <h1 className="text-4xl font-bold tracking-wide text-white md:text-6xl">
                    Welcome to My Website
                </h1>
                <p className="mt-6 text-lg font-medium text-gray-300 md:text-xl">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut euismod,
                    turpis sed vehicula blandit, velit quam interdum velit, sed mattis
                    sapien eros quis quam.
                </p>
                <button className="inline-flex items-center justify-center px-8 py-3 mt-8 text-lg font-medium tracking-wide text-white transition-colors duration-200 bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    Get Started
                    <ArrowNarrowDownIcon className="w-5 h-5 ml-2" />
                </button>
            </div>
        </div>
    );
};

export default LandingPage;
