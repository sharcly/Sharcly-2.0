import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";

import Script from "next/script";

export default function CookiesPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="pt-32 pb-24 md:pt-48 md:pb-32 bg-primary/[0.02]">
           <div className="container mx-auto px-6">
              <div className="max-w-3xl">
                <Badge className="bg-accent/10 text-accent border-none font-black text-[10px] uppercase tracking-widest px-4 mb-8">Consent Management</Badge>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-primary leading-[0.9] mb-8">
                  COOKIE <br/>
                  <span className="text-accent italic font-serif">PREFERENCES</span>.
                </h1>
              </div>
           </div>
        </section>

        <section className="py-24">
           <div className="container mx-auto px-6">
              <div className="bg-white border border-primary/5 rounded-[3rem] p-8 md:p-16 min-h-[600px]">
                <p className="text-center text-primary/40 font-bold mb-10">Managed via Termly Main Account</p>
                <div 
                  data-name="termly-embed" 
                  data-id="YOUR_COOKIES_ID_HERE" 
                  data-type="iframe"
                ></div>
                <Script
                  src="https://app.termly.io/embed-policy.min.js"
                  strategy="afterInteractive"
                />
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
