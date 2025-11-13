const STORAGE_KEY = "especialidades";

function initStorage() {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Cargando...");
    const iniciales = [
      { id: 1, nombre: "Cardiología", descripcion: "Especialidad centrada en el diagnóstico y tratamiento del corazón." },
      { id: 2, nombre: "Pediatría", descripcion: "Atención médica integral de niños y adolescentes." },
      { id: 3, nombre: "Dermatología", descripcion: "Tratamiento de enfermedades y cuidado de la piel." }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(iniciales));
  }
}

function getEspecialidades() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveEspecialidades(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function renderTable() {
  const tbody = document.querySelector("#especialidadesTable tbody");
  if (!tbody) return;
  const especialidades = getEspecialidades();
  tbody.innerHTML = "";

  especialidades.forEach((e) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.id}</td>
      <td>${e.nombre}</td>
      <td>${e.descripcion}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-info me-1 view-btn" data-id="${e.id}">Ver</button>
        <button class="btn btn-sm btn-primary me-1 edit-btn" data-id="${e.id}">Editar</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${e.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".view-btn").forEach(b => b.addEventListener("click", (e) => viewEspecialidad(e.target.dataset.id)));
  document.querySelectorAll(".edit-btn").forEach(b => b.addEventListener("click", (e) => openForm("edit", e.target.dataset.id)));
  document.querySelectorAll(".delete-btn").forEach(b => b.addEventListener("click", (e) => deleteEspecialidad(e.target.dataset.id)));
}

function openForm(mode = "create", id = null) {
  const modalTitle = document.getElementById("especialidadModalLabel");
  const form = document.getElementById("especialidadForm");
  if (!form) return;
  form.reset();
  form.dataset.mode = mode;
  delete form.dataset.id;

  if (mode === "create") {
    modalTitle.textContent = "Nueva Especialidad";
  } else {
    modalTitle.textContent = "Editar Especialidad";
    const especialidades = getEspecialidades();
    const e = especialidades.find(x => String(x.id) === String(id));
    if (!e) return;
    form.nombre.value = e.nombre;
    form.descripcion.value = e.descripcion;
    form.dataset.id = e.id;
  }

  const modal = new bootstrap.Modal(document.getElementById("especialidadModal"));
  modal.show();
}

function viewEspecialidad(id) {
  const especialidades = getEspecialidades();
  const e = especialidades.find(x => String(x.id) === String(id));
  if (!e) return;
  const body = document.getElementById("viewBody");
  if (!body) return;
  body.innerHTML = `
    <p><strong>Nombre:</strong> ${e.nombre}</p>
    <p><strong>Descripción:</strong> ${e.descripcion}</p>
  `;
  const modal = new bootstrap.Modal(document.getElementById("viewModal"));
  modal.show();
}

function deleteEspecialidad(id) {
  if (!confirm("¿Eliminar esta especialidad?")) return;
  const especialidades = getEspecialidades().filter(e => String(e.id) !== String(id));
  saveEspecialidades(especialidades);
  renderTable();
}

function onSubmitForm(e) {
  e.preventDefault();
  const form = e.target;
  const mode = form.dataset.mode;
  const especialidades = getEspecialidades();

  const record = {
    id: mode === "create" ? Date.now() : Number(form.dataset.id),
    nombre: form.nombre.value.trim(),
    descripcion: form.descripcion.value.trim()
  };

  if (mode === "create") {
    especialidades.push(record);
  } else {
    const idx = especialidades.findIndex(e => e.id === record.id);
    if (idx !== -1) especialidades[idx] = record;
  }

  saveEspecialidades(especialidades);
  renderTable();
  const modalEl = document.getElementById("especialidadModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();
}

document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  renderTable();

  const btnNueva = document.getElementById("btnNueva");
  if (btnNueva) btnNueva.addEventListener("click", () => openForm("create"));

  const form = document.getElementById("especialidadForm");
  if (form) form.addEventListener("submit", onSubmitForm);
});
