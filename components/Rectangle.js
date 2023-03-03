// import styles from "./Rectangle.module.css";

// export default function Rectangle(props) {
//   return (
//     <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
//       <div className="absolute inset-0 z-0 bg-gray-900"></div>
//       <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900"></div>
//       <div className="absolute inset-0 bg-blur" style={{ backgroundImage: `url(${props.bgImage})` }}></div>
//       <div className="z-10 animate-pulse">
//         {props.children}
//       </div>
//     </div>
//   );
// }

import React from "react";
import { Particles } from "react-tsparticles";

export default function Rectangle(props) {
  return (
    <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gray-900"></div>
      <Particles
        className="absolute inset-0 z-0"
        options={{
          background: {
            color: {
              value: "#000",
            },
          },
          particles: {
            number: {
              value: 80,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: "#fff",
            },
            shape: {
              type: "circle",
              stroke: {
                width: 0,
                color: "#fff",
              },
              polygon: {
                nb_sides: 5,
              },
              image: {
                src: "img/github.svg",
                width: 100,
                height: 100,
              },
            },
            opacity: {
              value: 0.5,
              random: false,
              anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false,
              },
            },
            size: {
              value: 3,
              random: true,
              anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false,
              },
            },
            line_linked: {
              enable: true,
              distance: 150,
              color: "#fff",
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 6,
              direction: "none",
              random: false,
              straight: false,
              out_mode: "out",
              bounce: false,
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: "canvas",
            events: {
              onhover: {
                enable: true,
                mode: "repulse",
              },
              onclick: {
                enable: true,
                mode: "push",
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          retina_detect: true,
        }}
      />
      <div className="z-10 animate-pulse">
        {props.children}
      </div>
    </div>
  );
}

