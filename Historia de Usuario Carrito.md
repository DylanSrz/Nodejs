# Historia de Usuario - Carrito de Compras con WebSockets

## Historia de Usuario

**ID:** HU-001

**Nombre:** Realizar una compra desde un carrito de compras

**Como** cliente de la tienda,

**Quiero** agregar productos a un carrito de compras y posteriormente realizar la compra,

**Para** conocer el detalle de los productos adquiridos junto con el subtotal, el IVA y el valor total de la compra.

---

# Requerimientos Funcionales

La API deberá estar desarrollada utilizando **Node.js** y **Express**.

## Endpoint 1: Agregar producto al carrito

**Método:** `POST`

**Ruta:** `/add-cart`

### Body

```json
{
    "productId": 1,
    "quantity": 2
}
```

---

## Endpoint 2: Comprar

**Método:** `POST`

**Ruta:** `/comprar`

---

# Estructura de los Productos

Cada producto deberá contener la siguiente información:

```json
{
    "id": 1,
    "name": "Mouse Gamer",
    "price": 80000
}
```

---

# Estructura del Carrito

El carrito deberá ser una lista de productos.

Cada elemento del carrito deberá contener:

```json
{
    "id": 1,
    "name": "Mouse Gamer",
    "price": 80000,
    "quantity": 2
}
```

---

# Evento WebSocket

Al realizar la compra se deberá emitir un evento llamado:

```
purchase
```

### Payload esperado

```json
{
    "products": [
        {
            "id": 1,
            "name": "Mouse Gamer",
            "price": 80000,
            "quantity": 2
        },
        {
            "id": 3,
            "name": "Teclado Mecánico",
            "price": 150000,
            "quantity": 1
        }
    ],
    "subtotal": 310000,
    "iva": 58900,
    "total": 368900
}
```

---

# Criterios de Aceptación

* El endpoint `/add-cart` permite agregar productos al carrito.
* Si un producto ya existe en el carrito, únicamente se incrementa su cantidad.
* El carrito mantiene una lista de los productos seleccionados.
* El endpoint `/comprar` calcula correctamente:

  * Subtotal.
  * IVA del 19%.
  * Total de la compra.
* Al ejecutar `/comprar` se emite un evento mediante WebSocket con:

  * Lista de productos comprados.
  * Subtotal.
  * IVA.
  * Total.
* Los cálculos deben realizarse utilizando los precios registrados en los productos.
* El IVA corresponde exactamente al **19%** del subtotal.

