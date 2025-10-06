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
