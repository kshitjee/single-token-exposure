import { useState } from "react";
import styles from "./DropDown.module.css";

export default function DropDown(props) {
  const [selectedToken, setSelectedToken] = useState("");

  const handleChange = (event) => {
    setSelectedToken(event.target.value);
    props.onTokenChange(event.target.value);
  };

  return (
    <div className={styles.container}>
      <select
        className={styles.dropdown}
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
      <div className={styles["dropdown-arrow"]}></div>
    </div>
  );
}
