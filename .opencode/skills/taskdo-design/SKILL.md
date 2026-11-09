---
name: taskdo-design
description: Define la identidad visual, experiencia de usuario, diseño de interfaces, componentes, estilos con Uniwind y animaciones Lottie de Task-do. Consultar al crear o modificar pantallas y funcionalidades visuales.
---

# Task-do Design

## 1. Identidad del proyecto

Task-do es una aplicación móvil para organizar tareas personales.

Lema: "Organiza. Prioriza. Cumple."

La interfaz debe transmitir organización, sencillez y tranquilidad. Debe ser moderna, agradable, intuitiva y fácil de utilizar.

## 2. Paleta oficial

Utilizar exclusivamente esta paleta como base de la identidad visual:

- taskdo-brown: #684f48. Encabezados, botones primarios, iconos activos y elementos destacados.
- taskdo-blue: #d6e9ed. Fondos principales, modales y contenedores.
- taskdo-gray: #ccd6d6. Bordes sutiles, botones secundarios, separadores y elementos inactivos.
- taskdo-cream: #f9e7c7. Fondos de tarjetas, alertas suaves y elementos destacados.

Antes de introducir nuevos colores, revisar si alguno de los colores existentes puede cumplir esa función.

Mantener suficiente contraste para que los textos y controles sean legibles.

No utilizar colores para representar prioridades, ya que Task-do no contempla esa funcionalidad.

## 3. Criterios de diseño

- Diseñar primero para dispositivos móviles.
- Utilizar únicamente el tema claro; el modo oscuro no forma parte del alcance.
- Mantener una interfaz limpia, ordenada y visualmente equilibrada.
- Utilizar espacios y márgenes consistentes.
- Mantener una jerarquía visual clara entre títulos, subtítulos, contenido y acciones.
- Evitar interfaces sobrecargadas y elementos decorativos innecesarios.
- Mantener consistencia entre todas las pantallas.
- Utilizar componentes reutilizables cuando tenga sentido.
- Mostrar estados visuales claros para carga, errores, listas vacías y operaciones exitosas.
- Incorporar animaciones únicamente cuando mejoren la experiencia de usuario.

## 4. Experiencia de usuario

La aplicación debe permitir que el usuario comprenda fácilmente cómo:

- Registrarse e iniciar sesión.
- Recuperar su contraseña.
- Consultar sus tareas.
- Crear y editar tareas.
- Marcar tareas como completadas o pendientes.
- Eliminar tareas.
- Consultar tareas según su fecha programada.

No incorporar categorías ni prioridades.

La fecha programada representa el día en que el usuario desea realizar una tarea, no una fecha límite.

## 5. Diseño y funcionalidades del CRUD de tareas

### Create (Crear)

Permitir ingresar:

- Título obligatorio.
- Descripción opcional.
- Fecha programada obligatoria.
- Hora programada obligatoria.

Validar los campos antes de guardar.

### Read (Leer)

Mostrar las tareas asociadas al `user_id` del usuario autenticado.

Incluir filtros:

- Todas.
- Pendientes.
- Completadas.

Diferenciar visualmente las tareas completadas de las pendientes.

### Update (Editar)

- Incorporar un icono de lápiz en cada tarjeta.
- Al seleccionarlo, permitir editar la tarea mediante un modal o formulario.
- Permitir modificar título, descripción, fecha programada y hora programada.
- Permitir marcar tareas como completadas o pendientes directamente desde su tarjeta.

### Delete (Eliminar)

- Incorporar un icono de papelera en cada tarjeta.
- Solicitar confirmación mediante un diálogo antes de eliminar.
- Ejecutar la eliminación únicamente después de la confirmación.
- Actualizar la interfaz después de completar la operación.

## 6. Visualización de tarjetas de tareas

Cada tarjeta debe mostrar:

