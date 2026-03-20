import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { ServiceSelectionTable } from "./ServiceSelectionTable";

export function ServiceSelection({
  servicesByCategory,
  selectedServices,
  setSelectedServices,
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {servicesByCategory.map(({ category, services }) => (
        <AccordionItem key={category} value={category}>
          <AccordionTrigger className="hover:decoration-pink-600">
            <div className="flex items-center justify-between w-full pr-4 cursor-pointer">
              <h3 className="text-pink-600">{category}</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <ServiceSelectionTable
                category={category}
                services={services}
                selectedServices={selectedServices}
                setSelectedServices={setSelectedServices}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
