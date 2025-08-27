import Usuarios from "./Usuarios.js";
import Eventos from "./Eventos.js";
import Invitados from "./Invitados.js";

// Relaciones entre Eventos y Usuarios

Usuarios.hasMany(Eventos, { as: "eventosOrganizados", foreignKey: "organizadorId" });

Usuarios.hasMany(Eventos, { as: "eventosAnfitrion", foreignKey: "anfitrionId" });

// Evento tiene un Organizador (Usuario con rol organizador)
Eventos.belongsTo(Usuarios, { as: 'organizador', foreignKey: 'organizadorId' });

// Evento tiene un Anfitrión (Usuario con rol anfitrion)
Eventos.belongsTo(Usuarios, { as: 'anfitrion', foreignKey: 'anfitrionId' });

// Relaciones entre Eventos e Invitados
Eventos.hasMany(Invitados, { foreignKey: 'eventoId', onDelete: "CASCADE" });

Invitados.belongsTo(Eventos, { foreignKey: 'eventoId', allowNull: false });


export { Usuarios, Eventos, Invitados }