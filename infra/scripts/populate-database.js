import orchestrator from "../../tests/orchestrator";

const CATEGORIES = [
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
  },
];

const SERVICES_DEPILACAO = [
  {
    name: "Abdômen Completo Feminino",
    price: 4850,
    category: "Depilação",
  },
  {
    name: "Antebraço Feminino",
    price: 2850,
    category: "Depilação",
  },
  {
    name: "Aparar pelos - virilha",
    price: 1200,
    category: "Depilação",
  },
  {
    name: "Areola",
    price: 1450,
    category: "Depilação",
  },
  {
    name: "Axila Feminina",
    price: 3600,
    category: "Depilação",
  },
  {
    name: "Bochechas Feminina",
    price: 1800,
    category: "Depilação",
  },
  {
    name: "Braços Completo Feminino",
    price: 4850,
    category: "Depilação",
  },
  {
    name: "Buço",
    price: 2850,
    category: "Depilação",
  },
  {
    name: "Coccix Feminino",
    price: 1950,
    category: "Depilação",
  },
  {
    name: "Costas Completas Fem.",
    price: 5950,
    category: "Depilação",
  },
  {
    name: "Coxa Anterior Feminina",
    price: 2800,
    category: "Depilação",
  },
  {
    name: "Coxa Completa Feminina",
    price: 4950,
    category: "Depilação",
  },
  {
    name: "Coxa Posterior Feminina",
    price: 2800,
    category: "Depilação",
  },
  {
    name: "Dorsal Feminina",
    price: 2900,
    category: "Depilação",
  },
  {
    name: "Entre Seios",
    price: 1450,
    category: "Depilação",
  },
  {
    name: "Faixa de Coxa Feminina",
    price: 2250,
    category: "Depilação",
  },
  {
    name: "Faixa de Nádegas Fem.",
    price: 2250,
    category: "Depilação",
  },
  {
    name: "Linha Alba Inferior Fem.",
    price: 1650,
    category: "Depilação",
  },
  {
    name: "Linha Alba Superior Fem.",
    price: 1650,
    category: "Depilação",
  },
  {
    name: "Lombar Feminina",
    price: 2900,
    category: "Depilação",
  },
  {
    name: "Mãos Femininas",
    price: 1800,
    category: "Depilação",
  },
  {
    name: "Meia Perna - Feminina",
    price: 4950,
    category: "Depilação",
  },
  {
    name: "Nádegas Fem.",
    price: 4250,
    category: "Depilação",
  },
  {
    name: "Nariz Feminino",
    price: 1650,
    category: "Depilação",
  },
  {
    name: "Nuca Feminina",
    price: 1200,
    category: "Depilação",
  },
  {
    name: "Ombros Femininos",
    price: 1500,
    category: "Depilação",
  },
  {
    name: "Orelha Feminina",
    price: 1500,
    category: "Depilação",
  },
  {
    name: "Perianal",
    price: 3500,
    category: "Depilação",
  },
  {
    name: "Perna Inteira Feminina",
    price: 9000,
    category: "Depilação",
  },
  {
    name: "Pés Femininos (DH02)",
    price: 1500,
    category: "Depilação",
  },
  {
    name: "Pescoço Feminino",
    price: 2000,
    category: "Depilação",
  },
  {
    name: "Protocolo Calmante Alta Frequência",
    price: 600,
    category: "Depilação",
  },
  {
    name: "Protocolo Calmante Argila + Alta Frequência",
    price: 800,
    category: "Depilação",
  },
  {
    name: "Queixo Feminino (DH02)",
    price: 1850,
    category: "Depilação",
  },
  {
    name: "Reparo - Depilação",
    price: 0,
    category: "Depilação",
  },
  {
    name: "Seios",
    price: 2300,
    category: "Depilação",
  },
  {
    name: "Temporas Feminina",
    price: 1850,
    category: "Depilação",
  },
  {
    name: "Testa Feminina",
    price: 1850,
    category: "Depilação",
  },
  {
    name: "Umbigo Feminino",
    price: 1000,
    category: "Depilação",
  },
  {
    name: "Virilha Biquíni",
    price: 4400,
    category: "Depilação",
  },
  {
    name: "Virilha Cavada",
    price: 5000,
    category: "Depilação",
  },
  {
    name: "Virilha Intima",
    price: 6850,
    category: "Depilação",
  },
  {
    name: "Virilha Intima + Perianal",
    price: 9400,
    category: "Depilação",
  },
];

