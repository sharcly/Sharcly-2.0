"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Trash2,
  X,
  ArrowRight,
  Search,
  Users,
  Percent,
  RefreshCw,
  Zap,
  Globe,
  Settings,
  Layout,
  MousePointer2,
  Mail,
  Download,
  Info,
  ChevronRight,
  Tag
} from "lucide-react"
import { apiClient } from "@/lib/api-client"

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8181/api"

function EditOfferModal({
  offer,
  onClose,
  onSaved,
}: {
  offer: any | null
  onClose: () => void
  onSaved: () => void
}) {
  const isNew = !offer
  const [title, setTitle] = useState(offer?.title ?? "")
  const [description, setDescription] = useState(offer?.description ?? "")
  const [codePrefix, setCodePrefix] = useState(offer?.codePrefix ?? "")
  const [discountType, setDiscountType] = useState<"percentage" | "fixed">(offer?.discountType ?? "percentage")
  const [discountValue, setDiscountValue] = useState(offer?.discountValue ?? 20)
  const [imageUrl, setImageUrl] = useState(offer?.imageUrl ?? "")
  const [isActive, setIsActive] = useState(offer?.isActive ?? true)

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSave = async () => {
    if (!title.trim() || !codePrefix.trim()) {
      setError("Campaign Title and Promo Prefix are required")
      return
    }

    setSaving(true)
    setError("")

    try {
      const payload = {
        title,
        description,
        codePrefix: codePrefix.toUpperCase(),
        discountType,
        discountValue: Number(discountValue),
        imageUrl,
        isActive
      }

      const url = isNew 
        ? `/marketing/admin/offers` 
        : `/marketing/admin/offers/${offer.id}`
      
      if (isNew) {
        await apiClient.post(url, payload)
      } else {
        await apiClient.patch(url, payload)
      }

      onSaved()
      onClose()
    } catch (err: any) {
      setError(err?.message ?? "Failed to save campaign.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden max-h-[90vh]"
      >
        <div className="px-8 py-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#082f1d]/10 text-[#082f1d] flex items-center justify-center border border-[#082f1d]/20">
              <Zap size={20} />
            </div>
            <h2 className="text-xl font-bold text-gray-900">
              {isNew ? "Create Campaign" : "Edit Campaign"}
            </h2>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
          {error && (
            <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-xs font-bold uppercase tracking-widest flex items-center gap-3">
              <Info size={16} /> {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="col-span-2 space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Campaign Title</label>
              <input
                type="text" value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Summer Welcome Offer"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-[#082f1d]/50 focus:ring-4 focus:ring-[#082f1d]/5 transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Promo Prefix</label>
              <input
                type="text" value={codePrefix} onChange={e => setCodePrefix(e.target.value)}
                placeholder="WELCOME"
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-[#082f1d]/50 uppercase"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Pricing Model</label>
              <select
                value={discountType} onChange={e => setDiscountType(e.target.value as any)}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-[#082f1d]/50 appearance-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount ($)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Reward Value</label>
              <input
                type="number" value={discountValue} onChange={e => setDiscountValue(Number(e.target.value))}
                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-[#082f1d]/50"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                onClick={() => setIsActive(!isActive)}
                className={`w-11 h-6 rounded-full transition-all relative ${isActive ? 'bg-[#082f1d]' : 'bg-gray-200'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${isActive ? 'left-6 shadow-sm' : 'left-1'}`} />
              </button>
              <span className="text-xs font-bold text-gray-600 uppercase tracking-wider">Status: {isActive ? 'Active' : 'Draft'}</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Image URL (Optional)</label>
            <input
              type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 outline-none focus:border-[#082f1d]/50"
            />
          </div>
        </div>

        <div className="px-8 py-6 border-t border-gray-50 bg-gray-50/50 flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-3 bg-[#082f1d] text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-[#051d12] transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 shadow-md"
          >
            {saving ? "Deploying..." : (isNew ? "Create Campaign" : "Save Changes")}
            <ArrowRight size={16} />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function MarketingAdminPage() {
  const [activeTab, setActiveTab] = useState<"offers" | "leads">("offers")
  const [offers, setOffers] = useState<any[]>([])
  const [leads, setLeads] = useState<any[]>([])
  const [config, setConfig] = useState<any>({ isEnabled: true, displayMode: "single", showFrequency: "every_visit" })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [editingOffer, setEditingOffer] = useState<any | null>(null)
  const [configSaving, setConfigSaving] = useState(false)

  const fetchConfig = async () => {
    try {
      const { data } = await apiClient.get("/marketing/config")
      if (data.config) setConfig(data.config)
    } catch (e) {
      console.warn("Failed to fetch config")
    }
  }

  const fetchData = async () => {
    setLoading(true)
    try {
      if (activeTab === "offers") {
        const { data } = await apiClient.get("/marketing/admin/offers")
        setOffers(data.offers || [])
      } else {
        const { data } = await apiClient.get("/marketing/admin/subscribers")
        setLeads(data.subscribers || [])
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchConfig()
    fetchData()
  }, [activeTab])

  const updateConfig = async (newConfig: any) => {
    setConfigSaving(true)
    try {
      const { data } = await apiClient.patch("/marketing/admin/config", newConfig)
      if (data.config) setConfig(data.config)
    } catch (e) {
      alert("Failed to update settings")
    } finally {
      setConfigSaving(false)
    }
  }

  const handleDeleteOffer = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm("Are you sure you want to delete this campaign?")) return
    try {
      await apiClient.delete(`/marketing/admin/offers/${id}`)
      fetchData()
    } catch (e) {
      alert("Failed to delete campaign")
    }
  }

  const filteredData = useMemo(() => {
    if (activeTab === "offers") {
      return offers.filter(o => o.title.toLowerCase().includes(searchQuery.toLowerCase()) || o.codePrefix.toLowerCase().includes(searchQuery.toLowerCase()))
    } else {
      return leads.filter(l => l.email.toLowerCase().includes(searchQuery.toLowerCase()))
    }
  }, [offers, leads, searchQuery, activeTab])

  const handleExportCSV = () => {
    if (leads.length === 0) return

    const headers = ["Email", "Phone", "Campaign", "Promo Code", "Date"]
    const rows = leads.map(lead => {
      const campaign = offers.find(o => o.id === lead.offerId)?.title || "General"
      const date = new Date(lead.createdAt).toLocaleDateString()
      return [
        lead.email,
        lead.phone || "",
        campaign,
        lead.promoCode,
        date
      ].map(val => `"${String(val).replace(/"/g, '""')}"`)
    })

    const csvContent = [headers.join(","), ...rows.map(r => r.join(","))].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `marketing_subscribers_${new Date().toISOString().split('T')[0]}.csv`)
    link.click()
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9] text-[#082f1d] selection:bg-[#082f1d]/10 p-8">
      <div className="max-w-7xl mx-auto space-y-10">
        <AnimatePresence mode="wait">
          {editingOffer && (
            <EditOfferModal
              offer={editingOffer === "new" ? null : editingOffer}
              onClose={() => setEditingOffer(null)}
              onSaved={fetchData}
            />
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-3 text-gray-400 uppercase tracking-[0.3em] font-bold text-[10px]">
              <Globe size={14} className="text-[#5a7a4a]" />
              Marketing Hub
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Campaign Management</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-white border border-gray-200 rounded-2xl p-1 flex shadow-sm">
              <button
                onClick={() => setActiveTab("offers")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'offers' ? 'bg-[#082f1d] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Percent size={14} /> Campaigns
              </button>
              <button
                onClick={() => setActiveTab("leads")}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${activeTab === 'leads' ? 'bg-[#082f1d] text-white shadow-md' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <Users size={14} /> Subscribers
              </button>
            </div>

            {activeTab === "offers" && (
              <button
                onClick={() => setEditingOffer("new")}
                className="px-6 py-3 bg-[#082f1d] hover:bg-[#051d12] text-white rounded-2xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all shadow-md active:scale-95 border border-transparent"
              >
                <Plus size={18} /> New Campaign
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-200 rounded-3xl p-6 space-y-6 shadow-sm">
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Global Configuration</h4>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-700 uppercase tracking-wider">System Status</span>
                    <span className={`text-[9px] font-bold ${config.isEnabled ? 'text-[#5a7a4a]' : 'text-gray-300'}`}>
                      {config.isEnabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                  </div>
                  <button
                    onClick={() => updateConfig({ ...config, isEnabled: !config.isEnabled })}
                    disabled={configSaving}
                    className={`w-10 h-5 rounded-full relative transition-all ${config.isEnabled ? 'bg-[#082f1d]' : 'bg-gray-200'}`}
                  >
                    <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${config.isEnabled ? 'left-5.5' : 'left-0.5'}`} />
                  </button>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] px-1">Display Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateConfig({ ...config, displayMode: 'single' })}
                      className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${config.displayMode === 'single' ? 'bg-[#082f1d]/5 border-[#082f1d]/20 text-[#082f1d]' : 'bg-white border-gray-100 text-gray-400'}`}
                    >
                      Focused
                    </button>
                    <button
                      onClick={() => updateConfig({ ...config, displayMode: 'multiple' })}
                      className={`py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${config.displayMode === 'multiple' ? 'bg-[#082f1d]/5 border-[#082f1d]/20 text-[#082f1d]' : 'bg-white border-gray-100 text-gray-400'}`}
                    >
                      Selection
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#082f1d] transition-colors" size={16} />
                  <input
                    type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    className="w-full h-11 pl-11 pr-4 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-gray-300 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Growth</span>
                <span className="text-2xl font-bold text-[#082f1d]">{leads.length}</span>
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2 shadow-sm">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Active</span>
                <span className="text-2xl font-bold text-[#082f1d]">{offers.filter(o => o.isActive).length}</span>
              </div>
            </div>

            <button
              onClick={fetchData}
              className="w-full py-4 flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 hover:text-gray-900 transition-all bg-white border border-gray-200 rounded-2xl hover:bg-gray-50 shadow-sm"
            >
              <RefreshCw size={14} className={loading ? 'animate-spin text-[#082f1d]' : ''} />
              Sync Data
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 min-h-[600px]">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center opacity-30">
                <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-[#082f1d] animate-spin mb-4" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Loading...</span>
              </div>
            ) : activeTab === 'offers' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.map((offer: any) => (
                  <motion.div
                    layout key={offer.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    onClick={() => setEditingOffer(offer)}
                    className="group bg-white border border-gray-200 rounded-3xl p-6 hover:border-[#082f1d]/30 hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between gap-4 mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-500 shadow-sm">
                        {offer.imageUrl ? (
                          <img src={offer.imageUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <MousePointer2 size={24} className="text-gray-300 group-hover:text-[#082f1d] transition-colors" />
                        )}
                      </div>
                      <div className={`w-2.5 h-2.5 rounded-full ${offer.isActive ? 'bg-[#5a7a4a] shadow-[0_0_10px_rgba(90,122,74,0.3)]' : 'bg-gray-200'}`} />
                    </div>
                    <div className="space-y-1.5 mb-8">
                      <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Zap size={10} className="text-[#082f1d]" />
                        {offer.codePrefix}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#082f1d] transition-colors leading-tight">{offer.title}</h3>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-[10px] font-bold text-gray-600">
                        {offer.discountValue}{offer.discountType === 'percentage' ? '%' : '$'} OFF
                      </div>
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); setEditingOffer(offer); }} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-[#082f1d] transition-all"><Settings size={16} /></button>
                        <button onClick={(e) => handleDeleteOffer(offer.id, e)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors border border-gray-100"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Growth Analytics</h3>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{filteredData.length} Total Subscribers</p>
                  </div>
                  <button
                    onClick={handleExportCSV} disabled={filteredData.length === 0}
                    className="px-4 h-10 flex items-center justify-center gap-2 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#082f1d] transition-all text-[10px] font-bold uppercase tracking-widest disabled:opacity-50"
                  >
                    <Download size={14} /> Export CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-[#FAFAF9] border-b border-gray-100 text-gray-500">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Identity</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Active Campaign</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest">Discount Code</th>
                        <th className="px-8 py-5 text-[10px] font-bold uppercase tracking-widest text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredData.map((lead: any) => (
                        <tr key={lead.id} className="group hover:bg-gray-50 transition-colors">
                          <td className="px-8 py-6">
                            <div className="flex flex-col gap-0.5">
                              <span className="text-sm font-bold text-gray-900 tracking-tight">{lead.email}</span>
                              {lead.phone && <span className="text-[10px] text-gray-400 font-medium">{lead.phone}</span>}
                            </div>
                          </td>
                          <td className="px-8 py-6">
                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                              {offers.find(o => o.id === lead.offerId)?.title || "General"}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <code className="px-3 py-1.5 bg-gray-50 border border-gray-100 text-[#5a7a4a] rounded-lg text-[11px] font-bold tracking-widest">{lead.promoCode}</code>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{new Date(lead.createdAt).toLocaleDateString()}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
