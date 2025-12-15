import { Link, Navigate } from "react-router-dom";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  //Token del usuario
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsub();
  }, []);

  //Cerrar sesión
  const handleLogout = async () => {
    await signOut(auth);
    alert("Has cerrado sesión correctamente");
    navigate("/");
  };

  let contenidoUsuario;

  if (user) {
    contenidoUsuario = (
      <>
        <li className="nav-item">
          <Link className="nav-link" to="/profile">
            Perfil
          </Link>
        </li>
        <li className="nav-item">
          <button className="nav-link link-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </li>
      </>
    );
  } else {
    contenidoUsuario = (
      <>
        <li className="nav-item">
          <Link className="nav-link link-success" to="/login">
            Iniciar sesión
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link" to="/register">
            Crear cuenta
          </Link>
        </li>
      </>
    );
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">
        <img
          src="src\assets\images\logo-errorcar-blanco.png"
          className="logo-header"
        ></img>
      </Link>

      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/">
              Inicio
            </Link>
          </li>
          <li>
            <Link className="nav-link" to="/ia">
              Pregunta a la IA
            </Link>
          </li>
          {contenidoUsuario}
        </ul>
      </div>
    </nav>
  );
}

export default Header;
