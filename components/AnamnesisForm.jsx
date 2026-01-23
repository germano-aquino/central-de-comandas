import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Separator } from "./ui/separator";
import { ChevronLeft, Download } from "lucide-react";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "sonner";
import Link from "next/link";

export function AnamnesisForm({ order, clientName, paymentMethod }) {
  const signatureRef = useRef(null);

  // Depilação
  const [depilacaoQuestions, setDepilacaoQuestions] = useState([
    {
      question: "Costuma fazer depilação? Qual o método?",
      answer: null,
      details: "",
    },
    { question: "Gestante? Quanto tempo?", answer: null, details: "" },
    {
      question: "Sensibilidade/alergia à algum produto?",
      answer: null,
      details: "",
    },
    {
      question: "Realiza tratamento com ácido ou laser?",
      answer: null,
      details: "",
    },
    {
      question: "Possui alguma cicatriz ou mancha?",
      answer: null,
      details: "",
    },
    { question: "Tem foliculite ou histórico?", answer: null, details: "" },
    { question: "Tem pelos encravados?", answer: null, details: "" },
  ]);
  const [tipoPele, setTipoPele] = useState({
    sensivel: false,
    seca: false,
    muitoSeca: false,
  });
  const [espessuraPelo, setEspessuraPelo] = useState({
    fino: false,
    medio: false,
    grosso: false,
  });

  // Sobrancelhas
  const [sobrancelhasQuestions, setSobrancelhasQuestions] = useState([
    { question: "Utiliza ácido na face?", answer: null, details: "" },
    { question: "Alergia a henna ou coloração?", answer: null, details: "" },
    { question: "Possui falhas na sombrancelha?", answer: null, details: "" },
  ]);

  // Esmalteria
  const [remocaoCuticula, setRemocaoCuticula] = useState("");
  const [esmalteriaQuestions, setEsmalteriaQuestions] = useState([
    { question: "Possui unha encravada?", answer: null, details: "" },
    { question: "Possui diabetes?", answer: null, details: "" },
    {
      question: "Possui sensibilidade ou alergia à algum produto?",
      answer: null,
      details: "",
    },
  ]);

  // Alta Frequência
  const [altaFrequenciaQuestions, setAltaFrequenciaQuestions] = useState([
    { question: "Tem Epilepsia?", answer: null, details: "" },
    { question: "Diabetes?", answer: null, details: "" },
    { question: "Gestante?", answer: null, details: "" },
    { question: "Portadora de marca passo?", answer: null, details: "" },
    { question: "Alguma condição cardíaca?", answer: null, details: "" },
    { question: "Placas ou pinos no corpo?", answer: null, details: "" },
  ]);

  // Uso de Imagens
  const [usoImagensQuestions, setUsoImagensQuestions] = useState([
    {
      question: "Aceita registrar fotos de antes e depois para documentar?",
      answer: null,
      details: "",
    },
    {
      question: "Autoriza publicação em redes sociais do Clube Depil?",
      answer: null,
      details: "",
    },
  ]);

  // Observações
  const [condicaoSaude, setCondicaoSaude] = useState("");
  const [observacoes, setObservacoes] = useState("");

  function updateYesNoAnswer(questions, setQuestions, index, answer) {
    const updated = [...questions];
    updated[index].answer = answer;
    if (!answer) {
      updated[index].details = "";
    }
    setQuestions(updated);
  }

  function updateDetails(questions, setQuestions, index, details) {
    const updated = [...questions];
    updated[index].details = details;
    setQuestions(updated);
  }

  function clearSignature() {
    signatureRef.current?.clear();
  }

  function generatePDF() {
    if (signatureRef.current?.isEmpty()) {
      toast.error("Por favor, adicione a assinatura da cliente");
      return;
    }

    // Aqui você implementaria a geração do PDF
    // Para simplicidade, vou criar um objeto com todos os dados
    const formData = {
      cliente: clientName,
      data: new Date().toLocaleDateString("pt-BR"),
      servicos: order,
      pagamento: paymentMethod,
      depilacao: {
        questions: depilacaoQuestions,
        tipoPele,
        espessuraPelo,
      },
      sobrancelhas: sobrancelhasQuestions,
      esmalteria: {
        remocaoCuticula,
        questions: esmalteriaQuestions,
      },
      altaFrequencia: altaFrequenciaQuestions,
      usoImagens: usoImagensQuestions,
      observacoes: {
        condicaoSaude,
        observacoes,
      },
      assinatura: signatureRef.current?.toDataURL(),
    };

    console.log("Dados do formulário:", formData);

    // Simular download do PDF
    toast.success("Ficha de avaliação gerada com sucesso!");

    // Aqui você poderia usar uma biblioteca como jsPDF ou react-pdf para gerar o PDF real
  }

  function YesNoField({ question, index, questions, setQuestions }) {
    return (
      <div className="space-y-2">
        <Label>{question.question}</Label>
        <div className="flex gap-4">
          <Button
            type="button"
            variant={question.answer === true ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateYesNoAnswer(questions, setQuestions, index, true)
            }
            className={
              question.answer === true ? "bg-pink-600 hover:bg-pink-700" : ""
            }
          >
            Sim
          </Button>
          <Button
            type="button"
            variant={question.answer === false ? "default" : "outline"}
            size="sm"
            onClick={() =>
              updateYesNoAnswer(questions, setQuestions, index, false)
            }
            className={
              question.answer === false ? "bg-pink-600 hover:bg-pink-700" : ""
            }
          >
            Não
          </Button>
        </div>
        {question.answer === true && (
          <Input
            placeholder="Descreva os detalhes"
            value={question.details}
            onChange={(e) =>
              updateDetails(questions, setQuestions, index, e.target.value)
            }
            className="mt-2"
          />
        )}
      </div>
    );
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
          {/* Depilação */}
          <div className="space-y-4">
            <h3 className="text-pink-600">Depilação</h3>
            <Separator />
            <div className="space-y-4">
              {depilacaoQuestions.map((q, index) => (
                <YesNoField
                  key={index}
                  question={q}
                  index={index}
                  questions={depilacaoQuestions}
                  setQuestions={setDepilacaoQuestions}
                />
              ))}

              <div className="space-y-2">
                <Label>Tipo de pele:</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="sensivel"
                      checked={tipoPele.sensivel}
                      onCheckedChange={(checked) =>
                        setTipoPele({ ...tipoPele, sensivel: checked })
                      }
                    />
                    <Label htmlFor="sensivel">Sensível</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="seca"
                      checked={tipoPele.seca}
                      onCheckedChange={(checked) =>
                        setTipoPele({ ...tipoPele, seca: checked })
                      }
                    />
                    <Label htmlFor="seca">Seca</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="muitoSeca"
                      checked={tipoPele.muitoSeca}
                      onCheckedChange={(checked) =>
                        setTipoPele({ ...tipoPele, muitoSeca: checked })
                      }
                    />
                    <Label htmlFor="muitoSeca">Muito Seca</Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Espessura do pelo:</Label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="fino"
                      checked={espessuraPelo.fino}
                      onCheckedChange={(checked) =>
                        setEspessuraPelo({ ...espessuraPelo, fino: checked })
                      }
                    />
                    <Label htmlFor="fino">Fino</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="medio"
                      checked={espessuraPelo.medio}
                      onCheckedChange={(checked) =>
                        setEspessuraPelo({ ...espessuraPelo, medio: checked })
                      }
                    />
                    <Label htmlFor="medio">Médio</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="grosso"
                      checked={espessuraPelo.grosso}
                      onCheckedChange={(checked) =>
                        setEspessuraPelo({ ...espessuraPelo, grosso: checked })
                      }
                    />
                    <Label htmlFor="grosso">Grosso</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sobrancelhas */}
          <div className="space-y-4">
            <h3 className="text-pink-600">Sobrancelhas</h3>
            <Separator />
            <div className="space-y-4">
              {sobrancelhasQuestions.map((q, index) => (
                <YesNoField
                  key={index}
                  question={q}
                  index={index}
                  questions={sobrancelhasQuestions}
                  setQuestions={setSobrancelhasQuestions}
                />
              ))}
            </div>
          </div>

          {/* Esmalteria */}
          <div className="space-y-4">
            <h3 className="text-pink-600">Esmalteria</h3>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Como você gosta que remova sua cutícula?</Label>
                <RadioGroup
                  value={remocaoCuticula}
                  onValueChange={setRemocaoCuticula}
                  className="flex flex-row"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="profunda" id="profunda" />
                    <Label htmlFor="profunda">Profunda</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="superficial" id="superficial" />
                    <Label htmlFor="superficial">Superficial</Label>
                  </div>
                </RadioGroup>
              </div>

              {esmalteriaQuestions.map((q, index) => (
                <YesNoField
                  key={index}
                  question={q}
                  index={index}
                  questions={esmalteriaQuestions}
                  setQuestions={setEsmalteriaQuestions}
                />
              ))}
            </div>
          </div>

          {/* Alta Frequência */}
          <div className="space-y-4">
            <h3 className="text-pink-600">Alta Frequência</h3>
            <Separator />
            <div className="space-y-4">
              {altaFrequenciaQuestions.map((q, index) => (
                <YesNoField
                  key={index}
                  question={q}
                  index={index}
                  questions={altaFrequenciaQuestions}
                  setQuestions={setAltaFrequenciaQuestions}
                />
              ))}
            </div>
          </div>

          {/* Uso de Imagens */}
          <div className="space-y-4">
            <h3 className="text-pink-600">Uso de Imagens</h3>
            <Separator />
            <div className="space-y-4">
              {usoImagensQuestions.map((q, index) => (
                <YesNoField
                  key={index}
                  question={q}
                  index={index}
                  questions={usoImagensQuestions}
                  setQuestions={setUsoImagensQuestions}
                />
              ))}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="text-pink-600">Observações</h3>
            <Separator />
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="condicaoSaude">
                  Alguma condição de saúde que ache importante mencionar?
                </Label>
                <Textarea
                  id="condicaoSaude"
                  placeholder="Descreva aqui..."
                  value={condicaoSaude}
                  onChange={(e) => setCondicaoSaude(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observacoes">Alguma observação?</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Descreva aqui..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>
          </div>

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
