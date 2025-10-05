import Usuarios from "./Usuarios.js";
import Eventos from "./Eventos.js";
import Invitados from "./Invitados.js";
import Plantillas from "./Plantillas.js";

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

// Relaciones entre Eventos y Plantillas
// Una plantilla PDF por evento
Plantillas.hasMany(Eventos, { as: 'eventosPDF', foreignKey: 'plantillaPdfId' });
Eventos.belongsTo(Plantillas, { as: 'plantillaPdf', foreignKey: 'plantillaPdfId' });

// Una plantilla Vista por evento
Plantillas.hasMany(Eventos, { as: 'eventosVista', foreignKey: 'plantillaVistaId' });
Eventos.belongsTo(Plantillas, { as: 'plantillaVista', foreignKey: 'plantillaVistaId' });

// Evento tiene una plantilla de Deseos
Eventos.belongsTo(Plantillas, { as: 'plantillaDeseos', foreignKey: 'plantillaDeseosId' });

// Evento tiene una plantilla Admin/Anfitrión
Eventos.belongsTo(Plantillas, { as: 'plantillaAdmin', foreignKey: 'plantillaAdminId' });

export { Usuarios, Eventos, Invitados, Plantillas }