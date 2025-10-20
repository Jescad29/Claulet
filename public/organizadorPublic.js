// alert("organizadorPublic conectado correctamente")

// const guestData = [
//   {
//     id: 1,
//     name: "Maria Garcia",
//     message: "¡Felicidades a los novios! Les deseo lo mejor.",
//     event: "boda",
//     status: "confirmado",
//     phone: "5215512345678",
//     mesa: 5,
//     seccion: "Familia de la novia",
//     tipo: "Principal",
//   },
//   {
//     id: 2,
//     name: "Carlos Lopez",
//     message: "Muchas felicidades, ¡qué viva el amor!",
//     event: "cena",
//     status: "confirmado",
//     phone: "5215587654321",
//     mesa: 12,
//     seccion: "Amigos",
//     tipo: "Principal",
//   },
//   {
//     id: 3,
//     name: "Sofia Martinez",
//     message: "Lamentablemente no podré asistir. ¡Felicidades a ambos!",
//     event: "boda",
//     status: "declinado",
//     phone: "5215598765432",
//     mesa: null,
//     seccion: null,
//     tipo: "Principal",
//   },
//   {
//     id: 4,
//     name: "Jorge Perez",
//     message: "Que su amor dure para siempre.",
//     event: "boda",
//     status: "confirmado",
//     phone: "5215511223344",
//     mesa: 3,
//     seccion: "Familia del novio",
//     tipo: "Principal",
//   },
//   {
//     id: 5,
//     name: "Laura Ramirez",
//     message: "Un abrazo fuerte para ambos.",
//     event: "boda",
//     status: "pendiente",
//     phone: "5215555667788",
//     mesa: null,
//     seccion: null,
//     tipo: "Amiga de la novia",
//   },
//   {
//     id: 6,
//     name: "Daniel Vargas",
//     message: "Les deseo una vida llena de felicidad.",
//     event: "cena",
//     status: "pendiente",
//     phone: "5215599887766",
//     mesa: 8,
//     seccion: "Colegas",
//     tipo: "Acompañante",
//   },
// ];

// const timelineFeed = document.getElementById("timeline-feed");
// const eventFilter = document.getElementById("event-filter");
// const guestSearchInput = document.getElementById("guest-search");
// const themeSelector = document.getElementById("theme-selector");

// const themes = [
//   "claulet-clasico",
//   "claulet-elegante",
//   "claulet-oscuro",
//   "claulet-contraste",
//   "claulet-natural",
//   "claulet-terracota",
//   "claulet-ceniza",
//   "claulet-moderno",
//   "claulet-fino",
//   "claulet-suave",
//   "marino",
//   "primavera",
//   "urbano",
//   "vino",
//   "bosque",
//   "spotify",
// ];

// function applyTheme(themeName) {
//   document.body.setAttribute("data-theme", themeName);
// }

// themeSelector.addEventListener("change", (e) => {
//   applyTheme(e.target.value);
// });

// function getStatusClass(status) {
//   switch (status) {
//     case "confirmado":
//       return "text-green-500";
//     case "pendiente":
//       return "text-yellow-500";
//     case "declinado":
//       return "text-red-500";
//     default:
//       return "text-gray-500";
//   }
// }

// function renderGuests(guests) {
//   timelineFeed.innerHTML = "";
//   guests.forEach((guest) => {
//     const card = document.createElement("div");
//     card.className = "timeline-card";
//     card.innerHTML = `
//                 <div class="flex flex-col md:flex-row md:items-center justify-between mb-2">
//                     <div class="guest-name">${guest.name}</div>
//                     <div class="flex space-x-2 items-center mt-2 md:mt-0">
//                         <span class="text-xs font-semibold uppercase ${getStatusClass(
//                           guest.status
//                         )}">
//                             ${guest.status}
//                         </span>
//                         <button onclick="deleteMessage(${
//                           guest.id
//                         })" class="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors" title="Eliminar deseo">
//                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 112 0v6a1 1 0 11-2 0V8z" clip-rule="evenodd" /></svg>
//                         </button>
//                         <button onclick="sendWhatsApp(${
//                           guest.phone
//                         })" class="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors" title="Enviar mensaje de WhatsApp">
//                             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-message-circle"><path d="M21 15a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h12a2 2 0 012 2v8z"></path><path d="M10 16V8M14 16V8"></path><path d="M12 16v-8" /></svg>
//                         </button>
//                     </div>
//                 </div>
//                 <div class="guest-message">"${guest.message}"</div>
//                 <div class="guest-details">
//                     ${guest.mesa ? `<strong>Mesa:</strong> ${guest.mesa}` : ""}
//                     ${
//                       guest.seccion
//                         ? ` | <strong>Sección:</strong> ${guest.seccion}`
//                         : ""
//                     }
//                     ${
//                       guest.tipo
//                         ? ` | <strong>Tipo:</strong> ${guest.tipo}`
//                         : ""
//                     }
//                 </div>
//             `;
//     timelineFeed.appendChild(card);
//   });
// }

