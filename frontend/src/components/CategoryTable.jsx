import { useEffect, useState } from "react";
import { API_BASE_URL, authHeaders, handleUnauthorized } from "../config/api";

const categoryDefinitions = [
  {
    key: "snacks",
    label: "Snacks",
    matcher: /snack|chips|crisp|cookie|biscuit|bar|candy|popcorn|cracker|pretzel|treat/i,
  },
  {
    key: "medicines",
    label: "Medicines",
    matcher: /medicine|medic|pill|tablet|capsule|syrup|ointment|drug|vitamin|supplement/i,
  },
  {
    key: "kitchenItems",
    label: "Kitchen Items",
    matcher: /kitchen|utensil|cook|pan|pot|spoon|fork|plate|dish|bowl|cup|mug|jar|container|appliance|glass/i,
  },
];

function categorizeProducts(products) {
  const groups = {
    snacks: [],
    medicines: [],
    kitchenItems: [],
  };

  products.forEach((product) => {
    const categoryLabel = String(product.category || "").trim();
    const matched = categoryDefinitions.find((definition) => definition.matcher.test(categoryLabel));

    const key = matched ? matched.key : "kitchenItems";
    groups[key].push(product);
  });

  return groups;
}

function renderCellList(items) {
  if (items.length === 0) {
    return <span className="category-empty">No items</span>;
  }

  return items.map((item) => (
    <div key={item._id} className="category-item">
      <strong>{item.name}</strong>
      <span>{item.category || "Other"}</span>
    </div>
  ));
}

function CategoryTable({ visible }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!visible) {
      return undefined;
    }

    async function fetchProducts() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`${API_BASE_URL}/api/products`, {
          headers: authHeaders(),
        });
        handleUnauthorized(response);

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load product table.");
        }

        setProducts(data);
      } catch (fetchError) {
        setError(fetchError.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
    window.addEventListener("products:changed", fetchProducts);

    return () => {
      window.removeEventListener("products:changed", fetchProducts);
    };
  }, [visible]);

  if (!visible) {
    return null;
  }

  const grouped = categorizeProducts(products);
  const rowCount = Math.max(grouped.snacks.length, grouped.medicines.length, grouped.kitchenItems.length, 1);

  return (
    <div className="category-table-card">
      <div className="category-table-header">
        <h3>Category Overview</h3>
        <p>Products loaded from your database grouped by Snacks, Medicines, and Kitchen Items.</p>
      </div>

      {loading && <p className="form-message">Loading category table...</p>}
      {error && <p className="form-message">{error}</p>}

      {!loading && !error && (
        <table className="category-summary-table">
          <thead>
            <tr>
              <th>Snacks</th>
              <th>Medicines</th>
              <th>Kitchen Items</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rowCount }).map((_, index) => (
              <tr key={index}>
                <td>{grouped.snacks[index] ? renderCellList([grouped.snacks[index]]) : ""}</td>
                <td>{grouped.medicines[index] ? renderCellList([grouped.medicines[index]]) : ""}</td>
                <td>{grouped.kitchenItems[index] ? renderCellList([grouped.kitchenItems[index]]) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CategoryTable;
