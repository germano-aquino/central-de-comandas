import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Trash2, ClipboardList } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Label } from "./ui/label";

export function OrderSummary({
  order,
  clientName,
  paymentMethod,
  onPaymentMethodChange,
  onClear,
  onNext,
}) {
  const total = order.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Comanda
            </CardTitle>
            {clientName ? (
              <CardDescription className="mt-1">
                Cliente: <span className="text-pink-600">{clientName}</span>
              </CardDescription>
            ) : (
              <CardDescription>Serviços selecionados</CardDescription>
            )}
          </div>
          {order.length > 0 && (
            <Badge variant="secondary" className="bg-pink-100 text-pink-700">
              {order.reduce((sum, item) => sum + item.quantity, 0)} itens
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {order.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum serviço selecionado</p>
            <p className="text-sm">Escolha os serviços desejados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {order.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-3 pb-3 border-b last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    R$ {item.price.toFixed(2)}{" "}
                    {item.quantity > 1 ? `x ${item.quantity}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {order.length > 0 && (
        <CardFooter className="flex-col gap-3">
          <div className="w-full flex justify-between items-center py-3 border-t">
            <span>Total:</span>
            <span className="text-pink-600">R$ {total.toFixed(2)}</span>
          </div>

          <div className="w-full space-y-2">
            <Label htmlFor="payment">Forma de Pagamento</Label>
            <Select value={paymentMethod} onValueChange={onPaymentMethodChange}>
              <SelectTrigger id="payment">
                <SelectValue placeholder="Selecione a forma de pagamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="pix">Pix</SelectItem>
                <SelectItem value="debito">Débito</SelectItem>
                <SelectItem value="credito">Crédito</SelectItem>
                <SelectItem value="pacote">Pacote</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full grid grid-cols-2 gap-2 mt-2">
            <Button variant="outline" onClick={onClear} className="gap-2">
              <Trash2 className="w-4 h-4" />
              Limpar
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700 gap-2"
              onClick={onNext}
              disabled={!clientName || order.length === 0 || !paymentMethod}
            >
              Próximo
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
