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

  // Obtener todos los Usuarios.
  axios.get("/claulet/admin/api/usuarios/todos").then((res) => { 
    const usuarios = res.data; 
    const tbody = document.querySelector("#tablaUsuarios tbody")
    tbody.innerHTML = "";

    try {
      if (usuarios.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML=`<td colspan="6" style="text-align:center;">No hay eventos</td>`;
        tbody.appendChild(tr)
        return
      }

      usuarios.forEach((usuario) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.rol}</td>
                <td>${usuario.email}</td>
                <td>${usuario.cantidadEventos}</td>
  
                    <button class="btn btn-sm btn-outline-secondary me-1 btn-editar-usuarios"
                        title="editarUsuarios" data-bs-toggle="modal"
                        data-bs-target="#modalEditarUsuario" data-usuario-id="${usuario.id}"><i
                            class="fas fa-edit"></i></button>
                    <button class="btn btn-sm btn-outline-secondary me-1 btn-password-usuarios"
                        title="password" data-bs-toggle="modal"
                        data-bs-target="#modalEditarPasswordUsuario"><i
                            class="fas fa-key"></i></button>
                    <button class="btn btn-sm btn-outline-danger btn-eliminar-usuario"
                        data-usuario-id="${usuario.id}"
                        title="Eliminar">
                        <i class="fas fa-trash-alt"></i></button>
                </td>
                `;
        tbody.appendChild(tr);
      });
    } catch (error) {
      console.error(error);
      tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">Error al cargar los invitados</td></tr>`;
    }
  });

 
  // Llenar formulario editar Usuario
  document
    .querySelector("#tablaUsuarios tbody")
    .addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-editar-usuarios");
      if (!btn) return;
      const usuarioId = btn.getAttribute("data-usuario-id");

      try {
        const res = await axios.get(
          `/claulet/admin/api/editarUsuario/obtenerUsuario/${usuarioId}`
        );
        const usuario = res.data;
        console.log(usuario);

        // LLenar Modal usando name
        document.querySelector("#modalEditarUsuario input[name='nombre']").value =
          usuario.nombre || "";
        document.querySelector("#modalEditarUsuario input[name='email']").value =
          usuario.email|| "";
        // document.querySelector("#modalEditarUsuario input[name='rol']").value =
        //   usuario.rol || "";
        document.querySelector("#modalEditarUsuario input[name='id']").value =
          usuario.id || "";
      } catch (error) {
        console.error("Error al obtener usuario:", error);
      }
    });

  // Editar Usuario 
  const formEditarUsuario = document.getElementById("form-editar-usuarios")
  
  formEditarUsuario.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datosEditarUsuario = Object.fromEntries(
      new FormData(formEditarUsuario).entries()
    );
    
    try {
      const res = await axios.put(
        `/claulet/admin/api/editarUsuario/${datosEditarUsuario.usuarioId}`,
        datosEditarUsuario  
      );
      alert("Usuario Actualizado");
      window.location.href = "/claulet/admin";
    } catch (error) {
      console.error("Error al editar el evento", error.response?.data || error);
      alert("Error al editar el evento");
    }
  });

  // Borrar Usuario
  document
    .querySelector("#tablaUsuarios tbody")
    .addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-eliminar-usuario");
      if (!btn) return;

      // Pedir confirmacion borrar usuario
      const confirmDelete = confirm("¿Estás seguro de eliminar este usuario?");
      if (!confirmDelete) return;

      // Obtener Id de usuario
      const usuarioId = btn.getAttribute("data-usuario-id");

      try {
        await axios.delete(`/claulet/admin/api/editarUsuario/${usuarioId}`);
        alert("Usuario eliminado correctamente");

        // eliminar la fila del DOM sin recargar
        const fila = btn.closest("tr");
        if (fila) fila.remove();
      } catch (error) {
        console.error(
          "Error al eliminar el Usuario",
          error.response?.data || error
        );
        alert("Error al eliminar el usuario");
      }
    });

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
        `/claulet/admin/api/editarEvento/${datosEditarEvento.id}`,
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

  // Agregar un nuevo Invitado
  const selectEventGuests = document.getElementById("selectEventGuests");
  const formAgregarInvitado = document.getElementById("formAgregarInvitado");
  const eventoSeleccionado = document.getElementById("eventoSeleccionado");

  if (selectEventGuests.value) {
    eventoSeleccionado.value = selectEventGuests.value;
  }

  selectEventGuests.addEventListener("change", () => {
    eventoSeleccionado.value = selectEventGuests.value;
  });

  formAgregarInvitado.addEventListener("submit", async (e) => {
    e.preventDefault();

    const formData = new FormData(formAgregarInvitado);
    const data = Object.fromEntries(formData.entries());

    // Aquí ya contiene eventoId gracias al input hidden
    try {
      const res = await axios.post("/claulet/admin/api/invitados", data);
      alert("✅ Invitado agregado con éxito");

      // cerrar modal
      const modal = bootstrap.Modal.getInstance(
        document.getElementById("modalAgregarInvitado")
      );
      modal.hide();

      // refrescar invitados del evento
      selectEventGuests.dispatchEvent(new Event("change"));
    } catch (error) {
      console.error(
        "❌ Error al agregar invitado:",
        error.response?.data || error
      );
      alert("Error al agregar invitado");
    }
  });

  //Importar lista de invitados en excel
  const archivoInput = document.getElementById("archivoExcel");
  const btnSubirExcel = document.getElementById("btnSubirExcel");

  btnSubirExcel.addEventListener("click", () => {
    archivoInput.click(); // abre el explorador de archivos
  });

  archivoInput.addEventListener("change", async () => {
    const archivo = archivoInput.files[0];
    const eventoId = selectEventGuests.value;

    if (!archivo) return alert("Selecciona un archivo");
    if (!eventoId) return alert("Selecciona un evento");

    const formData = new FormData();
    formData.append("file", archivo);
    formData.append("eventoId", eventoId);

    try {
      const res = await axios.post(
        "/claulet/admin/api/invitados/import",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert(`✅ Invitados importados: ${res.data.count}`);

      // refrescar invitados del evento
      selectEventGuests.dispatchEvent(new Event("change"));
    } catch (error) {
      console.error(
        "❌ Error al importar invitados:",
        error.response?.data || error
      );
      alert("Error al importar invitados");
    }
  });

  // Obtener Invitados por evento

  const tbodyInvitados = document.querySelector("#guests-tab tbody");

  // Llenar select con eventos
  axios.get("/claulet/admin/api/obtenerEventos").then((res) => {
    res.data.forEach((evento) => {
      const option = document.createElement("option");
      option.value = evento.id;
      option.textContent = evento.nombre;
      selectEventGuests.appendChild(option);
    });
  });

  // Cuando se selecciona un evento, mostrar invitados
  selectEventGuests.addEventListener("change", async () => {
    const eventoId = selectEventGuests.value;

    try {
      const res = await axios.get(`/claulet/admin/api/invitados/${eventoId}`);
      const invitados = res.data;

      tbodyInvitados.innerHTML = "";

      // Si no hay invitados, mostrar la leyenda, comienza a agregar invitados

      // if (invitados.length === 0) {
      //   const tr = document.createElement("tr");
      //   tr.innerHTML=`
      //   <td colspan="5" style="text-align:center; color: #777;">
      //     No hay invitados. ¡Agrega invitados al evento!
      //   </td>
      //   `;
      //   tbodyInvitados.appendChild(tr);
      //   return;
      // }

      invitados.forEach((inv) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
        <td>${inv.nombre} ${inv.apellidos}</td>
        <td>${inv.telefono || "-"}</td>
        <td>${inv.estado}</td>
        <td><button class="btn btn-sm btn-outline-info" data-bs-toggle="modal" data-bs-target="#modalQrInvitado" data-invitados-id="${
          inv.id
        }" title="Ver QR"><i class="fas fa-qrcode"></i></button></td>
        <td>
          <button class="btn btn-sm btn-outline-secondary me-1 btn-editar-invitado" title="Editar" data-bs-toggle="modal" data-bs-target="#modalEditarInvitado" data-invitados-id="${
            inv.id
          }"><i class="fas fa-edit"></i></button>
          <button class="btn btn-sm btn-outline-danger btn-eliminar-invitado" title="Eliminar" data-invitados-id="${
            inv.id
          }"><i class="fas fa-trash-alt"></i></button>
        </td>
      `;
        tbodyInvitados.appendChild(tr);
      });
    } catch (error) {
      console.error("Error al obtener invitados:", error);
    }
  });

  // LLenar formulario editar invitado
  document
    .querySelector(".tabEditarInvitados tbody")
    .addEventListener("click", async (e) => {
      const btnEditarInvi = e.target.closest(".btn-editar-invitado");
      if (!btnEditarInvi) return;

      //  pedir confirmación al usuario
      const confirmEdit = confirm(
        "¿Estás seguro que deseas editar este Invitado?"
      );
      if (!confirmEdit) return;

      const invitadoId = btnEditarInvi.getAttribute("data-invitados-id");

      try {
        const res = await axios.get(
          `/claulet/admin/api/invitado/${invitadoId}`
        );
        const invitadoEdit = res.data;

        // Llenar modal usando name
        document.querySelector(
          "#modalEditarInvitado input[name='nombre']"
        ).value = invitadoEdit.nombre || "";
        document.querySelector(
          "#modalEditarInvitado input[name='apellidos']"
        ).value = invitadoEdit.apellidos || "";
        document.querySelector(
          "#modalEditarInvitado input[name='edad']"
        ).value = invitadoEdit.edad || "";
        document.querySelector(
          "#modalEditarInvitado select[name='codigo_pais']"
        ).value = invitadoEdit.codigo_pais || "";
        document.querySelector(
          "#modalEditarInvitado input[name='telefono']"
        ).value = invitadoEdit.telefono || "";
        document.querySelector(
          "#modalEditarInvitado input[name='pases']"
        ).value = invitadoEdit.pases || "";
        document.querySelector(
          "#modalEditarInvitado input[name='seccion']"
        ).value = invitadoEdit.seccion || "";
        document.querySelector(
          "#modalEditarInvitado input[name='comentarios']"
        ).value = invitadoEdit.comentarios || "";
        document.querySelector(
          "#modalEditarInvitado input[name='invitadoId']"
        ).value = invitadoEdit.id;
      } catch (err) {
        console.error("Error al obtener invitado:", err);
      }
    });

  // Editar Invitado

  const formEditarInvitado = document.getElementById("formEditarInvitado");

  formEditarInvitado.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datosEditarInvitado = Object.fromEntries(
      new FormData(formEditarInvitado).entries()
    );

    try {
      await axios.put(`/claulet/admin/api/invitado`, datosEditarInvitado);
      alert("Invitado Actualizado Correctamente");
      window.location.href = "/claulet/admin";
    } catch (error) {
      console.error("Error al editar el invitado", err.response?.data || err);
      alert("Error al editar el invitado");
    }
  });

  // Eliminar invitado
  document
    .querySelector("#tablaInvitados tbody")
    .addEventListener("click", async (e) => {
      const btn = e.target.closest(".btn-eliminar-invitado"); // detecta si se hizo clic en un botón eliminar
      if (!btn) return;

      //  pedir confirmación al usuario
      const confirmDelete = confirm("¿Estás seguro de eliminar este Invitado?");
      if (!confirmDelete) return;

      // Obtenemos el id del invitado
      const invitadoId = btn.getAttribute("data-invitados-id");

      try {
        await axios.delete(`/claulet/admin/api/invitado/${invitadoId}`);
        alert("Invitado eliminado correctamente");

        // eliminar la fila del DOM sin recargar
        const fila = btn.closest("tr");
        if (fila) fila.remove();
      } catch (error) {
        console.error(
          "Error al eliminar el invitado",
          error.response?.data || error
        );
        alert("Error al eliminar el invitado");
      }
    });

  // Codigo QR
  const modalQr = document.getElementById("modalQrInvitado");

  modalQr.addEventListener("show.bs.modal", async (event) => {
    const button = event.relatedTarget; // Botón que disparó el modal
    const invitadoId = button.getAttribute("data-invitados-id");

    try {
      // Llamada al backend con Axios
      const response = await axios.get(
        `/claulet/admin/api/invitado/${invitadoId}`
      );
      const invitado = response.data;
      console.log("URL para QR:", invitado.url_personalizada);

      // Mostrar el nombre
      document.getElementById(
        "nombreInvitadoQR"
      ).textContent = `${invitado.nombre} ${invitado.apellidos}`;

      // Generar QR con la URL personalizada
      const qrContainer = document.getElementById("qrContainer");
      qrContainer.innerHTML = ""; // limpiar QR anterior
      const canvas = document.createElement("canvas");
      qrContainer.appendChild(canvas);

      QRCode.toCanvas(
        canvas,
        invitado.url_personalizada,
        { width: 200 },
        function (error) {
          if (error) console.error("Error generando QR:", error);
        }
      );
      // Actualizar input con URL personalizada
      urlField.value = invitado.url_personalizada;
    } catch (error) {
      console.error("Error al obtener invitado:", error);
    }
  });

  // Subir plantillas invitaciones

  // Siguiente Formulario
});
