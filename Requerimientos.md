# PROYECTO

## Equipo 5

## Integrantes : Albacura Dilan, Cuesaca Manuel, Gonzáles Yari, Diaz Jonathan, Moncayo

## Carlos

## Fecha : 08/07/

# 1. Equipo de trabajo

```
Integrante Rol Scrum / Técnico Responsabilidad principal
Albacura Dilan
Scrum Master / Developer
Backend
```
```
Facilita el daily scrum, elimina impedimentos, vela por el
proceso ágil.
Cuesaca Manuel Developer Backend Desarrollo de las reglas del backend
Gonzáles Yari Developer Backend
Desarrollo de API GraphQL con Node.js (queries,
mutations), lógica de negocio.
Diaz Jonathan Developer Backend / BD Desarrollo de API GraphQL, diseño y administración de
la base de datos.
Moncayo Carlos Developer Frontend
Desarrollo de las vistas y consumo de la API GraphQL
(menú dinámico).
```
# 2. Diagrama de Base de Datos

# 3. Product Backlog


```
ID Épica Historia de Usuario Prioridad Pts Sprint
```
```
HU- 01 Autenticación
```
```
Como administrador u operativo quiero iniciar
sesión con usuario y contraseña para acceder al
sistema de forma segura.
```
```
Alta 3 Sprint 1
```
```
HU- 02 Autenticación
```
```
Como administrador quiero gestionar (crear, editar,
listar, activar/inactivar) usuarios del sistema para
controlar quién accede.
```
```
Alta 5 Sprint 2
```
```
HU- 03 Autenticación Como administrador quiero gestionar rolesclasificar los tipos de acceso al sistema. para Alta 5 Sprint 3
```
```
HU- 04 Autenticación
```
```
Como administrador quiero gestionar
funciones/módulos del sistema para definir las
pantallas disponibles.
```
```
Alta 5 Sprint 4
```
```
HU- 05 Autenticación
```
```
Como administrador quiero asignar o quitar
funciones a un rol para controlar los permisos de
cada rol.
```
```
Alta 8 Sprint 5
```
```
HU- 06 Menú dinámico
```
```
Como usuario autenticado quiero visualizar un
menú dinámico según las funciones asignadas a mi
rol, para navegar solo por las opciones permitidas.
```
```
Alta 8 Sprint 6
```
```
HU- 07 Personas
```
```
Como administrador u operativo quiero registrar
personas (arrendatarios) con sus datos básicos
para gestionarlas.
```
```
Media 3 Sprint 7
```
```
HU- 08 Personas
```
```
Como administrador u operativo quiero editar y listar
las personas registradas para mantener la
información actualizada.
```
```
Media 3 Sprint 8
```
```
HU- 09 Departamentos
```
```
Como administrador quiero registrar departamentos
con descripción, precio y estado para ofrecerlos en
alquiler.
```
```
Alta 5 Sprint 9
```
```
HU- 10 Departamentos
```
```
Como administrador quiero editar, listar y cambiar el
estado de un departamento para reflejar su
disponibilidad.
```
```
Media 3 Sprint 1 0
```
```
HU- 11 Alquileres
```
```
Como operativo quiero registrar un alquiler asociado
a una persona para iniciar el proceso de
arrendamiento.
```
```
Alta 5 Sprint 1 1
```
```
HU- 12 Alquileres
```
```
Como operativo quiero registrar el detalle del
alquiler (departamento, precio, fecha inicio, fecha
fin) para especificar lo alquilado.
```
```
Alta 8 Sprint 1 2
```
```
HU- 13 Alquileres Como operativo quiero listar y consultar alquileres con su total y estado para dar seguimiento. Media 5 Sprint 1 3
```
```
HU- 14 Reportes
```
```
Como administrador quiero visualizar un listado
general de alquileres y departamentos para apoyar
la toma de decisiones.
```
```
Baja 3 Sprint 1 4
```
# 3.1 Historias de Usuario

### HU-01 · Iniciar sesión en el sistema

