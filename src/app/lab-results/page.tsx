"use client";

import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Beaker, 
  ShieldCheck, 
  Search, 
  ClipboardCheck,
  FileText,
  Microscope,
  Database,
  ArrowRight,
  CheckCircle2,
  Lock,
  ArrowUpRight,
  X,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

// --- REAL COA DATA ---
const labReports = [
  {
    name: "30mg CBD Full Spectrum",
    product: "CBD Infused Gummies",
    batch: "SHC0001CBD",
    sampleId: "9527HLQ4386.7206",
    lab: "Excelbis Labs",
    date: "May 09, 2026",
    testedDate: "04/21/2026",
    completedDate: "04/22/2026",
    totalTHC: "0.03%",
    totalCBD: "0.35%",
    totalCannabinoids: "0.64%",
    tests: [
      { name: "Cannabinoids", result: "Complete", status: "pass" },
      { name: "Mycotoxins",   result: "Pass",     status: "pass" },
      { name: "GCMS Pesticides", result: "Pass",  status: "pass" },
      { name: "LCMS Pesticides", result: "Pass",  status: "pass" },
    ],
    file: "/30mg_CBD_Sharcly-1_260509_175622.pdf",
    series: "Balance",
    seriesColor: "#d97706",
  },
  {
    name: "25mg CBN + CBD Sleep",
    product: "Sleep Gummies",
    batch: "SHC0001SLP",
    sampleId: "9527HLQ4386.7205",
    lab: "Excelbis Labs",
    date: "May 09, 2026",
    testedDate: "04/21/2026",
    completedDate: "04/22/2026",
    totalTHC: "0.01%",
    totalCBD: "0.26%",
    totalCannabinoids: "0.58%",
    tests: [
      { name: "Cannabinoids", result: "Complete", status: "pass" },
      { name: "Mycotoxins",   result: "Pass",     status: "pass" },
      { name: "GCMS Pesticides", result: "Pass",  status: "pass" },
      { name: "LCMS Pesticides", result: "Pass",  status: "pass" },
    ],
    file: "/25mg_CBN___CBD_Sharcly-1_260509_175649.pdf",
    series: "Sleep",
    seriesColor: "#1e40af",
  },
  {
    name: "30mg Delta-8 THC",
    product: "D8 Infused Gummies",
    batch: "SHC0001D8",
    sampleId: "9527HLQ4386.7207",
    lab: "Excelbis Labs",
    date: "May 09, 2026",
    testedDate: "04/21/2026",
    completedDate: "04/22/2026",
    totalTHC: "0.01%",
    totalCBD: "0.02%",
    totalCannabinoids: "0.31%",
    tests: [
      { name: "Cannabinoids", result: "Complete", status: "pass" },
      { name: "Mycotoxins",   result: "Pass",     status: "pass" },
      { name: "GCMS Pesticides", result: "Pass",  status: "pass" },
      { name: "LCMS Pesticides", result: "Pass",  status: "pass" },
    ],
    file: "/30mg_delta8_Sharcly-1_260509_175752.pdf",
    series: "Chill",
    seriesColor: "#dc2626",
  },
  {
    name: "20mg Delta-9 THC",
    product: "D9 Infused Gummies",
    batch: "SHC0001D9",
    sampleId: "9527HLQ4386.7208",
    lab: "Excelbis Labs",
    date: "May 09, 2026",
    testedDate: "04/21/2026",
    completedDate: "04/22/2026",
    totalTHC: "0.20%",
    totalCBD: "0.02%",
    totalCannabinoids: "0.24%",
    tests: [
      { name: "Cannabinoids", result: "Complete", status: "pass" },
      { name: "Mycotoxins",   result: "Pass",     status: "pass" },
      { name: "GCMS Pesticides", result: "Pass",  status: "pass" },
      { name: "LCMS Pesticides", result: "Pass",  status: "pass" },
    ],
    file: "/20mg_Delta9_Sharcly.pdf",
    series: "Lift",
    seriesColor: "#7c3aed",
  },
];

const tokens = {
  deeper:  '#040e07',
  deep:    '#082f1d',
  light:   '#eff8ee',
  gold:    '#E8C547',
  muted:   'rgba(239,248,238,0.52)',
  border:  'rgba(239,248,238,0.08)',
  card:    'rgba(239,248,238,0.04)',
  green:   '#4ade80',
};

