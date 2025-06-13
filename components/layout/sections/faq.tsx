import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQProps {
  question: string;
  answer: string;
  value: string;
}

const FAQList: FAQProps[] = [
  {
    question: "生日派对策划工具是免费的吗？",
    answer: "是的！我们的基础生日派对策划工具完全免费使用。您可以无限次生成派对方案，获得专业的策划建议。",
    value: "item-1",
  },
  {
    question: "生成的派对方案适合所有年龄段吗？",
    answer:
      "当然！我们专门为儿童（3-12岁）、成人（18-50岁）、长辈（50岁以上）设计了不同的派对方案，确保每个年龄段都能获得最合适的庆祝建议。",
    value: "item-2",
  },
  {
    question: "可以自定义派对主题吗？",
    answer:
      "可以的！除了我们提供的6个预设主题外，您还可以输入自定义主题。我们的系统会根据您的创意想法生成相应的派对策划方案。",
    value: "item-3",
  },
  {
    question: "生成的方案可以保存或分享吗？",
    answer:
      "目前支持复制方案内容进行保存。我们正在开发更多功能，包括账户保存、方案分享、PDF导出等，敬请期待！",
    value: "item-4",
  },
  {
    question: "策划方案的预算建议准确吗？",
    answer:
      "我们的预算分类（经济型、中档型、豪华型）是基于市场调研的大致范围。具体费用会因地区、季节、供应商等因素有所差异，建议您以实际询价为准。",
    value: "item-5",
  },
];

export const FAQSection = () => {
  return (
    <section id="faq" className="container md:w-[700px] py-24 sm:py-32">
      <div className="text-center mb-8">
        <h2 className="text-lg text-primary text-center mb-2 tracking-wider">
          常见问题
        </h2>

        <h2 className="text-3xl md:text-4xl text-center font-bold">
          生日派对策划常见问题
        </h2>
      </div>

      <Accordion type="single" collapsible className="AccordionRoot">
        {FAQList.map(({ question, answer, value }) => (
          <AccordionItem key={value} value={value}>
            <AccordionTrigger className="text-left">
              {question}
            </AccordionTrigger>

            <AccordionContent>{answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};
