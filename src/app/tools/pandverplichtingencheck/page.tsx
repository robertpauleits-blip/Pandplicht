import type { Metadata } from "next";
import { ToolPageView } from "@/features/tools/ToolPageView";
import { getToolPage } from "@/features/tools/tools-data";

const data = getToolPage("pandverplichtingencheck")!;

export const metadata: Metadata = {
  title: data.metaTitle,
  description: data.description,
  alternates: { canonical: data.path },
};

export default function Page() {
  return <ToolPageView data={data} />;
}
