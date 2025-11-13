const STORAGE_KEY = "obrasSociales";

function initStorage() {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Cargando...");
    const iniciales = [
      { id: 1, nombre: "OSDE", telefono: "0810-555-6733", email: "contacto@osde.com.ar", cobertura: "Consultas médicas, estudios, internaciones." },
      { id: 2, nombre: "Swiss Medical", telefono: "0810-444-7700", email: "info@swissmedical.com.ar", cobertura: "Cobertura médica integral, odontología, emergencias." },
      { id: 3, nombre: "PAMI", telefono: "138", email: "pami@pami.org.ar", cobertura: "Atención médica a jubilados y pensionados." }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(iniciales));
  }
}

function getObras() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveObras(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function renderTable() {
  const tbody = document.querySelector("#obrasTable tbody");
  if (!tbody) return;
  const obras = getObras();
  tbody.innerHTML = "";

  obras.forEach((o) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${o.id}</td>
      <td>${o.nombre}</td>
      <td>${o.telefono || "-"}</td>
      <td>${o.email || "-"}</td>
      <td class="text-end">
        <button class="btn btn-sm btn-info me-1 view-btn" data-id="${o.id}">Ver</button>
        <button class="btn btn-sm btn-primary me-1 edit-btn" data-id="${o.id}">Editar</button>
        <button class="btn btn-sm btn-danger delete-btn" data-id="${o.id}">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll(".view-btn").forEach(b => b.addEventListener("click", (e) => viewObra(e.target.dataset.id)));
  document.querySelectorAll(".edit-btn").forEach(b => b.addEventListener("click", (e) => openForm("edit", e.target.dataset.id)));
  document.querySelectorAll(".delete-btn").forEach(b => b.addEventListener("click", (e) => deleteObra(e.target.dataset.id)));
}

function openForm(mode = "create", id = null) {
  const modalTitle = document.getElementById("obraModalLabel");
  const form = document.getElementById("obraForm");
  if (!form) return;
  form.reset();
  form.dataset.mode = mode;
  delete form.dataset.id;

  if (mode === "create") {
    modalTitle.textContent = "Nueva Obra Social";
  } else {
    modalTitle.textContent = "Editar Obra Social";
    const obras = getObras();
    const o = obras.find(x => String(x.id) === String(id));
    if (!o) return;
    form.nombre.value = o.nombre;
    form.telefono.value = o.telefono;
    form.email.value = o.email;
    form.cobertura.value = o.cobertura;
    form.dataset.id = o.id;
  }

  const modal = new bootstrap.Modal(document.getElementById("obraModal"));
  modal.show();
}

function viewObra(id) {
  const obras = getObras();
  const o = obras.find(x => String(x.id) === String(id));
  if (!o) return;
  const body = document.getElementById("viewBody");
  if (!body) return;
  body.innerHTML = `
    <p><strong>Nombre:</strong> ${o.nombre}</p>
    <p><strong>Teléfono:</strong> ${o.telefono || "-"}</p>
    <p><strong>Email:</strong> ${o.email || "-"}</p>
    <p><strong>Cobertura:</strong> ${o.cobertura || "-"}</p>
  `;
  const modal = new bootstrap.Modal(document.getElementById("viewModal"));
  modal.show();
}

function deleteObra(id) {
  if (!confirm("¿Eliminar esta obra social?")) return;
  const obras = getObras().filter(o => String(o.id) !== String(id));
  saveObras(obras);
  renderTable();
}

function onSubmitForm(e) {
  e.preventDefault();
  const form = e.target;
  const mode = form.dataset.mode;
  const obras = getObras();

  const record = {
    id: mode === "create" ? Date.now() : Number(form.dataset.id),
    nombre: form.nombre.value.trim(),
    telefono: form.telefono.value.trim(),
    email: form.email.value.trim(),
    cobertura: form.cobertura.value.trim()
  };

  if (mode === "create") {
    obras.push(record);
  } else {
    const idx = obras.findIndex(o => o.id === record.id);
    if (idx !== -1) obras[idx] = record;
  }

  saveObras(obras);
  renderTable();
  const modalEl = document.getElementById("obraModal");
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();
}

document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  renderTable();

  const btnNueva = document.getElementById("btnNueva");
  if (btnNueva) btnNueva.addEventListener("click", () => openForm("create"));

  const form = document.getElementById("obraForm");
  if (form) form.addEventListener("submit", onSubmitForm);
});
