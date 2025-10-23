import { useState } from "react";
import { useMenu } from "@/context/MenuContext";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Heart, LogOut, Leaf, Wheat } from "lucide-react";

export default function ClientMenu() {
  const {
    items,
    getAllCategories,
    favorites,
    toggleFavorite,
    isFavorite,
    getItemsByCategory,
  } = useMenu();
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [filterVegan, setFilterVegan] = useState(false);
  const [filterGlutenFree, setFilterGlutenFree] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const categories = getAllCategories();
  const today = new Date().toISOString().split("T")[0];
  let displayItems = items.filter((item) => item.date === today);

  // Apply filters
  if (selectedCategory) {
    displayItems = displayItems.filter(
      (item) => item.category === selectedCategory,
    );
  }
  if (showFavoritesOnly) {
    displayItems = displayItems.filter((item) => isFavorite(item.id));
  }
  if (filterVegan) {
    displayItems = displayItems.filter((item) => item.isVegan);
  }
  if (filterGlutenFree) {
    displayItems = displayItems.filter((item) => item.isGlutenFree);
  }
  if (searchTerm) {
    displayItems = displayItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  // Group by category
  const groupedItems = categories.reduce(
    (acc, cat) => {
      acc[cat] = displayItems.filter((item) => item.category === cat);
      return acc;
    },
    {} as Record<string, typeof displayItems>,
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                Christoffel
              </h1>
              <p className="text-muted-foreground text-sm">
                Today's Menu Experience
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>

          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Filter Section */}
        <div className="mb-8 p-4 bg-card rounded-lg border border-border">
          <h2 className="font-semibold text-foreground mb-4">Filters</h2>

          <div className="space-y-4">
            {/* Favorites Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showFavoritesOnly}
                onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm font-semibold text-foreground">
                Favorites ({favorites.length})
              </span>
            </label>

            {/* Dietary Filters */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterVegan}
                  onChange={(e) => setFilterVegan(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <Leaf className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-foreground">
                  Vegan
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filterGlutenFree}
                  onChange={(e) => setFilterGlutenFree(e.target.checked)}
                  className="w-4 h-4 accent-primary"
                />
                <Wheat className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-foreground">
                  Gluten-Free
                </span>
              </label>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Browse by Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                    selectedCategory === null
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground hover:bg-muted/80"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        {displayItems.length > 0 ? (
          <div className="space-y-10">
            {selectedCategory ? (
              // Single category view
              <div>
                <h2 className="text-3xl font-serif font-bold text-primary mb-6">
                  {selectedCategory}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {groupedItems[selectedCategory]?.map((item) => (
                    <MenuItem key={item.id} item={item} />
                  ))}
                </div>
              </div>
            ) : (
              // All categories view
              categories.map((cat) =>
                groupedItems[cat] && groupedItems[cat].length > 0 ? (
                  <div key={cat}>
                    <h2 className="text-3xl font-serif font-bold text-primary mb-6">
                      {cat}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {groupedItems[cat].map((item) => (
                        <MenuItem key={item.id} item={item} />
                      ))}
                    </div>
                  </div>
                ) : null,
              )
            )}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No dishes found matching your filters.
            </p>
            <button
              onClick={() => {
                setSelectedCategory(null);
                setShowFavoritesOnly(false);
                setFilterVegan(false);
                setFilterGlutenFree(false);
                setSearchTerm("");
              }}
              className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </main>

      {/* Contact Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 text-center">
          <p className="text-muted-foreground mb-4">
            Interested in booking Christoffel for your private dining
            experience?
          </p>
          <a
            href="mailto:contact@christoffel.com"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-primary/90 transition-all"
          >
            Contact for Bookings
          </a>
        </div>
      </footer>
    </div>
  );
}

function MenuItem({ item }: { item: any }) {
  const { toggleFavorite, isFavorite } = useMenu();
  const favorite = isFavorite(item.id);

  return (
    <div className="card-elevated p-4 flex flex-col h-full group">
      {/* Image Container */}
      <div className="relative mb-4 h-48 rounded-lg overflow-hidden bg-muted">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {!item.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <p className="text-white font-semibold">Not Available</p>
          </div>
        )}
        {/* Favorite Button */}
        <button
          onClick={() => toggleFavorite(item.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all"
        >
          <Heart
            className={`w-5 h-5 ${
              favorite ? "fill-destructive text-destructive" : "text-foreground"
            }`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <h3 className="font-serif font-bold text-lg text-foreground mb-2">
          {item.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
          {item.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {item.isVegan && (
            <span className="inline-flex items-center gap-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-100 px-2 py-1 rounded">
              <Leaf className="w-3 h-3" />
              Vegan
            </span>
          )}
          {item.isGlutenFree && (
            <span className="inline-flex items-center gap-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100 px-2 py-1 rounded">
              <Wheat className="w-3 h-3" />
              Gluten-Free
            </span>
          )}
        </div>
      </div>

      {/* Price */}
      <p className="text-2xl font-serif font-bold text-primary">
        R{item.price.toFixed(2)}
      </p>
    </div>
  );
}
