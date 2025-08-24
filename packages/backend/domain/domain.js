import express from "express";

const app = express();
app.use(express.json());

// ==================== ENDPOINT /health ====================
/*
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date(),
  });
});*/

// ENDPOINT DE HEALTH CHECK
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// ================= ENUMS =================
const TipoUsuario = Object.freeze({
  COMPRADOR: "COMPRADOR",
  VENDEDOR: "VENDEDOR",
  ADMIN: "ADMIN"
});

const Moneda = Object.freeze({
  PESO_ARG: "PESO_ARG",
  DOLAR_USA: "DOLAR_USA",
  REAL: "REAL"
});

const EstadoPedido = Object.freeze({
  PENDIENTE: "PENDIENTE",
  CONFIRMADO: "CONFIRMADO",
  EN_PREPARACION: "EN_PREPARACION",
  ENVIADO: "ENVIADO",
  ENTREGADO: "ENTREGADO",
  CANCELADO: "CANCELADO"
});

// ================= CLASES =================
class Usuario {
  constructor(id, nombre, email, telefono, tipoUsuario) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipoUsuario = tipoUsuario;
    this.fechaAlta = new Date();
  }
}

class Categoria {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

class Producto {
  constructor(id, vendedor, titulo, status, descripcion, categorias, precio, moneda, stock, fotos, activo) {
    this.id = id;
    this.vendedor = vendedor; // Usuario
    this.titulo = titulo;
    this.status = status;
    this.descripcion = descripcion;
    this.categorias = categorias; // Categoria
    this.precio = precio;
    this.moneda = moneda; // Moneda
    this.stock = stock;
    this.fotos = fotos || [];
    this.activo = activo;
  }

  estaDisponible(cantidad) {
    return this.stock >= cantidad;
  }

  reducirStock(cantidad) {
    if (this.estaDisponible(cantidad)) {
      this.stock -= cantidad;
    } else {
      throw new Error("Stock insuficiente");
    }
  }

  aumentarStock(cantidad) {
    this.stock += cantidad;
  }

  agregarFoto(foto) {
    this.fotos.push(foto)
  }
}

class ItemPedido {
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  subTotal() {
    return this.cantidad * this.precioUnitario;
  }
}

class DireccionEntrega {
  constructor(calle, altura, piso, departamento, codPostal, ciudad, provincia, pais, lat, lon) {
    this.calle = calle;
    this.altura = altura;
    this.piso = piso;
    this.departamento = departamento;
    this.codPostal = codPostal;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.pais = pais;
    this.lat = lat;
    this.lon = lon;
  }
}

class Pedido {
  constructor(id, comprador, items, moneda, direccionEntrega) {
    this.id = id;
    this.comprador = comprador; // Usuario
    this.items = items || []; // [ItemPedido]
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega; // DireccionEntrega
    this.estado = EstadoPedido.PENDIENTE;
    this.fechaCreacion = new Date();
    this.historialEstados = [];
  }

  calcularTotal() {
    return this.items.reduce((acc, item) => acc + item.subTotal(), 0);
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    const cambio = new CambioEstadoPedido(new Date(), nuevoEstado, this, quien, motivo);
    this.historialEstados.push(cambio);
    this.estado = nuevoEstado;
  }

  //Asumo que validar stock hace referencia a que todos los productos esten disponibles
  validarStock() {
    return this.items.every(item => item.producto.estaDisponible(item.cantidad));
  }
}

class CambioEstadoPedido {
  constructor(fecha, estado, pedido, usuario, motivo) {
    this.fecha = fecha;
    this.estado = estado;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}

class Notificacion {
  constructor(id, usuarioDestino, mensaje, fechaAlta) {
    this.id = id;
    this.usuarioDestino = usuarioDestino;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta;
    this.fechaLeida = null;
    this.leida = false
  }

  marcarComoLeida() {
    this.fechaLeida = new Date();
    this.leida = true;
  }
}

class FactoryNotificacion {
  static crearSegunPedido(pedido) {
    return new Notificacion(
      Date.now().toString(),
      pedido.comprador,
      this.crearSegunEstadoPedido(pedido),
      new Date()
    );
  }

