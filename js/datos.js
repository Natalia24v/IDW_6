export const INITIAL_MEDICOS = [
  {
    id: 1,
    nombre: "Laura",
    apellido: "Fernández",
    especialidad: "Cardiología",
    matricula: "12345",
    email: "laura.fernandez@clinicavida.com",
    telefono: "3412345678",
    obraSocial: "OSDE, Swiss Medical",
    imagen: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 2,
    nombre: "Martín",
    apellido: "Pérez",
    especialidad: "Pediatría",
    matricula: "67890",
    email: "martin.perez@clinicavida.com",
    telefono: "3418765432",
    obraSocial: "PAMI, IOMA",
    imagen: "https://randomuser.me/api/portraits/men/32.jpg"
  }
];
export const INITIAL_TURNOS = [
  { id: 1, paciente: "Juan Pérez", medico: "Laura Fernández", especialidad: "Cardiología", fecha: "2025-11-15", hora: "10:00", observaciones: "Control anual" },
  { id: 2, paciente: "Ana Gómez", medico: "Martín Pérez", especialidad: "Pediatría", fecha: "2025-11-16", hora: "11:00", observaciones: "" }
];
export const INITIAL_OBRAS = [
  { id: 1, nombre: "OSDE" },
  { id: 2, nombre: "Swiss Medical" },
  { id: 3, nombre: "PAMI" },
  { id: 4, nombre: "IOMA" }
];
export const INITIAL_ESPECIALIDADES = [
  "Medicina General",
  "Cardiología",
  "Ginecología",
  "Dermatología",
  "Traumatología",
  "Pediatría"
];