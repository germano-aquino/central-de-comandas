import orchestrator from "../../tests/orchestrator";
import category from "@/models/category";
import service from "@/models/service";
import question from "@/models/question";
import formSection from "@/models/formSection";
import store from "@/models/store";

const SERVICE_CATEGORIES = [
  "Depilação",
  "Depilação à Linha",
  "Depilação Masculina",
  "Estética Facial",
  "Estética Corporal",
  "Esmalteria",
];

const SERVICES_CILIOS = [
  {
    name: "Cilios",
    price: 8000,
    category: "Cilios",
    is_mold: true,
  },
];

const SERVICES_DEPILACAO = [
  {
    name: "Abdômen Completo Feminino",
    price: 4850,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Antebraço Feminino",
    price: 2850,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Aparar pelos - virilha",
    price: 1200,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Areola",
    price: 1450,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Axila Feminina",
    price: 3600,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Bochechas Feminina",
    price: 1800,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Braços Completo Feminino",
    price: 4850,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Buço",
    price: 2850,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Coccix Feminino",
    price: 1950,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Costas Completas Fem.",
    price: 5950,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Coxa Anterior Feminina",
    price: 2800,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Coxa Completa Feminina",
    price: 4950,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Coxa Posterior Feminina",
    price: 2800,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Dorsal Feminina",
    price: 2900,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Entre Seios",
    price: 1450,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Faixa de Coxa Feminina",
    price: 2250,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Faixa de Nádegas Fem.",
    price: 2250,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Linha Alba Inferior Fem.",
    price: 1650,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Linha Alba Superior Fem.",
    price: 1650,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Lombar Feminina",
    price: 2900,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Mãos Femininas",
    price: 1800,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Meia Perna - Feminina",
    price: 4950,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Nádegas Fem.",
    price: 4250,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Nariz Feminino",
    price: 1650,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Nuca Feminina",
    price: 1200,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Ombros Femininos",
    price: 1500,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Orelha Feminina",
    price: 1500,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Perianal",
    price: 3500,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Perna Inteira Feminina",
    price: 9000,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Pés Femininos (DH02)",
    price: 1500,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Pescoço Feminino",
    price: 2000,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Protocolo Calmante Alta Frequência",
    price: 600,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Protocolo Calmante Argila + Alta Frequência",
    price: 800,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Queixo Feminino (DH02)",
    price: 1850,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Reparo - Depilação",
    price: 0,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Seios",
    price: 2300,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Temporas Feminina",
    price: 1850,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Testa Feminina",
    price: 1850,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Umbigo Feminino",
    price: 1000,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Virilha Biquíni",
    price: 4400,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Virilha Cavada",
    price: 5000,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Virilha Intima",
    price: 6850,
    category: "Depilação",
    is_mold: true,
  },
  {
    name: "Virilha Intima + Perianal",
    price: 9400,
    category: "Depilação",
    is_mold: true,
  },
];

