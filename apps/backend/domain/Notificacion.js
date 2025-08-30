export class Notificacion {
  #id
  #usuarioDestino
  #mensaje
  #fechaAlta
  #fechaLeida
  #leida

  constructor(id, usuarioDestino, mensaje, fechaAlta) {
    this.#id = id;
    this.#usuarioDestino = usuarioDestino;
    this.#mensaje = mensaje;
    this.#fechaAlta = fechaAlta;
    this.#fechaLeida = null;
    this.#leida = false;
  }

  marcarComoLeida() {
    this.#fechaLeida = new Date();
    this.#leida = true;
  }

  // Getters si es necesario
  getId() { return this.#id; }
  getUsuarioDestino() { return this.#usuarioDestino; }
  getMensaje() { return this.#mensaje; }
  getFechaAlta() { return this.#fechaAlta; }
  getFechaLeida() { return this.#fechaLeida; }
  isLeida() { return this.#leida; }
}

export class FactoryNotificacion {
  static crearSegunEstadoPedido(estadoPedido) {
    return `El pedido pasó al estado: ${estadoPedido}`;
  }

  static crearSegunPedido(pedido) {
    return new Notificacion(
      Date.now().toString(),
      pedido.getComprador(),
      `Pedido realizado por ${pedido.getComprador().getNombre()}, total: ${pedido.calcularTotal()}, entrega en: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}`,
      new Date(),
    );
  }

  static crearNotificacionNuevoPedido(pedido, vendedor) {
    const productos = pedido.getItems()
      .filter((item) => item.getProducto().getVendedor().getId() === vendedor.getId())
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join(", ");

    const mensaje = `Nuevo pedido de ${pedido.getComprador().getNombre()}. Productos: ${productos}. Total: ${pedido.calcularTotal()}. Entrega en: ${pedido.getDireccionEntrega().getCalle()} ${pedido.getDireccionEntrega().getAltura()}.`;

    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date(),
    );
  }

  static crearNotificacionEnvio(pedido) {
    const mensaje = `Tu pedido #${pedido.getId()} ha sido enviado y está en camino.`;

    return new Notificacion(
      Date.now().toString(),
      pedido.getComprador(),
      mensaje,
      new Date(),
    );
  }

  static crearNotificacionCancelacion(pedido, vendedor) {
    const productos = pedido.getItems()
      .filter((item) => item.getProducto().getVendedor().getId() === vendedor.getId())
      .map((item) => `${item.getProducto().getTitulo()} (x${item.getCantidad()})`)
      .join(", ");

    const mensaje = `El pedido #${pedido.getId()} con productos ${productos} ha sido cancelado por el comprador ${pedido.getComprador().getNombre()}.`;

    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date(),
    );
  }
}
