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
    answer: "是的！我们提供免费版本供您体验。免费版每天可以生成3次派对方案，数据保存7天，让您充分了解我们的策划功能。如需更多功能，可升级到高级版。",
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
    question: "生成的方案可以保存或导出吗？",
    answer:
      "免费版的方案数据保存7天，高级版支持数据永久保存和导出功能。您可以将完整的派对策划方案导出为PDF或其他格式，方便执行和分享。",
    value: "item-4",
  },
  {
    question: "免费版和高级版有什么区别？",
    answer:
      "免费版每天可生成3次方案，数据保存7天，提供简单策划方案。高级版支持无限生成、数据永久保存、导出功能，并提供更详细的定制化方案，仅需$9.9/月。",
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
