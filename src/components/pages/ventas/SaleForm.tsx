"use client";

import { Button } from "@/components/ui/button";
import { Combobox, ComboboxOption } from "@/components/ui/Combobox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useClientSearch } from "@/hooks/clients/useClientSearch";
import { useProductSearch } from "@/hooks/products/useProductSearch";
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
  productName?: string;
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
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [totalAmount, setTotalAmount] = useState<number>(0);

  // Search states
  const [clientSearchQuery, setClientSearchQuery] = useState("");
  const [productSearchQuery, setProductSearchQuery] = useState("");

  // Use the custom hooks for searching
  const { clients, isLoading: isLoadingClients } =
    useClientSearch(clientSearchQuery);

  const { products, isLoading: isLoadingProducts } =
    useProductSearch(productSearchQuery);

  // Convert clients to combobox options
  const clientOptions: ComboboxOption[] = clients.map((client) => ({
    label: `${client.name} ${client.lastName} (${client.email})`,
    value: client.id.toString(),
  }));

  // Convert products to combobox options
  const productOptions: ComboboxOption[] = products.map((product) => ({
    label: `${product.name} ($${product.price.toFixed(2)})`,
    value: product.id.toString(),
  }));

  const form = useForm<z.infer<typeof saleSchema>>({
    resolver: zodResolver(saleSchema),
    defaultValues: {
      clientId: 1, // Default client ID
    },
  });

  // Set the default client when clients are loaded
  useEffect(() => {
    if (clients.length > 0 && !form.getValues().clientId) {
      form.setValue("clientId", clients[0]?.id || 1);
    }
  }, [clients, form]);

  const addItem = () => {
    if (!selectedProduct) return;

    const productId = parseInt(selectedProduct);
    const product = products.find((p) => p.id === productId);

    if (!product) return;

    const newItem: CartItem = {
      productId,
      quantity: quantity,
      unitPrice: product.price,
      total: product.price * quantity,
      uniqueId: Date.now().toString() + Math.random().toString(36).substr(2, 9), // ID único
      productName: product.name,
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
    setSelectedProduct("");
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

    onSubmit(saleData);
  };

  const handleClientChange = (value: string) => {
    form.setValue("clientId", parseInt(value));
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
              <FormControl>
                <Combobox
                  options={clientOptions}
                  value={field.value.toString()}
                  onValueChange={handleClientChange}
                  onSearch={setClientSearchQuery}
                  placeholder="Seleccionar cliente"
                  searchPlaceholder="Buscar cliente..."
                  emptyMessage="No se encontraron clientes"
                  isLoading={isLoadingClients}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="border p-4 rounded-md space-y-4">
          <div className="text-sm font-medium">Productos</div>

          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Combobox
                  options={productOptions}
                  value={selectedProduct}
                  onValueChange={(value) => setSelectedProduct(value)}
                  onSearch={setProductSearchQuery}
                  placeholder="Seleccionar producto"
                  searchPlaceholder="Buscar producto..."
                  emptyMessage="No se encontraron productos"
                  isLoading={isLoadingProducts}
                />
              </div>
              <div className="flex gap-2">
                <Input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-24"
                />
                <Button
                  type="button"
                  onClick={addItem}
                  disabled={!selectedProduct}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
                  {items.map((item) => (
                    <tr key={`item_${item.uniqueId}`} className="border-t">
                      <td className="p-2">{item.productName}</td>
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
                  ))}
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
