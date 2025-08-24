export class Notificacion {
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

export class FactoryNotificacion {
  static crearSegunEstadoPedido(estadoPedido) {
    return `El pedido pasó al estado: ${estadoPedido}`;
  }

  static crearSegunPedido(pedido) {
    return new Notificacion(
      Date.now().toString(),
      pedido.comprador,
      `Pedido realizado por ${pedido.comprador.nombre}, total: ${pedido.calcularTotal()}, entrega en: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}`,
      new Date()
    );
  }

  static crearNotificacionNuevoPedido(pedido, vendedor) {
    const productos = pedido.items
      .filter(item => item.producto.vendedor.id === vendedor.id)
      .map(item => `${item.producto.nombre} (x${item.cantidad})`)
      .join(', ');
    
    const mensaje = `Nuevo pedido de ${pedido.comprador.nombre}. Productos: ${productos}. Total: ${pedido.calcularTotal()}. Entrega en: ${pedido.direccionEntrega.calle} ${pedido.direccionEntrega.altura}`;
    
    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date()
    );
  }

  static crearNotificacionEnvio(pedido) {
    const mensaje = `Tu pedido #${pedido.id} ha sido enviado y está en camino.`;
    
    return new Notificacion(
      Date.now().toString(),
      pedido.comprador,
      mensaje,
      new Date()
    );
  }

  static crearNotificacionCancelacion(pedido, vendedor) {
    const productos = pedido.items
      .filter(item => item.producto.vendedor.id === vendedor.id)
      .map(item => `${item.producto.nombre} (x${item.cantidad})`)
      .join(', ');
    
    const mensaje = `El pedido #${pedido.id} con productos ${productos} ha sido cancelado por el comprador ${pedido.comprador.nombre}.`;
    
    return new Notificacion(
      Date.now().toString(),
      vendedor,
      mensaje,
      new Date()
    );
  }
}