// function filterAndSearch() {
//   const event = eventFilter.value;
//   const searchTerm = guestSearchInput.value.toLowerCase();

//   const filteredGuests = guestData.filter((guest) => {
//     const matchesEvent = event === "all" || guest.event === event;
//     const matchesSearch = guest.name.toLowerCase().includes(searchTerm);
//     return matchesEvent && matchesSearch;
//   });

//   renderGuests(filteredGuests);
// }

// function deleteMessage(id) {
//   if (
//     confirm(
//       "Este es un demo. Se simularía la eliminación del deseo con el ID: " + id
//     )
//   ) {
//     // La lógica de eliminación real iría aquí.
//   }
// }

// function sendWhatsApp(phone) {
//   const message = encodeURIComponent(
//     "¡Hola! Muchas gracias por tus buenos deseos en nuestra boda. Nos alegramos de que hayas estado con nosotros."
//   );
//   const whatsappUrl = `https://wa.me/${phone}?text=${message}`;
//   window.open(whatsappUrl, "_blank");
// }

// eventFilter.addEventListener("change", filterAndSearch);
// guestSearchInput.addEventListener("input", filterAndSearch);

// window.onload = function () {
//   filterAndSearch();
// };

// public/organizadorPublic.js

document.addEventListener("DOMContentLoaded", function () {
  // ========================================
  // 1. BÚSQUEDA POR NOMBRE DE INVITADO
  // ========================================

  const searchInput = document.getElementById("guest-search");
  const eventFilter = document.getElementById("event-filter");

  /**
   * Función para filtrar invitados
   * - Combina búsqueda de texto + filtro de evento
   * - Se ejecuta cada vez que cambia alguno de los dos filtros
   */
  function filterGuests() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedEventId = eventFilter.value;

    // Obtener todas las tarjetas de invitados
    const guestCards = document.querySelectorAll(".timeline-card");

    // Obtener todos los títulos de eventos
    const eventTitles = document.querySelectorAll(".event-title");

    // Obtener mensajes de "no hay invitados"
    const noGuestsMessages = document.querySelectorAll(".no-guests-message");

    // Objeto para rastrear si cada evento tiene invitados visibles
    const eventHasVisibleGuests = {};

    // ----------------------------------------
    // Filtrar tarjetas de invitados
    // ----------------------------------------
    guestCards.forEach((card) => {
      const guestName = card.getAttribute("data-guest-name");
      const eventId = card.getAttribute("data-event-id");

      // Inicializar contador si no existe
      if (!eventHasVisibleGuests[eventId]) {
        eventHasVisibleGuests[eventId] = 0;
      }

      // Condiciones para mostrar la tarjeta:
      // 1. El evento seleccionado es "all" O coincide con el evento de la tarjeta
      // 2. El término de búsqueda está vacío O está incluido en el nombre del invitado
      const matchesEvent =
        selectedEventId === "all" || selectedEventId === eventId;
      const matchesSearch = searchTerm === "" || guestName.includes(searchTerm);

      if (matchesEvent && matchesSearch) {
        card.style.display = "block";
        eventHasVisibleGuests[eventId]++;
      } else {
        card.style.display = "none";
      }
    });

    // ----------------------------------------
    // Mostrar/ocultar títulos de eventos
    // ----------------------------------------
    eventTitles.forEach((title) => {
      const eventId = title.getAttribute("data-event-id");

      // Si el filtro es "all", mostrar todos los títulos
      // Si se seleccionó un evento específico, solo mostrar ese
      if (selectedEventId === "all") {
        // Mostrar título solo si tiene invitados visibles
        title.style.display =
          eventHasVisibleGuests[eventId] > 0 ? "block" : "none";
      } else {
        title.style.display = selectedEventId === eventId ? "block" : "none";
      }
    });

    // ----------------------------------------
    // Mostrar/ocultar mensajes de "no hay invitados"
    // ----------------------------------------
    noGuestsMessages.forEach((message) => {
      const eventId = message.getAttribute("data-event-id");

      // Mostrar mensaje solo si:
      // 1. El evento está seleccionado (o es "all")
      // 2. No hay invitados visibles para ese evento
      const shouldShow =
        (selectedEventId === "all" || selectedEventId === eventId) &&
        eventHasVisibleGuests[eventId] === 0;

      message.style.display = shouldShow ? "block" : "none";
    });

    // ----------------------------------------
    // Mensaje si no hay resultados en absoluto
    // ----------------------------------------
    const totalVisible = Object.values(eventHasVisibleGuests).reduce(
      (a, b) => a + b,
      0
    );

    // Obtener o crear mensaje de "sin resultados"
    let noResultsMessage = document.getElementById("no-results-message");

    if (
      totalVisible === 0 &&
      (searchTerm !== "" || selectedEventId !== "all")
    ) {
      // Si no existe el mensaje, crearlo
      if (!noResultsMessage) {
        noResultsMessage = document.createElement("div");
        noResultsMessage.id = "no-results-message";
        noResultsMessage.className = "text-center text-gray-500 py-8";
        noResultsMessage.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p class="text-lg font-semibold">No se encontraron resultados</p>
          <p class="text-sm mt-2">Intenta con otro término de búsqueda o selecciona otro evento</p>
        `;
        document.getElementById("timeline-feed").appendChild(noResultsMessage);
      }
      noResultsMessage.style.display = "block";
    } else {
      // Ocultar mensaje si hay resultados
      if (noResultsMessage) {
        noResultsMessage.style.display = "none";
      }
    }
  }

  // ========================================
  // EXPORTAR A EXCEL
  // ========================================

  const exportBtn = document.getElementById("export-excel-btn");
  const exportBtnText = document.getElementById("export-btn-text");

  if (exportBtn) {
    exportBtn.addEventListener("click", async function () {
      exportBtn.disabled = true;
      exportBtn.classList.add("opacity-50", "cursor-not-allowed");
      exportBtnText.textContent = "Generando Excel...";

      try {
        const organizadorId = window.ORGANIZADOR_DATA.usuarioId;

        // ✅ CORRECCIÓN: Agregar el prefijo /claulet
        const exportUrl = `/claulet/organizador/${organizadorId}/exportar`;

        console.log("📊 Exportando datos del organizador:", organizadorId);
        console.log("🔗 URL de exportación:", exportUrl);

        const response = await fetch(exportUrl, {
          method: "GET",
          credentials: "same-origin",
        });

        console.log(
          "📡 Respuesta del servidor:",
          response.status,
          response.statusText
        );

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const blob = await response.blob();
        console.log("📦 Blob recibido:", blob.size, "bytes");

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;

        const contentDisposition = response.headers.get("Content-Disposition");
        let filename = "invitados.xlsx";

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="?(.+?)"?$/);
          if (filenameMatch) {
            filename = filenameMatch[1];
          }
        }

        a.download = filename;
        document.body.appendChild(a);
        a.click();

        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        exportBtnText.textContent = "✓ Descargado";
        exportBtn.classList.remove("bg-emerald-500", "hover:bg-emerald-600");
        exportBtn.classList.add("bg-green-500");

        setTimeout(() => {
          exportBtnText.textContent = "Exportar Excel";
          exportBtn.classList.remove("bg-green-500");
          exportBtn.classList.add("bg-emerald-500", "hover:bg-emerald-600");
        }, 2000);

        console.log("✅ Archivo descargado correctamente:", filename);
      } catch (error) {
        console.error("❌ Error al exportar:", error);

        exportBtnText.textContent = "✗ Error al exportar";
        exportBtn.classList.remove("bg-emerald-500", "hover:bg-emerald-600");
        exportBtn.classList.add("bg-red-500");

        alert(
          `Error al generar el archivo Excel.\n\nDetalle: ${error.message}\n\nPor favor, intenta de nuevo.`
        );

        setTimeout(() => {
          exportBtnText.textContent = "Exportar Excel";
          exportBtn.classList.remove("bg-red-500");
          exportBtn.classList.add("bg-emerald-500", "hover:bg-emerald-600");
        }, 2000);
      } finally {
        exportBtn.disabled = false;
        exportBtn.classList.remove("opacity-50", "cursor-not-allowed");
      }
    });
  }
  // ========================================
  // 2. EVENT LISTENERS
  // ========================================

  /**
   * Escuchar cambios en el input de búsqueda
   * - 'input' se dispara con cada letra que escribes
   * - Más responsive que 'change' (que solo se dispara al perder el foco)
   */
  if (searchInput) {
    searchInput.addEventListener("input", filterGuests);
  }

  /**
   * Escuchar cambios en el select de eventos
   */
  if (eventFilter) {
    eventFilter.addEventListener("change", filterGuests);
  }

  // ========================================
  // 3. CAMBIO DE TEMA
  // ========================================

  /**
   * Persistir el tema seleccionado en localStorage
   * y aplicarlo al cargar la página
   */
  const themeSelector = document.getElementById("theme-selector");

  // Cargar tema guardado al iniciar
  const savedTheme = localStorage.getItem("claulet-theme") || "claulet-clasico";
  document.body.setAttribute("data-theme", savedTheme);
  if (themeSelector) {
    themeSelector.value = savedTheme;
  }

  // Escuchar cambios de tema
  if (themeSelector) {
    themeSelector.addEventListener("change", function () {
      const selectedTheme = this.value;
      document.body.setAttribute("data-theme", selectedTheme);
      localStorage.setItem("claulet-theme", selectedTheme);
    });
  }
});
