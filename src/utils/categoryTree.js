// Builds a nested tree from the flat category list using parentCategoryId
export function buildCategoryTree(categories) {
  const map = new Map(categories.map((c) => [c.categoryId, { ...c, children: [] }]));
  const roots = [];

  for (const cat of map.values()) {
    if (cat.parentCategoryId && map.has(cat.parentCategoryId)) {
      map.get(cat.parentCategoryId).children.push(cat);
    } else {
      roots.push(cat);
    }
  }
  return roots;
}

// Flattens the tree into indented dropdown options — e.g. "Clothing", "— Men", "—— Trousers"
export function flattenCategoryOptions(categories, prefix = "— ") {
  const tree = buildCategoryTree(categories);
  const options = [];

  function walk(nodes, depth) {
    for (const node of nodes) {
      options.push({ value: node.categoryId, label: `${prefix.repeat(depth)}${node.categoryName}` });
      if (node.children.length) walk(node.children, depth + 1);
    }
  }

  walk(tree, 0);
  return options;
}