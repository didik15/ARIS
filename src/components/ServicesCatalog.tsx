import React from 'react';
import { AgencyService } from '../types';
import { BookOpen, Clock, CheckCircle2, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

interface ServicesCatalogProps {
  services: AgencyService[];
}

export const ServicesCatalog: React.FC<ServicesCatalogProps> = ({ services }) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 rounded-2xl p-6 text-white shadow-md shadow-blue-500/10 space-y-2">
        <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-white/15 border border-white/20 text-blue-100 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-blue-200" />
          <span>A.R.I.S. & Synergy Consultant Service Catalog</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">
          Passport & Immigration Consultancy Service Reference
        </h2>
        <p className="text-xs text-blue-100 max-w-2xl leading-relaxed">
          Guide to estimated processing times, client document requirements, and standard service fee ranges for clients and PMA sponsors.
        </p>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 hover:border-blue-500 hover:shadow-sm transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                    {srv.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 mt-1.5">
                    {srv.name}
                  </h3>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {srv.description}
              </p>

              <div className="flex items-center space-x-2 text-xs font-semibold text-blue-700 bg-blue-50 p-2.5 rounded-xl border border-blue-100">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Est. Processing Time: {srv.estimatedDays}</span>
              </div>

              {/* Requirements List */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <span className="text-[11px] font-bold text-slate-800 block">
                  Document Requirements:
                </span>
                <ul className="space-y-1">
                  {srv.requirements.map((req, idx) => (
                    <li key={idx} className="text-xs text-slate-600 flex items-start space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {srv.estimatedFeeIndonesian && (
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Estimated Fee:</span>
                <strong className="text-emerald-700 font-bold">{srv.estimatedFeeIndonesian}</strong>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
