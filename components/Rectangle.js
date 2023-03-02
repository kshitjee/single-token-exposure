import styles from "./Rectangle.module.css";

export default function Rectangle(props) {
  return (
    <div className={styles.box}>
      <div className={styles.box}>{props.children}</div>
    </div>
  );
}
