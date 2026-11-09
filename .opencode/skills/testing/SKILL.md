---
name: testing
description: Define cómo verificar las implementaciones de Task-do, ejecutar pruebas adecuadas y validar cambios antes de continuar o realizar commits.
---

# Testing y control de cambios

## Objetivo

Verificar que cada funcionalidad implementada en Task-do funcione correctamente antes de darla por terminada.

Trabajar de forma incremental: implementar, revisar, probar, informar resultados y esperar la aprobación del usuario para continuar.

## 1. Antes de probar

- Revisar qué funcionalidad se acaba de implementar.
- Identificar los archivos modificados y comprender los cambios.
- Revisar los scripts disponibles en `package.json`.
- Consultar la documentación oficial cuando sea necesario verificar cómo probar una API o dependencia de Expo SDK 58.
- No asumir que una prueba existe o que se ejecutó correctamente.

## 2. Tipos de comprobaciones

Utilizar las comprobaciones que correspondan a la implementación:

### Revisión estática

- Ejecutar `npx tsc --noEmit` para comprobar errores de TypeScript.
- Ejecutar `npx expo lint` (ESLint ya está configurado con `eslint-config-expo`).
- Ejecutar `npx expo-doctor` para detectar problemas de configuración o dependencias.
- Revisar imports, tipos, dependencias y posibles errores introducidos.
- Comprobar que no existan referencias a archivos o funciones inexistentes.
- Comprobar que no existan imports de dependencias no instaladas.

### Pruebas funcionales

Cuando la funcionalidad ya esté implementada en la aplicación:

- Comprobar el flujo principal desde la interfaz.
- Verificar los estados de carga, éxito y error cuando correspondan.
- Comprobar validaciones y casos incorrectos.
- Revisar el comportamiento ante errores de red cuando la funcionalidad dependa de servicios externos.
- Verificar que los cambios no afecten funcionalidades anteriores relacionadas.

### Pruebas específicas

- Para autenticación, comprobar los flujos implementados de registro, inicio de sesión, Google, recuperación de contraseña y cierre de sesión.
- Para tareas, comprobar creación, consulta, edición, eliminación y cambio de estado.
- Para fecha y hora, comprobar que ambas se guarden, se recuperen y se muestren correctamente.
- Para Supabase, comprobar que las operaciones correspondan al usuario autenticado y respeten las políticas RLS.
- Para animaciones, comprobar que se reproduzcan correctamente y que sus estados correspondan a la acción realizada.

No ejecutar pruebas que no tengan relación con los cambios realizados.

## 3. Pruebas en la aplicación

- Priorizar las pruebas reales en el dispositivo o emulador cuando sea necesario.
- No crear pantallas temporales únicamente para probar configuraciones.
- No modificar configuraciones funcionales solo para realizar pruebas innecesarias.
- No considerar que una compilación exitosa garantiza que la funcionalidad trabaja correctamente.
- Si una prueba requiere credenciales, servicios externos o intervención del usuario, explicar qué se necesita antes de continuar.

## 4. Corrección de errores

Si una prueba falla:

1. Identificar el error y su causa.
2. Revisar los archivos relacionados.
3. Corregir únicamente lo necesario.
4. Volver a ejecutar las comprobaciones afectadas.
5. Informar si el problema quedó resuelto o continúa pendiente.

No ocultar errores ni declarar una implementación terminada cuando todavía existan fallos.

## 5. Informe de resultados

Al terminar cada conjunto de pruebas, presentar un resumen que indique:

- Funcionalidad comprobada.
- Comprobaciones ejecutadas.
- Resultados satisfactorios.
- Errores encontrados y correcciones realizadas.
- Problemas pendientes.
- Archivos modificados.

Diferenciar claramente entre pruebas ejecutadas, pruebas pendientes y pruebas que no pudieron realizarse.

## 6. Control de Git y commits

**Regla obligatoria: nunca realizar commits sin autorización explícita del usuario.**

Después de implementar y probar una funcionalidad:

1. Mostrar el resultado de las pruebas.
2. Informar los archivos modificados.
3. Esperar a que el usuario revise y confirme si desea realizar el commit.
4. Solo después de recibir autorización explícita, ejecutar los comandos de Git necesarios para crear el commit.

Está prohibido:

- Ejecutar `git commit` sin autorización.
- Crear commits automáticamente porque las pruebas hayan pasado.
- Realizar `git push` sin autorización.
- Cambiar de fase o comenzar otra funcionalidad sin que el usuario haya revisado el resultado de la fase actual.

Se puede utilizar `git status` y revisar los cambios para informar al usuario, sin modificar el historial de Git.

## 7. Forma de trabajo

Seguir siempre este ciclo:

1. Implementar una funcionalidad.
2. Revisar los cambios.
3. Ejecutar las comprobaciones correspondientes.
4. Corregir errores, si existen.
5. Presentar los resultados al usuario.
6. Esperar su aprobación antes de continuar.

El usuario mantiene el control sobre la aceptación de cada implementación y sobre los commits.
