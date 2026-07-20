import type { Metadata } from "next";
import { TopicPage } from "@/features/topics/TopicPage";
import { getTopicPage } from "@/features/topics/topics-data";

const data = getTopicPage("/verplichtingen/energielabel-utiliteitsgebouw")!;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.description,
  alternates: { canonical: data.path },
};

export default function Page() {
  return <TopicPage data={data} />;
}