```
Épica Autenticación
Narrativa principal Como administrador u operativo, quiero iniciar sesión con usuario y contraseña, para acceder al sistema de forma segura.
```
```
Criterios de aceptación
```
```
● El sistema permite ingresar usuario y contraseña.
● Si las credenciales son correctas, se otorga acceso al sistema.
● Si las credenciales son incorrectas, se muestra un mensaje de error y no se
otorga acceso.
● Solo los usuarios con estado activo pueden iniciar sesión.
Estimación 3 pts
Prioridad Alta
Sprint Sprint 1
```

### HU-02 · Gestionar usuarios del sistema

**Épica** Autenticación

**Narrativa principal** _Como administrador, quiero gestionar (crear, editar, listar, activar/inactivar) usuarios del sistema, para controlar quién accede._

**Criterios de aceptación**

● Se puede registrar un nuevo usuario con nombre de usuario y contraseña.
● Se puede editar los datos de un usuario existente.
● Se puede listar todos los usuarios registrados.
● Se puede activar o inactivar un usuario; un usuario inactivo no puede iniciar
sesión.
**Estimación 5 pts
Prioridad Alta
Sprint Sprint 2**

### HU-03 · Gestionar roles

**Épica** Autenticación
**Narrativa principal** _Como administrador, quiero gestionar roles para clasificar los tipos de acceso al sistema._

**Criterios de aceptación**

● Se puede crear un rol con un nombre único.
● Se puede editar el nombre de un rol existente.
● Se puede listar todos los roles registrados.
**Estimación 5 pts
Prioridad Alta
Sprint Sprint 3**

### HU-04 · Gestionar funciones del sistema

**Épica** Autenticación

**Narrativa principal**
_Como administrador, quiero gestionar funciones/módulos del sistema, para definir las
pantallas disponibles._

**Criterios de aceptación**

● Se puede registrar una función con nombre y ruta.
● Se puede editar una función existente.
● Se puede listar todas las funciones registradas.
**Estimación 5 pts
Prioridad Alta
Sprint Sprint 4**

### HU-05 · Asignar funciones a un rol

**Épica** Autenticación

**Narrativa principal** _Como administrador, quiero asignar o quitar funciones a un rol, para controlar los permisos de cada rol._

**Criterios de aceptación**

● Se puede seleccionar un rol y asignarle una o varias funciones.
● Se puede quitar una función previamente asignada a un rol.
● Los cambios de asignación se reflejan de inmediato en los permisos del rol.
**Estimación 8 pts
Prioridad Alta
Sprint Sprint 5**

### HU-06 · Visualizar menú dinámico

**Épica** Menú dinámico

**Narrativa principal** _Como usuario autenticado, quiero visualizar un menú dinámico según las funciones asignadas a mi rol, para navegar solo por las opciones permitidas._

**Criterios de aceptación**

```
● El menú muestra únicamente las funciones asignadas al rol del usuario
autenticado.
● Al quitar una función de un rol, esta deja de aparecer en el menú de los usuarios
con ese rol.
```

● Un usuario no puede acceder a una pantalla cuya función no tiene asignada a su
rol.
**Estimación 8 pts
Prioridad Alta
Sprint Sprint 6**

### HU-07 · Registrar personas (arrendatarios)

**Épica** Personas

**Narrativa principal** _Como administrador u operativo, quiero registrar personas (arrendatarios) con sus datos básicos, para gestionarlas._

**Criterios de aceptación**

● Se puede registrar una persona con cédula, nombres, apellidos, teléfono y
dirección.
● No se permite registrar dos personas con la misma cédula.
**Estimación 3 pts
Prioridad Media
Sprint Sprint 7**

### HU-08 · Editar y listar personas

**Épica** Personas

**Narrativa principal** _Como administrador u operativo, quiero editar y listar las personas registradas, para mantener la información actualizada._

**Criterios de aceptación** ●^ Se puede listar todas las personas registradas.^
● Se puede editar los datos de una persona existente.
**Estimación 3 pts
Prioridad Media
Sprint Sprint 8**

### HU-09 · Registrar departamentos

**Épica** Departamentos

**Narrativa principal** _Como administrador, quiero registrar departamentos con descripción, precio y estado, para ofrecerlos en alquiler._

**Criterios de aceptación** ●^ Se puede registrar un departamento con código, descripción, precio y estado.^
● El código del departamento es único.
**Estimación 5 pts
Prioridad Alta
Sprint Sprint 9**