- Título.
- Descripción, cuando exista.
- Fecha programada.
- Hora programada.
- Estado de la tarea.
- Acciones para editar y eliminar.

Mostrar explícitamente la fecha programada, utilizando un formato comprensible para el usuario.

Utilizar los colores de la paleta para diferenciar visualmente los estados, sin introducir prioridades.

Mantener tarjetas con:

- Bordes redondeados (`rounded-2xl` o `rounded-3xl`).
- Sombras suaves (`shadow-sm` o `shadow-md`).
- Espaciado interno adecuado.
- Estados interactivos al presionar (`active:opacity-80`).

## 7. Uniwind y Tailwind CSS 4

La aplicación utiliza Uniwind 1.13.2 y Tailwind CSS 4.3.5.

La configuración existente se encuentra en:

- `metro.config.js`
- `src/global.css`
- `src/app/_layout.tsx`
- `uniwind-types.d.ts`

Reglas:

- Utilizar Uniwind para los estilos de los componentes.
- Utilizar clases de utilidad de Tailwind CSS 4.
- Reutilizar las variables de color declaradas en `src/global.css`.
- Evitar repetir códigos hexadecimales cuando exista una variable de tema.
- Mantener consistencia en márgenes, espacios, tamaños y alineaciones.
- Priorizar Flexbox para la distribución de componentes.
- Considerar las áreas seguras del dispositivo y el teclado.
- Mantener los diseños adaptables a diferentes tamaños de pantalla.
- Evitar duplicar grandes bloques de clases.
- Crear componentes visuales reutilizables cuando corresponda.

No instalar NativeWind ni otras librerías de estilos.

No modificar la configuración existente de Metro, Uniwind o Tailwind sin una razón justificada.

## 8. Animaciones Lottie

Utilizar `lottie-react-native` para mejorar la experiencia visual.

La dependencia ya está instalada.

Los recursos de animación deben almacenarse en:

`assets/animations/`

Situaciones recomendadas:

- Procesamiento o carga.
- Operaciones completadas correctamente.
- Errores cuando una animación aporte claridad.
- Listas vacías de tareas.

Reglas de implementación:

- Utilizar el componente `LottieView`.
- Crear componentes reutilizables para las animaciones cuando corresponda.
- Mantener las animaciones separadas de la lógica de negocio.
- Controlar correctamente los estados de reproducción.
- Evitar reproducir animaciones innecesariamente.
- Utilizar animaciones breves y agradables.
- Evitar animaciones excesivamente pesadas.
- Mantener coherencia con la paleta visual de Task-do.

Los archivos JSON deben ser animaciones Lottie válidas.

No crear archivos vacíos ni inventar animaciones JSON.

Comprobar que el recurso exista antes de importarlo.

Recordar que Lottie contiene código nativo y requiere un development build para probarse correctamente.

## 9. Componentes y organización visual

- Mantener los componentes compartidos en `src/components/`.
- Mantener los componentes específicos de tareas en `src/features/tasks/components/`.
- Mantener las pantallas dentro de `src/app/`.
- Separar la presentación de la lógica de negocio cuando corresponda.
- Evitar duplicar componentes que puedan reutilizarse.
- Mantener nombres descriptivos y consistentes.

## 10. Reglas importantes

- No modificar la paleta oficial sin autorización.
- No incorporar categorías ni prioridades.
- No agregar campos que no existan en el modelo de datos aprobado.
- No inventar nuevas funcionalidades o elementos de interfaz.
- No rediseñar pantallas que no formen parte de la tarea solicitada.
- No instalar otras librerías de estilos o animaciones.
- No modificar configuraciones existentes sin justificación.
- Antes de realizar cambios visuales importantes, explicar brevemente la propuesta.
- Priorizar siempre la claridad y facilidad de uso sobre los efectos decorativos.
- No confundir la fecha y hora programadas con una fecha límite.
- La fecha y hora representan el momento en que el usuario desea realizar la tarea.
