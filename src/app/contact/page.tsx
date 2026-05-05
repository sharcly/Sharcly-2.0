"use client";

import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  RotateCcw,
  Loader2
} from "lucide-react";
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: ""
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await apiClient.post("/contact", formData);
      toast.success("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#040e07] text-[#eff8ee] selection:bg-[#EBB56B] selection:text-[#040e07]">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Outfit:wght@100..900&display=swap');
        .font-serif { font-family: 'Cormorant Garamond', serif; }
        .font-sans { font-family: 'Outfit', sans-serif; }
      `}} />
      
      {/* Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div 
          className="absolute inset-0"
          style={{ 
            background: "linear-gradient(135deg, #040e07 0%, #082f1d 45%, #051a10 100%)" 
          }} 
        />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#082f1d] rounded-full blur-[120px] opacity-30" />
      </div>

      <Navbar />
      
      <main className="relative z-10 flex-1 pt-32 pb-20">
        {/* Banner Section */}
        <section className="relative py-20 md:py-32 overflow-hidden">
           <div className="container mx-auto px-6 md:px-12 max-w-7xl">
              <div className="max-w-4xl space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Badge className="bg-[#EBB56B]/10 text-[#EBB56B] border border-[#EBB56B]/20 font-bold text-[9px] uppercase tracking-[0.4em] px-5 py-1.5 rounded-full mb-6">
                    Contact Us
                  </Badge>
                  <h1 className="text-5xl md:text-7xl font-serif italic tracking-tight leading-[1.1] mb-6">
                    We&apos;re here <br/> 
                    to <span className="text-[#EBB56B]">Support</span> you.
                  </h1>
                  <p className="text-lg md:text-xl text-[#eff8ee]/40 font-serif italic max-w-xl leading-relaxed">
                    Have a question about our products or your order? Our team is ready to assist you with anything you need.
                  </p>
                </motion.div>
              </div>
           </div>
        </section>

        {/* Contact Info & Form Grid */}
        <section className="pb-32">
          <div className="container mx-auto px-6 md:px-12 max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24">
              
              {/* Info Sidebar */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-4 space-y-12"
              >
                <div className="space-y-10">
                  <div className="flex gap-6 items-start group">
                    <div className="size-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#EBB56B] group-hover:text-[#040e07] transition-all duration-500 shadow-xl">
                      <Mail className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-[#eff8ee]/20 mb-2">Email Address</h3>
                      <p className="font-serif italic text-lg text-[#eff8ee]">support@sharcly.com</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start group">
                    <div className="size-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#EBB56B] group-hover:text-[#040e07] transition-all duration-500 shadow-xl">
                      <Phone className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-[#eff8ee]/20 mb-2">Phone Number</h3>
                      <p className="font-serif italic text-lg text-[#eff8ee]">+1-469-833-2727</p>
                      <p className="text-[9px] font-bold text-[#eff8ee]/30 uppercase tracking-widest mt-1">Mon-Fri · 09:00 - 17:00 CST</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start group">
                    <div className="size-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-[#EBB56B] group-hover:text-[#040e07] transition-all duration-500 shadow-xl">
                      <MapPin className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-black text-[9px] uppercase tracking-[0.3em] text-[#eff8ee]/20 mb-2">Our Office</h3>
                      <p className="font-serif italic text-lg text-[#eff8ee]">Plano, Texas</p>
                      <p className="text-[9px] font-bold text-[#eff8ee]/40 uppercase tracking-widest mt-1">By Appointment Only</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-[#0d2518] border border-white/5 rounded-[2.5rem] text-[#eff8ee] space-y-8 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(235,181,107,0.05),transparent_70%)]" />
                   <h3 className="text-2xl font-serif italic tracking-tight leading-tight relative z-10">Follow our <span className="text-[#EBB56B]">Journey.</span></h3>
                   <div className="flex gap-3 relative z-10">
                      {[Instagram, Twitter, Facebook].map((Icon, i) => (
                        <div key={i} className="size-12 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center hover:bg-[#EBB56B] hover:text-[#040e07] transition-all duration-500 cursor-pointer shadow-lg">
                           <Icon className="size-5" />
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>

              {/* Form Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="lg:col-span-8 bg-[#0d2518] border border-white/5 rounded-[3rem] p-8 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.3)] relative overflow-hidden"
              >
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(235,181,107,0.03),transparent_70%)]" />
                 <div className="relative z-10 space-y-12">
                    <div className="space-y-3">
                       <h2 className="text-3xl md:text-4xl font-serif italic text-[#eff8ee]">Send us a <span className="text-[#EBB56B]">Message.</span></h2>
                       <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-[#eff8ee]/30">We usually respond within 24 hours</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-10">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="space-y-3">
                             <label className="text-[8px] font-black uppercase tracking-[0.3em] text-[#eff8ee]/20 pl-4">Full Name</label>
                             <input 
                               type="text" 
                               value={formData.name}
                               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                               className="w-full h-14 bg-black/20 border border-white/5 rounded-xl px-6 font-serif italic text-lg text-[#eff8ee] outline-none focus:bg-black/40 focus:border-[#EBB56B]/30 transition-all placeholder:text-white/5" 
                               placeholder="Enter your name" 
                               required
                             />
                          </div>
                          <div className="space-y-3">
                             <label className="text-[8px] font-black uppercase tracking-[0.3em] text-[#eff8ee]/20 pl-4">Email Address</label>
                             <input 
                               type="email" 
                               value={formData.email}
                               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                               className="w-full h-14 bg-black/20 border border-white/5 rounded-xl px-6 font-serif italic text-lg text-[#eff8ee] outline-none focus:bg-black/40 focus:border-[#EBB56B]/30 transition-all placeholder:text-white/5" 
                               placeholder="Enter your email" 
                               required
                             />
                          </div>
                       </div>
                       
                       <div className="space-y-3">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-[#eff8ee]/20 pl-4">Subject</label>
                          <div className="relative">
                            <select 
                              value={formData.subject}
                              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                              className="w-full h-14 bg-black/20 border border-white/5 rounded-xl px-6 font-serif italic text-lg text-[#eff8ee] outline-none focus:bg-black/40 focus:border-[#EBB56B]/30 transition-all appearance-none cursor-pointer"
                            >
                               <option className="bg-[#0d2518]">General Inquiry</option>
                               <option className="bg-[#0d2518]">Order Support</option>
                               <option className="bg-[#0d2518]">Wholesale Partnership</option>
                               <option className="bg-[#0d2518]">Press & Media</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-[#EBB56B]">
                               <ArrowRight className="size-3.5 rotate-90" />
                            </div>
                          </div>
                       </div>

                       <div className="space-y-3">
                          <label className="text-[8px] font-black uppercase tracking-[0.3em] text-[#eff8ee]/20 pl-4">Your Message</label>
                          <textarea 
                            rows={5} 
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-black/20 border border-white/5 rounded-[2rem] p-6 font-serif italic text-lg text-[#eff8ee] outline-none focus:bg-black/40 focus:border-[#EBB56B]/30 transition-all resize-none placeholder:text-white/5" 
                            placeholder="How can we help you?"
                            required
                          ></textarea>
                       </div>

                       <Button 
                         type="submit"
                         disabled={loading}
                         className="h-16 px-12 bg-[#EBB56B] text-[#040e07] font-black uppercase tracking-[0.3em] text-[9px] rounded-full group w-full md:w-auto hover:bg-[#eff8ee] transition-all shadow-2xl shadow-[#EBB56B]/20"
                       >
                          {loading ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <>
                              Send Message <Send className="ml-2.5 size-3.5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                            </>
                          )}
                       </Button>
                    </form>
                 </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Global Support Features */}
        <section className="pb-32">
           <div className="container mx-auto px-6 md:px-12 max-w-7xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                 {[
                   { icon: Clock, title: "Fast Support", desc: "Response under 24 hours." },
                   { icon: MessageSquare, title: "Helpful Team", desc: "Ready to assist you." },
                   { icon: RotateCcw, title: "Easy Returns", desc: "30-day return policy." }
                 ].map((feature, i) => (
                   <motion.div 
                     key={i}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: i * 0.1 }}
                     className="p-10 border border-white/5 rounded-[3rem] text-center flex flex-col items-center bg-white/2 hover:bg-white/5 transition-all group"
                   >
                      <div className="size-16 rounded-2xl bg-[#0d2518] flex items-center justify-center text-[#EBB56B] mb-8 group-hover:scale-110 transition-transform shadow-2xl">
                        <feature.icon className="size-7" />
                      </div>
                      <h3 className="font-serif italic text-2xl text-[#eff8ee] mb-3">{feature.title}</h3>
                      <p className="text-[10px] font-bold text-[#eff8ee]/30 uppercase tracking-[0.2em]">{feature.desc}</p>
                   </motion.div>
                 ))}
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
