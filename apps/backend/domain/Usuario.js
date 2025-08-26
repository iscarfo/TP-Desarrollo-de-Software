export class Usuario {
  constructor(id, nombre, email, telefono, tipoUsuario) {
    this.id = id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.tipoUsuario = tipoUsuario;
    this.fechaAlta = new Date();
  }
}