const SERVICES_DEPILACAO_FACIAL_COM_LINHA = [
  {
    name: "Bochechas com Linha",
    price: 1950,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Buço com Linha",
    price: 2800,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Depilação do Pescoço com linha",
    price: 2050,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Face completa com linha",
    price: 12000,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Face Completa na linha + Porcelana (DH02)",
    price: 13750,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Meio Sobrancelha",
    price: 2750,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Nariz com Linha",
    price: 1650,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Queixo com Linha (DH02)",
    price: 2100,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Têmporas com linha",
    price: 1950,
    categorie: "Depilação Facial com Linha",
  },
  {
    name: "Testa com linha",
    price: 2100,
    categorie: "Depilação Facial com Linha",
  },
];

const SERVICES_DEPILACAO_MASCULINA = [
  {
    name: "Abdômen Masculino",
    price: 7050,
    category: "Depilação Masculina",
  },
  {
    name: "Antebraço Masculino",
    price: 3550,
    category: "Depilação Masculina",
  },
  {
    name: "Axila Masculina",
    price: 4650,
    category: "Depilação Masculina",
  },
  {
    name: "Barba Completa",
    price: 9350,
    category: "Depilação Masculina",
  },
  {
    name: "Barba Lateral",
    price: 4650,
    category: "Depilação Masculina",
  },
  {
    name: "Bigode",
    price: 3500,
    category: "Depilação Masculina",
  },
  {
    name: "Braços Masculino",
    price: 6500,
    category: "Depilação Masculina",
  },
  {
    name: "Coccix Masculino",
    price: 3400,
    category: "Depilação Masculina",
  },
  {
    name: "Costas Completas Masc.",
    price: 8900,
    category: "Depilação Masculina",
  },
  {
    name: "Costelas Masculinas",
    price: 2500,
    category: "Depilação Masculina",
  },
  {
    name: "Coxa Anterior Masculina",
    price: 3550,
    category: "Depilação Masculina",
  },
  {
    name: "Coxa Posterior Masculina",
    price: 3550,
    category: "Depilação Masculina",
  },
  {
    name: "Coxas Masculina",
    price: 6000,
    category: "Depilação Masculina",
  },
  {
    name: "Dorsal Masculino",
    price: 4650,
    category: "Depilação Masculina",
  },
  {
    name: "Faixa Cintura Masc.",
    price: 5900,
    category: "Depilação Masculina",
  },
  {
    name: "Faixa de Coxa Masculino",
    price: 2800,
    category: "Depilação Masculina",
  },
  {
    name: "Glúteos Masculinos",
    price: 4750,
    category: "Depilação Masculina",
  },
  {
    name: "Linha Alba Inferior Masc.",
    price: 2250,
    category: "Depilação Masculina",
  },
  {
    name: "Linha Alba Superior Masc.",
    price: 2250,
    category: "Depilação Masculina",
  },
  {
    name: "Lombar masculino",
    price: 5500,
    category: "Depilação Masculina",
  },
  {
    name: "Mãos Masculinas",
    price: 2800,
    category: "Depilação Masculina",
  },
  {
    name: "Meia Perna - Masculino",
    price: 5800,
    category: "Depilação Masculina",
  },
  {
    name: "Nariz Masculino",
    price: 2300,
    category: "Depilação Masculina",
  },
  {
    name: "Nuca Masculina",
    price: 1800,
    category: "Depilação Masculina",
  },
  {
    name: "Ombros Masculinos",
    price: 2050,
    category: "Depilação Masculina",
  },
  {
    name: "Orelha Masculina",
    price: 2650,
    category: "Depilação Masculina",
  },
  {
    name: "Perna Inteira Masc.",
    price: 11000,
    category: "Depilação Masculina",
  },
  {
    name: "Pés Masculinos (DH02)",
    price: 2550,
    category: "Depilação Masculina",
  },
  {
    name: "Pescoço Masculino (DH02)",
    price: 3400,
    category: "Depilação Masculina",
  },
  {
    name: "Queixo Masculino",
    price: 2750,
    category: "Depilação Masculina",
  },
  {
    name: "Testa Masculina",
    price: 2100,
    category: "Depilação Masculina",
  },
  {
    name: "Torax Masculino",
    price: 3700,
    category: "Depilação Masculina",
  },
  {
    name: "Tronco masculino",
    price: 9650,
    category: "Depilação Masculina",
  },
  {
    name: "Umbigo Masculino",
    price: 1350,
    category: "Depilação Masculina",
  },
];

