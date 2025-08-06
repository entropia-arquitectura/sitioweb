document.addEventListener("DOMContentLoaded", function() {
  // Variables principales
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

// Tiempo de inicio para detectar envíos muy rápidos
const formStartTime = Date.now();

// Event listener principal del formulario
form.addEventListener("submit", function (e) {
  e.preventDefault();
  status.textContent = "";
  status.classList.remove("success", "error");
  
  const timeDiff = Date.now() - formStartTime;
  if (timeDiff < 3000) {
    status.classList.add("error");
    status.textContent = "Por favor, tomate un momento para completar el formulario.";
    return;
  }
  
  const honeypot = form.querySelector('[name="_gotcha"]');
  if (honeypot && honeypot.value !== '') {
    status.classList.add("error");
    status.textContent = "Error en el envío. Por favor, recargá la página e intentá nuevamente.";
    return;
  }
  
  const nameField = form.querySelector('[name="Nombre Completo"]');
  const email = form.querySelector('[name="Email"]');
  const messageField = form.querySelector('[name="Mensaje"]');
  
  if (nameField.value.trim().length < 2) {
    status.classList.add("error");
    status.textContent = "Por favor, ingresá tu nombre completo.";
    nameField.focus();
    return;
  }
  
  if (!email.value.includes("@") || !email.value.includes(".")) {
    status.classList.add("error");
    status.textContent = "Ingresá una dirección de correo válida.";
    email.focus();
    return;
  }
  
  if (messageField.value.trim().length < 10) {
    status.classList.add("error");
    status.textContent = "El mensaje debe tener al menos 10 caracteres.";
    messageField.focus();
    return;
  }
  
  
  // Deshabilitar botón y mostrar loading
  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando...";
  
  // GENERAR TOKEN RECAPTCHA Y ENVIAR
  grecaptcha.ready(function () {
    grecaptcha.execute('6Lfi4ZsrAAAAAMHtA0PcBxXPKbAyXjjzT60kH1ly', { action: 'contact_form' }).then(function (token) {
      
      let tokenInput = form.querySelector('[name="g-recaptcha-response"]');
      if (!tokenInput) {
        tokenInput = document.createElement('input');
        tokenInput.setAttribute('type', 'hidden');
        tokenInput.setAttribute('name', 'g-recaptcha-response');
        form.appendChild(tokenInput);
      }
      tokenInput.setAttribute('value', token);
      
      enviarFormulario();
      
    }).catch(function(error) {
      console.error('Error reCAPTCHA:', error);
      status.classList.add("error");
      status.textContent = "Error de verificación. Por favor, intentá nuevamente.";
      submitBtn.disabled = false;
      submitBtn.textContent = "Enviar";
    });
  });
});

async function enviarFormulario() {
  try {
    const formData = new FormData(form);
    
    const response = await fetch(form.action, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      // ÉXITO - Mostrar mensaje verde
      status.classList.add("success");
      status.style.color = "#28a745";
      status.style.padding = "15px";
      status.style.backgroundColor = "rgba(40, 167, 69, 0.1)";
      status.style.border = "1px solid #28a745";
      status.style.borderRadius = "5px";
      status.textContent = "✓ ¡Gracias! Tu consulta fue enviada correctamente. Nos pondremos en contacto a la brevedad.";
      
      // Limpiar formulario
      form.reset();
      
      // Scroll suave hacia el mensaje de éxito
      status.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Remover el token para el próximo envío
      const tokenInput = form.querySelector('[name="g-recaptcha-response"]');
      if (tokenInput) {
        tokenInput.remove();
      }
      
    } else {
      // ERROR del servidor
      const result = await response.json();
      const errorMsg = result.errors?.[0]?.message || "Ocurrió un error. Intentá nuevamente.";
      status.classList.add("error");
      status.style.color = "#dc3545";
      status.style.padding = "15px";
      status.style.backgroundColor = "rgba(220, 53, 69, 0.1)";
      status.style.border = "1px solid #dc3545";
      status.style.borderRadius = "5px";
      status.textContent = errorMsg;
    }
    
  } catch (error) {
    // ERROR de conexión
    console.error('Error de conexión:', error);
    status.classList.add("error");
    status.style.color = "#dc3545";
    status.style.padding = "15px";
    status.style.backgroundColor = "rgba(220, 53, 69, 0.1)";
    status.style.border = "1px solid #dc3545";
    status.style.borderRadius = "5px";
    status.textContent = "Error de conexión. Por favor, revisá tu internet o intentá más tarde.";
  } finally {
    // SIEMPRE rehabilitar el botón
    submitBtn.disabled = false;
    submitBtn.textContent = "Enviar";
  }
}

window.addEventListener('pageshow', function() {
  submitBtn.disabled = false;
  submitBtn.textContent = "Enviar";
  status.textContent = "";
  status.classList.remove("success", "error");
});
});