import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, Home, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 px-4 py-12">
      <div className="max-w-md w-full text-center bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-stone-200/80">
        <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center mx-auto mb-4">
          <Coffee className="w-8 h-8" />
        </div>
        <span className="text-xs uppercase tracking-widest font-bold text-brand-600">404 Error</span>
        <h1 className="mt-1 font-serif text-3xl font-bold text-stone-900">Page Not Found</h1>
        <p className="mt-2 text-sm text-stone-500 leading-relaxed">
          The cup you're looking for appears to be empty or has moved to another table.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="primary" icon={Home} className="w-full sm:w-auto">
              Back to Home
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-50 rounded-xl transition-colors border border-stone-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
