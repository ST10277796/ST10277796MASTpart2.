import { useState } from "react";
import { MenuItem } from "@/context/MenuContext";

interface MenuFormProps {
  initialData?: MenuItem;
  onSubmit: (data: Omit<MenuItem, "id"> | Partial<MenuItem>) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  "Starters",
  "Main Courses",
  "Sides",
  "Desserts",
  "Beverages",
];

const IMAGE_PRESETS = {
  "Pan-Seared Duck":
    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
  "Grilled Fish":
    "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop",
  Salad:
    "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
  Pasta:
    "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
  Steak:
    "https://images.unsplash.com/photo-1432139555190-58524dae6a55?w=400&h=300&fit=crop",
  Dessert:
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
};

export default function MenuForm({
  initialData,
  onSubmit,
  onCancel,
}: MenuFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    price: initialData?.price?.toString() || "",
    category: initialData?.category || "Main Courses",
    image: initialData?.image || "",
    isVegan: initialData?.isVegan || false,
    isGlutenFree: initialData?.isGlutenFree || false,
    isAvailable: initialData?.isAvailable ?? true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) < 0)
      newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.image) newErrors.image = "Image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const submitData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      image: formData.image,
      isVegan: formData.isVegan,
      isGlutenFree: formData.isGlutenFree,
      isAvailable: formData.isAvailable,
      date: initialData?.date || new Date().toISOString().split("T")[0],
    };

    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Dish Name *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Pan-Seared Duck Breast"
          className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.name && (
          <p className="text-xs text-destructive mt-1">{errors.name}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Description *
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          placeholder="Describe the dish, preparation, and garnishes..."
          rows={3}
          className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
        />
        {errors.description && (
          <p className="text-xs text-destructive mt-1">{errors.description}</p>
        )}
      </div>

      {/* Price & Category */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Price (R) *
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            placeholder="0.00"
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          {errors.price && (
            <p className="text-xs text-destructive mt-1">{errors.price}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-xs text-destructive mt-1">{errors.category}</p>
          )}
        </div>
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-semibold text-foreground mb-2">
          Image URL *
        </label>
        <input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://..."
          className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.image && (
          <p className="text-xs text-destructive mt-1">{errors.image}</p>
        )}

        {/* Image Preview */}
        {formData.image && (
          <div className="mt-3 h-40 rounded-lg overflow-hidden bg-muted">
            <img
              src={formData.image}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        {/* Image Presets */}
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-2">Quick presets:</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(IMAGE_PRESETS).map(([name, url]) => (
              <button
                key={name}
                type="button"
                onClick={() => setFormData({ ...formData, image: url })}
                className="text-xs px-2 py-1 bg-accent/20 text-accent-foreground rounded hover:bg-accent/30 transition-colors"
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Dietary Options */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Dietary Options
        </label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isVegan}
              onChange={(e) =>
                setFormData({ ...formData, isVegan: e.target.checked })
              }
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-foreground">Vegan</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.isGlutenFree}
              onChange={(e) =>
                setFormData({ ...formData, isGlutenFree: e.target.checked })
              }
              className="w-4 h-4 accent-primary"
            />
            <span className="text-sm text-foreground">Gluten-Free</span>
          </label>
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) =>
              setFormData({ ...formData, isAvailable: e.target.checked })
            }
            className="w-4 h-4 accent-primary"
          />
          <span className="text-sm font-semibold text-foreground">
            Available Today
          </span>
        </label>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          className="flex-1 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
        >
          {initialData ? "Update Dish" : "Add Dish"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 border-2 border-border text-foreground font-semibold rounded-lg hover:bg-muted transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
