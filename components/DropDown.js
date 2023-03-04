import { useState } from "react";
import styles from "./DropDown.module.css";

export default function DropDown(props) {
  const [selectedToken, setSelectedToken] = useState("");

  const handleChange = (event) => {
    setSelectedToken(event.target.value);
    props.onTokenChange(event.target.value);
  };

  return (
    <div className="relative w-full mx-auto">
      <select
        className="block w-full py-2 px-4 bg-blue-200 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
        value={selectedToken}
        onChange={handleChange}
      >
        <option value="" disabled hidden>
          Select a Token
        </option>
        {props.options.map((token) => (
          <option key={token.token} value={token.token}>
            {token.token}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
        <svg
          className="w-5 h-5 text-gray-400"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
        >
          <path
            d="M7 7l3-3 3 3m0 6l-3 3-3-3"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
}
