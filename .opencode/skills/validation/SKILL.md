---
name: validation
description: Gestiona la autenticación completa de Task-do mediante Supabase y Google OAuth, las validaciones de formularios, la recuperación de contraseña y el perfil del usuario.
---

# Authentication, Validation and User Management

## 1. Configuración existente

Task-do utiliza Supabase para autenticación y persistencia de usuarios.

Configuración existente:

- Cliente Supabase: `src/lib/supabase.ts`
- Variables de entorno en `.env.local`:
  - `EXPO_PUBLIC_SUPABASE_URL`
  - `EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- Soporte Web Crypto para PKCE: `src/lib/crypto-polyfill.ts` mediante `expo-crypto`.
- Flujo OAuth configurado con `flowType: 'pkce'`.
- Expo SDK 58.
- Expo Router.
- Expo Linking.
- Expo Web Browser.
- React Native URL Polyfill.

No crear otro cliente Supabase ni duplicar su configuración.

Las credenciales de Google y la configuración del proveedor ya están registradas en Supabase.

## 2. Validaciones de formularios

### Correo electrónico
- Campo obligatorio.
- Validar que tenga un formato de correo electrónico válido.
- Eliminar espacios al inicio y al final.
- Mostrar mensajes claros cuando el formato sea incorrecto.

### Contraseña
- Mínimo 6 caracteres.
- Debe contener al menos una letra y un número.
- No aceptar campos vacíos.
- Aplicar las mismas reglas al registro y al establecimiento de una nueva contraseña.
- Mantener coherencia con las políticas configuradas en Supabase.

### Nombre completo
- Campo obligatorio durante el registro.
- Mínimo 3 caracteres después de eliminar espacios innecesarios.
- No aceptar nombres compuestos únicamente por espacios.

### Confirmación de contraseña
- Debe coincidir exactamente con la contraseña ingresada.
- Validar antes de enviar cualquier solicitud.

## 3. Registro con correo y contraseña

Utilizar `supabase.auth.signUp()`.

Solicitar:
- Nombre completo.
- Correo electrónico.
- Contraseña.
- Confirmación de contraseña.

Guardar el nombre completo en los metadatos del usuario mediante `options.data`.

Utilizar el enlace de confirmación:

`applogindeber6://auth/confirm-email`

Consideraciones:
- Mantener habilitada la confirmación de correo.
- Informar al usuario que debe revisar su bandeja de entrada.
- No asumir que existe una sesión activa inmediatamente después del registro.
- Gestionar errores de correo ya registrado y otros errores devueltos por Supabase.

## 4. Inicio de sesión

### Correo y contraseña

Utilizar `supabase.auth.signInWithPassword()`.

- Validar los campos antes de realizar la solicitud.
- Gestionar credenciales incorrectas.
- Mostrar indicadores de carga.
- Evitar solicitudes repetidas.
- Permitir el acceso cuando Supabase confirme la autenticación.

### Google OAuth

Utilizar Supabase OAuth con el proveedor `google`.

Implementar el flujo móvil:

1. El usuario selecciona iniciar sesión con Google.
2. Ejecutar `supabase.auth.signInWithOAuth()`.
3. Configurar `provider: 'google'`.
4. Utilizar `skipBrowserRedirect: true`.
5. Configurar `redirectTo` con el deep link registrado.
6. Abrir el proceso mediante `WebBrowser.openAuthSessionAsync()`.
7. Recibir y procesar la respuesta OAuth.
8. Intercambiar el código de autorización mediante `exchangeCodeForSession()` (flujo PKCE).
9. Actualizar el estado global de autenticación.

El flujo PKCE requiere `crypto.getRandomValues()` y `crypto.subtle.digest()`. Importar `src/lib/crypto-polyfill.ts` antes de crear el cliente Supabase; React Native no incluye Web Crypto por defecto.

No asumir que todas las respuestas OAuth contienen un código válido.

