import React from "react";
import styles from "./Rectangle.module.css";

export default function Rectangle(props) {
  return (
    <div className="relative flex flex-col items-center justify-center w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900  animate-pulse"></div>

      <div className="absolute inset-0 bg-blur z-10"></div>
      <div className="z-20 animate-bounce text-white font-bold text-5xl tracking-wider mb-4">
        Decentralized AVM Interest Swap Platform
      </div>
      <div className="z-20 text-black text-base md:text-lg lg:text-xl font-medium mb-4 text-center w-1/10">
        {props.children}
      </div>
      <div className="z-20 text-white text-base md:text-lg lg:text-xl font-medium mb-4 text-center max-w-2xl">
        Swap your AVM assets at the best rates using our decentralized interest
        swap platform.
      </div>
      <div className="z-20 text-white text-base md:text-lg lg:text-xl font-medium mb-4 text-center max-w-2xl">
        No middlemen. No fees. Complete control of your assets.
      </div>
      <div className="z-20 text-white text-base md:text-lg lg:text-xl font-medium mb-4 text-center max-w-2xl">
        Join us and revolutionize the way you swap AVM assets.
      </div>
    </div>
  );
}

// import React from "react";
// import { Particles } from "react-tsparticles";

// export default function Rectangle(props) {
//   return (
//     <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
//       <div className="absolute inset-0 z-0 bg-white-900"></div>
//       <Particles
//         className="absolute inset-0 z-0"
//         options={{
//           background: {
//             color: {
//               value: "#000",
//             },
//           },
//           particles: {
//             number: {
//               value: 80,
//               density: {
//                 enable: true,
//                 value_area: 800,
//               },
//             },
//             color: {
//               value: "#fff",
//             },
//             shape: {
//               type: "circle",
//               stroke: {
//                 width: 0,
//                 color: "#fff",
//               },
//               polygon: {
//                 nb_sides: 5,
//               },
//               image: {
//                 src: "img/github.svg",
//                 width: 100,
//                 height: 100,
//               },
//             },
//             opacity: {
//               value: 0.5,
//               random: false,
//               anim: {
//                 enable: false,
//                 speed: 1,
//                 opacity_min: 0.1,
//                 sync: false,
//               },
//             },
//             size: {
//               value: 3,
//               random: true,
//               anim: {
//                 enable: false,
//                 speed: 40,
//                 size_min: 0.1,
//                 sync: false,
//               },
//             },
//             line_linked: {
//               enable: true,
//               distance: 150,
//               color: "#fff",
//               opacity: 0.4,
//               width: 1,
//             },
//             move: {
//               enable: true,
//               speed: 6,
//               direction: "none",
//               random: false,
//               straight: false,
//               out_mode: "out",
//               bounce: false,
//               attract: {
//                 enable: false,
//                 rotateX: 600,
//                 rotateY: 1200,
//               },
//             },
//           },
//           interactivity: {
//             detect_on: "canvas",
//             events: {
//               onhover: {
//                 enable: true,
//                 mode: "repulse",
//               },
//               onclick: {
//                 enable: true,
//                 mode: "push",
//               },
//               resize: true,
//             },
//             modes: {
//               grab: {
//                 distance: 400,
//                 line_linked: {
//                   opacity: 1,
//                 },
//               },
//               bubble: {
//                 distance: 400,
//                 size: 40,
//                 duration: 2,
//                 opacity: 8,
//               },
//               repulse: {
//                 distance: 200,
//                 duration: 0.4,
//               },
//               push: {
//                 particles_nb: 4,
//               },
//               remove: {
//                 particles_nb: 2,
//               },
//             },
//           },
//           retina_detect: true,
//         }}
//       />
//       <div className="z-10 animate-pulse">
//         {props.children}
//       </div>
//     </div>
//   );
// }

// import Head from 'next/head';
// import { motion } from 'framer-motion';
// import Particles from 'react-tsparticles';
// import { FiArrowRight } from 'react-icons/fi';

