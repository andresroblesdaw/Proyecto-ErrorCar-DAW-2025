import { useState } from "react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { googleProvider } from "../firebase";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const iniciarSesion = async (ev) => {
    ev.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert("Has iniciado sesión correctamente");
      navigate("/");
    } catch {
      alert("Correo y/o contraseña incorrecto");
    }
  };

  const handleGoogleLogin = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    //Si es la primera vez se crea en Firestore
    if (!snap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        username: user.displayName,
        rol: "user",
        createdAt: new Date(),
      });
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">Iniciar sesión</h2>

      <form onSubmit={iniciarSesion}>
        <div className="mb-3">
          <label className="form-label">Correo</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="btn btn-primary w-100" type="submit">
          Entrar
        </button>
      </form>

      <hr />

      <button
        className="btn btn-secondary w-100 mt-2"
        type="button"
        onClick={handleGoogleLogin}
      >
        <i class="bi bi-google"></i> Iniciar sesión con Google
      </button>

      <Link to="/register" className="btn btn-link w-100 mt-2">
        ¿No tienes una cuenta? Regístrate
      </Link>
    </div>
  );
}

export default Login;