const batchMap: Record<string, typeof labReports[0]> = {
  'SHC0001CBD': labReports[0],
  'SHC0001SLP': labReports[1],
  'SHC0001D8':  labReports[2],
  'SHC0001D9':  labReports[3],
  '260509':     labReports[0], // fallback
};

export default function LabResultsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [foundReport, setFoundReport] = useState<typeof labReports[0] | null>(null);
  const [selectedReport, setSelectedReport] = useState<typeof labReports[0] | null>(null);

  const handleSearch = () => {
    const report = batchMap[searchQuery.toUpperCase()];
    setFoundReport(report || null);
  };

  const protocol = [
    {
      title: "Harvest Audit",
      icon: Microscope,
      desc: "Raw hemp is tested immediately after harvest for cannabinoid profiles and soil purity, ensuring no heavy metals or pesticides enter the ecosystem.",
      points: ["Soil purity verification", "Cannabinoid profiling", "Contaminant screening"]
    },
    {
      title: "Formulation Screen",
      icon: Database,
      desc: "Finished formulations are tested before encapsulation to verify the exact potency match between the distillate and the final product recipe.",
      points: ["Potency verification", "Ingredient stability", "Pre-batch verification"]
    },
    {
      title: "Final Batch QC",
      icon: ClipboardCheck,
      desc: "End-products undergo a final 'handshake' test for potency and microbial safety before being sealed and shipped to our customers.",
      points: ["Microbial safety", "Potency handshake", "Final seal audit"]
    }
  ];

  return (
    <div className="min-h-screen selection:bg-[#E8C547]/20 selection:text-[#E8C547]" style={{ background: tokens.deeper, color: tokens.light }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
      `}} />
      
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden" style={{ background: `linear-gradient(160deg, ${tokens.deeper} 0%, ${tokens.deep} 50%, ${tokens.deeper} 100%)` }}>
          <div 
            className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
            style={{ 
              backgroundImage: 'url("https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          
          <div className="absolute inset-0 z-0 pointer-events-none">
            <div 
              className="absolute top-1/2 left-0 right-0 h-full transform -translate-y-1/2 opacity-20"
              style={{ background: `radial-gradient(ellipse 60% 40% at 30% 50%, ${tokens.gold}0A, transparent)` }}
            />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-[#E8C547]/10 text-[#E8C547] border border-[#E8C547]/20 font-bold text-[10px] uppercase tracking-[0.3em] px-4 py-1 mb-8 rounded-full">
                  Laboratory Verification
                </Badge>
                <h1 className="text-6xl md:text-8xl font-serif italic text-white leading-[1.1] mb-12">
                  Transparency <br/>
                  <span className="text-[#E8C547]">Through</span> Precision.
                </h1>
                <p className="text-lg md:text-xl text-white/60 leading-relaxed font-medium max-w-2xl">
                  Every product we create is backed by rigorous third-party laboratory verification. 
                  Our commitment is simple: what's on the label is exactly what's in the bottle.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Verification Stats */}
        <section className="py-12 border-b border-white/5" style={{ background: tokens.deeper }}>
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { label: "Lab Tests", value: "100%", sub: "Every Batch Verified" },
                { label: "Purity", value: "0.0%", sub: "Heavy Metals Detected" },
                { label: "Certification", value: "USDA", sub: "Organic Standards" },
                { label: "Standards", value: "GMP", sub: "Certified Facility" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-8 bg-white/[0.04] border border-white/[0.08] rounded-2xl hover:border-[#E8C547]/20 transition-all group"
                >
                  <p className="text-4xl font-bold font-serif text-[#E8C547] mb-2">{stat.value}</p>
                  <p className="text-[9px] font-black uppercase tracking-[0.22em] text-white/35 mb-1">{stat.label}</p>
                  <p className="text-[11px] font-medium text-white/50 italic">{stat.sub}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Three-Stage Protocol */}
        <section className="py-32 relative" style={{ background: `linear-gradient(180deg, ${tokens.deeper} 0%, ${tokens.deep} 50%, ${tokens.deeper} 100%)` }}>
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <Badge className="bg-[#E8C547]/10 text-[#E8C547] border-none font-bold text-[9px] uppercase tracking-[0.3em] px-4 mb-6">Our Process</Badge>
              <h2 className="text-5xl md:text-6xl font-serif text-white italic mb-8">The Three-Stage Protocol.</h2>
              <p className="text-white/50 text-lg font-medium leading-relaxed">
                Our safety standards exceed industry requirements. We verify our product at every critical 
                intersection of the manufacturing process to ensure absolute consistency.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {protocol.map((step, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-10 bg-white/[0.04] border border-white/[0.08] rounded-[20px] hover:border-[#E8C547]/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.4),0_0_0_1px_rgba(232,197,71,0.06)] hover:-translate-y-1 transition-all flex flex-col group relative overflow-hidden"
                >
                  <div className="absolute top-4 right-6 text-[#E8C547]/5 font-serif italic text-8xl group-hover:text-[#E8C547]/10 transition-colors pointer-events-none">
                    0{i + 1}
                  </div>
                  <div className="size-14 bg-[#E8C547]/10 border border-[#E8C547]/20 rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110">
                    <step.icon className="h-7 w-7 text-[#E8C547]" />
                  </div>
                  <h3 className="text-3xl font-serif text-white italic mb-6">{step.title}</h3>
                  <p className="text-white/50 font-medium leading-[1.78] text-[14.5px] mb-10 flex-1">{step.desc}</p>
                  <div className="space-y-3 pt-6 border-t border-white/5">
                    {step.points.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 size={12} className="text-[#4ade80]" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/45">{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Search / COA Section */}
        <section className="py-32" style={{ background: tokens.deeper }}>
          <div className="container mx-auto px-6">
            <div className="bg-[#082f1d] rounded-[3rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden border border-white/5">
              <div 
                className="absolute inset-0 opacity-5"
                style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}
              />
              
              <div className="lg:w-1/2 space-y-10 relative z-10">
                <Badge className="bg-[#E8C547]/10 text-[#E8C547] border border-[#E8C547]/20 font-bold text-[9px] uppercase tracking-[0.3em] px-3">Batch Verification</Badge>
                <h2 className="text-5xl md:text-7xl font-serif text-white italic leading-none">Verify Your <span className="text-[#E8C547]">Batch.</span></h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-lg">
                  Enter your batch number found on the bottom of your bottle to view the full Certificate of Analysis (COA) for that specific production run.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <Input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. SHC0001CBD" 
                    className="h-16 rounded-full border-white/10 bg-white/5 text-white placeholder:text-white/20 px-8 font-bold focus:ring-4 focus:ring-[#E8C547]/10 outline-none transition-all"
                  />
                  <Button 
                    onClick={handleSearch}
                    className="h-16 px-10 bg-[#E8C547] hover:bg-[#f0cf55] text-[#082f1d] font-bold uppercase tracking-widest text-xs rounded-full shadow-xl shadow-[#E8C547]/10"
                  >
                    View Results
                  </Button>
                </div>

                <AnimatePresence>
                  {foundReport && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="pt-8 border-t border-white/10 mt-8">
                        <div 
                          onClick={() => setSelectedReport(foundReport)}
                          className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-[#E8C547]/30 cursor-pointer hover:bg-white/10 transition-all"
                        >
                          <div>
                            <p className="text-[10px] font-bold text-[#E8C547] uppercase tracking-widest">Match Found</p>
                            <p className="text-lg font-serif italic text-white">{foundReport.name}</p>
                          </div>
                          <ArrowRight className="text-[#E8C547]" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                  {searchQuery && !foundReport && searchQuery.length > 5 && (
                    <p className="text-white/30 text-xs mt-4 italic">No matching batch found. Please check the code on your bottle.</p>
                  )}
                </AnimatePresence>
              </div>

              <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                 <div 
                   onClick={() => setSelectedReport(labReports[0])}
                   className="p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group cursor-pointer hover:border-[#E8C547]/30 transition-all"
                 >
                    <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-[#E8C547]/10 transition-colors">
                       <FileText className="h-7 w-7 text-white/40 group-hover:text-[#E8C547] transition-colors" />
                    </div>
                    <div>
                       <p className="font-serif text-2xl text-white italic mb-2">30mg CBD</p>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-[#E8C547] transition-colors flex items-center gap-2">
                          Batch SHC0001CBD <ArrowUpRight size={12} />
                       </p>
                    </div>
                 </div>
                 <div className="p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group cursor-pointer hover:border-[#4ade80]/30 transition-all sm:translate-y-12">
                    <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-[#4ade80]/10 transition-colors">
                       <ShieldCheck className="h-7 w-7 text-white/40 group-hover:text-[#4ade80] transition-colors" />
                    </div>
                    <div>
                       <p className="font-serif text-2xl text-white italic mb-2">Verified</p>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-[#4ade80] transition-colors flex items-center gap-2">
                          100% Purity <ArrowUpRight size={12} />
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* COA Library */}
        <section className="py-32" style={{ background: tokens.deeper }}>
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
              <div>
                <Badge className="bg-[#E8C547]/10 text-[#E8C547] border-none font-bold text-[9px] uppercase tracking-[0.3em] px-4 mb-4">COA Library</Badge>
                <h2 className="text-5xl md:text-6xl font-serif text-white italic">Recent Verifications.</h2>
              </div>
              <p className="text-white/40 text-sm font-medium max-w-xs leading-relaxed">
                Access the most recent laboratory results for our signature product line.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {labReports.map((report, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => setSelectedReport(report)}
                  className="group p-7 bg-white/[0.04] border border-white/[0.08] rounded-[20px] hover:border-[#E8C547]/22 hover:-translate-y-1 transition-all flex flex-col cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="size-11 bg-white/[0.05] rounded-xl flex items-center justify-center group-hover:bg-[#E8C547]/10 transition-colors">
                      <FileText className="h-5 w-5 text-white/30 group-hover:text-[#E8C547] transition-colors" />
                    </div>
                    <span 
                      className="px-2.5 py-1 rounded-full text-[8px] font-bold uppercase tracking-[0.15em] text-white"
                      style={{ background: report.seriesColor }}
                    >
                      {report.series}
                    </span>
                  </div>

                  <h4 className="text-xl font-serif text-white font-bold mb-1 italic">{report.name}</h4>
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/30 mb-6">Batch: {report.batch}</p>
                  
                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {report.tests.slice(0, 2).map((test, idx) => (
                      <span key={idx} className="text-[9px] font-bold tracking-[0.12em] uppercase px-2 py-1 rounded-full bg-[#4ade80]/10 border border-[#4ade80]/25 text-[#4ade80] flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-[#4ade80]" /> {test.name}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-3 bg-white/[0.03] border border-white/[0.06] rounded-xl mb-6">
                    <div>
                      <div className="text-sm font-bold text-[#E8C547] font-serif">{report.totalTHC}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30">THC</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#E8C547] font-serif">{report.totalCBD}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30">CBD</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#E8C547] font-serif">{report.totalCannabinoids}</div>
                      <div className="text-[8px] uppercase tracking-widest text-white/30">Total</div>
                    </div>
                  </div>

                  <div className="mt-auto pt-5 border-t border-white/[0.07] flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-white/20 uppercase tracking-tighter">Excelbis Labs</span>
                      <span className="text-[10px] font-bold text-white/30">{report.date}</span>
                    </div>
                    <a 
                      href={report.file} 
                      target="_blank" 
                      onClick={(e) => e.stopPropagation()}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#E8C547] px-3.5 py-1.5 rounded-full border border-[#E8C547]/25 bg-[#E8C547]/5 hover:bg-[#E8C547] hover:text-[#082f1d] transition-all flex items-center gap-2"
                    >
                      PDF <ArrowUpRight size={10} />
                    </a>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Trust Section */}
        <section className="py-24 border-t border-white/5" style={{ background: tokens.deeper }}>
           <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-white/[0.04] border border-white/[0.08] rounded-[20px] p-12">
                 <div className="flex items-center gap-8">
                    <div className="size-20 bg-[#E8C547]/10 border border-[#E8C547]/20 rounded-full flex items-center justify-center shadow-sm">
                       <Lock size={32} className="text-[#E8C547]" />
                    </div>
                    <div>
                       <h4 className="text-2xl font-serif text-white italic">End-to-End Encryption</h4>
                       <p className="text-white/50 font-medium">All laboratory data is securely stored and tamper-proof.</p>
                    </div>
                 </div>
                 <div className="flex gap-8 items-center">
                    <div className="opacity-40 hover:opacity-80 transition-all cursor-help grayscale hover:grayscale-0">
                       <svg className="h-10 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="20" cy="20" r="20" fill="currentColor" fillOpacity="0.1"/>
                          <path d="M20 5L23.5 13H16.5L20 5Z" fill="#E8C547"/>
                          <rect x="16" y="13" width="8" height="15" fill="#E8C547"/>
                          <path d="M12 28H28L20 35L12 28Z" fill="#E8C547"/>
                       </svg>
                       <p className="text-[8px] font-bold text-center mt-2 tracking-widest uppercase">USDA</p>
                    </div>
                    <div className="opacity-40 hover:opacity-80 transition-all cursor-help grayscale hover:grayscale-0">
                       <svg className="h-10 w-auto" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 5C11.7 5 5 11.7 5 20C5 28.3 11.7 35 20 35C28.3 35 35 28.3 35 20" stroke="#E8C547" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M15 20L18.5 23.5L25 17" stroke="#E8C547" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                       <p className="text-[8px] font-bold text-center mt-2 tracking-widest uppercase">ORGANIC</p>
                    </div>
                 </div>
              </div>
           </div>
        </section>

        {/* Compliance Footer */}
        <section className="py-20 border-t border-white/5" style={{ background: tokens.deeper }}>
           <div className="container mx-auto px-6 text-center">
              <p className="max-w-3xl mx-auto text-white/30 text-[11px] font-medium leading-relaxed italic">
                Sharcly products are verified by independent third-party USDA certified laboratories. All products contain less than 0.3% Delta-9 THC by dry weight 
                in accordance with the 2018 Farm Bill. These statements have not been evaluated by the Food and Drug Administration.
              </p>
           </div>
        </section>
      </main>
      <Footer />

      {/* COA MODAL */}
      <AnimatePresence>
        {selectedReport && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedReport(null)}
              className="absolute inset-0 bg-[#040e07]/92 backdrop-blur-xl"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[560px] bg-[#082f1d]/95 border border-[#E8C547]/15 rounded-[24px] shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="p-8 pb-4 flex justify-between items-start">
                <div>
                  <Badge 
                    className="mb-4 text-white border-none font-bold text-[8px] uppercase tracking-[0.2em] px-3"
                    style={{ background: selectedReport.seriesColor }}
                  >
                    {selectedReport.series} Series
                  </Badge>
                  <h3 className="text-4xl font-serif italic text-white leading-tight">{selectedReport.name}</h3>
                </div>
                <button 
                  onClick={() => setSelectedReport(null)}
                  className="size-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 pt-4 space-y-8 overflow-y-auto max-h-[70vh]">
                {/* Summary Table */}
                <div className="rounded-xl border border-white/5 bg-white/[0.02] overflow-hidden">
                  <div className="grid grid-cols-3 p-4 border-b border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/30">
                    <div>Test</div>
                    <div>Date</div>
                    <div className="text-right">Result</div>
                  </div>
                  {selectedReport.tests.map((test, idx) => (
                    <div key={idx} className="grid grid-cols-3 p-4 items-center border-b border-white/5 last:border-0 text-sm">
                      <div className="text-white font-medium">{test.name}</div>
                      <div className="text-white/40 font-mono text-[11px]">{selectedReport.completedDate}</div>
                      <div className="text-right">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#4ade80]/10 text-[#4ade80] text-[10px] font-bold tracking-wider uppercase border border-[#4ade80]/20">
                          {test.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cannabinoid Highlights */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Total THC", value: selectedReport.totalTHC },
                    { label: "Total CBD", value: selectedReport.totalCBD },
                    { label: "Total Cannabinoids", value: selectedReport.totalCannabinoids }
                  ].map((stat, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] text-center">
                      <p className="text-2xl font-serif font-bold text-[#E8C547] mb-1">{stat.value}</p>
                      <p className="text-[9px] font-bold text-white/30 uppercase tracking-[0.15em]">{stat.label}</p>
                    </div>
                  ))}
                </div>

                {/* Lab Details */}
                <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="size-12 bg-white/5 rounded-full flex items-center justify-center">
                      <ShieldCheck className="text-[#E8C547]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{selectedReport.lab}</p>
                      <p className="text-[11px] text-white/40">License: C8-0000059-LIC • Santa Ana, CA</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-6 pt-4 border-t border-white/5">
                    <div>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Sample ID</p>
                      <p className="text-xs font-mono text-white/60">{selectedReport.sampleId}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mb-1">Batch Number</p>
                      <p className="text-xs font-mono text-white/60">{selectedReport.batch}</p>
                    </div>
                  </div>
                </div>

                {/* Footer Signatures */}
                <div className="flex items-center justify-between pt-6 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold text-white/20 uppercase tracking-widest">Signed By</p>
                    <p className="text-[11px] font-bold text-white italic">Jerry White, PhD</p>
                  </div>
                  <a 
                    href={selectedReport.file} 
                    target="_blank"
                    className="h-14 px-10 bg-[#E8C547] text-[#082f1d] rounded-xl font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 hover:bg-[#f0cf55] transition-all shadow-xl shadow-[#E8C547]/10"
                  >
                    Download Full PDF <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
