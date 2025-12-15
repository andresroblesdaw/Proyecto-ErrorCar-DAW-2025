import { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const crearCuenta = (e) => {
    e.preventDefault();

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        await sendEmailVerification(user);
        alert(
          "Cuenta creada correctamente. Hemos mandado un mensaje a tu correo electrónico."
        );
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          username: username,
          rol: "user",
          createdAt: new Date(),
        });
      })

        alert(
          "La contraseña tiene que tener al menos una mayúscula, caracter especial y un número. Tiene que tener mínimo 6 carácteres"
        )
      
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 400 }}>
      <h2 className="text-center mb-4">Crear cuenta</h2>

      <form onSubmit={crearCuenta}>
        <div className="mb-3">
          <label>Nombre de usuario</label>
          <input
            type="text"
            className="form-control mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Correo</label>
          <input
            className="form-control"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label>Contraseña</label>
          <input
            className="form-control"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="btn btn-success w-100" type="submit">
          Registrarme
        </button>
      </form>

      <a href="/login" className="btn btn-link w-100 mt-3">
        ¿Ya tienes una cuenta? Inicia sesión
      </a>
    </div>
  );
}

export default Register;
