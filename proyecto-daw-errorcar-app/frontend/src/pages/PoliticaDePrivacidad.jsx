export default function PoliticaPrivacidad() {
  return (
    <div className="container py-5">
      <div className="my-5">
        <h1>Política de Privacidad</h1>

        <section>
          <p>
            En cumplimiento de lo dispuesto en el Reglamento (UE) 2016/679 del
            Parlamento Europeo y del Consejo (RGPD) y en la Ley Orgánica 3/2018
            (LOPDGDD), se informa a los usuarios sobre el tratamiento de sus
            datos personales en el sitio web ErrorCar.
          </p>
        </section>

        <section>
          <h2>1. Responsable del tratamiento</h2>
          <ul>
            <li>
              <strong>Responsable:</strong> Andrés
            </li>
            <li>
              <strong>Nombre del sitio web:</strong> ErrorCar
            </li>
            <li>
              <strong>Correo electrónico:</strong> contacto@errorcar.com
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Datos personales recogidos</h2>
          <p>
            ErrorCar recoge únicamente los datos necesarios para el
            funcionamiento de la plataforma:
          </p>
          <ul>
            <li>Correo electrónico</li>
            <li>Nombre de usuario</li>
            <li>Comentarios publicados por el usuario</li>
          </ul>
          <p>
            La autenticación se realiza mediante Firebase Authentication (email
            y contraseña o Google).
          </p>
        </section>

        <section>
          <h2>3. Finalidad del tratamiento</h2>
          <p>
            Los datos personales se utilizan con las siguientes finalidades:
          </p>
          <ul>
            <li>Gestionar el registro y autenticación de usuarios</li>
            <li>Permitir la publicación de comentarios</li>
            <li>Gestionar la funcionalidad de favoritos</li>
            <li>Mejorar la experiencia de uso de la aplicación</li>
          </ul>
        </section>

        <section>
          <h2>4. Base legal</h2>
          <p>
            La base legal para el tratamiento de los datos es el consentimiento
            del usuario al registrarse y utilizar la plataforma.
          </p>
        </section>

        <section>
          <h2>5. Conservación de los datos</h2>
          <p>
            Los datos personales se conservarán mientras el usuario mantenga su
            cuenta activa o solicite su eliminación.
          </p>
        </section>

        <section>
          <h2>6. Cesión de datos a terceros</h2>
          <p>
            ErrorCar no cede datos personales a terceros, salvo obligación
            legal. Los servicios de autenticación y base de datos se prestan a
            través de Firebase (Google).
          </p>
        </section>

        <section>
          <h2>7. Derechos del usuario</h2>
          <p>El usuario puede ejercer los siguientes derechos:</p>
          <ul>
            <li>Acceso</li>
            <li>Rectificación</li>
            <li>Supresión</li>
            <li>Limitación del tratamiento</li>
          </ul>
          <p>
            Para ejercer estos derechos, puede contactar mediante el correo
            electrónico indicado anteriormente.
          </p>
        </section>

        <section>
          <h2>8. Seguridad</h2>
          <p>
            ErrorCar aplica medidas técnicas y organizativas para garantizar la
            seguridad de los datos personales, utilizando servicios seguros de
            Google Firebase.
          </p>
        </section>

        <section>
          <h2>9. Cambios en la política de privacidad</h2>
          <p>
            ErrorCar se reserva el derecho a modificar la presente Política de
            Privacidad para adaptarla a novedades legislativas o técnicas.
          </p>
        </section>
      </div>
    </div>
  );
}