const SERVICES_DESIGN_E_COLORAÇÃO = [
  {
    name: "Coloração de Sobrancelhas com Henna (DC01)",
    price: 4500,
    category: "Design e Coloração",
  },
  {
    name: "Coloração de Sobrancelhas Tintura (DC01)",
    price: 4500,
    category: "Design e Coloração",
  },
  {
    name: "Design + Buço",
    price: 8200,
    category: "Design e Coloração",
  },
  {
    name: "Design + Coloração (DC01)",
    price: 8500,
    category: "Design e Coloração",
  },
  {
    name: "Design + Coloração + Buço (DC01)",
    price: 10500,
    category: "Design e Coloração",
  },
  {
    name: "Design + Henna (DC01)",
    price: 8500,
    category: "Design e Coloração",
  },
  {
    name: "Design + Henna + Buço (DC01)",
    price: 10500,
    category: "Design e Coloração",
  },
  {
    name: "Design de Sobrancelhas",
    price: 6200,
    category: "Design e Coloração",
  },
  {
    name: "Protocolo Calmante - Design",
    price: 0,
    category: "Design e Coloração",
  },
  {
    name: "Reparo - Design",
    price: 0,
    category: "Design e Coloração",
  },
];

const SERVICES_LABIAL_E_MASCARAS_FACIAIS = [
  {
    name: "Hidratação Facial com Argila Rosa (DH02)",
    price: 4400,
    category: "Labial e Mascaras Faciais",
  },
  {
    name: "Máscara de Porcelana (DH02)",
    price: 4400,
    category: "Labial e Mascaras Faciais",
  },
  {
    name: "Revitalização facial (promocional)",
    price: 0,
    category: "Labial e Mascaras Faciais",
  },
  {
    name: "Spa labial (DX03)",
    price: 6600,
    category: "Labial e Mascaras Faciais",
  },
];

const SERVICES_LIMPEZA_DE_PELE = [
  {
    name: "Aplicação de Alta Frequência",
    price: 0,
    category: "Limpeza de Pele",
  },
  {
    name: "Limpeza de Pele Profunda",
    price: 11000,
    category: "Limpeza de Pele",
  },
  {
    name: "Limpeza de Pele Profunda Especial",
    price: 14000,
    category: "Limpeza de Pele",
  },
  {
    name: "Limpeza Detox",
    price: 5000,
    category: "Limpeza de Pele",
  },
];

