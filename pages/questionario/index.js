import { AnamnesisForm } from "components/AnamnesisForm";

export default function QuestionForm({ order, clientName, paymentMethod }) {
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
