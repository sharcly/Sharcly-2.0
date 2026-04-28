import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Beaker, 
  ShieldCheck, 
  Search, 
  ClipboardCheck,
  FileText,
  Microscope,
  Database,
  ArrowRight
} from "lucide-react";
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
    <>
      <Navbar />
      <main className="flex-1">
        {/* Banner */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-40 overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-primary/[0.02]" />
          <div className="container mx-auto px-6">
            <div className="max-w-4xl">
              <Badge className="bg-accent/10 text-accent border-none font-black text-[10px] uppercase tracking-widest px-4 mb-8">Quality Assurance</Badge>
              <h1 className="text-6xl md:text-9xl font-black tracking-tighter text-primary leading-[0.85] mb-12">
                TRANSPARENCY <br/>
                <span className="text-accent italic font-serif">THROUGH</span> TESTING.
              </h1>
              <p className="text-xl md:text-2xl text-foreground/70 leading-relaxed font-medium max-w-2xl">
                Every gummy we bottle is backed by rigorous third-party laboratory verification. 
                What's on the label is exactly what's in the bottle.
              </p>
            </div>
          </div>
        </section>

        {/* Three-Stage Protocol */}
        <section className="py-32 bg-primary">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-24">
              <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-cream mb-8 uppercase">THE THREE-STAGE PROTOCOL.</h2>
              <p className="text-cream/60 text-lg font-medium leading-relaxed">
                Our safety standards go beyond industry requirements. We verify our product at every critical 
                intersection of the manufacturing process to ensure absolute consistency.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {protocol.map((step, i) => (
                <div key={i} className="p-12 bg-white/5 border border-white/10 rounded-[3rem] hover:bg-white/10 transition-all flex flex-col group">
                  <div className="h-16 w-16 bg-accent/20 rounded-2xl flex items-center justify-center mb-10 group-hover:scale-110 transition-transform">
                    <step.icon className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-3xl font-black tracking-tight text-cream mb-6">{step.title}</h3>
                  <p className="text-cream/60 font-medium leading-relaxed mb-10 flex-1">{step.desc}</p>
                  <div className="space-y-3 pt-6 border-t border-white/10">
                    {step.points.map((point, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="h-1 w-1 rounded-full bg-accent" />
                        <span className="text-[11px] font-black uppercase tracking-widest text-cream/40">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search / COA Section */}
        <section className="py-32">
          <div className="container mx-auto px-6">
            <div className="bg-primary/[0.02] border border-primary/5 rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center gap-20">
              <div className="lg:w-1/2 space-y-10">
                <Badge className="bg-primary/10 text-primary border-none font-black text-[9px] uppercase tracking-widest px-3">Batch Verification</Badge>
                <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-primary leading-none">VERIFY YOUR BATCH.</h2>
                <p className="text-foreground/60 text-lg font-medium leading-relaxed">
                  Enter your batch number found on the bottom of your bottle to view the full Certificate of Analysis (COA) for that specific production run.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input 
                    type="text" 
                    placeholder="Enter Batch ID (e.g. SC-1025)" 
                    className="flex-1 h-16 rounded-2xl border border-primary/10 bg-white px-6 font-bold focus:ring-4 focus:ring-primary/5 outline-none transition-all"
                  />
                  <Button className="h-16 px-10 premium-gradient font-black uppercase tracking-widest text-xs rounded-2xl">
                    View Results
                  </Button>
                </div>
              </div>
              <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                 <div className="aspect-square bg-white rounded-[2.5rem] border border-primary/5 p-10 flex flex-col justify-between group cursor-pointer hover:border-accent/30 transition-all">
                    <FileText className="h-10 w-10 text-primary/20 group-hover:text-accent transition-colors" />
                    <p className="font-black text-xs uppercase tracking-widest text-primary/60">Sample COA</p>
                 </div>
                 <div className="aspect-square bg-white rounded-[2.5rem] border border-primary/5 p-10 flex flex-col justify-between group cursor-pointer hover:border-accent/30 transition-all translate-y-12">
                    <ShieldCheck className="h-10 w-10 text-primary/20 group-hover:text-accent transition-colors" />
                    <p className="font-black text-xs uppercase tracking-widest text-primary/60">Lab Credentials</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Footer */}
        <section className="py-20 border-t border-primary/5">
           <div className="container mx-auto px-6 text-center">
              <p className="max-w-3xl mx-auto text-foreground/40 text-sm font-medium leading-relaxed">
                Scarly products are verified by third-party USDA certified laboratories. All products contain less than 0.3% Delta-9 THC by dry weight 
                in accordance with the 2018 Farm Bill. These statements have not been evaluated by the Food and Drug Administration.
              </p>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
