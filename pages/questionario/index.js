import { AnamnesisForm } from "@/components/questionaire/AnamnesisForm";
import { Form } from "lucide-react";

function QuestionForm({ order, clientName, paymentMethod }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <AnamnesisForm
        order={order}
        clientName={clientName}
        paymentMethod={paymentMethod}
      />
    </div>
  );
}

QuestionForm.headerProps = {
  subtitle: "Preencha o formulário",
  icon: Form,
};

export default QuestionForm;
