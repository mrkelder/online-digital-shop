export default function findSubCategories(
  catalogInfo: CatalogInfo,
  categoryId: string
): SubCategory[] {
  const category = catalogInfo.categories?.find(i => i.id === categoryId);
  const subCategories = catalogInfo.subcategories?.filter(i =>
    category?.subcategories.includes(i.id)
  );

  return subCategories as SubCategory[];
}
