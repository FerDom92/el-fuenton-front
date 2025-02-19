export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  detalle: string;
};

export type ProductoDTO ={
  id?: number;
  nombre: string;
  precio: number;
  detalle: string;
}