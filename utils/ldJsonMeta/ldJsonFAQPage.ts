export interface FAQQuestion {
  question: string;
  answer: string;
}

export default function ldJsonFAQPage(questions: FAQQuestion[]): string {
  const obj = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map(i => ({
      "@type": "Question",
      name: i.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: i.answer
      }
    }))
  };

  return JSON.stringify(obj);
}
