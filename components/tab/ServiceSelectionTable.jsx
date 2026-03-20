import { useState } from "react";
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

export function ServiceSelectionTable({
  category,
  services,
  selectedServices,
  setSelectedServices,
}) {
  const [toggleAll, setToggleAll] = useState(true);

  function selectService(serviceId, checked) {
    setSelectedServices({
      ...selectedServices,
      [category]: {
        ...selectedServices[category],
        [serviceId]: checked,
      },
    });
    console.log(selectedServices);
    // if (checked) question.options_marked.push(option);
    // else
    //   question.options_marked = question.options_marked.filter(
    //     (optionMarked) => optionMarked !== option,
    //   );
  }

  function handleCheckAllBoxes() {
    const newSelectedServices = services.reduce((accumulator, service) => {
      accumulator[service.id] = toggleAll;
      return accumulator;
    }, {});

    setSelectedServices({
      ...selectedServices,
      [category]: newSelectedServices,
    });
    setToggleAll((state) => !state);
    console.log(selectedServices);
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
                checked={selectedServices[category][service.id]}
                onCheckedChange={(checked) =>
                  selectService(service.id, checked)
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
