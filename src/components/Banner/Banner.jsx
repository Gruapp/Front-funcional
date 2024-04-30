import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import styles from "./Banner.module.css";

export default function Banner({ mensaje, href }) {
  return (
    <div className={styles.contenedor}>
      <ExclamationTriangleIcon className={styles.icono} />
      <p>
        <a href={href}>
          {mensaje}
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
    </div>
  );
}
