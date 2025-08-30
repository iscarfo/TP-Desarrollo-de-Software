export class Categoria {
  #nombre

  constructor(nombre) {
    this.#nombre = nombre;
  }

  getNombre() {
    return this.#nombre;
  }
}

export class Producto {
  #id
  #vendedor
  #titulo
  #status
  #descripcion
  #categorias
  #precio
  #moneda
  #stock
  #fotos
  #activo

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
    this.#id = id;
    this.#vendedor = vendedor; // Usuario
    this.#titulo = titulo;
    this.#status = status;
    this.#descripcion = descripcion;
    this.#categorias = categorias; // Categoria
    this.#precio = precio;
    this.#moneda = moneda; // Moneda
    this.#stock = stock;
    this.#fotos = fotos || [];
    this.#activo = activo;
  }

  estaDisponible(cantidad) {
    return this.#stock >= cantidad;
  }

  reducirStock(cantidad) {
    if (this.estaDisponible(cantidad)) {
      this.#stock -= cantidad;
    } else {
      throw new Error("Stock insuficiente");
    }
  }

  aumentarStock(cantidad) {
    this.#stock += cantidad;
  }

  agregarFoto(foto) {
    this.#fotos.push(foto);
  }

  getVendedor() {
    return this.#vendedor;
  }

  getTitulo() {
    return this.#titulo;
  }

  //No usados pero los agrego para futuras funcionalidades:
  getId() { return this.#id; }
  getStatus() { return this.#status; }
  getDescripcion() { return this.#descripcion; }
  getCategorias() { return this.#categorias; }
  getPrecio() { return this.#precio; }
  getMoneda() { return this.#moneda; }
  getStock() { return this.#stock; }
  getFotos() { return this.#fotos; }
  isActivo() { return this.#activo; }
}
