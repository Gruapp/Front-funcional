import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import "./Header.css";
import { socket, validarClicks } from "../../constants/utils";
import Banner from "../Banner/Banner";

export default function Header() {
  const usuarioAutenticado = useSelector(
    (state) => state.client?.client !== null
  );
  const idClienteAutenticado = useSelector((state) => {
    return state.client?.client?.idCliente;
  });
  const estoyBloqueado = useSelector((state) => {
    return state.client?.estoyBloqueado;
  });

  useEffect(() => {
    if (usuarioAutenticado) {
      validarClicks(idClienteAutenticado);
    }
  }, [idClienteAutenticado]);

  const handleLogout = () => {
    socket.emit("usuario-desconectado", idClienteAutenticado);
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  document.addEventListener("scroll", function () {
    const header = document.querySelector(".header");
    const scrollPosition = window.scrollY;

    if (scrollPosition > 0) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  return (
    <>
      <header className="header">
        <div className="logo">
          <NavLink to="/">
            <h1>Gruapp</h1>
          </NavLink>
        </div>
        <nav className="navbar">
          <ul>
            <li>
              <NavLink className="opciones" to="/">
                Inicio
              </NavLink>
              <NavLink className="opciones" to="/Gruas">
                Servicios
              </NavLink>

              {usuarioAutenticado && (
                <NavLink className="aggGrua" to="/AgregarGrua">
                  + Grúa
                </NavLink>
              )}

              {/* Mostrar el enlace de "Mi Cuenta" solo si el usuario está autenticado */}
              {usuarioAutenticado && (
                <NavLink className="rayasHorizontales">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/14505/14505987.png"
                    alt=""
                  />
                  <ul className="menuVertical">
                    <li>
                      {usuarioAutenticado && (
                        <NavLink to="/ProfileForm">Perfil</NavLink>
                      )}
                    </li>

                    <li>
                      {usuarioAutenticado && (
                        <NavLink to="/" onClick={handleLogout}>
                          <img
                            className="cerrar"
                            src="https://cdn-icons-png.flaticon.com/128/4113/4113923.png"
                            alt=""
                          />
                        </NavLink>
                      )}
                    </li>
                  </ul>
                </NavLink>
              )}

              {/* Mostrar el enlace de inicio de sesión solo si el usuario no está autenticado */}
              {!usuarioAutenticado && (
                <>
                  <NavLink className="opciones" to="/login">
                    Login
                  </NavLink>
                  <NavLink className="opciones" to="/register">
                    Register
                  </NavLink>
                </>
              )}
            </li>
          </ul>
        </nav>
      </header>
      {estoyBloqueado && (
        <Banner
          mensaje="Superaste los clicks gratuitos, tus grúas no se estan mostrando, presiona aquí para volver a mostrar tus grúas "
          href="/planes"
        />
      )}
    </>
  );
}
