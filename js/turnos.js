import { INITIAL_TURNOS } from "../js/datos.js";


const STORAGE_KEY = "turnos";

function initStorage() {
  let data = JSON.parse(localStorage.getItem("turnos"));
  if (!Array.isArray(data) || data.length === 0) {
    localStorage.setItem("turnos", JSON.stringify(INITIAL_TURNOS));
  }
}


function getTurnos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveTurnos(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

async function renderTable() {
  const tbody = document.querySelector("#turnosTable tbody");
  if (!tbody) return;
  const turnos = getTurnos();
  tbody.innerHTML = "";

  turnos.forEach((t) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${t.id}</td>
      <td>${t.paciente}</td>
      <td>${t.medico}</td>
      <td>${t.especialidad}</td>
      <td>${t.fecha}</td>
      <td>${t.hora}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-info me-1 view-btn" data-id="${t.id}">Ver</button>
        <button class="btn btn-sm btn-primary me-1 edit-btn" data-id="${t.id}">Editar</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${t.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".view-btn").forEach(b => b.addEventListener("click", (e) => viewTurno(e.target.dataset.id)));
  document.querySelectorAll(".edit-btn").forEach(b => b.addEventListener("click", (e) => openForm("edit", e.target.dataset.id)));
  document.querySelectorAll(".delete-btn").forEach(b => b.addEventListener("click", (e) => deleteTurno(e.target.dataset.id)));
}

async function openForm(mode = "create", id = null) {
  const modalTitle = document.getElementById("turnoModalLabel");
  const form = document.getElementById("turnoForm");
  const medicoSelect = form.medico;
  medicoSelect.innerHTML = "";

  // cargar médicos
  const medicos = await obtenerMedicos();
  medicos.forEach(m => {
    const opt = document.createElement("option");
    opt.value = `${m.nombre} ${m.apellido}`;
    opt.textContent = `${m.nombre} ${m.apellido} (${m.especialidad})`;
    medicoSelect.appendChild(opt);
  });

  form.reset();
  form.dataset.mode = mode;
  delete form.dataset.id;

  if (mode === "create") {
    modalTitle.textContent = "Nuevo Turno";
  } else {
    modalTitle.textContent = "Editar Turno";
    const turnos = getTurnos();
    const t = turnos.find(x => String(x.id) === String(id));
    if (!t) return;
    form.paciente.value = t.paciente;
    form.medico.value = t.medico;
    form.especialidad.value = t.especialidad;
    form.fecha.value = t.fecha;
    form.hora.value = t.hora;
    form.observaciones.value = t.observaciones;
    form.dataset.id = t.id;
  }

  const modal = new bootstrap.Modal(document.getElementById("turnoModal"));
  modal.show();
}

function viewTurno(id) {
  const turnos = getTurnos();
  const t = turnos.find(x => String(x.id) === String(id));
  if (!t) return;
  const body = document.getElementById("viewBody");
  if (!body) return;
  body.innerHTML = `
    <p><strong>Paciente:</strong> ${t.paciente}</p>
    <p><strong>Médico:</strong> ${t.medico}</p>
    <p><strong>Especialidad:</strong> ${t.especialidad}</p>
    <p><strong>Fecha:</strong> ${t.fecha}</p>
    <p><strong>Hora:</strong> ${t.hora}</p>
    <p><strong>Observaciones:</strong> ${t.observaciones || "-"}</p>
  `;
  const modal = new bootstrap.Modal(document.getElementById("viewModal"));
  modal.show();
}

function deleteTurno(id) {
  if (!confirm("¿Eliminar este turno?")) return;
  const turnos = getTurnos().filter(t => String(t.id) !== String(id));
  saveTurnos(turnos);}

document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  renderTable();
});
