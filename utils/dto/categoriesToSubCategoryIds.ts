export default function categoriesToSubCategoryIds(categories: Category[]) {
  const subcategoryIds: SubCategory["id"][] = [];
  categories.forEach(i => i.subcategories.forEach(s => subcategoryIds.push(s)));
  return subcategoryIds;
}
