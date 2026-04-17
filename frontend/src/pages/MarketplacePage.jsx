import { useState } from 'react'
import { Star, MapPin, Phone, ExternalLink } from 'lucide-react'
const vendors = [
  { id: 1, name: 'SoundPros Ghana', category: 'Sound & AV Equipment', location: 'Accra', rating: 4.8, reviews: 34, description: 'Professional PA systems, microphones, and stage lighting for all church events.', verified: true, phone: '+233 24 100 2200' },
  { id: 2, name: 'PrintFast Accra', category: 'Printing Services', location: 'Tema', rating: 4.6, reviews: 51, description: 'Banners, bulletins, event flyers, certificates, and member ID cards. Fast turnaround.', verified: true, phone: '+233 20 300 4400' },
  { id: 3, name: 'GraceShots Photography', category: 'Photography & Videography', location: 'East Legon', rating: 4.9, reviews: 28, description: 'Sunday services, crusades, weddings, dedications and church documentaries.', verified: true, phone: '+233 55 500 6600' },
  { id: 4, name: 'Kingdom Canopy Rentals', category: 'Canopy & Event Setup', location: 'Kumasi', rating: 4.5, reviews: 19, description: 'Canopies, chairs, tables, staging and podiums for outdoor events.', verified: false, phone: '+233 27 700 8800' },
  { id: 5, name: 'Mama Akua Catering', category: 'Catering Services', location: 'Lapaz, Accra', rating: 4.7, reviews: 42, description: 'Church event catering, retreat feeding and pastor luncheons.', verified: true, phone: '+233 24 900 0011' },
  { id: 6, name: 'Holy Word Bookstore', category: 'Bookstores & Resources', location: 'Accra', rating: 4.4, reviews: 67, description: 'Bibles, devotionals, study materials, hymnals and church admin resources.', verified: true, phone: '+233 20 112 2334' },
]
const categories = ['All','Sound & AV Equipment','Printing Services','Photography & Videography','Canopy & Event Setup','Catering Services','Bookstores & Resources']
export default function MarketplacePage() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? vendors : vendors.filter(v => v.category === cat)
  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8 fade-in">
        <h1 className="text-3xl font-bold" style={{ fontFamily: 'Cormorant Garamond', color: '#0F172A' }}>Church Marketplace</h1>
        <p className="text-gray-400 text-sm mt-1">Verified vendors who serve churches — book directly from here</p>
      </div>
      <div className="flex gap-2 mb-6 flex-wrap fade-in">
        {categories.map(c => (
          <button key={c} onClick={() => setCat(c)} className="px-3 py-2 rounded-lg text-xs font-medium transition"
            style={{ background: cat === c ? '#1B4FD8' : 'white', color: cat === c ? 'white' : '#6B7280', border: '1px solid ' + (cat === c ? '#1B4FD8' : '#E5E7EB') }}>
            {c}
          </button>
        ))}
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
        {filtered.map(v => (
          <div key={v.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden stat-card">
            <div className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#EEF2FF', color: '#1B4FD8' }}>{v.category}</span>
                {v.verified && <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: '#DBEAFE', color: '#1E40AF' }}>Verified</span>}
              </div>
              <h3 className="font-bold text-gray-900 mb-1" style={{ fontSize: "16px", letterSpacing: "-0.02em" }}>{v.name}</h3>
              <div className="flex items-center gap-1 mb-2">
                <Star size={11} fill="#F59E0B" stroke="none" />
                <span className="text-xs font-medium text-gray-700">{v.rating}</span>
                <span className="text-xs text-gray-400">({v.reviews} reviews)</span>
              </div>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">{v.description}</p>
              <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><MapPin size={10} /> {v.location}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1"><Phone size={10} /> {v.phone}</p>
            </div>
            <div className="border-t border-gray-100 px-5 py-3 flex gap-2">
              <button className="flex-1 py-2 rounded-lg text-xs font-medium text-white" style={{ background: '#1B4FD8' }}>Book Vendor</button>
              <button className="px-3 py-2 rounded-lg border border-gray-200 text-gray-600"><ExternalLink size={12} /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