  static crearSegunEstadoPedido(pedido) {
    switch (pedido.estado) {
      case EstadoPedido.PENDIENTE: return notificarVendedorPedidoCreado(pedido);
      case EstadoPedido.ENVIADO: return notificarCompradorPedidoEnviado(pedido);
      case EstadoPedido.CANCELADO: return notificarVendedorPedidoCancelado(pedido, 'El comprador se arrepintio');
      default: return null;
    }
  }
}

// INICIO DEL SERVIDOR
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

//to do:
/*Respecto a las notificaciones, nuestro Teach Leader nos ha mencionado que:
 - Cada vez que se realice un pedido, es necesario enviarle una notificación al Vendedor, 
   donde se le indique quién realizó el pedido, qué productos incluye, el total del mismo
   y dirección de entrega.
 - Cada vez que un vendedor marque un pedido como enviado, es necesario notificar al comprador.
 - Si un comprador decide cancelar un pedido, es necesario notificar al vendedor.
 */

// ================= NOTIFICACIONES SEGÚN REGLAS =================

function notificarVendedorPedidoCreado(pedido) {
  // Notifica a cada vendedor involucrado en el pedido
  //const vendedor = pedido.items[0].producto.vendedor;
  const productos = pedido.items
    .map(item => `${item.producto.titulo} x${item.cantidad}`)
    .join(", ");
  const mensaje = `Nuevo pedido realizado por ${pedido.comprador.nombre}. Productos: ${productos}. Total: ${pedido.calcularTotal()}. Entrega en: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}`;
  return mensaje;
}

function notificarCompradorPedidoEnviado(pedido) {
  const mensaje = `Tu pedido #${pedido.id} ha sido enviado.`;
  return mensaje;
}

function notificarVendedorPedidoCancelado(pedido, motivo) {
  //const vendedor = pedido.items[0].producto.vendedor;
  const mensaje = `El pedido #${pedido.id} fue cancelado por el comprador. Motivo: ${motivo || 'No especificado'}`;
  return mensaje;
}

// TEST DE NOTIFICACIONES 
app.get('/test-notificaciones', (req, res) => {
  // Crear un comprador
  const comprador = new Usuario(1, "Facundo", "facu@mail.com", "123456", TipoUsuario.COMPRADOR);

  // Crear un vendedor
  const vendedor = new Usuario(2, "Juan", "juan@mail.com", "789101", TipoUsuario.VENDEDOR);

  // Crear un vendedor
  const vendedor2 = new Usuario(3, "Pepe", "pepe@mail.com", "789102", TipoUsuario.VENDEDOR);

  // Crear un producto
  const producto = new Producto(1, vendedor, "Pistachos Premium", "DISPONIBLE", "Bolsa de 1kg", [], 5000, Moneda.PESO_ARG, 10, [], true);

  // Crear un producto
  const producto2 = new Producto(2, vendedor2, "zapatillas", "DISPONIBLE", "par de zapas", [], 5000, Moneda.PESO_ARG, 10, [], true);

  // Crear item de pedido
  const item = new ItemPedido(producto, 2, producto.precio);

  // Crear item de pedido
  const item2 = new ItemPedido(producto2, 5, producto2.precio);

  // Dirección de entrega
  const direccion = new DireccionEntrega("Av. Siempre Viva", 742, null, null, "1000", "CABA", "Buenos Aires", "Argentina", -34.6, -58.4);

  // Crear pedido
  const pedido = new Pedido(1, comprador, [item, item2], Moneda.PESO_ARG, direccion);

  // Llamar a las funciones de notificación
  const notif = FactoryNotificacion.crearSegunPedido(pedido);
  pedido.actualizarEstado(EstadoPedido.ENVIADO, vendedor);
  const notif2 = FactoryNotificacion.crearSegunPedido(pedido);
  pedido.actualizarEstado(EstadoPedido.CANCELADO, comprador, "El comprador se arrepintió");
  const notif3 = FactoryNotificacion.crearSegunPedido(pedido);


  //const notif1 = notificarVendedorPedidoCreado(pedido);
  //const notif2 = notificarCompradorPedidoEnviado(pedido);
  //const notif3 = notificarVendedorPedidoCancelado(pedido, "El comprador se arrepintió");

  res.json({ notif, notif2, notif3 });
});