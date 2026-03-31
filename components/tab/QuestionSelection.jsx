import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { QuestionSelectionTable } from "./QuestionSelectionTable";

export function QuestionSelection({
  questionsBySection,
  questionIds,
  setQuestionIds,
}) {
  return (
    <Accordion type="multiple" className="w-full">
      {questionsBySection.map(({ section, questions }) => (
        <AccordionItem key={section} value={section}>
          <AccordionTrigger className="hover:decoration-pink-600">
            <div className="flex items-center justify-between w-full pr-4 cursor-pointer">
              <h3 className="text-pink-600">{section}</h3>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4">
              <QuestionSelectionTable
                questions={questions}
                questionIds={questionIds}
                setQuestionIds={setQuestionIds}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
