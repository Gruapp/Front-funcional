import styles from "./Planes.module.css";
import { useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import Footer from "../footer/Footer";
import { SERVER_URL } from "../../constants/constants";

export default function Planes() {
  const [planes, setPlanes] = useState([]);

  useEffect(() => {
    fetch(`${SERVER_URL}/planes`)
      .then((response) => response.json())
      .then((data) => {
        const principalPlan = data.find((plan) => plan.principal === 1);
        const otrosPlanes = data.filter((plan) => plan.principal !== 1);

        if (data.length === 2) {
          otrosPlanes.push(principalPlan);
        } else {
          const indiceMedio = Math.floor(otrosPlanes.length / 2);
          otrosPlanes.splice(indiceMedio, 0, principalPlan);
        }

        setPlanes(otrosPlanes);
      });
  }, []);

  return (
    <div className={styles["bg-white"]}>
      <main>
        <div className={styles.contenedor}>
          <div className={styles.contenedorPrecios}>
            <div className={styles.contenedorPreciosSecundario}>
              <div className={styles.contenedorIntroduccion}>
                <h1>Precios simples, sin compromiso</h1>
                <p>Solo paga según tus necesidades.</p>
              </div>
              <div className={styles.contenedorTarjetas}>
                <div className={styles.divisor} aria-hidden="true" />
                {planes.map((plan) => (
                  <div
                    key={plan.id}
                    className={`${styles.contenedorTarjetaPlan} ${
                      plan.principal
                        ? styles.contenedorTarjetaPlanPrincipal
                        : styles.contenedorTarjetaPlanSecundario
                    }`}
                  >
                    <div className={styles.tarjetaPlan}>
                      <h2
                        id={plan.id}
                        className={`${
                          plan.principal
                            ? styles.tarjetaPlanTituloPrincipal
                            : styles.tarjetaPlanTituloSecundario
                        }`}
                      >
                        {plan.nombre}
                      </h2>
                      <div className={styles.tarjetaPlanPrecioContenedor}>
                        <div className={styles.tarjetaPlanPrecioContenedor2}>
                          <p
                            className={`${styles.precio} ${
                              plan.principal
                                ? styles.tarjetaPlanTituloPrincipal
                                : styles.tarjetaPlanTituloSecundario
                            }`}
                          >
                            {new Intl.NumberFormat("es-CO", {
                              style: "currency",
                              currency: "COP",
                            }).format(plan.precio)}
                          </p>
                          <div className={styles.contenedorMoneda}>
                            <p
                              className={`${
                                plan.principal
                                  ? styles.tarjetaPlanTituloPrincipal
                                  : styles.tarjetaPlanTituloSecundario
                              }`}
                            >
                              COP
                            </p>
                          </div>
                        </div>
                        <a
                          href={`/planes/${plan.id}`}
                          aria-describedby={plan.id}
                          className={`${styles.linkCompra} ${
                            plan.principal
                              ? styles.linkCompraPrincipal
                              : styles.linkCompraSecundario
                          }`}
                        >
                          Compra este plan
                        </a>
                      </div>
                      <div className={styles.contenedorCaracteristicas}>
                        <ul
                          role="list"
                          className={`${styles.listaCaracteristicas} ${
                            plan.principal
                              ? styles.listaCaracteristicasPrincipal
                              : styles.listaCaracteristicasSecundario
                          }`}
                        >
                          <li className={styles.caracteristica}>
                            <CheckIcon
                              className={`${styles.iconoCaracteristica} ${
                                plan.principal
                                  ? styles.iconoCaracteristicaPrincipal
                                  : styles.iconoCaracteristicaSecundario
                              }`}
                              aria-hidden="true"
                            />
                            {plan.clicks} Clicks
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
