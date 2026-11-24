import React, { useState, useEffect } from 'react';
import {
  menuService,
  teamService,
  testimonialService,
  openingHourService,
  reservationService,
  contactService,
} from '../../api/services';
import { resolveImageUrl } from '../../utils/imageUtils';
import { formatPrice, formatTime } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import { Input } from '../../components/common/Input';
import { Textarea } from '../../components/common/Textarea';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import {
  Clock,
  CalendarCheck,
  Send,
  Star,
  CheckCircle2,
  ArrowDown,
  Sparkles,
} from 'lucide-react';
import { APP_NAME, TAGLINE, TEST_DATA_PREFIX } from '../../utils/constants';

export function HomePage() {
  const toast = useToast();

  // --- API DATA STATES ---
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [menuLoading, setMenuLoading] = useState(true);
  const [menuError, setMenuError] = useState(null);

  const [team, setTeam] = useState([]);
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(null);

  const [testimonials, setTestimonials] = useState([]);
  const [testLoading, setTestLoading] = useState(true);
  const [testError, setTestError] = useState(null);

  const [hours, setHours] = useState([]);
  const [hoursLoading, setHoursLoading] = useState(true);
  const [hoursError, setHoursError] = useState(null);

  // --- FORM STATES: RESERVATION ---
  const [reservationForm, setReservationForm] = useState({
    FullName: '',
    PhoneNo: '',
    Date: new Date().toISOString().split('T')[0],
    Time: '10:00',
    BookingCount: 2,
    Comment: '',
  });
  const [resvErrors, setResvErrors] = useState({});
  const [resvSubmitting, setResvSubmitting] = useState(false);
  const [resvSuccess, setResvSuccess] = useState(false);

  // --- FORM STATES: CONTACT ---
  const [contactForm, setContactForm] = useState({
    Name: '',
    Email: '',
    Message: '',
  });
  const [contactErrors, setContactErrors] = useState({});
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // --- INITIAL DATA FETCHING ---
  const loadMenuData = async () => {
    try {
      setMenuLoading(true);
      setMenuError(null);
      const [cats, items] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems(),
      ]);
      setCategories(cats);
      setMenuItems(items);
    } catch (err) {
      setMenuError(err.message || 'Unable to retrieve menu items at this moment.');
    } finally {
      setMenuLoading(false);
    }
  };

  const loadTeamData = async () => {
    try {
      setTeamLoading(true);
      setTeamError(null);
      const data = await teamService.getTeams();
      setTeam(data);
    } catch (err) {
      setTeamError(err.message || 'Unable to retrieve team members.');
    } finally {
      setTeamLoading(false);
    }
  };

  const loadTestimonialsData = async () => {
    try {
      setTestLoading(true);
      setTestError(null);
      const data = await testimonialService.getTestimonials();
      setTestimonials(data);
    } catch (err) {
      setTestError(err.message || 'Unable to retrieve testimonials.');
    } finally {
      setTestLoading(false);
    }
  };

  const loadHoursData = async () => {
    try {
      setHoursLoading(true);
      setHoursError(null);
      const data = await openingHourService.getOpeningHours();
      setHours(data);
    } catch (err) {
      setHoursError(err.message || 'Unable to retrieve opening hours.');
    } finally {
      setHoursLoading(false);
    }
  };

  useEffect(() => {
    loadMenuData();
    loadTeamData();
    loadTestimonialsData();
    loadHoursData();
  }, []);

  // Filtered Menu Items
  const filteredMenuItems = selectedCategory === null
    ? menuItems
    : menuItems.filter((i) => i.CategoryId === selectedCategory);

  // --- RESERVATION SUBMISSION ---
  const handleReservationSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!reservationForm.FullName.trim()) errors.FullName = 'Full name is required';
    if (!reservationForm.PhoneNo.trim()) errors.PhoneNo = 'Phone number is required';
    if (!reservationForm.Date) errors.Date = 'Reservation date is required';
    if (!reservationForm.Time) errors.Time = 'Reservation time is required';
    if (!reservationForm.BookingCount || Number(reservationForm.BookingCount) < 1) {
      errors.BookingCount = 'Party size must be at least 1 guest';
    }
    setResvErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setResvSubmitting(true);
      const payload = {
        FullName: reservationForm.FullName.trim(),
        PhoneNo: reservationForm.PhoneNo.trim(),
        Date: new Date(reservationForm.Date).toISOString(),
        Time: `${reservationForm.Time}:00`,
        BookingCount: Number(reservationForm.BookingCount),
        Comment: reservationForm.Comment.trim() || 'Online reservation booking',
      };
      await reservationService.insertReservation(payload);
      setResvSuccess(true);
      toast.success('Your table reservation was booked successfully.');
    } catch (err) {
      toast.error(err.message || 'Reservation submission failed. Please try again.');
    } finally {
      setResvSubmitting(false);
    }
  };

  // --- CONTACT SUBMISSION ---
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!contactForm.Name.trim()) errors.Name = 'Name is required';
    if (!contactForm.Email.trim()) {
      errors.Email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(contactForm.Email)) {
      errors.Email = 'Please provide a valid email address';
    }
    if (!contactForm.Message.trim()) errors.Message = 'Message is required';
    setContactErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setContactSubmitting(true);
      await contactService.insertContactUs({
        Name: contactForm.Name.trim(),
        Email: contactForm.Email.trim(),
        Message: contactForm.Message.trim(),
      });
      setContactSuccess(true);
      toast.success('Your message has been sent to our team.');
    } catch (err) {
      toast.error(err.message || 'Message submission failed. Please try again.');
    } finally {
      setContactSubmitting(false);
    }
  };

  return (
    <div className="space-y-0">
      {/* ========================================================
          SECTION 2: LARGE EDITORIAL HERO SECTION
         ======================================================== */}
      <section className="relative min-h-[85vh] flex items-center bg-[#F6F3EC] border-b border-[#E2DCCE] overflow-hidden py-14 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#BD8856] font-medium border-b border-[#BD8856]/30 pb-1">
                <span>Melbourne Micro-Roastery & Kitchen</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-[#24251F] tracking-tight">
                A quiet ritual for everyday craft.
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-[#24251F]/70 leading-relaxed font-light max-w-xl">
                {APP_NAME} brings together single-origin beans, heritage grains, and open-flame cooking. A serene space thoughtfully curated for unhurried conversations and sensory nourishment.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <a
                  href="#reservation"
                  className="bg-[#435640] hover:bg-[#364634] text-[#F6F3EC] px-8 py-3.5 text-xs uppercase tracking-[0.14em] font-medium text-center transition-colors"
                >
                  Reserve a Table
                </a>
                <a
                  href="#menu"
                  className="border border-[#24251F]/20 hover:border-[#24251F] text-[#24251F] px-8 py-3.5 text-xs uppercase tracking-[0.14em] font-medium text-center transition-colors"
                >
                  Explore Menu
                </a>
              </div>

              {/* Editorial Micro-Metrics */}
              <div className="pt-6 border-t border-[#E2DCCE] grid grid-cols-3 gap-3 sm:gap-6 max-w-md text-[#24251F]">
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-[#24251F] block leading-none">100%</span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#24251F]/60 mt-1 block">
                    Single-Origin
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-[#24251F] block leading-none">48hr</span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#24251F]/60 mt-1 block">
                    Fermentation
                  </span>
                </div>
                <div>
                  <span className="font-serif text-2xl sm:text-3xl text-[#24251F] block leading-none">Daily</span>
                  <span className="text-[10px] uppercase tracking-[0.12em] text-[#24251F]/60 mt-1 block">
                    Fresh Bakes
                  </span>
                </div>
              </div>
            </div>

            {/* Right Editorial Imagery Column */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="relative">
                {/* Main Large Image */}
                <div className="img-editorial-zoom border border-[#DED7CB] aspect-[4/5] bg-[#EFEBE1]">
                  <img
                    src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80"
                    alt="Artisanal pour over coffee ceremony"
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                </div>
                {/* Overlaid Smaller Vignette */}
                <div className="hidden sm:block absolute -bottom-6 -left-6 sm:-bottom-8 sm:-left-8 w-36 sm:w-44 aspect-square border border-[#DED7CB] shadow-xl bg-[#F6F3EC] p-2 z-10">
                  <div className="img-editorial-zoom w-full h-full">
                    <img
                      src="https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80"
                      alt="Freshly baked artisan croissant"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 3: CAFÉ INTRODUCTION / STORY
         ======================================================== */}
      <section id="story" className="py-16 sm:py-24 lg:py-28 bg-[#F6F3EC] border-b border-[#E2DCCE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mb-6 sm:mb-8">
            <span>01</span>
            <span className="w-8 h-[1px] bg-[#BD8856]" />
            <span>Our Philosophy</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#24251F] leading-tight">
                Slow mornings, seasonal ingredients, and uncompromised craft.
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-6 text-[#24251F]/70 text-sm sm:text-base lg:text-lg leading-relaxed font-light">
              <p>
                {APP_NAME} was established on a singular premise: that coffee and food should reflect intentionality and deep respect for origin. We work hand-in-hand with regenerative micro-lots across Ethiopia, Colombia, and Guatemala.
              </p>
              <p>
                In the kitchen, our philosophy mirrors our roastery. Sourdoughs cold-fermented over two full days, house-churned cultured butter, and produce sourced from Victorian growers within a morning’s drive of our kitchen door.
              </p>

              <div className="pt-6 grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 border-t border-[#E2DCCE]">
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-[#24251F]">The Roastery</h3>
                  <p className="text-xs text-[#24251F]/60 leading-relaxed">
                    Light to medium Scandinavian-inspired roast profiles developed to preserve delicate terroir floral and fruit nuances.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-serif text-xl text-[#24251F]">The Kitchen</h3>
                  <p className="text-xs text-[#24251F]/60 leading-relaxed">
                    A breakfast and midday menu inspired by minimalist European bistros and seasonal Australian farm-to-table dining.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTIONS 4 & 5: SIGNATURE MENU & CATEGORY FILTERS
         ======================================================== */}
      <section id="menu" className="py-16 sm:py-24 lg:py-28 bg-[#F6F3EC] border-b border-[#E2DCCE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mb-6 sm:mb-8">
            <span>02</span>
            <span className="w-8 h-[1px] bg-[#BD8856]" />
            <span>Curated Offerings</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 sm:mb-12">
            <div>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#24251F]">
                The Signature Menu
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#24251F]/60 max-w-md">
                Roasted in-house and prepared fresh each morning. Filter by section below.
              </p>
            </div>

            {/* Category Filter Buttons (Actual API categories) */}
            {!menuLoading && categories.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-colors border ${
                    selectedCategory === null
                      ? 'bg-[#435640] text-[#F6F3EC] border-[#435640]'
                      : 'bg-transparent text-[#24251F]/70 border-[#DED9CE] hover:border-[#24251F]'
                  }`}
                >
                  All Items ({menuItems.length})
                </button>
                {categories.map((cat) => {
                  const isSelected = selectedCategory === cat.Id;
                  const count = menuItems.filter((m) => m.CategoryId === cat.Id).length;
                  return (
                    <button
                      key={cat.Id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.Id)}
                      className={`px-4 py-2 text-xs uppercase tracking-[0.14em] font-medium transition-colors border ${
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
          </div>

          {/* Menu Items State */}
          {menuLoading && <LoadingSpinner message="Fetching current offerings from the kitchen..." />}
          {menuError && <ErrorState message={menuError} onRetry={loadMenuData} />}
          {!menuLoading && !menuError && filteredMenuItems.length === 0 && (
            <EmptyState
              title="No Menu Items Available"
              description="No dishes or beverages are currently available under this category selection."
            />
          )}

          {/* Clean Editorial Menu Grid */}
          {!menuLoading && !menuError && filteredMenuItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
              {filteredMenuItems.map((item) => {
                const hasOffer = item.OfferPrice && item.OfferPrice > 0;
                return (
                  <div
                    key={item.Id}
                    className="editorial-card group p-5 sm:p-6 border border-[#E2DCCE] bg-white/50 hover:bg-white transition-all flex flex-col justify-between min-h-[140px]"
                  >
                    <div>
                      {/* Top Header Row */}
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

                      {/* Description */}
                      <p className="mt-2.5 text-xs sm:text-sm text-[#24251F]/70 leading-relaxed font-light">
                        {item.Description || 'Prepared fresh to order using single-origin harvests.'}
                      </p>
                    </div>

                    {/* Category Label at bottom */}
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
        </div>
      </section>

      {/* ========================================================
          SECTION 6: CULINARY TEAM
         ======================================================== */}
      <section id="team" className="py-16 sm:py-24 lg:py-28 bg-[#F6F3EC] border-b border-[#E2DCCE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mb-6 sm:mb-8">
            <span>03</span>
            <span className="w-8 h-[1px] bg-[#BD8856]" />
            <span>The Artisans</span>
          </div>

          <div className="max-w-2xl mb-8 sm:mb-12">
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#24251F]">
              People Behind the Pour
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#24251F]/60">
              Passionate baristas, roasters, and culinary artisans guiding your experience at {APP_NAME}.
            </p>
          </div>

          {teamLoading && <LoadingSpinner message="Introducing the culinary team..." />}
          {teamError && <ErrorState message={teamError} onRetry={loadTeamData} />}
          {!teamLoading && !teamError && team.length === 0 && (
            <EmptyState
              title="Team Profile Unavailable"
              description="Our team directory is being updated."
            />
          )}

          {!teamLoading && !teamError && team.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {team.map((member) => (
                <div
                  key={member.Id}
                  className="editorial-card group bg-white/40 border border-[#E2DCCE] p-4 flex flex-col justify-between"
                >
                  <div className="img-editorial-zoom aspect-[4/5] bg-[#EFEBE1] border border-[#E2DCCE]/70 relative overflow-hidden">
                    <img
                      src={resolveImageUrl(member.ImagePath)}
                      alt={member.Name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500" fill="%23EFEBE1"><rect width="400" height="500" fill="%23EFEBE1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="14" fill="%23BD8856">Culinary Artisan</text></svg>';
                      }}
                    />
                  </div>
                  <div className="pt-5 pb-2">
                    <span className="text-[10px] uppercase tracking-[0.18em] text-[#BD8856] font-medium block">
                      {member.Designation}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl text-[#24251F] mt-1">
                      {member.Name}
                    </h3>
                    {member.SubText && (
                      <p className="mt-2 text-xs text-[#24251F]/70 italic leading-relaxed font-light">
                        "{member.SubText}"
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          SECTION 7: TESTIMONIALS
         ======================================================== */}
      <section id="testimonials" className="py-16 sm:py-24 lg:py-28 bg-[#F6F3EC] border-b border-[#E2DCCE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mb-6 sm:mb-8">
            <span>04</span>
            <span className="w-8 h-[1px] bg-[#BD8856]" />
            <span>Community Voices</span>
          </div>

          <div className="max-w-2xl mb-8 sm:mb-12">
            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#24251F]">
              Guest Notes & Reviews
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-[#24251F]/60">
              Reflections from regulars and visitors who have shared quiet moments at our tables.
            </p>
          </div>

          {testLoading && <LoadingSpinner message="Loading guest reviews..." />}
          {testError && <ErrorState message={testError} onRetry={loadTestimonialsData} />}
          {!testLoading && !testError && testimonials.length === 0 && (
            <EmptyState
              title="No Reviews Available"
              description="Guest notes are currently being gathered."
            />
          )}

          {!testLoading && !testError && testimonials.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {testimonials.map((review) => {
                const starCount = Math.min(5, Math.max(1, Math.round(review.Rating > 5 ? review.Rating / 2 : (review.Rating || 5))));
                return (
                  <div
                    key={review.Id}
                    className="editorial-card p-6 sm:p-8 bg-white/60 border border-[#E2DCCE] flex flex-col justify-between"
                  >
                    <div className="space-y-4">
                      {/* Rating stars */}
                      <div className="flex items-center gap-1 text-[#BD8856]">
                        {Array.from({ length: starCount }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#BD8856]" />
                        ))}
                        <span className="text-[11px] font-mono text-[#24251F]/50 ml-2">
                          {review.Rating}/10
                        </span>
                      </div>

                      <p className="font-serif text-base sm:text-lg text-[#24251F] leading-snug italic">
                        "{review.Description}"
                      </p>
                    </div>

                    <div className="mt-6 sm:mt-8 pt-5 border-t border-[#E2DCCE] flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-[#EFEBE1] border border-[#DED7CB] flex-shrink-0">
                        <img
                          src={resolveImageUrl(review.CustomerImagePath)}
                          alt={review.CustomerName}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" fill="%23EFEBE1"><rect width="100" height="100" fill="%23EFEBE1"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-size="28" fill="%23435640">M</text></svg>';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif text-base text-[#24251F] truncate">
                          {review.CustomerName}
                        </h4>
                        <span className="text-[10px] uppercase tracking-[0.14em] text-[#24251F]/40 block truncate">
                          Verified Guest
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================
          SECTION 8: OPENING HOURS
         ======================================================== */}
      <section id="hours" className="py-16 sm:py-24 lg:py-28 bg-[#F6F3EC] border-b border-[#E2DCCE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mb-6 sm:mb-8">
            <span>05</span>
            <span className="w-8 h-[1px] bg-[#BD8856]" />
            <span>Service Schedule</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
            <div className="lg:col-span-5 space-y-4">
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#24251F]">
                When to Visit Us
              </h2>
              <p className="text-xs sm:text-sm text-[#24251F]/70 leading-relaxed font-light">
                We roast fresh batches every morning and serve breakfast through late afternoon. Walk-ins are always welcomed; reservations are encouraged for weekends and groups.
              </p>
              <div className="pt-2 text-xs text-[#24251F]/50">
                <p>Kitchen closes 45 minutes prior to listed closing times.</p>
              </div>
            </div>

            <div className="lg:col-span-7">
              {hoursLoading && <LoadingSpinner message="Loading service hours..." />}
              {hoursError && <ErrorState message={hoursError} onRetry={loadHoursData} />}
              {!hoursLoading && !hoursError && hours.length === 0 && (
                <EmptyState
                  title="Hours Not Configured"
                  description="Weekly schedule details are currently being updated."
                />
              )}

              {!hoursLoading && !hoursError && hours.length > 0 && (
                <div className="border border-[#E2DCCE] bg-white/70 divide-y divide-[#E2DCCE]">
                  {hours.map((slot) => (
                    <div
                      key={slot.Id}
                      className="p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 hover:bg-white transition-colors"
                    >
                      <div>
                        <span className="font-serif text-lg sm:text-xl text-[#24251F] block">
                          {slot.DayRange}
                        </span>
                        <span className="text-xs text-[#24251F]/60 mt-0.5 block font-mono">
                          {slot.TimeRange}
                        </span>
                      </div>
                      <div className="self-start sm:self-auto">
                        {slot.IsClosed ? (
                          <Badge variant="neutral">Closed</Badge>
                        ) : (
                          <Badge variant="primary">Open for Service</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 9: TABLE RESERVATION FORM
         ======================================================== */}
      <section id="reservation" className="py-16 sm:py-24 lg:py-28 bg-[#F6F3EC] border-b border-[#E2DCCE]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mb-6 sm:mb-8">
            <span>06</span>
            <span className="w-8 h-[1px] bg-[#BD8856]" />
            <span>Table Bookings</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-4 space-y-4">
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#24251F]">
                Reserve Your Spot
              </h2>
              <p className="text-xs sm:text-sm text-[#24251F]/70 leading-relaxed font-light">
                Whether for a morning pour-over tasting or a weekend brunch gathering, we look forward to welcoming you.
              </p>
              <div className="p-4 bg-[#EDE8DE]/40 border border-[#DED7CB] text-xs text-[#24251F]/70 space-y-1">
                <p className="font-medium text-[#24251F]">Candidate Assessment Rule Notice:</p>
                <p className="text-[11px] leading-relaxed">
                  For test submissions, please prefix your full name with <strong className="text-[#435640]">"{TEST_DATA_PREFIX}"</strong> to ensure easy record identification.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8 bg-white/80 border border-[#E2DCCE] p-6 sm:p-10 lg:p-12">
              {resvSuccess ? (
                <div className="text-center py-10 sm:py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#435640]/10 text-[#435640] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#24251F]">
                    Reservation Confirmed
                  </h3>
                  <p className="text-xs sm:text-sm text-[#24251F]/70 max-w-md mx-auto leading-relaxed">
                    Thank you, <strong className="text-[#24251F]">{reservationForm.FullName}</strong>. Your table for <strong className="text-[#24251F]">{reservationForm.BookingCount} guests</strong> on <strong className="text-[#24251F]">{reservationForm.Date} at {formatTime(reservationForm.Time)}</strong> has been recorded in our system.
                  </p>
                  <div className="pt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setResvSuccess(false);
                        setReservationForm({
                          FullName: '',
                          PhoneNo: '',
                          Date: new Date().toISOString().split('T')[0],
                          Time: '10:00',
                          BookingCount: 2,
                          Comment: '',
                        });
                      }}
                    >
                      Make Another Booking
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleReservationSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <Input
                      label="Full Guest Name"
                      name="FullName"
                      placeholder={`e.g. ${TEST_DATA_PREFIX} Sarah`}
                      value={reservationForm.FullName}
                      onChange={(e) => setReservationForm({ ...reservationForm, FullName: e.target.value })}
                      error={resvErrors.FullName}
                      required
                    />

                    <Input
                      label="Phone Number"
                      name="PhoneNo"
                      type="tel"
                      placeholder="e.g. +61 412 345 678"
                      value={reservationForm.PhoneNo}
                      onChange={(e) => setReservationForm({ ...reservationForm, PhoneNo: e.target.value })}
                      error={resvErrors.PhoneNo}
                      required
                    />

                    <Input
                      label="Reservation Date"
                      name="Date"
                      type="date"
                      value={reservationForm.Date}
                      onChange={(e) => setReservationForm({ ...reservationForm, Date: e.target.value })}
                      error={resvErrors.Date}
                      required
                    />

                    <Input
                      label="Time Slot"
                      name="Time"
                      type="time"
                      value={reservationForm.Time}
                      onChange={(e) => setReservationForm({ ...reservationForm, Time: e.target.value })}
                      error={resvErrors.Time}
                      required
                    />

                    <Input
                      label="Number of Guests"
                      name="BookingCount"
                      type="number"
                      min="1"
                      max="20"
                      value={reservationForm.BookingCount}
                      onChange={(e) => setReservationForm({ ...reservationForm, BookingCount: e.target.value })}
                      error={resvErrors.BookingCount}
                      required
                    />

                    <div className="sm:col-span-2">
                      <Textarea
                        label="Special Notes or Dietary Preferences"
                        name="Comment"
                        rows={3}
                        placeholder="Tell us if celebrating a special occasion or if any guests have dietary preferences..."
                        value={reservationForm.Comment}
                        onChange={(e) => setReservationForm({ ...reservationForm, Comment: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={resvSubmitting}
                      icon={CalendarCheck}
                      className="w-full sm:w-auto"
                    >
                      Confirm Table Reservation
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          SECTION 10: CONTACT FORM
         ======================================================== */}
      <section id="contact" className="py-16 sm:py-24 lg:py-28 bg-[#F6F3EC]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          {/* Section Marker */}
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mb-6 sm:mb-8">
            <span>07</span>
            <span className="w-8 h-[1px] bg-[#BD8856]" />
            <span>Enquiries & Notes</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
            <div className="lg:col-span-5 space-y-6">
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#24251F]">
                Get in Touch
              </h2>
              <p className="text-xs sm:text-sm text-[#24251F]/70 leading-relaxed font-light">
                Have questions regarding wholesale coffee, private bookings, or seasonal menu allergens? Send us an inquiry and our team will be in touch.
              </p>

              <div className="space-y-4 pt-4 text-xs uppercase tracking-[0.12em] font-medium text-[#24251F]/70">
                <div className="border-b border-[#E2DCCE] pb-3 flex justify-between gap-4">
                  <span className="flex-shrink-0">General Enquiries</span>
                  <span className="font-serif lowercase tracking-normal text-xs sm:text-sm text-[#24251F] truncate text-right">hello@morrowcoffee.com</span>
                </div>
                <div className="border-b border-[#E2DCCE] pb-3 flex justify-between gap-4">
                  <span className="flex-shrink-0">Roastery Studio</span>
                  <span className="font-mono text-xs text-[#24251F] truncate text-right">+61 (03) 9482 1100</span>
                </div>
                <div className="border-b border-[#E2DCCE] pb-3 flex justify-between gap-4">
                  <span className="flex-shrink-0">Heritage Location</span>
                  <span className="text-right text-[#24251F] capitalize font-normal">42 Franklin Promenade, Melbourne</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 bg-white/80 border border-[#E2DCCE] p-6 sm:p-10 lg:p-12">
              {contactSuccess ? (
                <div className="text-center py-10 sm:py-12 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-[#435640]/10 text-[#435640] flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#24251F]">
                    Message Dispatched
                  </h3>
                  <p className="text-xs sm:text-sm text-[#24251F]/70 max-w-sm mx-auto leading-relaxed">
                    Thank you for writing to us. A member of the {APP_NAME} team will review your enquiry and reply promptly.
                  </p>
                  <div className="pt-6">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setContactSuccess(false);
                        setContactForm({ Name: '', Email: '', Message: '' });
                      }}
                    >
                      Send Another Message
                    </Button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                    <Input
                      label="Your Name"
                      name="Name"
                      placeholder={`e.g. ${TEST_DATA_PREFIX} David`}
                      value={contactForm.Name}
                      onChange={(e) => setContactForm({ ...contactForm, Name: e.target.value })}
                      error={contactErrors.Name}
                      required
                    />

                    <Input
                      label="Email Address"
                      name="Email"
                      type="email"
                      placeholder="e.g. david@example.com"
                      value={contactForm.Email}
                      onChange={(e) => setContactForm({ ...contactForm, Email: e.target.value })}
                      error={contactErrors.Email}
                      required
                    />

                    <div className="sm:col-span-2">
                      <Textarea
                        label="Message"
                        name="Message"
                        rows={4}
                        placeholder="Share your inquiry or thoughts with us..."
                        value={contactForm.Message}
                        onChange={(e) => setContactForm({ ...contactForm, Message: e.target.value })}
                        error={contactErrors.Message}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      loading={contactSubmitting}
                      icon={Send}
                      className="w-full sm:w-auto"
                    >
                      Dispatch Message
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
