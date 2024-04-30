import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SERVER_URL } from "../../constants/constants";
import { useSelector } from "react-redux";
import ModalSimple from "../Modales/Simple/ModalSimple";
import styles from "./Checkout.module.css";
import { TicketIcon } from "@heroicons/react/24/solid";

export default function Checkout() {
  const { idPlan } = useParams();
  const [plan, setPlan] = useState({});
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [error, setError] = useState(false);
  const idClienteAutenticado = useSelector(
    (state) => state.client?.client?.idCliente
  );

  useEffect(() => {
    fetch(`${SERVER_URL}/planes/${idPlan}`)
      .then((response) => response.json())
      .then((data) => {
        setPlan(data[0]);
      });
  }, [idPlan]);

  const handleCardNumberChange = (event) => {
    if (event.target.value.length > 19) return;
    if (isNaN(event.target.value.replace(/\s+/g, ""))) return;
    let value = event.target.value
      .replace(/\s+/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setCardNumber(value);
  };

  const pagarPlan = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const cardNumber = formData.get("card-number");
    const expirationDate = formData.get("expiration-date");
    const cvc = formData.get("cvc");
    if (!cardNumber || !expirationDate || !cvc) {
      setOpen(true);
      setTitle("Error de validación");
      setMessage(
        "Por favor complete todos los campos:" +
          (!cardNumber ? " Número de tarjeta," : "") +
          (!expirationDate ? " Fecha de expiración," : "") +
          (!cvc ? " CVC" : "")
      );
      setError(true);
      return;
    }
    const response = await fetch(`${SERVER_URL}/pagos/pagar/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idPlan, idCliente: idClienteAutenticado }),
    });

    if (response.ok) {
      setOpen(true);
      setTitle("Pago exitoso");
      setMessage("El pago se realizó correctamente");
      setError(false);
    } else {
      setOpen(true);
      setTitle("Error al pagar");
      setMessage("Hubo un error al procesar el pago");
      setError(true);
    }
  };

  return (
    <div className={styles.contenedorPrincipal}>
      <ModalSimple
        open={open}
        setOpen={setOpen}
        title={title}
        message={message}
        buttonAction={() => {
          if (!error) window.location.href = "/";
        }}
        error={error}
      />
      <div className={styles.mitadIzquierda} aria-hidden="true" />
      <div className={styles.mitadDerecha} aria-hidden="true" />

      <main className= {styles.mainClass}>
        <h1 className={styles.srOnly}>Checkout</h1>

        <section
          aria-labelledby="summary-heading"
          className={styles.seccionDerecha}
        >
          <div className={styles.contenedorSeccionDerecha}>
            <h2 id="summary-heading" className={styles.srOnly}>
              Resumen
            </h2>

            <dl>
              <dt className={styles.tituloDerecha}>Monto a pagar</dt>
              <dd className={styles.precioDerecha}>
                {Intl.NumberFormat("es-CO", {
                  style: "currency",
                  currency: "COP",
                }).format(plan?.precio)}{" "}
                COP
              </dd>
            </dl>

            <ul role="list" className={styles.listaDerecha}>
              {
                <li className={styles.listaItemDerecha}>
                  <TicketIcon className={styles.iconoDerecha} />
                  <div className={styles.contenedorInfoDerecha}>
                    <h3 className={styles.textWhite}>{plan?.nombre}</h3>
                    <p>{plan?.clicks} Clicks</p>
                  </div>
                  <p className={styles.listaItemDerechaPrecio}>
                    {Intl.NumberFormat("es-CO", {
                      style: "currency",
                      currency: "COP",
                    }).format(plan?.precio)}{" "}
                    COP
                  </p>
                </li>
              }
            </ul>

            <dl className={styles.contenedorTotal}>
              <div>
                <dt className={styles.textBase}>Total</dt>
                <dd className={styles.textBase}>
                  {Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                  }).format(plan?.precio)}{" "}
                  COP
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section
          aria-labelledby="payment-and-shipping-heading"
          className={styles.seccionFormulario}
        >
          <form onSubmit={pagarPlan}>
            <div className={styles.contenedorFormulario}>
              <div className={styles.mt10}>
                <h3 id="payment-heading">Detalles de pago</h3>

                <div className={styles.contenedorInputs}>
                  <div className={styles.contenedorNumeroTarjeta}>
                    <label htmlFor="card-number">Número de tarjeta</label>
                    <div className={styles.mt1}>
                      <input
                        required
                        type="text"
                        id="card-number"
                        name="card-number"
                        autoComplete="cc-number"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                      />
                    </div>
                  </div>

                  <div className={styles.contenedorFecha}>
                    <label htmlFor="expiration-date">
                      Fecha de expiración (MM/YY)
                    </label>
                    <div className={styles.mt1}>
                      <input
                        required
                        type="text"
                        name="expiration-date"
                        id="expiration-date"
                        autoComplete="cc-exp"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="cvc" className={styles.labelCVC}>
                      CVC
                    </label>
                    <div className={styles.mt1}>
                      <input
                        required
                        type="number"
                        name="cvc"
                        id="cvc"
                        autoComplete="csc"
                        min={0}
                        max={999}
                        className={styles.inputCVC}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.contenedorBoton}>
                <button type="submit">Pagar Ahora</button>
              </div>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
