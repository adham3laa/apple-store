import { redirect } from "next/navigation";
import { COSMO_CATALOG } from "@/data/cosmo-catalog";

export default async function BuyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cleanId = id ? decodeURIComponent(id).trim().toLowerCase() : "";
  const product = COSMO_CATALOG.find(
    p => p.id.toLowerCase() === cleanId || p.slug.toLowerCase() === cleanId
  );

  if (product) {
    redirect(`/device/${product.slug}`);
  }
  redirect("/");
}
