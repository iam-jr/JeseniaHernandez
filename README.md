# Estilista Profesional - Sistema de Reservas Online

Una página web moderna y profesional para un servicio de estilismo con más de 30 años de experiencia, con sistema integrado de reservas de citas.

## 📁 Archivos

- **index.html** - Estructura HTML completa con todas las secciones
- **styles.css** - Estilos y diseño responsivo
- **script.js** - Funcionalidad del calendario, reservas y formulario de contacto

## ✨ Características Principales

### 🎫 Sistema de Reservas Integrado
- **Calendario interactivo** - Selecciona fechas disponibles
- **Horarios en tiempo real** - Elige tu hora preferida
- **Servicios variables** - 6 servicios diferentes con precios
- **Información del cliente** - Captura nombre, email y teléfono
- **Resumen de cita** - Visualiza todos los detalles antes de confirmar
- **Almacenamiento local** - Las reservas se guardan en el navegador

### 📄 Secciones de la Página

1. **Inicio (Hero)** - Presentación y llamada a acción
2. **Sobre Nosotros** - Información sobre la experiencia profesional (30+ años)
3. **Reseñas** - Testimonios de clientes
4. **Servicios** - Descripción detallada de los 6 servicios
5. **Galería** - Espacio para fotos de trabajos
6. **Precios** - Lista completa de servicios y precios
7. **Equipo** - Perfil del profesional
8. **Hablemos** - Formulario de contacto + información
9. **Footer** - Información y derechos

## 🎨 Diseño

- **Estilo Luxury** - Colores oscuros con dorados
- **Responsive** - Funciona en móviles, tablets y desktop
- **Navegación Sticky** - Menú fijo en la parte superior
- **Smooth Scroll** - Desplazamiento suave entre secciones

## 🚀 Cómo Usar

1. Abre `index.html` en tu navegador
2. Navega por las diferentes secciones
3. Para hacer una reserva:
   - Selecciona un servicio en la sección "Reservar Cita"
   - Elige una fecha en el calendario
   - Selecciona una hora disponible
   - Ingresa tu información
   - Confirma tu cita
4. Las reservas se guardan automáticamente en el navegador

## 📋 Servicios

1. **Corte y Estilo** - $55
2. **Tratamiento de Color** - $65
3. **Estilismo Avanzado** - $75
4. **Tratamiento Facial** - $50
5. **Peinado Especial** - $45
6. **Corte Niñas** - $35

## 📞 Información de Contacto

- **Teléfono:** +1 (939) 353-5676
- **Email:** info@estilista.com
- **Ubicación:** Miramar, San Juan, Puerto Rico
- **Horarios:**
  - Martes a Sábado: 9:00 am - 6:00 pm
  - Lunes y Domingo: Cerrado

## 💾 Almacenamiento de Datos

Las reservas se guardan en el `localStorage` del navegador. Para ver las reservas guardadas, abre la consola del navegador y ejecuta:

```javascript
JSON.parse(localStorage.getItem('barberBookings'))
```

## 🔧 Personalización

Puedes personalizar fácilmente:

- **Colores** - Edita las variables CSS en la sección `:root` de `styles.css`
- **Servicios** - Modifica los datos en el HTML
- **Horarios** - Cambia `businessHours` en `script.js`
- **Información** - Actualiza el contenido en `index.html`

## 📱 Compatibilidad

- Chrome/Chromium ✓
- Firefox ✓
- Safari ✓
- Edge ✓
- Mobile browsers ✓

## 📝 Notas

- El calendario solo permite seleccionar fechas futuras
- El calendario bloquea domingos y lunes (días cerrados)
- Algunos horarios están marcados como "no disponibles" para demostración
- El formulario de contacto muestra un mensaje de confirmación

---

**Versión:** 1.0  
**Año:** 2026  
**Última actualización:** Enero 2026
