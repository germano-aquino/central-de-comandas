import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";

import { ChevronLeft, Download } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";
import Link from "next/link";
import { QuestionsBySection } from "./QuestionsBySection";

export function AnamnesisForm({ clientName }) {
  const signatureRef = useRef(null);

  const [questions, setQuestions] = useState([]);
  const [formSections, setFormSections] = useState([]);

  useEffect(() => {
    loadQuestions();
    loadFormSections();
  }, []);

  async function loadQuestions() {
    const params = new URLSearchParams();
    params.set("is_mold", "true");
    const response = await fetch(`/api/v1/questions?${params}`);

    const storedQuestions = await response.json();
    const questions = storedQuestions.map((question) => {
      return {
        id: question.id,
        statement: question.statement,
        sectionId: question.section_id,
        type: question.type,
        options: question.options,
        options_marked: question.options_marked,
        answer: question?.answer ? question.answer : "",
      };
    });
    setQuestions(questions);
  }

  async function loadFormSections() {
    const response = await fetch("/api/v1/form/sections");

    const storedFormSections = await response.json();
    const formSections = storedFormSections.map((section) => {
      return {
        id: section.id,
        name: section.name,
      };
    });
    setFormSections(formSections);
  }

  const questionsBySection = formSections.map((section) => ({
    section: section.name,
    questions: questions.filter(
      (question) => question.sectionId === section.id,
    ),
  }));

  function clearSignature() {
    signatureRef.current?.clear();
  }

  function generatePDF() {
    if (signatureRef.current?.isEmpty()) {
      console.log("Erro");
      toast.error("Por favor, adicione a assinatura da cliente");
      return;
    }

    console.log("Questions: ", questions);
    console.log("questionsBySection: ", questionsBySection);

    // Aqui você implementaria a geração do PDF
    // Para simplicidade, vou criar um objeto com todos os dados
    // const formData = {
    //   cliente: clientName,
    //   data: new Date().toLocaleDateString("pt-BR"),
    //   servicos: order,
    //   pagamento: paymentMethod,
    //   depilacao: {
    //     questions: depilacaoQuestions,
    //     tipoPele,
    //     espessuraPelo,
    //   },
    //   sobrancelhas: sobrancelhasQuestions,
    //   esmalteria: {
    //     remocaoCuticula,
    //     questions: esmalteriaQuestions,
    //   },
    //   altaFrequencia: altaFrequenciaQuestions,
    //   usoImagens: usoImagensQuestions,
    //   observacoes: {
    //     condicaoSaude,
    //     observacoes,
    //   },
    //   assinatura: signatureRef.current?.toDataURL(),
    // };

    // console.log("Dados do formulário:", formData);

    // Simular download do PDF
    // toast.success("Ficha de avaliação gerada com sucesso!");

    // Aqui você poderia usar uma biblioteca como jsPDF ou react-pdf para gerar o PDF real
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/comanda" passHref>
        <Button variant="outline" className="mb-6 gap-2">
          <ChevronLeft className="w-4 h-4" />
          Voltar
        </Button>
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Ficha de Avaliação</CardTitle>
          <CardDescription>Cliente: {clientName}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <QuestionsBySection questionsBySection={questionsBySection} />

          {/* Assinatura */}
          <div className="space-y-4">
            <h3 className="text-pink-600">Assinatura da Cliente</h3>
            <Separator />
            <div className="space-y-2">
              <Label>Por favor, assine no campo abaixo:</Label>
              <div className="border-2 border-gray-300 rounded-lg bg-white">
                <SignatureCanvas
                  ref={signatureRef}
                  canvasProps={{
                    className: "w-full h-40 cursor-crosshair",
                  }}
                  backgroundColor="rgb(255, 255, 255)"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={clearSignature}
              >
                Limpar Assinatura
              </Button>
            </div>
          </div>

          {/* Botão Concluir */}
          <div className="pt-4">
            <Button
              onClick={generatePDF}
              className="w-full bg-pink-600 hover:bg-pink-700 gap-2"
              size="lg"
            >
              <Download className="w-5 h-5" />
              Concluir e Gerar PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
