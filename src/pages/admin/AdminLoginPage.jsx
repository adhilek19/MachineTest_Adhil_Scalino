import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Lock, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { authService } from '../../api/services';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { APP_NAME, TAGLINE, CANDIDATE_NAME } from '../../utils/constants';

export function AdminLoginPage() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/admin';

  useEffect(() => {
    // Populate candidate/staff names from real API endpoint /auth/getNames
    authService.getNames()
      .then((names) => {
        if (Array.isArray(names)) {
          setStaffList(names);
        }
      })
      .catch((err) => {
        console.warn('Lookup /auth/getNames notice:', err.message);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please provide an administrative username or select staff identity.');
      return;
    }

    try {
      setLoading(true);
      await login({ username, password });
      toast.success(`Session authenticated as ${username}`, 'Signed In');
      navigate(destination, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F6F3EC] px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-md w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl sm:text-4xl text-[#24251F] block leading-none">
            {APP_NAME}
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#BD8856] font-medium block mt-1.5">
            {TAGLINE}
          </span>
          <p className="text-xs text-[#24251F]/60 mt-3 uppercase tracking-[0.14em]">
            Administration & Content Console
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-[#E2DCCE] p-6 sm:p-10 shadow-sm">
          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-xs text-rose-800">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Staff Username / ID"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. admin or staff name"
              required
            />

            <Input
              label="Staff Passcode (Optional)"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter passcode"
              helperText="Client-side demonstration session (backend provides no authentication endpoints)"
            />

            {/* Quick staff selector populated from real API /auth/getNames */}
            {staffList.length > 0 && (
              <div className="pt-2">
                <span className="text-[10px] uppercase tracking-[0.14em] font-medium text-[#24251F]/50 block mb-2">
                  Staff Identity from API (/auth/getNames)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => setUsername('admin')}
                    className={`text-xs px-3 py-1 border transition-colors uppercase tracking-[0.1em] ${
                      username === 'admin'
                        ? 'bg-[#435640] text-white border-[#435640]'
                        : 'bg-[#F6F5F2] text-[#24251F] border-[#E2DCCE] hover:border-[#24251F]'
                    }`}
                  >
                    admin
                  </button>
                  {staffList.map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setUsername(name)}
                      className={`text-xs px-3 py-1 border transition-colors uppercase tracking-[0.1em] ${
                        username === name
                          ? 'bg-[#435640] text-white border-[#435640]'
                          : 'bg-[#F6F5F2] text-[#24251F] border-[#E2DCCE] hover:border-[#24251F]'
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                icon={ArrowRight}
                iconPosition="right"
                className="w-full"
              >
                Access Administration
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-[#E2DCCE] flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.12em] text-[#24251F]/50">
            <ShieldCheck className="w-4 h-4 text-[#435640]" />
            <span>Protected Route Guards Enabled</span>
          </div>
        </div>

        {/* Footer candidate tag */}
        <p className="mt-6 text-center text-xs text-[#24251F]/40 font-light">
          Built for technical machine test evaluation by {CANDIDATE_NAME}.
        </p>
      </div>
    </div>
  );
}

export default AdminLoginPage;
