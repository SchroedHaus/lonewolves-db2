const CategorySelector = ({
  allCategories,
  selectedCategoryIds,
  setSelectedCategoryIds,
}) => {
  const toggleCategory = (id) => {
    if (selectedCategoryIds.includes(id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter((c) => c !== id));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, id]);
    }
  };

  return (
    <div>
      <h4>Categories:</h4>
      {allCategories.map((cat) => (
        <label key={cat.id} style={{ marginRight: "1rem" }}>
          <input
            type="checkbox"
            checked={selectedCategoryIds.includes(cat.id)}
            onChange={() => toggleCategory(cat.id)}
          />
          {cat.name}
        </label>
      ))}
    </div>
  );
};

export default CategorySelector;
