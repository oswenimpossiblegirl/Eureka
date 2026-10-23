let preguntas = [];
let preguntaActual = 0;
let opcionSeleccionada = null;
let segundos = 0;
let timerInterval;

// Cargar preguntas desde el archivo JSON
async function cargarPreguntas() {
  const res = await fetch('preguntas.json');
  preguntas = await res.json();
  mostrarPregunta();
  iniciarCronometro();
}

function iniciarCronometro() {
  segundos = 0;
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    segundos++;
    const mins = String(Math.floor(segundos / 60)).padStart(2, '0');
    const secs = String(segundos % 60).padStart(2, '0');
    document.getElementById('time-display').innerText = `${mins}:${secs}`;
  }, 1000);
}

function mostrarPregunta() {
  const p = preguntas[preguntaActual];
  document.getElementById('modulo-tag').innerText = p.modulo;
  document.getElementById('pregunta-texto').innerText = p.pregunta;
  
  const container = document.getElementById('opciones-container');
  container.innerHTML = '';

  p.opciones.forEach(opt => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerText = `${opt.id}) ${opt.texto}`;
    btn.onclick = () => seleccionarOpcion(opt.id, btn);
    container.appendChild(btn);
  });

  document.getElementById('btn-comprobar').disabled = true;
  document.getElementById('feedback-card').classList.add('hidden');
}

function seleccionarOpcion(id, btnElement) {
  opcionSeleccionada = id;
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btnElement.classList.add('selected');
  document.getElementById('btn-comprobar').disabled = false;
}

function comprobarRespuesta() {
  clearInterval(timerInterval);
  const p = preguntas[preguntaActual];
  const feedbackCard = document.getElementById('feedback-card');
  const statusBadge = document.getElementById('status-badge');
  
  if (opcionSeleccionada === p.correcta) {
    statusBadge.innerHTML = "🟢 <strong>¡Respuesta Correcta!</strong>";
  } else {
    statusBadge.innerHTML = "🔴 <strong>Respuesta Incorrecta</strong>";
  }

  document.getElementById('hack-texto').innerText = p.hack;

  const lista = document.getElementById('desglose-lista');
  lista.innerHTML = '';
  Object.keys(p.desglose).forEach(key => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>Opción ${key}:</strong> ${p.desglose[key]}`;
    lista.appendChild(li);
  });

  feedbackCard.classList.remove('hidden');
}

function siguientePregunta() {
  preguntaActual++;
  if (preguntaActual < preguntas.length) {
    mostrarPregunta();
    iniciarCronometro();
  } else {
    alert("¡Has completado la práctica!");
  }
}

// Iniciar aplicación
cargarPreguntas();
