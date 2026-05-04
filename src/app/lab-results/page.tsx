"use client";

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
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function LabResultsPage() {
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
    <div className="min-h-screen bg-[#FDFDFB]">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
      `}} />
      
      <Navbar />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-[#062D1B]">
          <div 
            className="absolute inset-0 opacity-10 mix-blend-overlay"
            style={{ 
              backgroundImage: 'url("https://i.postimg.cc/0y2xqZs9/Sunlit-forest-path-with-wooden-platform.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#062D1B]/50 via-[#062D1B] to-[#062D1B]" />
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <Badge className="bg-[#EBB56B]/10 text-[#EBB56B] border border-[#EBB56B]/20 font-bold text-[10px] uppercase tracking-[0.3em] px-4 py-1 mb-8 rounded-full">
                  Laboratory Verification
                </Badge>
                <h1 className="text-6xl md:text-8xl font-serif italic text-white leading-[1.1] mb-12">
                  Transparency <br/>
                  <span className="text-[#EBB56B]">Through</span> Precision.
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
        <section className="py-12 border-b border-gray-100">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { label: "Lab Tests", value: "100%", sub: "Every Batch Verified" },
                { label: "Purity", value: "0.0%", sub: "Heavy Metals Detected" },
                { label: "Certification", value: "USDA", sub: "Organic Standards" },
                { label: "Standards", value: "GMP", sub: "Certified Facility" }
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-3xl font-bold text-[#062D1B]">{stat.value}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#062D1B]/40">{stat.label}</p>
                  <p className="text-[10px] font-medium text-[#EBB56B] italic">{stat.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Three-Stage Protocol */}
        <section className="py-32 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-24">
              <Badge className="bg-[#062D1B]/5 text-[#062D1B] border-none font-bold text-[9px] uppercase tracking-[0.3em] px-4 mb-6">Our Process</Badge>
              <h2 className="text-5xl md:text-6xl font-serif text-[#062D1B] italic mb-8">The Three-Stage Protocol.</h2>
              <p className="text-gray-500 text-lg font-medium leading-relaxed">
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
                  className="p-10 bg-[#FDFDFB] border border-gray-100 rounded-[2.5rem] hover:border-[#EBB56B]/30 hover:shadow-[0_20px_50px_rgba(235,181,107,0.1)] transition-all flex flex-col group relative"
                >
                  <div className="absolute top-8 right-8 text-[#062D1B]/5 font-serif italic text-6xl group-hover:text-[#EBB56B]/10 transition-colors">
                    0{i + 1}
                  </div>
                  <div className="size-16 bg-[#062D1B] rounded-2xl flex items-center justify-center mb-10 shadow-lg shadow-[#062D1B]/10 group-hover:scale-110 transition-transform">
                    <step.icon className="h-7 w-7 text-[#EBB56B]" />
                  </div>
                  <h3 className="text-3xl font-serif text-[#062D1B] italic mb-6">{step.title}</h3>
                  <p className="text-gray-500 font-medium leading-relaxed mb-10 flex-1">{step.desc}</p>
                  <div className="space-y-3 pt-6 border-t border-gray-100">
                    {step.points.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <CheckCircle2 size={12} className="text-[#00C853]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{point}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Search / COA Section */}
        <section className="py-32 bg-[#FDFDFB]">
          <div className="container mx-auto px-6">
            <div className="bg-[#062D1B] rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden">
              <div 
                className="absolute inset-0 opacity-5"
                style={{ 
                  backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                  backgroundSize: '32px 32px'
                }}
              />
              
              <div className="lg:w-1/2 space-y-10 relative z-10">
                <Badge className="bg-[#EBB56B]/10 text-[#EBB56B] border border-[#EBB56B]/20 font-bold text-[9px] uppercase tracking-[0.3em] px-3">Batch Verification</Badge>
                <h2 className="text-5xl md:text-7xl font-serif text-white italic leading-none">Verify Your <span className="text-[#EBB56B]">Batch.</span></h2>
                <p className="text-white/60 text-lg font-medium leading-relaxed max-w-lg">
                  Enter your batch number found on the bottom of your bottle to view the full Certificate of Analysis (COA) for that specific production run.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md">
                  <Input 
                    type="text" 
                    placeholder="e.g. SC-1025" 
                    className="h-16 rounded-full border-white/10 bg-white/5 text-white placeholder:text-white/20 px-8 font-bold focus:ring-4 focus:ring-[#EBB56B]/10 outline-none transition-all"
                  />
                  <Button className="h-16 px-10 bg-[#EBB56B] hover:bg-[#d4a259] text-[#062D1B] font-bold uppercase tracking-widest text-xs rounded-full shadow-xl shadow-[#EBB56B]/10">
                    View Results
                  </Button>
                </div>
              </div>

              <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                 <div className="p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group cursor-pointer hover:border-[#EBB56B]/30 transition-all">
                    <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-[#EBB56B]/10 transition-colors">
                       <FileText className="h-7 w-7 text-white/40 group-hover:text-[#EBB56B] transition-colors" />
                    </div>
                    <div>
                       <p className="font-serif text-2xl text-white italic mb-2">Sample COA</p>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-[#EBB56B] transition-colors flex items-center gap-2">
                          View PDF <ArrowUpRight size={12} />
                       </p>
                    </div>
                 </div>
                 <div className="p-10 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 group cursor-pointer hover:border-[#EBB56B]/30 transition-all sm:translate-y-12">
                    <div className="size-14 bg-white/5 rounded-2xl flex items-center justify-center mb-12 group-hover:bg-[#00C853]/10 transition-colors">
                       <ShieldCheck className="h-7 w-7 text-white/40 group-hover:text-[#00C853] transition-colors" />
                    </div>
                    <div>
                       <p className="font-serif text-2xl text-white italic mb-2">Credentials</p>
                       <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 group-hover:text-[#00C853] transition-colors flex items-center gap-2">
                          Verified <ArrowUpRight size={12} />
                       </p>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Security Trust Section */}
        <section className="py-24 border-t border-gray-100">
           <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-12 bg-[#062D1B]/5 rounded-[3rem] p-12">
                 <div className="flex items-center gap-8">
                    <div className="size-20 bg-white rounded-full flex items-center justify-center shadow-sm">
                       <Lock size={32} className="text-[#062D1B]" />
                    </div>
                    <div>
                       <h4 className="text-2xl font-serif text-[#062D1B] italic">End-to-End Encryption</h4>
                       <p className="text-gray-500 font-medium">All laboratory data is securely stored and tamper-proof.</p>
                    </div>
                 </div>
                 <div className="flex gap-4">
                    <img src="https://img.icons8.com/color/48/000000/us-shield.png" alt="USDA" className="h-10 w-auto opacity-50 grayscale hover:grayscale-0 transition-all" />
                    <img src="https://img.icons8.com/color/48/000000/leaf.png" alt="Organic" className="h-10 w-auto opacity-50 grayscale hover:grayscale-0 transition-all" />
                 </div>
              </div>
           </div>
        </section>

        {/* Compliance Footer */}
        <section className="py-20 bg-white">
           <div className="container mx-auto px-6 text-center">
              <p className="max-w-3xl mx-auto text-gray-400 text-xs font-medium leading-relaxed italic">
                Sharcly products are verified by independent third-party USDA certified laboratories. All products contain less than 0.3% Delta-9 THC by dry weight 
                in accordance with the 2018 Farm Bill. These statements have not been evaluated by the Food and Drug Administration.
              </p>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
