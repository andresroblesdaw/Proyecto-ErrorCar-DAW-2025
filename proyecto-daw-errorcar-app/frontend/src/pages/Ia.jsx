import { useState } from "react";

function AskAI() {
  const [mensaje, setMensaje] = useState("");
  const [respuesta, setRespuesta] = useState("");

  const preguntarIA = async () => {
    if (!mensaje.trim()) return;

    setRespuesta("");

    const res = await fetch("http://localhost:8080/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensaje }),
    });

    const data = await res.json();
    setRespuesta(data.respuesta || "Error al responder");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "700px" }}>
      <img
        src="https://img.icons8.com/?size=100&id=FBO05Dys9QCg&format=png&color=000000"
        className="d-block mx-auto mb-3"
      ></img>
      <h1 className="text-center">Pregunta a la IA</h1>
      <p className="text-center mb-5">
        Asistencia inteligente para detectar posibles problemas en tu vehículo.
      </p>

      <textarea required
        className="form-control mt-3"
        rows="4"
        placeholder="¿Qué problemas comunes tiene el BMW Serie 1?"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
      />

      <button className="btn btn-primary mt-3" onClick={preguntarIA}>
        Preguntar
      </button>

      {respuesta && (
        <div className="alert alert-secondary mt-4">
          <strong>Respuesta:</strong>
          <p className="mt-2">{respuesta}</p>
        </div>
      )}
    </div>
  );
}

export default AskAI;
