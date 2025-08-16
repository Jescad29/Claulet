document.addEventListener("DOMContentLoaded", () => {
  //Obtener Usuarios/Evento

  const btnnuevoEvento = document.getElementById("nuevoEvento");

  btnnuevoEvento.addEventListener("click", async () => {
    try {
      const { data } = await axios.get("/claulet/admin/api/crearEvento");
      const eventOrganizador = document.getElementById("eventOrganizador");

      data.organizadores.forEach((u) => {
        const option = document.createElement("option");
        option.value = u.id;
        option.textContent = u.nombre;
        eventOrganizador.appendChild(option);
      });

      const eventAnfitriones = document.getElementById("eventAnfitrion");

      data.anfitriones.forEach((anfi) => {
        const option = document.createElement("option");
        option.value = anfi.id;
        option.textContent = anfi.nombre;
        eventAnfitriones.appendChild(option);
      });

      console.log(
        "Datos enviados por el servidor de la ruta /claulet/admin/api/crearEvento",
        data
      );
    } catch (error) {
      console.error("Error cargando usuarios", err.response?.data || err);
      alert("No se pudieron cargar los usuarios");
    }
  });

  // Formulario Crear Evento

  const formEvento = document.querySelector("#form-evento");

  if (formEvento) {
    formEvento.addEventListener("submit", async (e) => {
      e.preventDefault();
      const datosEvento = Object.fromEntries(
        new FormData(formEvento).entries()
      );

      try {
        const res = await axios.post("/claulet/admin/api/eventos", datosEvento);
        alert("Evento Creado");
        window.location.href = "/claulet/admin";
      } catch (err) {
        console.error("Error al crear evento", err.response?.data || err);
        alert("Error al crear evento");
      }
    });
  }

  // Formulario Obtener Eventos
  axios.get("/claulet/admin/api/obtenerEventos").then((res) => {
    const eventos = res.data;
    const tbody = document.querySelector("#tablaEventos tbody");
    tbody.innerHTML = "";

    try {
      if (eventos.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td colspan="6" style="text-align:center;">No hay eventos</td>
        `;
        tbody.appendChild(tr);
        return;
      }

      eventos.forEach((evento) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${evento.nombre}</td>
                <td>${evento.fecha}</td>
                <td>${evento.confirmados}</td>
                <td>${evento.pendientes}</td>
                <td>${evento.declinados}</td>
  
                    <button class="btn btn-sm btn-outline-secondary me-1 btn-editar"
                        title="Editar" data-bs-toggle="modal"
                        data-bs-target="#editEventModal" data-evento-id="${evento.id}"><i
                            class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-secondary me-1 btn-invitados"
                        title="Gestionar Invitados">
                        <i class="fas fa-users"></i></button>
                    <button class="btn btn-sm btn-outline-secondary me-1 btn-contrasena"
                        title="Contraseñas" data-bs-toggle="modal"
                        data-bs-target="#passwordModal"><i
                            class="fas fa-key"></i></button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar"
                        data-evento-id="${evento.id}"
                        title="Eliminar">
                        <i class="fas fa-trash-alt"></i></button>
                </td>
                `;
        tbody.appendChild(tr);
      });
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar los eventos</td></tr>`;
    }
  });

  // Formulario Crear usuario
  const formUsuario = document.querySelector("#form-usuarios");

  if (formUsuario) {
    formUsuario.addEventListener("submit", async (e) => {
      e.preventDefault();
      const datosUsuario = Object.fromEntries(
        new FormData(formUsuario).entries()
      );

      try {
        const res = await axios.post(
          "/claulet/admin/api/usuarios",
          datosUsuario
        );
        alert("Usuario Creado Correctamente");
        window.location.href = "/claulet/admin";
      } catch (err) {
        if (err.response && err.response.status === 400) {
          // El usuario ya esta registrado
          const primerError = err.response.data.errores[0].msg;
          alert(primerError);
        } else {
          alert("Error desconocido, intenta más tarde");
        }
      }
    });
  }

  // LLenar formulario editar evento
  document
    .querySelector("#tablaEventos tbody")
    .addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-editar");
      if (!btn) return;

      const eventoId = btn.getAttribute("data-evento-id");

      try {
        const res = await axios.get(
          `/claulet/admin/api/editarEvento/${eventoId}`
        );
        const evento = res.data;

        // Llenar modal usando name
        document.querySelector("#editEventModal input[name='nombre']").value =
          evento.nombre || "";
        document.querySelector("#editEventModal input[name='fecha']").value =
          evento.fecha || "";
        document.querySelector("#editEventModal input[name='hora']").value =
          evento.hora || "";
        document.querySelector("#editEventModal input[name='lugar']").value =
          evento.lugar || "";
        document.querySelector(
          "#editEventModal textarea[name='descripcion']"
        ).value = evento.descripcion || "";
        document.querySelector("#editEventModal input[name='urlBase']").value =
          evento.urlBase;
        document.querySelector("#editEventModal input[name='id']").value =
          evento.id;
      } catch (err) {
        console.error("Error al obtener evento:", err);
      }
    });

  // Editar evento

  const formEditarEvento = document.getElementById("formEditarEvento");

  formEditarEvento.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datosEditarEvento = Object.fromEntries(
      new FormData(formEditarEvento).entries()
    );

    try {
      const res = await axios.put(
        "/claulet/admin/api/editarEvento/${datosEditarEvento.id}",
        datosEditarEvento
      );
      alert("Evento Actualizado");
      window.location.href = "/claulet/admin";
    } catch (error) {
      console.error("Error al editar el evento", err.response?.data || err);
      alert("Error al editar el evento");
    }
  });

  // Eliminar el evento

  document
    .querySelector("#tablaEventos tbody")
    .addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-eliminar"); // detecta si se hizo clic en un botón eliminar
      if (!btn) return;

      //  pedir confirmación al usuario
      const confirmDelete = confirm("¿Estás seguro de eliminar este evento?");
      if (!confirmDelete) return;

      // Obtenemos el id del evento
      const eventoId = btn.getAttribute("data-evento-id");

      try {
        await axios.delete(`/claulet/admin/api/eventos/${eventoId}`);
        alert("Evento eliminado correctamente");

        // eliminar la fila del DOM sin recargar
        const fila = btn.closest("tr");
        if (fila) fila.remove();
      } catch (error) {
        console.error(
          "Error al eliminar el evento",
          error.response?.data || error
        );
        alert("Error al eliminar el evento");
      }
    });

  // Siguiente Formulario
});
