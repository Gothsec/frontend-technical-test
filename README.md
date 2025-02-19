# frontend-technical-test
# HU: Administración de alojamiento hoteles locales

Esta HU se centra en que el agente de viajes pueda gestionar su lista de hoteles. A continuación se detalla lo implementado:

- ✅ **Crear un nuevo hotel:**  
  Se permite crear un hotel ingresando el nombre, ciudad y descripción.

- ✅ **Asignar habitaciones al hotel:**  
  Se puede agregar una habitación a un hotel, ingresando el tipo de habitación, ubicación, costo base e impuestos.

- ⚠️ **Modificar los valores de cada habitación:**  
  Se implementa la funcionalidad de habilitar/deshabilitar habitaciones, pero la edición completa de valores (como costo base e impuestos) no se encuentra en la interfaz actual.

- ⚠️ **Modificar los datos de cada hotel:**  
  Aunque se cuenta con la función `updateHotel` en el servicio, en la interfaz actual no se ha implementado un formulario para editar los datos completos del hotel.

- ✅ **Habilitar/Deshabilitar cada hotel:**  
  Se puede alternar el estado (habilitado/deshabilitado) de cada hotel mediante un botón.

- ✅ **Habilitar/Deshabilitar cada habitación:**  
  Se permite alternar el estado de cada habitación dentro del hotel.

- ✅ **Listar reservas realizadas en los hoteles:**  
  Se incluye un componente de gestión de reservas que lista las reservas realizadas.

- ✅ **Ver detalle de cada reserva:**  
  El agente puede ver el detalle completo de cada reserva (incluyendo datos de pasajeros y contacto de emergencia).

**Observaciones adicionales:**

- ✅ Cada habitación permite registrar el costo base, impuestos y tipo de habitación.  
- ✅ Cada habitación permite registrar la ubicación.

--- 
# HU: Reserva de hoteles

Esta HU está orientada a la experiencia del viajero para realizar reservas. Se han implementado los siguientes requerimientos:

- ✅ **Buscar hoteles:**  
  El sistema permite buscar hoteles por:
  - Ciudad de destino.
  - Fecha de entrada.
  - Fecha de salida.
  - Cantidad de personas.

- ✅ **Elegir una habitación:**  
  Una vez realizada la búsqueda, el viajero puede seleccionar una habitación del hotel de su preferencia.

- ✅ **Desplegar formulario de reserva:**  
  Al seleccionar la habitación, se muestra un formulario para ingresar los datos de los huéspedes, que incluye:
  - Nombres y apellidos.
  - Fecha de nacimiento.
  - Género.
  - Tipo y número de documento.
  - Email.
  - Teléfono de contacto.

- ✅ **Realizar la reserva:**  
  El sistema permite completar la reserva de la habitación con los datos ingresados.

- ⛔ **Notificar reserva por correo electrónico:**  
  Implementando...

- ✅ **Asociar contacto de emergencia:**  
  La reserva incluye datos del contacto de emergencia (nombres completos y teléfono).

**Observaciones adicionales:**

- Los datos de cada pasajero se recogen de forma individual, de acuerdo a la cantidad de personas ingresada.
