import { Separator } from "./ui/separator";
// import { Label } from "./ui/label";
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
import { CardContent } from "./ui/card";
import { Question } from "./Question";

export function QuestionsBySection({ questionsBySection }) {
  // function updateYesNoAnswer(questions, setQuestions, index, answer) {
  //   const updated = [...questions];
  //   updated[index].answer = answer;
  //   if (!answer) {
  //     updated[index].details = "";
  //   }
  //   setQuestions(updated);
  // }

  // function updateDetails(questions, setQuestions, index, details) {
  //   const updated = [...questions];
  //   updated[index].details = details;
  //   setQuestions(updated);
  // }

  // function YesNoField({ question, index, questions, setQuestions }) {
  //   return (
  //     <div className="space-y-2">
  //       <Label>{question.question}</Label>
  //       <div className="flex gap-4">
  //         <Button
  //           type="button"
  //           variant={question.answer === true ? "default" : "outline"}
  //           size="sm"
  //           onClick={() =>
  //             updateYesNoAnswer(questions, setQuestions, index, true)
  //           }
  //           className={
  //             question.answer === true ? "bg-pink-600 hover:bg-pink-700" : ""
  //           }
  //         >
  //           Sim
  //         </Button>
  //         <Button
  //           type="button"
  //           variant={question.answer === false ? "default" : "outline"}
  //           size="sm"
  //           onClick={() =>
  //             updateYesNoAnswer(questions, setQuestions, index, false)
  //           }
  //           className={
  //             question.answer === false ? "bg-pink-600 hover:bg-pink-700" : ""
  //           }
  //         >
  //           Não
  //         </Button>
  //       </div>
  //       {question.answer === true && (
  //         <Input
  //           placeholder="Descreva os detalhes"
  //           value={question.details}
  //           onChange={(e) =>
  //             updateDetails(questions, setQuestions, index, e.target.value)
  //           }
  //           className="mt-2"
  //         />
  //       )}
  //     </div>
  //   );
  // }

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
