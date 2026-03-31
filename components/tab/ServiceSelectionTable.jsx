import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

import { useState } from "react";

export function ServiceSelectionTable({ services, serviceIds, setServiceIds }) {
  const checkBoxObject = services.reduce((accumulator, service) => {
    accumulator[service.id] = serviceIds.includes(service.id);
    return accumulator;
  }, {});

  const [checkboxSelection, setCheckboxSelection] = useState(checkBoxObject);
  const [toggleAll, setToggleAll] = useState(true);

  function handleSelectService(serviceId, checked) {
    setCheckboxSelection({
      ...checkboxSelection,
      [serviceId]: checked,
    });
    if (checked) setServiceIds((state) => [...state, serviceId]);
    else
      serviceIds = setServiceIds((state) =>
        state.filter((id) => id !== serviceId),
      );
    console.log("serviceIds: ", serviceIds);
  }

  function handleCheckAllBoxes() {
    const newSelectedServices = services.reduce((accumulator, service) => {
      accumulator[service.id] = toggleAll;
      return accumulator;
    }, {});

    setCheckboxSelection(newSelectedServices);
    const toggleServiceIds = services.map((service) => service.id);
    if (toggleAll) serviceIds.push(...toggleServiceIds);
    else serviceIds = serviceIds.filter((id) => !toggleServiceIds.includes(id));
    setToggleAll((state) => !state);
    console.log("serviceIds: ", serviceIds);
  }

  function priceToCurrencyString(price) {
    return price.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-48">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => handleCheckAllBoxes()}
            >
              Adicionar / Remover
            </Button>
          </TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Preço</TableHead>
          <TableHead className="w-24">Ordem</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.map((service) => (
          <TableRow key={service.id}>
            <TableCell className="w-42 flex items-center justify-center">
              <Checkbox
                className="cursor-pointer"
                id={service.id}
                checked={checkboxSelection[service.id]}
                onCheckedChange={(checked) =>
                  handleSelectService(service.id, checked)
                }
              />
            </TableCell>
            <TableCell className="max-w-md">
              <div className="flex flex-col gap-1">
                <span>{service.name}</span>
              </div>
            </TableCell>
            <TableCell>
              <span>{priceToCurrencyString(service.price)}</span>
            </TableCell>
            <TableCell>{service.order}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