const SERVICES_MANICURE = [
  {
    name: "Adicional Base Fortalecedora Personale",
    price: 350,
    category: "Manicure",
  },
  {
    name: "Adicional de Esfoliação das Pernas (DC01)",
    price: 1650,
    category: "Manicure",
  },
  {
    name: "Adicional Degradê 2 Unhas",
    price: 660,
    category: "Manicure",
  },
  {
    name: "Adicional Degradê Toda Mão",
    price: 1320,
    category: "Manicure",
  },
  {
    name: "Adicional Filha única",
    price: 660,
    category: "Manicure",
  },
  {
    name: "Adicional Francesinha",
    price: 750,
    category: "Manicure",
  },
  {
    name: "Adicional Francesinha Pé e Mão",
    price: 1350,
    category: "Manicure",
  },
  {
    name: "Adicional Gota Secante (DG04)",
    price: 350,
    category: "Manicure",
  },
  {
    name: "Adicional Pedraria/Película",
    price: 660,
    category: "Manicure",
  },
  {
    name: "Adicional Top Coat Risque",
    price: 500,
    category: "Manicure",
  },
  {
    name: "Alongamento de Unha postiça",
    price: 8500,
    category: "Manicure",
  },
  {
    name: "Argila Verde nos Pés (DC01)",
    price: 2500,
    category: "Manicure",
  },
  {
    name: "Avaliação Cliente - Esmalteria",
    price: 0,
    category: "Manicure",
  },
  {
    name: "Hidratação das mãos com parafina (DC01)",
    price: 1000,
    category: "Manicure",
  },
  {
    name: "Hidratação dos pés com parafina (DC01)",
    price: 1500,
    category: "Manicure",
  },
  {
    name: "Manicure brasileirinha",
    price: 4400,
    category: "Manicure",
  },
  {
    name: "Manicure Brasileirinha - Compartilhada",
    price: 4100,
    category: "Manicure",
  },
  {
    name: "Manicure Infantil",
    price: 1850,
    category: "Manicure",
  },
  {
    name: "Manicure ligeirinha",
    price: 2750,
    category: "Manicure",
  },
  {
    name: "Manicure Masculina",
    price: 3850,
    category: "Manicure",
  },
  {
    name: "Manicure+Pedicure",
    price: 8200,
    category: "Manicure",
  },
  {
    name: "Pedicure brasileirinha",
    price: 4400,
    category: "Manicure",
  },
  {
    name: "Pedicure Brasileirinha - Compartilhada",
    price: 4100,
    category: "Manicure",
  },
  {
    name: "Pedicure Infantil",
    price: 1850,
    category: "Manicure",
  },
  {
    name: "Pedicure ligeirinha",
    price: 2750,
    category: "Manicure",
  },
  {
    name: "Pedicure Masculina",
    price: 4400,
    category: "Manicure",
  },
  {
    name: "Protocolo Calmante - Esmalteria",
    price: 0,
    category: "Manicure",
  },
  {
    name: "Remoção de unha de fibra",
    price: 4900,
    category: "Manicure",
  },
  {
    name: "Remoção de unha postiça (unitário)",
    price: 700,
    category: "Manicure",
  },
  {
    name: "Reparo - Esmalteria",
    price: 0,
    category: "Manicure",
  },
  {
    name: "Retoque unha (kit)",
    price: 400,
    category: "Manicure",
  },
  {
    name: "Spa das Mãos (DC01)",
    price: 1000,
    category: "Manicure",
  },
  {
    name: "Spa dos Pés Calosidade",
    price: 13000,
    category: "Manicure",
  },
  {
    name: "Spa dos Pés Relaxante Jelly",
    price: 15000,
    category: "Manicure",
  },
  {
    name: "Spa dos Pés Relaxante Sais",
    price: 15000,
    category: "Manicure",
  },
  {
    name: "Troca de esmalte",
    price: 1100,
    category: "Manicure",
  },
  {
    name: "Unha Postiça (uma unha)",
    price: 900,
    category: "Manicure",
  },
  {
    name: "Unhas em Gel",
    price: 12000,
    category: "Manicure",
  },
];

const SERVICES_MASSAGEM = [
  {
    name: "Drenagem Linfática",
    price: 15000,
    category: "Massagem",
  },
  {
    name: "Massagem Modeladora",
    price: 15000,
    category: "Massagem",
  },
  {
    name: "Massagem Relaxante",
    price: 15000,
    category: "Massagem",
  },
];

async function createCategories() {
  const categories = await orchestrator.createSections(
    undefined,
    undefined,
    CATEGORIES,
  );

  const depilacao = categories.find((cat) => cat.name === "Depilação");
  for (const service of SERVICES_DEPILACAO) {
    await orchestrator.createService(service.name, service.price, depilacao.id);
  }

  const depilacaoLinha = categories.find(
    (cat) => cat.name === "Depilação à Linha",
  );
  for (const service of SERVICES_DEPILACAO_FACIAL_COM_LINHA) {
    await orchestrator.createService(
      service.name,
      service.price,
      depilacaoLinha.id,
    );
  }

  const depilacaoMasc = categories.find(
    (cat) => cat.name === "Depilação Masculina",
  );
  for (const service of SERVICES_DEPILACAO_MASCULINA) {
    await orchestrator.createService(
      service.name,
      service.price,
      depilacaoMasc.id,
    );
  }

  const facial = categories.find((cat) => cat.name === "Estética Facial");
  for (const service of SERVICES_DESIGN_E_COLORAÇÃO) {
    await orchestrator.createService(service.name, service.price, facial.id);
  }

  for (const service of SERVICES_LABIAL_E_MASCARAS_FACIAIS) {
    await orchestrator.createService(service.name, service.price, facial.id);
  }

  for (const service of SERVICES_LIMPEZA_DE_PELE) {
    await orchestrator.createService(service.name, service.price, facial.id);
  }

  for (const service of SERVICES_CILIOS) {
    await orchestrator.createService(service.name, service.price, facial.id);
  }

  const esmalteria = categories.find((cat) => cat.name === "Esmalteria");
  for (const service of SERVICES_MANICURE) {
    await orchestrator.createService(
      service.name,
      service.price,
      esmalteria.id,
    );
  }

  const corporal = categories.find((cat) => cat.name === "Estética Corporal");
  for (const service of SERVICES_MASSAGEM) {
    await orchestrator.createService(service.name, service.price, corporal.id);
  }
}

export default createCategories;
