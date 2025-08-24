import { EstadoPedido } from './enums.js';
import { FactoryNotificacion } from './Notificacion.js';

export class ItemPedido {
  constructor(producto, cantidad, precioUnitario) {
    this.producto = producto;
    this.cantidad = cantidad;
    this.precioUnitario = precioUnitario;
  }

  subTotal() {
    return this.cantidad * this.precioUnitario;
  }
}

export class DireccionEntrega {
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

export class Pedido {
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
    
    if (nuevoEstado === EstadoPedido.ENVIADO) {
      const notificacion = FactoryNotificacion.crearNotificacionEnvio(this);
    }
    
    if (nuevoEstado === EstadoPedido.CANCELADO) {
      const vendedores = this.obtenerVendedores();
      vendedores.forEach(vendedor => {
        const notificacion = FactoryNotificacion.crearNotificacionCancelacion(this, vendedor);
      });
    }
  }

  validarStock() {
    return this.items.every(item => item.producto.estaDisponible(item.cantidad));
  }

  obtenerVendedores() {
    const vendedores = new Set();
    this.items.forEach(item => {
      vendedores.add(item.producto.vendedor);
    });
    return Array.from(vendedores);
  }

  crearPedido() {
    const vendedores = this.obtenerVendedores();
    vendedores.forEach(vendedor => {
      const notificacion = FactoryNotificacion.crearNotificacionNuevoPedido(this, vendedor);
    });
  }
}

export class CambioEstadoPedido {
  constructor(fecha, estado, pedido, usuario, motivo) {
    this.fecha = fecha;
    this.estado = estado;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}