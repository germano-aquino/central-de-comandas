import { ServiceList } from "./ServiceList";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

export function ServicesByCategory({
  servicesByCategory,
  selectedServices,
  toggleService,
}) {
  return (
    <Accordion type="single" collapsible className="w-full">
      {servicesByCategory.map(({ category, services }) => (
        <AccordionItem key={category} value={category}>
          <AccordionTrigger>
            <div className="flex items-center justify-between w-full pr-4 cursor-pointer">
              <span>{category}</span>
              <span className="text-sm text-gray-500">
                {services.filter((s) => selectedServices.has(s.id)).length} /{" "}
                {services.length}
              </span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <ServiceList
              services={services}
              selectedServices={selectedServices}
              onToggleService={toggleService}
            />
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
