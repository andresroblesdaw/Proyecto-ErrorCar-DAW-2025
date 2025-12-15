import { useEffect, useState } from "react";
import { doc, setDoc, deleteDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";


function Home() {
  const [arrBrands, setBrands] = useState([]);
  const [arrModels, setModels] = useState([]);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState("");
  const [modeloSeleccionado, setModeloSeleccionado] = useState("");
  const [resultado, setResultado] = useState(null);
  const [arrFavoritos, setFavoritos] = useState([]);
  const [arrGenerations, setGenerations] = useState([]);
  const [generacionSeleccionada, setGeneracionSeleccionada] = useState("");
  const [comentarios, setComentarios] = useState({});
  const [nuevoComentario, setNuevoComentario] = useState("");
  const navigate = useNavigate();

  //Petición de marcas
  useEffect(() => {
    fetch("http://localhost:8080/api/brands")
      .then((res) => res.json())
      .then((data) => setBrands(data))
      .catch((err) => console.error(err));
  }, []);

  //Petición de modelos
  useEffect(() => {
    if (!marcaSeleccionada) {
      setModels([]);
      return;
    }

    fetch(`http://localhost:8080/api/models?brand=${marcaSeleccionada}`)
      .then((res) => res.json())
      .then((data) => setModels(data))
      .catch((err) => console.error(err));
  }, [marcaSeleccionada]);

  //Petición de generaciones
  useEffect(() => {
    if (!marcaSeleccionada || !modeloSeleccionado) {
      setGenerations([]);
      return;
    }

    fetch(
      `http://localhost:8080/api/search?brand=${marcaSeleccionada}&model=${modeloSeleccionado}`
    )
      .then((res) => res.json())
      .then((data) => {
        setGenerations(data.generations);
      })
      .catch((err) => console.error(err));
  }, [modeloSeleccionado]);

  //Resultados
  const resultadoErrores = () => {
    if (!marcaSeleccionada || !modeloSeleccionado) return;

    fetch(
      `http://localhost:8080/api/search?brand=${marcaSeleccionada}&model=${modeloSeleccionado}`
    )
      .then((res) => res.json())
      .then((data) => {
        setResultado(data);
      })

      .catch((err) => console.error(err));
  };

  //Añadir o quitar favorito
  const addFavorito = async (gen) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Tienes que iniciar sesión para poder guardar favoritos");
      return;
    }

    //Obtener nombres y modelos
    const brandName =
      arrBrands.find((b) => b.id == marcaSeleccionada)?.name || "";

    const modelName =
      arrModels.find((m) => m.id == modeloSeleccionado)?.name || "";

    const favoriteId = doc(db, "users", user.uid, "favorites", gen.id);
    const exist = await getDoc(favoriteId);

    if (exist.exists()) {
      await deleteDoc(favoriteId);
      setFavoritos(arrFavoritos.filter((id) => id !== gen.id));
      alert("Favorito eliminado");
    } else {
      await setDoc(favoriteId, {
        id: gen.id,
        generation: gen.name,
        brandId: marcaSeleccionada,
        brand: brandName,
        modelId: modeloSeleccionado,
        model: modelName,
        years: gen.years,
      });

      setFavoritos([...arrFavoritos, gen.id]);
      alert("Favorito añadido");
    }
  };

  const cargarComentarios = async (brandId, modelId, genId) => {
    const commentsRef = collection(
      db,
      `brands/${brandId}/models/${modelId}/generations/${genId}/comments`
    );

    const q = query(commentsRef, orderBy("createdAt", "asc"));
    const snap = await getDocs(q);

    const arr = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));

    setComentarios((prev) => ({
      ...prev,
      [genId]: arr,
    }));
  };

  const publicarComentario = async (brandId, modelId, genId) => {
    const user = auth.currentUser;

    if (!user) {
      alert("Debes iniciar sesión para comentar");
      return;
    }

    if (!nuevoComentario.trim()) return;

    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    const username = userSnap.data().username;

    const commentsRef = collection(
      db,
      `brands/${brandId}/models/${modelId}/generations/${genId}/comments`
    );

    await addDoc(commentsRef, {
      userId: user.uid,
      username: username,
      text: nuevoComentario,
      createdAt: serverTimestamp(),
    });

    setNuevoComentario("");
    cargarComentarios(brandId, modelId, genId);
  };

  return (
    <div className="container">
      <div className="row g-3 mb-4">
        <div className="mt-5 mb-5 text-center">
          <img
            src="src\assets\images\logo-errorcar-negro.png"
            className="logo-home"
          ></img>
          <p>Errores comunes y fiabilidad por modelo y generación</p>
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select mb-3"
            value={marcaSeleccionada}
            onChange={(e) => setMarcaSeleccionada(e.target.value)}
          >
            <option hidden selected>
              Selecciona una marca
            </option>

            {arrBrands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select mb-3"
            value={modeloSeleccionado}
            onChange={(e) => setModeloSeleccionado(e.target.value)}
          >
            <option hidden selected>
              Selecciona un modelo
            </option>

            {arrModels.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3">
          <select
            className="form-select mb-3"
            value={generacionSeleccionada}
            onChange={(e) => setGeneracionSeleccionada(e.target.value)}
          >
            <option hidden selected>
              Selecciona una generación
            </option>

            {arrGenerations.map((gen) => (
              <option key={gen.id} value={gen.id}>
                {gen.name} {gen.years}
              </option>
            ))}
          </select>
        </div>

        <div className="col-6 col-md-3">
          <button
            className="btn btn-primary w-100 mb-4"
            onClick={resultadoErrores}
          >
            Buscar errores
          </button>
        </div>
        {resultado && (
          <div className="mt-5">
            <h3 className="mb-3">
              Resultados de {resultado.brandName + " " + resultado.modelName}{" "}
              <img src={resultado.brandLogo} width="28px" />
            </h3>

            {resultado.generations
              .filter((gen) => gen.id == generacionSeleccionada)
              .map((gen) => (
                <div key={gen.id} className="card mb-3">
                  <div className="card-body p-4">
                    <h5 className="card-title d-flex justify-content-between mb-4">
                      {gen.name + " " + gen.years}

                      <button
                        className={`btn btn-sm ${
                          arrFavoritos.includes(gen.id)
                            ? "btn-warning"
                            : "btn-outline-warning"
                        }`}
                        onClick={() => addFavorito(gen)}
                      >
                        <i className="bi bi-star"></i>
                      </button>
                    </h5>

                    <ul>
                      {gen.errors.map((err) => (
                        <li key={err.id} className="my-4 mx-5">
                          <strong>{err.title}</strong>: {err.description}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <hr />
                  <div className="px-4 pb-4">
                    <h5 className="mb-4">Comentarios</h5>

                    <div className="mb-2">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          cargarComentarios(
                            resultado.brandId || marcaSeleccionada,
                            modeloSeleccionado,
                            gen.id
                          )
                        }
                      >
                        Cargar comentarios
                      </button>

                      <ul className="mt-2 list-unstyled p-0">
                        {(comentarios[gen.id] || []).map((c) => (
                          <li
                            key={c.id}
                            className="border rounded p-3 mb-2"
                            style={{ backgroundColor: "#FAFAFA" }}
                          >
                            <strong>{c.username}</strong>
                            <br />
                            {c.text}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="d-flex gap-2">
                      <input
                        type="text"
                        placeholder="Escribe un comentario..."
                        className="form-control"
                        value={nuevoComentario}
                        onChange={(e) => setNuevoComentario(e.target.value)}
                      />

                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          publicarComentario(
                            resultado.brandId || marcaSeleccionada,
                            modeloSeleccionado,
                            gen.id
                          )
                        }
                      >
                        Enviar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
      <div className="container my-5">
        <div className="row align-items-center px-5 py-5 border rounded bg-light">
          
          <div className="col-md-4 text-center mb-3 mb-md-0 w-50">
            <img className="chatgpt-logo"
              src="https://img.icons8.com/?size=100&id=FBO05Dys9QCg&format=png&color=000000"
            />
          </div>

          <div className="col-md-8 w-50">
            <h1>¿Tienes dudas sobre algún coche?</h1>
            <p className="mb-3 me-5">
              Pregunta cualquier duda sobre averías, mantenimiento o compra de
              vehículos a nuestra inteligencia artificial.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => navigate("/Ia")}
            >
              Preguntar a la IA
            </button>
          </div>

        </div>
      </div>
      <div className="container my-5">
        <div className="row align-items-center px-5 py-5 border rounded bg-light">
          
          <div className="col-md-8 mb-3 mb-md-0 w-50">
            <h1>¿Quieres organizar la compra de tu coche?</h1>
            <p className="mb-3 me-5">
              Crea una cuenta para guardar tus modelos favoritos y consultar
              errores comunes siempre que lo necesites.
            </p>
            <button
              className="btn btn-success"
              onClick={() => navigate("/register")}
            >
              Crear cuenta
            </button>
          </div>

          <div className="col-md-4 text-center w-50">
            <i className="bi bi-person-circle" style={{ fontSize: "7rem" }}></i>
          </div>

        </div>
      </div>
    </div>
    
  );
}

export default Home;
