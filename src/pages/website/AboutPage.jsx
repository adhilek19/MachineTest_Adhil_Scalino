import React, { useState, useEffect } from 'react';
import { teamService } from '../../api/services';
import { resolveImageUrl } from '../../utils/imageUtils';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import { APP_NAME } from '../../utils/constants';

export function AboutPage() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamService.getTeams();
      setTeam(data);
    } catch (err) {
      setError(err.message || 'Failed to load team members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  return (
    <div className="py-14 sm:py-20 lg:py-24 bg-[#F6F3EC] space-y-16 sm:space-y-20">
      {/* Intro Header */}
      <section className="max-w-4xl mx-auto px-5 sm:px-8 text-center space-y-6">
        <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-[#BD8856] font-medium border-b border-[#BD8856]/30 pb-1">
          <span>The Roastery & Kitchen Story</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl text-[#24251F] leading-tight">
          Where seasonal harvests meet mindful craft.
        </h1>
        <p className="text-sm sm:text-base lg:text-lg text-[#24251F]/70 font-light leading-relaxed max-w-2xl mx-auto">
          Founded on principles of terroir preservation, {APP_NAME} partners directly with regenerative coffee producers and regional farmers to create honest, unhurried sensory experiences.
        </p>
      </section>

      {/* Editorial Story Grid */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center pb-16 sm:pb-20 border-b border-[#E2DCCE]">
          <div className="img-editorial-zoom aspect-[4/3] bg-[#EFEBE1] border border-[#E2DCCE]">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=1200&q=80"
              alt="Café interior atmosphere"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="space-y-6 text-[#24251F]/70 text-sm sm:text-base font-light leading-relaxed">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#24251F]">
              The Neighborhood Sanctuary
            </h2>
            <p>
              Every element of our space—from the bespoke acoustic dampening to the natural lime-plastered walls and raw timber joinery—was conceived to quiet the mind and heighten the senses.
            </p>
            <p>
              We believe great dining is as much about ease and hospitality as it is about culinary technique.
            </p>
          </div>
        </div>
      </section>

      {/* Team Roster */}
      <section className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-2xl mb-8 sm:mb-12">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.24em] text-[#BD8856] font-medium mb-3">
            <span>Our Team</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl text-[#24251F]">
            The Artisans Behind Every Roast
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-[#24251F]/60">
            Meet the culinary artists and master baristas dedicated to perfection at {APP_NAME}.
          </p>
        </div>

        {loading && <LoadingSpinner message="Loading team directory..." />}
        {error && <ErrorState message={error} onRetry={fetchTeam} />}
        {!loading && !error && team.length === 0 && (
          <EmptyState title="Team Profile Unavailable" description="Our team directory is currently being updated." />
        )}
        {!loading && !error && team.length > 0 && (
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
      </section>
    </div>
  );
}

export default AboutPage;
