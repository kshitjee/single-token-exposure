import styles from "./Rectangle.module.css";

export default function Rectangle(props) {
  return (
    <div className="relative flex items-center justify-center w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gray-900"></div>
      <div className="absolute inset-0 z-0 bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900"></div>
      <div className="absolute inset-0 bg-blur" style={{ backgroundImage: `url(${props.bgImage})` }}></div>
      <div className="z-10 animate-pulse">
        {props.children}
      </div>
    </div>
  );
}
