"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientCrud } from "@/hooks/clients/useClientsCrud";
import { useProductCrud } from "@/hooks/products/useProductCrud";
import { SaleDTO } from "@/types/sale.types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Interfaz para los items que se muestran en la UI
interface CartItem {
  productId: number;
  quantity: number;
  uniqueId: string;
  // Estos campos son solo para la UI
  unitPrice?: number;
  total?: number;
}

const saleSchema = z.object({
  clientId: z.coerce.number().min(1, "Debe seleccionar un cliente"),
});

interface SaleFormProps {
  onSubmit: (data: SaleDTO) => void;
  onCancel: () => void;
}

export function SaleForm({ onSubmit, onCancel }: SaleFormProps) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  const { clients } = useClientCrud({
    page: 1,
    limit: 100,
  });

  const { products } = useProductCrud({
    page: 1,
    limit: 100,
  });

  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      clientId: clients.length > 0 ? clients[0]?.id || 1 : 1,
    },
  });

  // Actualizar el cliente por defecto cuando se cargan los clientes
  useEffect(() => {
    if (clients.length > 0 && !form.getValues().clientId) {
      form.setValue("clientId", clients[0]?.id || 1);
    }
  }, [clients, form]);

  const addItem = () => {
    if (!selectedProduct) return;

    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const newItem: CartItem = {
      productId: selectedProduct,
      quantity: quantity,
      unitPrice: product.price,
      total: product.price * quantity,
      uniqueId: Date.now().toString() + Math.random().toString(36).substr(2, 9), // ID único
    };

    const updatedItems = [...items, newItem];
    setItems(updatedItems);

    // Actualizar el total de la venta
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    setTotalAmount(newTotal);

    // Limpiar selección
    setSelectedProduct(null);
    setQuantity(1);
  };

  const removeItem = (uniqueId: string) => {
    const updatedItems = items.filter((item) => item.uniqueId !== uniqueId);
    setItems(updatedItems);

    // Actualizar el total de la venta
    const newTotal = updatedItems.reduce(
      (sum, item) => sum + (item.total || 0),
      0
    );
    setTotalAmount(newTotal);
  };

  const handleFormSubmit = (values: z.infer<typeof saleSchema>) => {
    if (items.length === 0) {
      alert("Debe agregar al menos un producto");
      return;
    }

    // Simplificar los items para el backend, sólo enviamos productId y quantity
    const simplifiedItems = items.map(({ productId, quantity }) => ({
      productId,
      quantity,
    }));

    const clientId = Number(values.clientId);

    // Preparar los datos para el backend
    const saleData: SaleDTO = {
      clientId,
      items: simplifiedItems,
      total: totalAmount,
    };

    console.log("Enviando venta (datos simplificados):", saleData);
    onSubmit(saleData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4 py-4"
      >
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <Select
                onValueChange={(value) => field.onChange(parseInt(value))}
                value={field.value?.toString()}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem
                      key={`client_${client.id}`}
                      value={client.id.toString()}
                    >
                      {client.name} {client.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border p-4 rounded-md space-y-4">
          <div className="text-sm font-medium">Productos</div>

          <div className="flex gap-2">
            <div className="flex-1">
              <Select
                onValueChange={(value) => setSelectedProduct(parseInt(value))}
                value={selectedProduct?.toString() || ""}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem
                      key={`product_${product.id}`}
                      value={product.id.toString()}
                    >
                      {product.name} (${product.price})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              className="w-24"
            />
            <Button
              type="button"
              size="sm"
              onClick={addItem}
              disabled={!selectedProduct}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {items.length === 0 && (
            <div className="text-sm text-muted-foreground italic">
              No hay productos agregados
            </div>
          )}

          {items.length > 0 && (
            <div className="border rounded-md overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="p-2 text-left">Producto</th>
                    <th className="p-2 text-right">Precio</th>
                    <th className="p-2 text-right">Cantidad</th>
                    <th className="p-2 text-right">Subtotal</th>
                    <th className="p-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => {
                    const product = products.find(
                      (p) => p.id === item.productId
                    );
                    return (
                      <tr key={`item_${item.uniqueId}`} className="border-t">
                        <td className="p-2">{product?.name}</td>
                        <td className="p-2 text-right">
                          ${item.unitPrice?.toFixed(2)}
                        </td>
                        <td className="p-2 text-right">{item.quantity}</td>
                        <td className="p-2 text-right">
                          ${item.total?.toFixed(2)}
                        </td>
                        <td className="p-2">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.uniqueId)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="border-t font-medium">
                    <td className="p-2" colSpan={3}>
                      Total
                    </td>
                    <td className="p-2 text-right">
                      ${totalAmount.toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Mensaje explícito sobre productos */}
          {items.length === 0 && (
            <div className="text-amber-500 text-sm font-medium">
              Agregue al menos un producto para continuar
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={items.length === 0}>
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
}