// const particlesConfig = {
//   background: {
//     color: {
//       value: '#000000',
//     },
//   },
//   particles: {
//     number: {
//       value: 160,
//       density: {
//         enable: false,
//       },
//     },
//     color: {
//       value: '#ffffff',
//     },
//     opacity: {
//       value: 0.1,
//       random: true,
//       anim: {
//         enable: true,
//         speed: 1,
//         opacity_min: 0.1,
//         sync: false,
//       },
//     },
//     size: {
//       value: 3,
//       random: true,
//       anim: {
//         enable: false,
//         speed: 4,
//         size_min: 0.3,
//         sync: false,
//       },
//     },
//     line_linked: {
//       enable: false,
//     },
//     move: {
//       enable: true,
//       random: true,
//       speed: 1,
//       direction: 'top',
//       out_mode: 'out',
//     },
//   },
//   interactivity: {
//     events: {
//       onhover: {
//         enable: true,
//         mode: 'bubble',
//       },
//       onclick: {
//         enable: true,
//         mode: 'repulse',
//       },
//     },
//     modes: {
//       bubble: {
//         distance: 250,
//         duration: 2,
//         size: 0,
//         opacity: 0,
//       },
//       repulse: {
//         distance: 400,
//         duration: 4,
//       },
//     },
//   },
// };
// const variants = {
//   initial: {
//     opacity: 0,
//     y: 200,
//   },
//   animate: {
//     opacity: 1,
//     y: 0,
//     transition: {
//       duration: 0.5,
//     },
//   },
// };
// export default function LandingPage() {
//   return (
//     <div>
//       <Head>
//         <title>Layer Zero - Home</title>
//         <meta name="description" content="Layer Zero - Building the future of web3 infrastructure" />
//       </Head>
//       <div className="relative h-screen">
//         <Particles options={particlesConfig} className="absolute inset-0 z-0" />
//         <div className="flex flex-col items-center justify-center h-full relative z-10">
//           <motion.h1
//             initial="initial"
//             animate="animate"
//             variants={variants}
//             className="text-4xl md:text-6xl text-white font-bold text-center mb-6 md:mb-10"
//           >
//             Building the future of web3 infrastructure
//           </motion.h1>
//           <motion.p
//             initial="initial"
//             animate="animate"
//             variants={variants}
//             className="text-lg md:text-2xl text-white text-center mb-8 md:mb-12 max-w-screen-md px-4"
//           >
//             Layer Zero is a decentralized, high-performance infrastructure protocol for Web 3.0. We aim to build the
//             foundation for the next generation of the internet by providing fast, reliable, and scalable solutions for
//             developers, entrepreneurs, and enterprises.
//           </motion.p>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function Rectangle(props) {
//   return (
//     <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
//       <div className="absolute inset-0 z-0 bg-black-900"></div>
//       <Particles
//         className="absolute inset-0 z-0"
//         options={{
//           background: {
//             color: {
//               value: "#000",
//             },
//           },
//           particles: {
//             number: {
//               value: 80,
//               density: {
//                 enable: true,
//                 value_area: 800,
//               },
//             },
//             color: {
//               value: "#fff",
//             },
//             shape: {
//               type: "circle",
//               stroke: {
//                 width: 0,
//                 color: "#fff",
//               },
//               polygon: {
//                 nb_sides: 5,
//               },
//               image: {
//                 src: "img/github.svg",
//                 width: 100,
//                 height: 100,
//               },
//             },
//             opacity: {
//               value: 0.5,
//               random: false,
//               anim: {
//                 enable: false,
//                 speed: 1,
//                 opacity_min: 0.1,
//                 sync: false,
//               },
//             },
//             size: {
//               value: 3,
//               random: true,
//               anim: {
//                 enable: false,
//                 speed: 40,
//                 size_min: 0.1,
//                 sync: false,
//               },
//             },
//             line_linked: {
//               enable: true,
//               distance: 150,
//               color: "#fff",
//               opacity: 0.4,
//               width: 1,
//             },
//             move: {
//               enable: true,
//               speed: 6,
//               direction: "none",
//               random: false,
//               straight: false,
//               out_mode: "out",
//               bounce: false,
//               attract: {
//                 enable: false,
//                 rotateX: 600,
//                 rotateY: 1200,
//               },
//             },
//           },
//           interactivity: {
//             detect_on: "canvas",
//             events: {
//               onhover: {
//                 enable: true,
//                 mode: "repulse",
//               },
//               onclick: {
//                 enable: true,
//                 mode: "push",
//               },
//               resize: true,
//             },
//             modes: {
//               grab: {
//                 distance: 400,
//                 line_linked: {
//                   opacity: 1,
//                 },
//               },
//               bubble: {
//                 distance: 400,
//                 size: 40,
//                 duration: 2,
//                 opacity: 8,
//               },
//               repulse: {
//                 distance: 200,
//                 duration: 0.4,
//               },
//               push: {
//                 particles_nb: 4,
//               },
//               remove: {
//                 particles_nb: 2,
//               },
//             },
//           },
//           retina_detect: true,
//         }}
//       />
//       <div className="z-10 animate-pulse">
//         {props.children}
//       </div>
//     </div>
//   );
// }
