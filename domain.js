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
  constructor(id, nombre, email, telefono, tipoUsuario, fechaAlta) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipoUsuario = tipoUsuario;
    this.fechaAlta = fechaAlta;
  }
}

class Categoria {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

class Producto {
  constructor(id, vendedor, nombre, status, descripcion, categoria, precio, moneda, stock, fotos, activo) {
    this.id = id;
    this.vendedor = vendedor; // Usuario
    this.nombre = nombre;
    this.status = status;
    this.descripcion = descripcion;
    this.categoria = categoria; // Categoria
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
  constructor(calle, altura, piso, departamento, ciudad, provincia, pais, lat, lon) {
    this.calle = calle;
    this.altura = altura;
    this.piso = piso;
    this.departamento = departamento;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.pais = pais;
    this.lat = lat;
    this.lon = lon;
  }
}

class Pedido {
  constructor(id, comprador, items, moneda, direccionEntrega, estado, fechaCreacion) {
    this.id = id;
    this.comprador = comprador; // Usuario
    this.items = items || []; // [ItemPedido]
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega; // DireccionEntrega
    this.estado = estado;
    this.fechaCreacion = fechaCreacion;
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
  constructor(id, usuarioDestino, mensaje, fechaAlta, fechaLeida, leida) {
    this.id = id;
    this.usuarioDestino = usuarioDestino;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta;
    this.fechaLeida = fechaLeida || null;
    this.leida = false
  }

  marcarComoLeida() {
    this.fechaLeida = new Date();
    this.leida = true;
  }
}

//Falta esto
class FactoryNotificacion {
 
}