import { CheckboxQuestion } from "./CheckboxQuestion";
import { RadioQuestion } from "./RadioQuestion";
import { YesOrNoQuestion } from "./YesOrNoQuestion";
import { YesOrNoDiscursiveQuestion } from "./YesOrNoDiscursiveQuestion";
import { DiscursiveQuestion } from "./DiscursiveQuestion";

export function Question({ question }) {
  switch (question.type) {
    case "checkBox":
      return <CheckboxQuestion question={question} />;

    case "radio":
      return <RadioQuestion question={question} />;

    case "yesOrNo":
      return <YesOrNoQuestion question={question} />;

    case "yesOrNoDiscursive":
      return <YesOrNoDiscursiveQuestion question={question} />;

    case "discursive":
      return <DiscursiveQuestion question={question} />;

    default:
      return <></>;
  }
}