### HU-10 · Editar y listar departamentos

**Épica** Departamentos

**Narrativa principal**
_Como administrador, quiero editar, listar y cambiar el estado de un departamento, para
reflejar su disponibilidad._

**Criterios de aceptación**

● Se puede listar todos los departamentos con su estado actual.
● Se puede editar los datos de un departamento.
● Se puede cambiar el estado de un departamento (disponible / no disponible).
**Estimación 3 pts
Prioridad Media
Sprint Sprint 1 0**

### HU-11 · Registrar un alquiler

**Épica** Alquileres

**Narrativa principal** _Como operativo, quiero registrar un alquiler asociado a una persona, para iniciar el proceso de arrendamiento._

**Criterios de aceptación** (^) ● Se puede seleccionar una persona registrada para asociarla al alquiler.


```
● El alquiler se registra con fecha y estado inicial.
● No se puede registrar un alquiler sin una persona asociada.
Estimación 5 pts
Prioridad Alta
Sprint Sprint 1 1
```
### HU-12 · Registrar detalle del alquiler

```
Épica Alquileres
Narrativa principal Como operativo, quiero registrar el detalle del alquiler (departamento, precio, fecha inicio, fecha fin), para especificar lo alquilado.
```
```
Criterios de aceptación
```
```
● Se puede asociar uno o varios departamentos a un alquiler.
● Cada detalle incluye precio, fecha de inicio y fecha de fin.
● El total del alquiler se calcula a partir de los detalles registrados.
Estimación 8 pts
Prioridad Alta
Sprint Sprint 1 1
```
### HU-13 · Listar y consultar alquileres

```
Épica Alquileres
Narrativa principal Como operativo, quiero listar y consultar alquileres con su total y estado, para dar seguimiento.
```
```
Criterios de aceptación
```
```
● Se puede listar todos los alquileres registrados.
● Cada alquiler muestra su total y estado actual.
● Se puede consultar el detalle de un alquiler específico.
Estimación 5 pts
Prioridad Media
Sprint Sprint 12
```
### HU-14 · Visualizar reporte general

```
Épica Reportes
Narrativa principal Como administrador, quiero visualizar un listado general de alquileres y departamentos, para apoyar la toma de decisiones.
```
```
Criterios de aceptación ●^ El reporte muestra el total de alquileres registrados.^
● El reporte muestra el estado de los departamentos (disponibles / alquilados).
Estimación 3 pts
Prioridad Baja
Sprint Sprint 1 3
```
# 4. Planificación

## Calendario de Daily Scrum

```
Fecha Enfoque del Daily Scrum Participantes
Mié 08 Jul Sprint Planning + inicio del Sprint 1 Todo el equipo
Jue 09 Jul Daily Scrum 1 - avance diseño BD y entorno GraphQL Todo el equipo
Vie 10 Jul Daily Scrum 2 - avance HU-01 / HU- 02 Todo el equipo
Sáb 11 Jul Daily Scrum 3 - avance HU- 03 Todo el equipo
Dom 12 Jul Daily Scrum 4 - avance HU- 04 Todo el equipo
Lun 13 Jul Daily Scrum 5 - avance HU- 05 Todo el equipo
Mar 14 Jul Daily Scrum 6 - avance HU-06 (menú dinámico) Todo el equipo
Mié 15 Jul Daily Scrum 7 - Revisión intermedia / ajustes Todo el equipo
Jue 16 Jul Daily Scrum 8 - avance HU-07 / HU- 08 Todo el equipo
```

```
Vie 17 Jul Daily Scrum 9 - avance HU-09 / HU- 10 Todo el equipo
Sáb 18 Jul Daily Scrum 10 - avance HU- 11 Todo el equipo
Dom 19 Jul Daily Scrum 11 - avance HU- 12 Todo el equipo
Lun 20 Jul Daily Scrum 12 - avance HU-13 / HU- 14 Todo el equipo
Mar 21 Jul Daily Scrum 13 - pruebas integrales y correcciones Todo el equipo
Mié 22 Jul Sprint Review + Sprint Retrospective - cierre Sprint 1 Todo el equipo
```
## Historias de Usuario, Tareas y Asignaciones

