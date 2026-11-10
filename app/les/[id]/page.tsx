import type { Metadata } from "next";
import { notFound } from "next/navigation";
import LessonFlow from "@/components/LessonFlow";
import { getLes, lessen } from "@/data/lessen";

export function generateStaticParams() {
  return lessen.map((les) => ({ id: les.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const les = getLes(id);
  return { title: les ? `${les.titel} – Dagelijks Nederlands` : "Dagelijks Nederlands" };
}

export default async function LesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const les = getLes(id);
  if (!les) notFound();
  return <LessonFlow les={les} />;
}
