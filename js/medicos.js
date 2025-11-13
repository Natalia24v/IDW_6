import { INITIAL_MEDICOS } from "./datos.js";

const STORAGE_KEY = "medicos";

function initStorage() {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!Array.isArray(data) || data.length === 0 || !data[0].nombre) {
    console.warn("⚠️ Datos de médicos inválidos o vacíos. Se restauran los iniciales.");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDICOS));
  }
}

function getMedicos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveMedicos(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function renderTable() {
  const tbody = document.querySelector("#medicosTable tbody");
  if (!tbody) return;
  const medicos = getMedicos();
  tbody.innerHTML = "";

  medicos.forEach((m) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${m.id}</td>
      <td>${m.apellido}, ${m.nombre}</td>
      <td>${m.especialidad}</td>
      <td>${m.matricula}</td>
      <td>${m.obraSocial}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-info me-1 view-btn" data-id="${m.id}">Ver</button>
        <button class="btn btn-sm btn-primary me-1 edit-btn" data-id="${m.id}">Editar</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${m.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".view-btn").forEach(b => b.addEventListener("click", (e) => viewMedico(e.target.dataset.id)));
  document.querySelectorAll(".edit-btn").forEach(b => b.addEventListener("click", (e) => openForm("edit", e.target.dataset.id)));
  document.querySelectorAll(".delete-btn").forEach(b => b.addEventListener("click", (e) => deleteMedico(e.target.dataset.id)));
}

function openForm(mode = "create", id = null) {
  const modalTitle = document.getElementById("medicoModalLabel");
  const form = document.getElementById("medicoForm");
  if (!form) return;
  form.reset();
  form.dataset.mode = mode;
  delete form.dataset.id;

  if (mode === "create") {
    modalTitle.textContent = "Nuevo Médico";
  } else {
    modalTitle.textContent = "Editar Médico";
    const medicos = getMedicos();
    const m = medicos.find(x => String(x.id) === String(id));
    if (!m) return;
    form.nombre.value = m.nombre;
    form.apellido.value = m.apellido;
    form.especialidad.value = m.especialidad;
    form.matricula.value = m.matricula;
    form.email.value = m.email;
    form.telefono.value = m.telefono;
    form.obraSocial.value = m.obraSocial;
    form.imagen.value = m.imagen;
    form.dataset.id = m.id;
  }

  const modal = new bootstrap.Modal(document.getElementById("medicoModal"));
  modal.show();
}

function viewMedico(id) {
  const medicos = getMedicos();
  const m = medicos.find(x => String(x.id) === String(id));
  if (!m) return;
  const body = document.getElementById("viewBody");
  if (!body) return;
  body.innerHTML = `
    <img src="${m.imagen || 'https://via.placeholder.com/150'}" class="img-fluid mb-3" alt="${m.nombre} ${m.apellido}">
    <p><strong>Nombre:</strong> ${m.nombre} ${m.apellido}</p>
    <p><strong>Especialidad:</strong> ${m.especialidad}</p>
    <p><strong>Matrícula:</strong> ${m.matricula}</p>
    <p><strong>Email:</strong> ${m.email}</p>
    <p><strong>Teléfono:</strong> ${m.telefono}</p>
    <p><strong>Obra social:</strong> ${m.obraSocial}</p>
  `;
  const modal = new bootstrap.Modal(document.getElementById("viewModal"));
  modal.show();
}

function deleteMedico(id) {
  if (!confirm("¿Eliminar este médico?")) return;
  const medicos = getMedicos().filter(m => String(m.id) !== String(id));
  saveMedicos(medicos);
  renderTable();
}

function onSubmitForm(e) {
  e.preventDefault();
  const form = e.target;
  const mode = form.dataset.mode;
  const medicos = getMedicos();

  const record = {
    id: mode === "create" ? Date.now() : Number(form.dataset.id),
    nombre: form.nombre.value.trim(),
    apellido: form.apellido.value.trim(),
    especialidad: form.especialidad.value,
    matricula: form.matricula.value.trim(),
    email: form.email.value.trim(),
    telefono: form.telefono.value.trim(),
    obraSocial: form.obraSocial.value,
    imagen: form.imagen.value.trim() || "https://via.placeholder.com/150"
  };

  if (mode === "create") {
    medicos.push(record);
  } else {
    const idx = medicos.findIndex(m => m.id === record.id);
    if (idx !== -1) medicos[idx] = record;
  }

  saveMedicos(medicos);
  renderTable();
  const modalEl = document.getElementById("medicoModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();
}

document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  renderTable();

  const btnNuevo = document.getElementById("btnNuevo");
  if (btnNuevo) btnNuevo.addEventListener("click", () => openForm("create"));

  const form = document.getElementById("medicoForm");
  if (form) form.addEventListener("submit", onSubmitForm);
});


// Exporto para el catálogo público
export async function obtenerMedicos() {
  initStorage();
  return getMedicos();
}
