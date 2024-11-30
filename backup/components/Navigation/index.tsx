import React from 'react';
import { Phone, Clock, MapPin, Mail, AlertTriangle, ChevronRight, ArrowRight, Globe } from 'lucide-react';

const Navigation = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Emergency Bar */}
      <div className="bg-gradient-to-r from-red-700 to-red-600 text-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <a href="tel:1300309361" className="group flex items-center gap-2 hover:scale-105 transition-all">
              <div className="p-1.5 bg-white/10 rounded-lg group-hover:bg-white/20">
                <Phone className="text-white" size={16} />
              </div>
              <span className="font-semibold">1300 309 361</span>
            </a>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <AlertTriangle className="animate-pulse" size={16} />
              </div>
              <span className="font-medium">24/7 Emergency Response</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2 text-sm">
              <MapPin size={16} />
              <span>Serving South East QLD</span>
            </span>
          </div>
        </div>
      </div>

      {/* Enhanced Header */}
      <header className="bg-white shadow-md relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-24">
            <div className="flex items-center gap-8">
              <img 
                src="/disaster-recovery-logo.png" 
                alt="Disaster Recovery Queensland" 
                className="h-20 hover:scale-105 transition-transform duration-300"
              />
              <div className="h-12 w-px bg-gray-200"></div>
              <div className="flex items-center gap-2">
                <Globe className="text-blue-600" size={24} />
                <div>
                  <div className="text-blue-900 font-bold">IICRC Certified</div>
                  <div className="text-gray-600 text-sm">Professional Restoration</div>
                </div>
              </div>
            </div>
            
            <button className="bg-red-600 text-white px-6 py-3 rounded-lg 
                           hover:bg-red-700 transition-all duration-300 
                           shadow-md hover:shadow-lg hover:scale-105">
              <div className="flex items-center gap-3">
                <Phone size={20} />
                <span className="font-semibold">Emergency Call</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Enhanced Navigation */}
      <nav className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 shadow-xl relative z-20">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center gap-3">
            {[
              { name: 'Water Damage', icon: Globe },
              { name: 'Mould Remediation', icon: Globe },
              { name: 'Sewage Clean Up', icon: AlertTriangle },
              { name: 'Fire Damage', icon: Globe },
              { name: 'Locations', icon: MapPin },
              { name: 'About Us', icon: Globe },
              { name: 'Contact', icon: Phone }
            ].map(({ name, icon: Icon }) => (
              <a
                key={name}
                href="#"
                className="group px-4 py-2.5 rounded-full 
                         bg-blue-800/50 hover:bg-blue-700
                         border border-blue-300/20 hover:border-blue-300/40
                         transition-all duration-300 shadow-md text-sm 
                         hover:shadow-lg hover:scale-105
                         flex items-center gap-2"
              >
                <Icon size={14} className="text-blue-300 group-hover:text-white transition-colors" />
                <span className="text-white">{name}</span>
                <ChevronRight size={14} 
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-900 to-blue-800 py-16 relative z-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-12">
            <div className="w-1/2 space-y-6">
              <h1 className="text-5xl font-bold text-white leading-tight">
                Fast Response
                <span className="text-red-500"> Emergency Services</span>
              </h1>
              <h2 className="text-xl text-blue-200">
                Professional damage restoration available 24/7 
                across South East Queensland
              </h2>
              <div className="flex gap-4 pt-4">
                <button className="bg-red-600 text-white px-8 py-4 rounded-lg 
                               hover:bg-red-700 transition-all duration-300 
                               shadow-lg hover:shadow-xl hover:scale-105">
                  <div className="flex items-center gap-3">
                    <Phone size={20} />
                    <span className="font-semibold">Call Now</span>
                    <ArrowRight size={16} />
                  </div>
                </button>
                <button className="bg-white/10 text-white px-8 py-4 rounded-lg 
                               hover:bg-white/20 transition-all duration-300 
                               shadow-lg hover:shadow-xl hover:scale-105
                               border border-white/20">
                  Our Services
                </button>
              </div>
            </div>
            <div className="w-1/2">
              <div className="bg-blue-800/50 rounded-xl shadow-2xl p-8 border border-blue-700/50">
                <h3 className="text-2xl font-semibold mb-6 text-white flex items-center gap-3">
                  <MapPin size={24} className="text-red-500" />
                  Service Areas
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  {[
                    'Brisbane',
                    'Brisbane CBD',
                    'Ipswich',
                    'Logan',
                    'Gold Coast',
                    'Redlands'
                  ].map((area) => (
                    <div key={area} 
                         className="flex items-center gap-3 group cursor-pointer
                                  hover:bg-blue-700/50 p-3 rounded-lg transition-all duration-300">
                      <MapPin size={16} className="text-blue-300 group-hover:text-white transition-colors" />
                      <span className="text-white/90 group-hover:text-white group-hover:translate-x-1 transition-all">
                        {area}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
