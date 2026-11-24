import React, { useState, useEffect } from 'react';
import { menuService } from '../../api/services';
import { formatPrice } from '../../utils/formatters';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Badge from '../../components/common/Badge';

export function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMenuData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [cats, items] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems(),
      ]);
      setCategories(cats);
      setMenuItems(items);
    } catch (err) {
      setError(err.message || 'Failed to load menu data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const filteredItems = selectedCategory
    ? menuItems.filter((item) => item.CategoryId === selectedCategory)
    : menuItems;

  return (
    <div className="py-14 sm:py-20 lg:py-24 max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 space-y-12 sm:space-y-16 bg-[#F6F3EC]">
      {/* Editorial Title */}
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#BD8856] font-medium border-b border-[#BD8856]/30 pb-1 mb-4">
          <span>Seasonal Offerings</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#24251F] leading-tight">
          The Complete Menu
        </h1>
        <p className="mt-3 text-xs sm:text-base text-[#24251F]/70 font-light leading-relaxed">
          Carefully extracted single-origin espressos, delicate filter roasts, and seasonal breakfast creations.
        </p>
      </div>

      {loading && <LoadingSpinner message="Fetching current offerings from the kitchen..." />}
      {error && <ErrorState message={error} onRetry={fetchMenuData} />}

      {!loading && !error && (
        <>
          {/* Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pb-6 border-b border-[#E2DCCE]">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className={`px-4 sm:px-5 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-colors border ${
                  selectedCategory === null
                    ? 'bg-[#435640] text-[#F6F3EC] border-[#435640]'
                    : 'bg-transparent text-[#24251F]/70 border-[#DED9CE] hover:border-[#24251F]'
                }`}
              >
                All Items ({menuItems.length})
              </button>
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.Id;
                const count = menuItems.filter((i) => i.CategoryId === cat.Id).length;
                return (
                  <button
                    key={cat.Id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.Id)}
                    className={`px-4 sm:px-5 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-colors border ${
                      isSelected
                        ? 'bg-[#435640] text-[#F6F3EC] border-[#435640]'
                        : 'bg-transparent text-[#24251F]/70 border-[#DED9CE] hover:border-[#24251F]'
                    }`}
                  >
                    {cat.Name} ({count})
                  </button>
                );
              })}
            </div>
          )}

          {/* Menu Items Grid */}
          {filteredItems.length === 0 ? (
            <EmptyState
              title="No Menu Items Found"
              description="No menu items are listed under this category yet."
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {filteredItems.map((item) => {
                const hasOffer = item.OfferPrice && item.OfferPrice > 0;
                return (
                  <div
                    key={item.Id}
                    className="editorial-card group p-5 sm:p-6 border border-[#E2DCCE] bg-white/50 hover:bg-white transition-all flex flex-col justify-between min-h-[140px]"
                  >
                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-serif text-lg sm:text-xl text-[#24251F] group-hover:text-[#435640] transition-colors">
                            {item.Name}
                          </h3>
                          {item.TagName && (
                            <Badge variant="accent" size="xs">
                              {item.TagName}
                            </Badge>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          {hasOffer ? (
                            <div className="flex items-baseline gap-2">
                              <span className="font-serif text-base sm:text-lg text-[#BD8856] font-medium">
                                {formatPrice(item.OfferPrice)}
                              </span>
                              <span className="text-xs text-[#24251F]/40 line-through">
                                {formatPrice(item.Price)}
                              </span>
                            </div>
                          ) : (
                            <span className="font-serif text-base sm:text-lg text-[#24251F]">
                              {formatPrice(item.Price)}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-2.5 text-xs sm:text-sm text-[#24251F]/70 leading-relaxed font-light">
                        {item.Description || 'Prepared fresh to order using single-origin harvests.'}
                      </p>
                    </div>

                    {item.CategoryName && (
                      <div className="mt-4 pt-3 border-t border-[#E2DCCE]/60 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-[#24251F]/40">
                        <span>{item.CategoryName}</span>
                        <span>Item #{item.Id}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default MenuPage;
