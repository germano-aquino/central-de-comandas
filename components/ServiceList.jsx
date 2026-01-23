import { Checkbox } from "./ui/checkbox";
import { Field, FieldContent, FieldLabel, FieldTitle } from "./ui/field";

export function ServiceList({ services, selectedServices, onToggleService }) {
  return (
    <div className="space-y-2 flex flex-wrap">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex items-center space-x-3 flex-wrap mr-3"
        >
          <FieldLabel>
            <Field orientation="horizontal">
              <Checkbox
                id={service.id}
                className="hidden"
                checked={selectedServices.has(service.id)}
                onCheckedChange={() => onToggleService(service)}
              />
              <FieldContent>
                <FieldTitle>{service.name}</FieldTitle>
              </FieldContent>
            </Field>
          </FieldLabel>

          {/* <Label htmlFor={service.id} className="flex-1 cursor-pointer">
              <span className="block">{service.name}</span>
            </Label> */}
        </div>
      ))}
    </div>
  );
}