```
HU Tarea (Develop) Responsable Hrs Estado
HU- 01 Diseñar tabla Usuarios y script de creación en BD
Diaz Jonathan
3
Por
hacer
HU- 01
Desarrollar mutation login (GraphQL) con validación y
JWT
```
```
Gonzáles Yari
5
Por
hacer
HU- 01 Maquetar formulario de login en HTML/CSS
Moncayo Carlos
3
Por
hacer
HU- 02 Crear queries y mutations GraphQL de Usuarios
(Node.js)
```
```
Gonzáles Yari 6 Por
hacer
HU- 02
Maquetar vista de gestión de usuarios
(listar/crear/editar)
```
```
Moncayo Carlos
5
Por
hacer
HU- 03 Crear queries y mutations GraphQL de Roles
Diaz Jonathan
5
Por
hacer
HU- 03 Maquetar vista de gestión de roles
Moncayo Carlos
4
Por
hacer
HU- 04 Crear queries y mutations GraphQL de Funciones
Gonzáles Yari
5
Por
hacer
HU- 04 Maquetar vista de gestión de funciones
Moncayo Carlos
4
Por
hacer
HU- 05
Diseñar tabla Roles_Funciones y mutation GraphQL de
asignación
```
```
Diaz Jonathan
6
Por
hacer
HU- 05
Maquetar vista de asignación de funciones a rol
(checklist)
```
```
Moncayo Carlos
5
Por
hacer
HU- 06
Desarrollar query GraphQL que retorne funciones
según rol del usuario
```
```
Gonzáles Yari
5
Por
hacer
HU- 06
Implementar renderizado dinámico del menú en el
frontend
```
```
Moncayo Carlos
6
Por
hacer
HU- 06 Pruebas de menú dinámico (agregar/quitar función a
un rol)
```
```
Albacura Dilan 3 Por
hacer
HU- 07 Diseñar tabla Personas y queries/mutations GraphQL
Diaz Jonathan
4
Por
hacer
HU- 07 Maquetar formulario de registro de personas
Moncayo Carlos
3
Por
hacer
HU- 08
Desarrollar query/mutation GraphQL de listado/edición
de personas
```
```
Gonzáles Yari
3
Por
hacer
HU- 08 Maquetar vista de listado y edición de personas
Moncayo Carlos
3
Por
hacer
HU- 09
Diseñar tabla Departamento y queries/mutations
GraphQL
```
```
Diaz Jonathan
5
Por
hacer
HU- 09 Maquetar formulario de registro de departamento Moncayo Carlos^4 Por
hacer
HU- 10
Desarrollar mutation GraphQL de edición/cambio de
estado de departamento
```
```
Gonzáles Yari
3
Por
hacer
```

#### HU- 10

```
Maquetar vista de listado de departamentos con filtro
por estado
```
```
Moncayo Carlos
3
Por
hacer
```
**HU- 11**
Diseñar tabla Alquileres y mutation GraphQL de
registro de alquiler

```
Diaz Jonathan
5
Por
hacer
```
**HU- 11**
Maquetar formulario de registro de alquiler (selección
de persona)

```
Moncayo Carlos
4
Por
hacer
```
**HU- 12**
Diseñar tabla Detalle_Alquiler y mutation GraphQL de
registro de detalle

```
Diaz Jonathan
6
Por
hacer
```
**HU- 12**
Maquetar formulario de detalle de alquiler
(departamento/fechas/precio)

```
Moncayo Carlos
5
Por
hacer
```
**HU- 12** Calcular total del alquiler según detalles registrados
Gonzáles Yari
4
Por
hacer

**HU- 13**
Desarrollar query GraphQL de listado/consulta de
alquileres

```
Gonzáles Yari
4
Por
hacer
```
**HU- 13** Maquetar vista de listado de alquileres (estado y total)
Moncayo Carlos
4
Por
hacer

**HU- 14**
Desarrollar query GraphQL de reporte general
(alquileres/departamentos)

```
Diaz Jonathan
4
Por
hacer
```
**HU- 14** Maquetar vista de reporte general
Moncayo Carlos
3
Por
hacer


