import { INITIAL_MEDICOS } from "./datos.js";

const STORAGE_KEY = "medicos";

function initStorage() {
  let data = JSON.parse(localStorage.getItem(STORAGE_KEY));

  if (!Array.isArray(data) || data.length === 0 || !data[0].nombre) {
    console.warn("⚠️ Datos de médicos inválidos o vacíos. Se restauran los iniciales.");
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MEDICOS));
    data = INITIAL_MEDICOS;
  }

  return data;
}

function getMedicos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function renderCatalogo() {
  const contenedor = document.getElementById("catalogoMedicos");
  if (!contenedor) return;

  const medicos = getMedicos();
  contenedor.innerHTML = "";

  medicos.forEach((m) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    card.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${m.imagen || 'https://via.placeholder.com/150'}" class="card-img-top" alt="${m.nombre} ${m.apellido}">
        <div class="card-body">
          <h5 class="card-title">${m.nombre} ${m.apellido}</h5>
          <p class="card-text"><strong>Especialidad:</strong> ${m.especialidad}</p>
          <p class="card-text"><strong>Matrícula:</strong> ${m.matricula}</p>
          <p class="card-text"><strong>Obra social:</strong> ${m.obraSocial}</p>
        </div>
      </div>
    `;
    contenedor.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initStorage();
  renderCatalogo();
});
