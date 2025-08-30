import { EstadoPedido } from "./enums.js";
import { FactoryNotificacion } from "./Notificacion.js";

export class ItemPedido {
  #producto
  #cantidad
  #precioUnitario

  constructor(producto, cantidad, precioUnitario) {
    this.#producto = producto;
    this.#cantidad = cantidad;
    this.#precioUnitario = precioUnitario;
  }

  subTotal() {
    return this.#cantidad * this.#precioUnitario;
  }

  getProducto() {
    return this.#producto;
  }

  getCantidad() {
    return this.#cantidad;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getPrecioUnitario() { return this.#precioUnitario; }
}

export class DireccionEntrega {
  #calle
  #altura
  #piso
  #departamento
  #codPostal
  #ciudad
  #provincia
  #pais
  #lat
  #lon


  constructor(
    calle,
    altura,
    piso,
    departamento,
    codPostal,
    ciudad,
    provincia,
    pais,
    lat,
    lon,
  ) {
    this.#calle = calle;
    this.#altura = altura;
    this.#piso = piso;
    this.#departamento = departamento;
    this.#codPostal = codPostal;
    this.#ciudad = ciudad;
    this.#provincia = provincia;
    this.#pais = pais;
    this.#lat = lat;
    this.#lon = lon;
  }

  getCalle() {
    return this.#calle;
  }

  getAltura() {
    return this.#altura;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getPiso() { return this.#piso; }
  getDepartamento() { return this.#departamento; }
  getCodPostal() { return this.#codPostal; }
  getCiudad() { return this.#ciudad; }
  getProvincia() { return this.#provincia; }
  getPais() { return this.#pais; }
  getLat() { return this.#lat; }
  getLon() { return this.#lon; }
}

export class Pedido {
  #id
  #comprador
  #items
  #moneda
  #direccionEntrega
  #estado
  #fechaCreacion
  #historialEstados

  constructor(id, comprador, items, moneda, direccionEntrega) {
    this.#id = id;
    this.#comprador = comprador; // Usuario
    this.#items = items || []; // [ItemPedido]
    this.#moneda = moneda;
    this.#direccionEntrega = direccionEntrega; // DireccionEntrega
    this.#estado = EstadoPedido.PENDIENTE;
    this.#fechaCreacion = new Date();
    this.#historialEstados = [];
  }

  calcularTotal() {
    return this.#items.reduce((acc, item) => acc + item.subTotal(), 0);
  }

  actualizarEstado(nuevoEstado, quien, motivo) {
    const cambio = new CambioEstadoPedido(
      new Date(),
      nuevoEstado,
      this,
      quien,
      motivo,
    );
    this.#historialEstados.push(cambio);
    this.#estado = nuevoEstado;

    if (nuevoEstado === EstadoPedido.ENVIADO) {
      const notificacion = FactoryNotificacion.crearNotificacionEnvio(this);
    }

    if (nuevoEstado === EstadoPedido.CANCELADO) {
      const vendedores = this.obtenerVendedores();
      vendedores.forEach((vendedor) => {
        const notificacion = FactoryNotificacion.crearNotificacionCancelacion(
          this,
          vendedor,
        );
      });
    }
  }

  validarStock() {
    return this.#items.every((item) =>
      item.getProducto().estaDisponible(item.getCantidad()),
    );
  }

  obtenerVendedores() {
    const vendedores = new Set();
    this.#items.forEach((item) => {
      vendedores.add(item.getProducto().getVendedor());
    });
    return Array.from(vendedores);
  }

  crearPedido() {
    const vendedores = this.obtenerVendedores();
    vendedores.forEach((vendedor) => {
      const notificacion = FactoryNotificacion.crearNotificacionNuevoPedido(
        this,
        vendedor,
      );
    });
  }

  getComprador() {
    return this.#comprador;
  }

  getItems() {
    return this.#items;
  }

  getDireccionEntrega() {
    return this.#direccionEntrega;
  }

  getId() {
    return this.#id;
  }

  // No usados pero los agrego para futuras funcionalidades:
  getMoneda() { return this.#moneda; }
  getEstado() { return this.#estado; }
  getFechaCreacion() { return this.#fechaCreacion; }
  getHistorialEstados() { return this.#historialEstados; }
}

export class CambioEstadoPedido {
  #fecha
  #estado
  #pedido
  #usuario
  #motivo

  constructor(fecha, estado, pedido, usuario, motivo) {
    this.#fecha = fecha;
    this.#estado = estado;
    this.#pedido = pedido;
    this.#usuario = usuario;
    this.#motivo = motivo;
  }

  // Getters si es necesario
  getFecha() { return this.#fecha; }
  getEstado() { return this.#estado; }
  getPedido() { return this.#pedido; }
  getUsuario() { return this.#usuario; }
  getMotivo() { return this.#motivo; }
}
