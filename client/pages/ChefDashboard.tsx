import { useState } from "react";
import { useMenu, MenuItem } from "@/context/MenuContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, Edit2, Trash2, LogOut } from "lucide-react";
import MenuForm from "@/components/MenuForm";

export default function ChefDashboard() {
  const { items, deleteItem, addItem, updateItem, getAllCategories } =
    useMenu();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const todayItems = items.filter((item) => item.date === selectedDate);
  const categories = getAllCategories();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAddItem = (data: Omit<MenuItem, "id">) => {
    addItem({ ...data, date: selectedDate });
    setShowForm(false);
  };

  const handleUpdateItem = (data: Partial<MenuItem>) => {
    if (editingItem) {
      updateItem(editingItem.id, data);
      setEditingItem(null);
      setShowForm(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    if (confirm("Are you sure you want to delete this item?")) {
      deleteItem(id);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">
              Christoffel
            </h1>
            <p className="text-muted-foreground text-sm">Chef Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Date Selector & Add Button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Menu Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all w-full sm:w-auto justify-center"
          >
            <Plus className="w-5 h-5" />
            Add Dish
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-card">
                <h2 className="text-2xl font-serif font-bold text-foreground">
                  {editingItem ? "Edit Dish" : "Add New Dish"}
                </h2>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                  className="text-muted-foreground hover:text-foreground text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                <MenuForm
                  initialData={editingItem || undefined}
                  onSubmit={editingItem ? handleUpdateItem : handleAddItem}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingItem(null);
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Menu Items by Category */}
        {categories.length > 0 ? (
          <div className="space-y-8">
            {categories.map((category) => {
              const categoryItems = todayItems.filter(
                (item) => item.category === category,
              );
              if (categoryItems.length === 0) return null;

              return (
                <div key={category}>
                  <h2 className="text-2xl font-serif font-bold text-primary mb-4">
                    {category}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {categoryItems.map((item) => (
                      <div
                        key={item.id}
                        className="card-elevated p-4 flex flex-col"
                      >
                        {/* Image */}
                        <div className="mb-4 h-40 rounded-lg overflow-hidden bg-muted">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h3 className="font-serif font-bold text-lg text-foreground mb-1">
                            {item.name}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-3">
                            {item.isVegan && (
                              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 px-2 py-1 rounded">
                                Vegan
                              </span>
                            )}
                            {item.isGlutenFree && (
                              <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 px-2 py-1 rounded">
                                Gluten-Free
                              </span>
                            )}
                            {!item.isAvailable && (
                              <span className="text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-100 px-2 py-1 rounded">
                                Unavailable
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-3 border-t border-border">
                          <p className="font-serif font-bold text-lg text-primary">
                            R{item.price.toFixed(2)}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setEditingItem(item);
                                setShowForm(true);
                              }}
                              className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No dishes for this date. Add your first dish!
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
