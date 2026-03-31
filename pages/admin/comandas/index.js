import { Button } from "@/components/ui/button";
import { QuestionSelection } from "@/components/tab/QuestionSelection";
import { ServiceSelection } from "@/components/tab/ServiceSelection";
import { Newspaper } from "lucide-react";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { getCookie } from "cookies-next/client";

function ManageTabMolds() {
  const [sections, setSections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [serviceIds, setServiceIds] = useState([]);
  const [questionIds, setQuestionIds] = useState([]);

  useEffect(() => {
    loadServicesAndCategories();
    loadQuestionsAndFormSections();
    // loadMoldServicesAndQuestions()
  }, []);

  async function loadServicesAndCategories() {
    const categoryResponse = await fetch("/api/v1/categories");

    const storedCategories = await categoryResponse.json();

    if (categoryResponse.status !== 200) {
      toast.error("Falha ao carregar as categorias!");
      console.error(storedCategories);
      return;
    }
    let categoryOrder = 0;
    const categoriesMap = new Map();
    const categories = storedCategories.map((category) => {
      categoriesMap.set(category.id, category.name);
      return {
        id: category.id,
        name: category.name,
        order: ++categoryOrder,
      };
    });
    setCategories(categories);

    const params = new URLSearchParams();
    params.set("is_mold", "true");
    const serviceResponse = await fetch(`/api/v1/services?${params}`);

    const storedServices = await serviceResponse.json();

    if (serviceResponse.status !== 200) {
      toast.error("Falha ao carregar os serviços!");
      console.error(storedServices);
      return;
    }
    let serviceOrder = 0;
    const services = storedServices.map((service) => {
      return {
        id: service.id,
        name: service.name,
        price: service.price / 100,
        categoryId: service.category_id,
        category: categoriesMap.get(service.category_id),
        order: ++serviceOrder,
      };
    });
    setServices(services);
  }

  async function loadQuestionsAndFormSections() {
    const formSectionsResponse = await fetch(`/api/v1/form/sections`);

    const storedSections = await formSectionsResponse.json();

    if (formSectionsResponse.status !== 200) {
      toast.error("Falha ao carrega as seções de perguntas.");
      console.error(storedSections.message);
      return;
    }

    let formSectionOrder = 1;

    const sectionsMap = new Map();
    const sections = storedSections.map((section) => {
      sectionsMap.set(section.id, section.name);
      return {
        id: section.id,
        name: section.name,
        order: formSectionOrder++,
      };
    });
    setSections(sections);

    const params = new URLSearchParams();
    params.set("is_mold", "true");
    const questionsResponse = await fetch(`/api/v1/questions?${params}`);
    const storedQuestions = await questionsResponse.json();

    if (questionsResponse.status !== 200) {
      console.error(storedQuestions);
      return;
    }

    let questionsOrder = 1;
    const questions = storedQuestions.map((question) => {
      return {
        id: question.id,
        statement: question.statement,
        type: question.type,
        sectionId: question.section_id,
        sectionName: sectionsMap.get(question.section_id),
        order: questionsOrder++,
      };
    });
    setQuestions(questions);

    let newSelectedQuestions = {};
    for (const section of sections) {
      newSelectedQuestions = {
        ...newSelectedQuestions,
        [section.name]: questions
          .filter((question) => question.sectionId === section.id)
          .reduce((accumulator, question) => {
            accumulator[question.id] = false;
            return accumulator;
          }, {}),
      };
    }
    console.log("newSelectedQuestions: ", newSelectedQuestions);
    setSelectedQuestions(newSelectedQuestions);
  }

  // async function loadMoldServicesAndQuestions() {
  //   const storeResponse = await fetch('/api/v1/stores')

  //   if (storeResponse.status !== 200) {
  //     const storeResponseBody = await storeResponse.json()

  //     console.error(storeResponseBody)
  //     toast.error("Falha ao carregar as informações da loja")
  //     return
  //   }

  //   const storeInfo = await storeResponse.json()

  //   const storeId = getCookie('store_id')

  //   const moldId = (storeInfo.filter(store => store.id === storeId)).mold_id
  //   const params = new URLSearchParams()
  //   params.set('id', moldId)

  //   const response = await fetch(`/api/v1/molds?params`)

  //   if (response.status !== 200) {
  //     const responseBody = await response.json()

  //     console.error(responseBody)
  //     toast.error("Falha ao carregar o padrão de comanda")
  //     return
  //   }

  //   const mold = await response.json()

  // }

  async function handleSaveTab() {
    const storeId = getCookie("store_id");
    console.log("storeId: ", storeId);

    console.log("serviceIds: ", serviceIds);
    console.log("questionIds: ", questionIds);

    // const response = await fetch("/api/v1/molds", {
    //   method: "POST",
    //   headers: {
    //     "content-type": "application/json",
    //   },
    //   body: {
    //     store_ids: [storeId],
    //     form_section_ids: [],
    //     question_ids: [],
    //     category_ids: [],
    //     service_ids: [],
    //   },
    // });

    // if (response.status !== 201) {
    //   const responseBody = await response.json();

    //   console.error(responseBody);
    //   toast.error("Falha ao salvar a comanda.");
    //   return;
    // }
  }

  const servicesByCategory = categories.map((category) => ({
    category: category.name,
    services: services.filter((service) => service.categoryId === category.id),
  }));

  const questionsBySection = sections.map((section) => ({
    section: section.name,
    questions: questions.filter(
      (question) => question.sectionId === section.id,
    ),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-4">
          <div className="flex justify-between">
            <h2 className="mb-4">Perguntas Disponíveis</h2>
            <Button
              onClick={() => {
                handleSaveTab();
              }}
            >
              Salvar Comanda
            </Button>
          </div>
          <QuestionSelection
            questionsBySection={questionsBySection}
            questionIds={questionIds}
            setQuestionIds={setQuestionIds}
          />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="mb-4">Serviços Disponíveis</h2>
          <ServiceSelection
            servicesByCategory={servicesByCategory}
            serviceIds={serviceIds}
            setServiceIds={setServiceIds}
          />
        </div>
      </div>
    </div>
  );
}

ManageTabMolds.headerProps = {
  subtitle: "Gerenciar o padrão de comanda",
  icon: Newspaper,
};

export default ManageTabMolds;
