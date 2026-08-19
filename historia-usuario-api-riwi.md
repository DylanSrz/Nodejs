# Historia de Usuario: API de Gestión de Riwi

**Como** equipo de desarrollo de Riwi
**Quiero** una API REST construida con Node.js, TypeScript y MongoDB
**Para** gestionar la información de TLs, Rutas, Clanes y Coders, permitiendo consultar sus relaciones jerárquicas

---

## Contexto del dominio

Jerarquía de entidades:

```
TL (Team Leader)
 └── Ruta (asociada a un TL)
      └── Clan (asociado a una Ruta)
           └── Coder (asociado a un Clan)
```

---

## Criterios de aceptación

### 1. Modelo TL
- Se debe crear un modelo `TL`.
- Debe existir un endpoint para consultar TLs.

### 2. Modelo Ruta
- Se debe crear un modelo `Ruta`, relacionado con un `TL`.
- Debe existir un endpoint para consultar rutas, incluyendo la información del TL asociado.

### 3. Modelo Clan
- Se debe crear un modelo `Clan`, relacionado con una `Ruta`.
- Debe existir un endpoint para consultar clanes, incluyendo la información de la ruta asociada.

### 4. Modelo Coder
- Se debe crear un modelo `Coder`, relacionado con un `Clan`.
- Debe contar con un CRUD completo (crear, consultar, actualizar y eliminar).

### 5. Consultas especiales
- Debe ser posible consultar los coders pertenecientes a un clan específico.
- Debe ser posible consultar los coders pertenecientes a una ruta específica.

### 6. Validación de datos
- Toda la información recibida en las peticiones (creación y actualización) debe ser validada antes de ser procesada.
- La validación debe verificar que los campos requeridos estén presentes, que los tipos de dato sean correctos y que las relaciones referenciadas (TL, Ruta, Clan) existan realmente en la base de datos.
- Si los datos no cumplen con las validaciones, la API debe responder con un error claro indicando qué campo(s) fallaron y por qué.
- No se debe permitir el registro de información inválida o incompleta en ninguno de los modelos.

### 7. Documentación
- La API debe estar debidamente documentada con Swagger (OpenAPI).

---

## Definición de terminado (DoD)

- [ ] Los 4 modelos están creados con sus relaciones correctamente definidas.
- [ ] Todos los endpoints de consulta funcionan correctamente, mostrando las relaciones asociadas.
- [ ] El CRUD de Coder está completamente funcional.
- [ ] Las consultas de coders por clan y por ruta retornan los datos correctos.
- [ ] Los datos de entrada son validados correctamente en todos los endpoints que reciben información.
- [ ] La API responde con errores claros cuando los datos enviados son inválidos o incompletos.
- [ ] Swagger está disponible y documenta la API.