const SERVICES_DEPILACAO_FACIAL_COM_LINHA = [
  {
    name: "Bochechas com Linha",
    price: 1950,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Buço com Linha",
    price: 2800,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Depilação do Pescoço com linha",
    price: 2050,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Face completa com linha",
    price: 12000,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Face Completa na linha + Porcelana (DH02)",
    price: 13750,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Meio Sobrancelha",
    price: 2750,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Nariz com Linha",
    price: 1650,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Queixo com Linha (DH02)",
    price: 2100,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Têmporas com linha",
    price: 1950,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
  {
    name: "Testa com linha",
    price: 2100,
    categorie: "Depilação Facial com Linha",
    is_mold: true,
  },
];

const SERVICES_DEPILACAO_MASCULINA = [
  {
    name: "Abdômen Masculino",
    price: 7050,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Antebraço Masculino",
    price: 3550,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Axila Masculina",
    price: 4650,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Barba Completa",
    price: 9350,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Barba Lateral",
    price: 4650,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Bigode",
    price: 3500,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Braços Masculino",
    price: 6500,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Coccix Masculino",
    price: 3400,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Costas Completas Masc.",
    price: 8900,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Costelas Masculinas",
    price: 2500,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Coxa Anterior Masculina",
    price: 3550,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Coxa Posterior Masculina",
    price: 3550,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Coxas Masculina",
    price: 6000,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Dorsal Masculino",
    price: 4650,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Faixa Cintura Masc.",
    price: 5900,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Faixa de Coxa Masculino",
    price: 2800,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Glúteos Masculinos",
    price: 4750,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Linha Alba Inferior Masc.",
    price: 2250,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Linha Alba Superior Masc.",
    price: 2250,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Lombar masculino",
    price: 5500,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Mãos Masculinas",
    price: 2800,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Meia Perna - Masculino",
    price: 5800,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Nariz Masculino",
    price: 2300,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Nuca Masculina",
    price: 1800,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Ombros Masculinos",
    price: 2050,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Orelha Masculina",
    price: 2650,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Perna Inteira Masc.",
    price: 11000,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Pés Masculinos (DH02)",
    price: 2550,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Pescoço Masculino (DH02)",
    price: 3400,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Queixo Masculino",
    price: 2750,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Testa Masculina",
    price: 2100,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Torax Masculino",
    price: 3700,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Tronco masculino",
    price: 9650,
    category: "Depilação Masculina",
    is_mold: true,
  },
  {
    name: "Umbigo Masculino",
    price: 1350,
    category: "Depilação Masculina",
    is_mold: true,
  },
];

const SERVICES_DESIGN_E_COLORAÇÃO = [
  {
    name: "Coloração de Sobrancelhas com Henna (DC01)",
    price: 4500,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Coloração de Sobrancelhas Tintura (DC01)",
    price: 4500,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Design + Buço",
    price: 8200,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Design + Coloração (DC01)",
    price: 8500,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Design + Coloração + Buço (DC01)",
    price: 10500,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Design + Henna (DC01)",
    price: 8500,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Design + Henna + Buço (DC01)",
    price: 10500,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Design de Sobrancelhas",
    price: 6200,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Protocolo Calmante - Design",
    price: 0,
    category: "Design e Coloração",
    is_mold: true,
  },
  {
    name: "Reparo - Design",
    price: 0,
    category: "Design e Coloração",
    is_mold: true,
  },
];

const SERVICES_LABIAL_E_MASCARAS_FACIAIS = [
  {
    name: "Hidratação Facial com Argila Rosa (DH02)",
    price: 4400,
    category: "Labial e Mascaras Faciais",
    is_mold: true,
  },
  {
    name: "Máscara de Porcelana (DH02)",
    price: 4400,
    category: "Labial e Mascaras Faciais",
    is_mold: true,
  },
  {
    name: "Revitalização facial (promocional)",
    price: 0,
    category: "Labial e Mascaras Faciais",
    is_mold: true,
  },
  {
    name: "Spa labial (DX03)",
    price: 6600,
    category: "Labial e Mascaras Faciais",
    is_mold: true,
  },
];

const SERVICES_LIMPEZA_DE_PELE = [
  {
    name: "Aplicação de Alta Frequência",
    price: 0,
    category: "Limpeza de Pele",
    is_mold: true,
  },
  {
    name: "Limpeza de Pele Profunda",
    price: 11000,
    category: "Limpeza de Pele",
    is_mold: true,
  },
  {
    name: "Limpeza de Pele Profunda Especial",
    price: 14000,
    category: "Limpeza de Pele",
    is_mold: true,
  },
  {
    name: "Limpeza Detox",
    price: 5000,
    category: "Limpeza de Pele",
    is_mold: true,
  },
];

const SERVICES_MANICURE = [
  {
    name: "Adicional Base Fortalecedora Personale",
    price: 350,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional de Esfoliação das Pernas (DC01)",
    price: 1650,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional Degradê 2 Unhas",
    price: 660,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional Degradê Toda Mão",
    price: 1320,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional Filha única",
    price: 660,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional Francesinha",
    price: 750,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional Francesinha Pé e Mão",
    price: 1350,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional Gota Secante (DG04)",
    price: 350,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional Pedraria/Película",
    price: 660,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Adicional Top Coat Risque",
    price: 500,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Alongamento de Unha postiça",
    price: 8500,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Argila Verde nos Pés (DC01)",
    price: 2500,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Avaliação Cliente - Esmalteria",
    price: 0,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Hidratação das mãos com parafina (DC01)",
    price: 1000,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Hidratação dos pés com parafina (DC01)",
    price: 1500,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Manicure brasileirinha",
    price: 4400,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Manicure Brasileirinha - Compartilhada",
    price: 4100,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Manicure Infantil",
    price: 1850,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Manicure ligeirinha",
    price: 2750,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Manicure Masculina",
    price: 3850,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Manicure+Pedicure",
    price: 8200,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Pedicure brasileirinha",
    price: 4400,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Pedicure Brasileirinha - Compartilhada",
    price: 4100,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Pedicure Infantil",
    price: 1850,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Pedicure ligeirinha",
    price: 2750,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Pedicure Masculina",
    price: 4400,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Protocolo Calmante - Esmalteria",
    price: 0,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Remoção de unha de fibra",
    price: 4900,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Remoção de unha postiça (unitário)",
    price: 700,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Reparo - Esmalteria",
    price: 0,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Retoque unha (kit)",
    price: 400,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Spa das Mãos (DC01)",
    price: 1000,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Spa dos Pés Calosidade",
    price: 13000,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Spa dos Pés Relaxante Jelly",
    price: 15000,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Spa dos Pés Relaxante Sais",
    price: 15000,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Troca de esmalte",
    price: 1100,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Unha Postiça (uma unha)",
    price: 900,
    category: "Manicure",
    is_mold: true,
  },
  {
    name: "Unhas em Gel",
    price: 12000,
    category: "Manicure",
    is_mold: true,
  },
];

const SERVICES_MASSAGEM = [
  {
    name: "Drenagem Linfática",
    price: 15000,
    category: "Massagem",
    is_mold: true,
  },
  {
    name: "Massagem Modeladora",
    price: 15000,
    category: "Massagem",
    is_mold: true,
  },
  {
    name: "Massagem Relaxante",
    price: 15000,
    category: "Massagem",
    is_mold: true,
  },
];

const QUESTION_SECTIONS = [
  "Depilação",
  "Sombrancelhas",
  "Esmalteria",
  "Alta Frequência",
  "Uso de Imagem",
  "Observações",
];

const QUESTIONS_DEPILACAO = [
  {
    statement: "Costuma fazer depilação? Qual método?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Gestante? Quanto tempo?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Sensibilidade/alergia à algum produto?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Realiza tratamento com ácido ou laser?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Possui alguma cicatriz ou mancha?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Tipo de pele:",
    type: "radio",
    options: ["Sensível", "Seca", "Muito seca"],
    is_mold: true,
  },
  {
    statement: "Espessura do pelo:",
    type: "radio",
    options: ["Fino", "Médio", "Grosso"],
    is_mold: true,
  },
  {
    statement: "Tem foliculite ou histórico?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Tem pelos encravados?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Qual cera utilizou?",
    type: "checkBox",
    options: [
      "Cera de Açaí",
      "Cera de Aveia",
      "Cera de Castanha",
      "Cera de Cupuaçu",
    ],
    is_mold: true,
  },
];

const QUESTIONS_SOMBRANCELHA = [
  {
    statement: "Utiliza ácido na face?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Alergia a hena ou coloração?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Possui falhas na sombrancelha?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
];

const QUESTIONS_ESMALTERIA = [
  {
    statement: "Como você gosta que remova a cutícula?",
    type: "radio",
    options: ["Profunda", "Superficial"],
    is_mold: true,
  },
  {
    statement: "Possui unha encravada?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Possui diabetes?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Sensibilidade/alergia à algum produto?",
    type: "yesOrNoDiscursive",
    options: ["Não", "Sim"],
    is_mold: true,
  },
];

const QUESTIONS_ALTA_FREQUENCIA = [
  {
    statement: "Tem epilepsia?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Tem diabetes?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "É gestante?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "É portadora de marca passo?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Alguma condição cardíaca?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Tem placas ou pinos no corpo?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
];

const QUESTIONS_USO_IMAGEM = [
  {
    statement: "Aceita registrar fotos de antes e depois para documentar?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
  {
    statement: "Autoriza publicação em redes sociais do Clube Depil?",
    type: "yesOrNo",
    options: ["Não", "Sim"],
    is_mold: true,
  },
];

const QUESTIONS_OBSERVACAO = [
  {
    statement: "Alguma condição de saúde que ache importante mencionar?",
    type: "discursive",
    is_mold: true,
  },
];

const STORES = [
  "Clube Depil 14 de Abril",
  "Clube Depil Duque",
  "Clube Depil Umarizal",
  "Clube Depil Batista",
];

async function populateDatabase() {
  const user = await orchestrator.createUser({
    username: "germano",
    email: "germano@example.com",
    password: "123456",
  });

  const forbiddenUser = await orchestrator.createUser({
    username: "semAcesso",
    email: "user@forbidden.com",
    password: "123456",
  });

  await orchestrator.activateUser(user);
  await orchestrator.activateUser(forbiddenUser);

  await orchestrator.addFeatures(user, category.addFeatures);
  await orchestrator.addFeatures(user, service.addFeatures);
  await orchestrator.addFeatures(user, question.addFeatures);
  await orchestrator.addFeatures(user, formSection.addFeatures);
  await orchestrator.addFeatures(user, store.addFeatures);

  const serviceCategories = await createServiceCategories();

  await createServices(serviceCategories);

  const formSections = await createQuestionSections();

  await createQuestions(formSections);

  await createStores();
}

async function createServiceCategories() {
  const categories = await orchestrator.createSections(
    undefined,
    undefined,
    SERVICE_CATEGORIES,
  );

  return categories;
}

async function createServices(serviceCategories) {
  const depilacao = serviceCategories.find((cat) => cat.name === "Depilação");
  for (const service of SERVICES_DEPILACAO) {
    await orchestrator.createService(
      service.name,
      service.price,
      depilacao.id,
      service.is_mold,
    );
  }

  const depilacaoLinha = serviceCategories.find(
    (cat) => cat.name === "Depilação à Linha",
  );
  for (const service of SERVICES_DEPILACAO_FACIAL_COM_LINHA) {
    await orchestrator.createService(
      service.name,
      service.price,
      depilacaoLinha.id,
      service.is_mold,
    );
  }

  const depilacaoMasc = serviceCategories.find(
    (cat) => cat.name === "Depilação Masculina",
  );
  for (const service of SERVICES_DEPILACAO_MASCULINA) {
    await orchestrator.createService(
      service.name,
      service.price,
      depilacaoMasc.id,
      service.is_mold,
    );
  }

  const facial = serviceCategories.find(
    (cat) => cat.name === "Estética Facial",
  );
  for (const service of SERVICES_DESIGN_E_COLORAÇÃO) {
    await orchestrator.createService(
      service.name,
      service.price,
      facial.id,
      service.is_mold,
    );
  }

  for (const service of SERVICES_LABIAL_E_MASCARAS_FACIAIS) {
    await orchestrator.createService(
      service.name,
      service.price,
      facial.id,
      service.is_mold,
    );
  }

  for (const service of SERVICES_LIMPEZA_DE_PELE) {
    await orchestrator.createService(
      service.name,
      service.price,
      facial.id,
      service.is_mold,
    );
  }

  for (const service of SERVICES_CILIOS) {
    await orchestrator.createService(
      service.name,
      service.price,
      facial.id,
      service.is_mold,
    );
  }

  const esmalteria = serviceCategories.find((cat) => cat.name === "Esmalteria");
  for (const service of SERVICES_MANICURE) {
    await orchestrator.createService(
      service.name,
      service.price,
      esmalteria.id,
      service.is_mold,
    );
  }

  const corporal = serviceCategories.find(
    (cat) => cat.name === "Estética Corporal",
  );
  for (const service of SERVICES_MASSAGEM) {
    await orchestrator.createService(
      service.name,
      service.price,
      corporal.id,
      service.is_mold,
    );
  }
}

async function createQuestionSections() {
  const sections = await orchestrator.createSections(
    undefined,
    "form",
    QUESTION_SECTIONS,
  );

  return sections;
}

async function createQuestions(formSections) {
  const depilacao = formSections.find((sec) => sec.name === "Depilação");
  for (const question of QUESTIONS_DEPILACAO) {
    await orchestrator.createQuestion(
      question.statement,
      question.type,
      question.options,
      depilacao.id,
      undefined,
      question.is_mold,
    );
  }

  const sombrancelha = formSections.find((sec) => sec.name === "Sombrancelhas");
  for (const question of QUESTIONS_SOMBRANCELHA) {
    await orchestrator.createQuestion(
      question.statement,
      question.type,
      question.options,
      sombrancelha.id,
      undefined,
      question.is_mold,
    );
  }

  const esmalteria = formSections.find((sec) => sec.name === "Esmalteria");
  for (const question of QUESTIONS_ESMALTERIA) {
    await orchestrator.createQuestion(
      question.statement,
      question.type,
      question.options,
      esmalteria.id,
      undefined,
      question.is_mold,
    );
  }

  const altaFrequencia = formSections.find(
    (sec) => sec.name === "Alta Frequência",
  );
  for (const question of QUESTIONS_ALTA_FREQUENCIA) {
    await orchestrator.createQuestion(
      question.statement,
      question.type,
      question.options,
      altaFrequencia.id,
      undefined,
      question.is_mold,
    );
  }

  const usoImagem = formSections.find((sec) => sec.name === "Uso de Imagem");
  for (const question of QUESTIONS_USO_IMAGEM) {
    await orchestrator.createQuestion(
      question.statement,
      question.type,
      question.options,
      usoImagem.id,
      undefined,
      question.is_mold,
    );
  }

  const observacao = formSections.find((sec) => sec.name === "Observações");
  for (const question of QUESTIONS_OBSERVACAO) {
    await orchestrator.createQuestion(
      question.statement,
      question.type,
      question.options,
      observacao.id,
      undefined,
      question.is_mold,
    );
  }
}

async function createStores() {
  await orchestrator.createStores(undefined, STORES);
}

export default populateDatabase;
