export class Categoria {
  constructor(nombre) {
    this.nombre = nombre;
  }
}

export class Producto {
  constructor(
    id,
    vendedor,
    titulo,
    status,
    descripcion,
    categorias,
    precio,
    moneda,
    stock,
    fotos,
    activo,
  ) {
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
    this.fotos.push(foto);
  }
}
