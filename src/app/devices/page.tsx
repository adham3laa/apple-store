import { redirect } from "next/navigation";

export default async function DevicesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const params = await searchParams;
  const category = params?.category;
  if (category) {
    redirect(`/?category=${encodeURIComponent(category)}`);
  }
  redirect("/");
}
