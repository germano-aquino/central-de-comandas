import { Separator } from "../ui/separator";
import { CardContent } from "../ui/card";
import { Question } from "./Question";

export function QuestionsBySection({ questionsBySection }) {
  return (
    <CardContent className="space-y-8">
      {questionsBySection.map(({ section, questions }) => {
        return (
          <div key={section} className="space-y-4">
            <h3 className="text-pink-600">{section}</h3>
            <Separator />

            <div className="space-y-4">
              {questions.map((question) => {
                return <Question key={question.id} question={question} />;
              })}
            </div>
          </div>
        );
      })}
    </CardContent>
  );
}
