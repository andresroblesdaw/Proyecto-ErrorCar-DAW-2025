import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { addDoc, serverTimestamp } from "firebase/firestore";

function Profile() {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [MensajeReset, setMensajeReset] = useState("");
  const [username, setUsername] = useState("");
  const [rol, setRol] = useState("user");
  const [arrModels, setModels] = useState([]);
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");
  const [arrGenerations, setGenerations] = useState([]);
  const [generacionSeleccionada, setGeneracionSeleccionada] = useState("");
  const [arrBrands, setBrands] = useState([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [tituloError, setTituloError] = useState("");
  const [descripcionError, setDescripcionError] = useState("");

  useEffect(() => {
    const favoritosr = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        cargarFavoritos(currentUser.uid);

        const userRef = doc(db, "users", currentUser.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setUsername(snap.data().username);

          const rolUsuario = snap.data().rol || "user";
          setRol(rolUsuario);

          if (rolUsuario == "admin") {
            cargarMarcas();
          }
        }
      }
    });

    return () => favoritosr();
  }, []);

  //Favoritos en el perfil
  const cargarFavoritos = async (uid) => {
    try {
      const favsRef = collection(db, "users", uid, "favorites");
      const snapshot = await getDocs(favsRef);

      const favList = snapshot.docs.map((doc) => doc.data());
      setFavorites(favList);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };

  const cargarMarcas = async () => {
    const res = await fetch("http://localhost:8080/api/brands");
    const data = await res.json();
    setBrands(data);
  };

  const cargarModelos = async (brandId) => {
    const res = await fetch(
      `http://localhost:8080/api/models?brand=${brandId}`
    );
    const data = await res.json();
    setModels(data);
    setModeloSeleccionado("");
    setGenerations([]);
    setGeneracionSeleccionada("");
  };

  const quitarFavorito = async (fav) => {
    const user = auth.currentUser;

    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "favorites", fav.id));

    setFavorites(favorites.filter((f) => f.id !== fav.id));
  };

  const restablecerPassword = async () => {
    setMensajeReset("");

    await sendPasswordResetEmail(auth, user.email);
    setMensajeReset(
      "Te hemos enviado un correo electrónico para restablecer tu contraseña."
    );
  };

  if (!user) {
    return (
      <div className="container" style={{ maxWidth: "500px" }}>
        <p>No has iniciado sesión</p>
      </div>
    );
  }

  const cargarGeneraciones = async (brandId, modelId) => {
    const res = await fetch(
      `http://localhost:8080/api/search?brand=${brandId}&model=${modelId}`
    );
    const data = await res.json();
    setGenerations(data.generations || []);
    setGeneracionSeleccionada("");
  };

  const addError = async () => {
  const errorsRef = collection(
    db,
    `brands/${marcaSeleccionada}/models/${modeloSeleccionado}/generations/${generacionSeleccionada}/errors`
  );

    await addDoc(errorsRef, {
      title: tituloError,
      description: descripcionError,
      createdAt: serverTimestamp(),
      createdBy: user.uid,
    });

    setTituloError("");
    setDescripcionError("");
    alert("Error añadido correctamente");
  
};


  return (
    <div className="container mt-5" style={{ maxWidth: "600px" }}>
      <h2 className="text-center mb-4">Tu Perfil</h2>

      <div className="mb-3">
        <label className="form-label">Nombre de usuario</label>
        <input type="text" className="form-control" value={username} disabled />
        <label className="form-label">Correo</label>
        <input
          type="email"
          className="form-control"
          value={user.email}
          disabled
        />
      </div>
      {MensajeReset && <div className="alert alert-info">{MensajeReset}</div>}

      <button
        className="btn btn-secondary w-100 mt-2"
        onClick={restablecerPassword}
      >
        Restablecer contraseña
      </button>

      <hr />
      {rol == "user" && (
        <>
          <h3 className="mt-4">
            Tus modelos favoritos <i class="bi bi-star-fill"></i>
          </h3>

          {favorites.length == 0 ? (
            <p>No tienes modelos favoritos guardados</p>
          ) : (
            <ul className="list-group">
              {favorites.map((fav) => (
                <li key={fav.id} className="list-group-item position-relative">
                  <strong>Marca:</strong> {fav.brand} <br />
                  <strong>Modelo:</strong> {fav.model} <br />
                  <strong>Generación:</strong> {fav.generation} {fav.years}
                  <br />
                  <button
                    className="btn position-absolute bg-white border border-warning rounded p-1"
                    style={{ top: "10px", right: "10px" }}
                    onClick={() => quitarFavorito(fav)}
                  >
                    <i className="bi bi-star-fill text-warning"></i>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {rol == "admin" && (
        <div className="mt-4 p-3 border rounded">
          <h4>Panel de administración</h4>

          <label className="form-label mt-2">Selecciona una marca</label>
          <select
            className="form-select"
            value={marcaSeleccionada}
            onChange={(e) => {
              const brandId = e.target.value;
              setMarcaSeleccionada(brandId);
              if (brandId) {
                cargarModelos(brandId);
              }
            }}
          >
            <option value="">Selecciona una marca</option>
            {arrBrands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>

          <label className="form-label mt-3">Selecciona un modelo</label>
          <select
            className="form-select"
            value={modeloSeleccionado}
            onChange={(e) => {
              const modelId = e.target.value;
              setModeloSeleccionado(modelId);
              if (modelId) {
                cargarGeneraciones(marcaSeleccionada, modelId);
              }
            }}
          >
            <option value="">Selecciona un modelo</option>
            {arrModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>

          <label className="form-label mt-3">Selecciona una generación</label>
          <select
            className="form-select"
            value={generacionSeleccionada}
            onChange={(e) => setGeneracionSeleccionada(e.target.value)}
          >
            <option value="">Selecciona una generación</option>
            {arrGenerations.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.name} ({gen.years})
              </option>
            ))}
          </select>
          {generacionSeleccionada && (
            <div className="mt-4">
              <h5>Añadir error a la generación</h5>

              <input required
                type="text"
                className="form-control mb-2"
                placeholder="Título del error"
                value={tituloError}
                onChange={(e) => setTituloError(e.target.value)}
              />

              <textarea required
                className="form-control mb-2"
                placeholder="Descripción del error"
                rows="3"
                value={descripcionError}
                onChange={(e) => setDescripcionError(e.target.value)}
              />

              <button className="btn btn-danger" onClick={addError}>
                Añadir error
              </button>

              
            </div>
          )}
        </div>
      )}
    </div>
  );

}
export default Profile;
