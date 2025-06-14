"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from "@/lib/contexts/language-context";

interface FAQProps {
  questionKey: string;
  answerKey: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    questionKey: "faq.questions.isFree.question",
    answerKey: "faq.questions.isFree.answer",
    value: "item-1",
  },
  {
    questionKey: "faq.questions.allAges.question",
    answerKey: "faq.questions.allAges.answer",
    value: "item-2",
  },
  {
    questionKey: "faq.questions.customTheme.question",
    answerKey: "faq.questions.customTheme.answer",
    value: "item-3",
  },
  {
    questionKey: "faq.questions.saveExport.question",
    answerKey: "faq.questions.saveExport.answer",
    value: "item-4",
  },
  {
    questionKey: "faq.questions.planDifference.question",
    answerKey: "faq.questions.planDifference.answer",
    value: "item-5",
  },
];

export const FAQSection = () => {
  const { t } = useLanguage();

  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          {t('faq.subtitle')}
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          {t('faq.title')}
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ questionKey, answerKey, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {t(questionKey)}
            </AccordionTrigger>

            <AccordionContent>{t(answerKey)}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
