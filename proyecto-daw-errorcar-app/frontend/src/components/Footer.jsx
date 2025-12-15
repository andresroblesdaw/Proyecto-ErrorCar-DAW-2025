import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light border-top mt-auto py-5">
      <div className="container py-4">
        <div className="row align-items-start">
          <div className="col-md-6 mb-3 mb-md-0">
            <img
              src="src\assets\images\logo-errorcar-blanco.png"
              className="logo-header"
            ></img>
            <p className="mt-2 mb-0 text-secondary">© 2025 ErrorCar</p>
          </div>

          <div className="col-md-6 d-flex justify-content-md-end">
            <ul className="list-unstyled mb-2 mx-4">
              <li>
                <Link to="/" className="text-decoration-none text-secondary">
                  Inicio
                </Link>
              </li>

              <li>
                <Link to="/ia" className="text-decoration-none text-secondary">
                  Pregunta a la IA
                </Link>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-decoration-none text-secondary"
                >
                  Iniciar sesión
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-decoration-none text-secondary"
                >
                  Crear cuenta
                </Link>
              </li>
            </ul>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/aviso-legal"
                  className="text-decoration-none  text-secondary"
                >
                  Aviso legal
                </Link>
              </li>
              <li>
                <Link
                  to="/politica-de-privacidad"
                  className="text-decoration-none  text-secondary"
                >
                  Política de privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
