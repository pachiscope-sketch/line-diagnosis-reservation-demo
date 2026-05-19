import { DemoApp } from "@/components/DemoApp";
import { demoTypes, type DemoType } from "@/lib/types";

type HomeProps = {
  searchParams: Promise<{
    demo?: string;
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const initialDemo = demoTypes.includes(params.demo as DemoType)
    ? (params.demo as DemoType)
    : "store";

  return <DemoApp initialDemo={initialDemo} />;
}