Gestionar:
- Cancelación del proceso.
- Errores de autenticación.
- Respuestas inválidas.
- Retorno a la aplicación.

No exponer el Client Secret de Google en el código móvil.

## 5. Deep Linking

El esquema registrado es:

`applogindeber6`

URLs configuradas:

- `applogindeber6://auth/callback`
- `applogindeber6://auth/confirm-email`
- `applogindeber6://auth/reset-password`

Implementar las rutas correspondientes mediante Expo Router.

Consideraciones:
- Procesar correctamente los enlaces recibidos.
- Gestionar enlaces cuando la aplicación está abierta o cerrada.
- Evitar procesar dos veces el mismo callback.
- Diferenciar confirmación de correo, recuperación de contraseña y autenticación OAuth.
- Consultar la documentación vigente de Expo y Supabase antes de implementar el flujo.

## 6. Recuperación y cambio de contraseña

### Recuperación

Utilizar `supabase.auth.resetPasswordForEmail()`.

Enviar el enlace con:

`applogindeber6://auth/reset-password`

Permitir que el usuario establezca una contraseña nueva después de completar el flujo de recuperación.

### Cambio de contraseña

Solicitar:

1. Contraseña actual.
2. Nueva contraseña.
3. Confirmación de nueva contraseña.

Validar:
- Que la contraseña actual sea correcta mediante una reautenticación apropiada.
- Que la nueva contraseña cumpla las reglas establecidas.
- Que la confirmación coincida.

Actualizar mediante:

`supabase.auth.updateUser({ password: nuevaPassword })`

No asumir que `updateUser()` verifica automáticamente la contraseña actual.

Para usuarios autenticados exclusivamente con Google que no tengan contraseña establecida, gestionar el caso por separado.

## 7. Perfil de usuario

Permitir consultar y editar los datos del usuario autenticado.

Información visible:
- Nombre completo.
- Correo electrónico.

### Edición

Utilizar:

`supabase.auth.updateUser({ data: { full_name: nombre } })`

Validar el nombre antes de guardar.

Actualizar la interfaz después de confirmar que la operación fue exitosa.

No mostrar etiquetas técnicas como "(Google)" ni información interna del backend.

Se pueden utilizar etiquetas sencillas como "Usuario activo".

## 8. Persistencia y estado de autenticación

- Utilizar el cliente Supabase existente.
- Mantener la persistencia de sesión configurada.
- Utilizar `supabase.auth.onAuthStateChange()` para observar cambios.
- Centralizar el estado mediante un provider.
- Gestionar la renovación automática del token mediante `AppState` cuando corresponda.
- Limpiar correctamente las suscripciones y listeners.
- Mantener sincronizado el estado de autenticación con la navegación.

## 9. Cierre de sesión

Utilizar `supabase.auth.signOut()`.

- Mostrar un diálogo de confirmación.
- Permitir cancelar.
- Ejecutar el cierre de sesión cuando el usuario confirme.
- Limpiar el estado de autenticación.
- Redirigir a la pantalla de inicio de sesión después de cerrar correctamente.

## 10. Experiencia de usuario

- Mostrar mensajes de validación junto a los campos.
- Identificar visualmente los errores.
- Mostrar indicadores de carga.
- Deshabilitar botones durante operaciones en proceso.
- Mostrar mensajes comprensibles de éxito y error.
- Evitar mostrar errores técnicos directamente al usuario.
- Mantener consistencia con la identidad visual de Task-do.

## 11. Organización y seguridad

- Mantener los servicios de autenticación dentro de `src/features/auth/services/`.
- Mantener hooks y componentes dentro de `src/features/auth/`.
- Evitar llamadas directas a Supabase desde múltiples pantallas.
- Reutilizar validaciones cuando corresponda.
- No almacenar contraseñas manualmente.
- No exponer claves privadas ni tokens.
- No modificar credenciales, políticas o configuración de Supabase sin autorización.
- No instalar dependencias que ya estén disponibles.
- No agregar funcionalidades no solicitadas.
