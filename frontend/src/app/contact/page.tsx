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
  RotateCcw
} from "lucide-react";

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Banner Section */}
        <section className="relative pt-32 pb-24 md:pt-48 md:pb-32 overflow-hidden bg-primary/[0.02]">
           <div className="container mx-auto px-6">
              <div className="max-w-3xl">
                <Badge className="bg-accent/10 text-accent border-none font-black text-[10px] uppercase tracking-widest px-4 mb-8">Get In Touch</Badge>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-primary leading-[0.9] mb-8">
                  WE&apos;RE HERE <br/>
                  <span className="text-accent italic font-serif">TO HELP</span> YOU.
                </h1>
                <p className="text-xl text-foreground/60 font-medium">
                  Have a question about a product, your order, or wholesale? Our team is ready to assist.
                </p>
              </div>
           </div>
        </section>

        {/* Contact Info Grid */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
              
              {/* Info Sidebar */}
              <div className="lg:col-span-4 space-y-12">
                <div className="space-y-10">
                  <div className="flex gap-6 items-start">
                    <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-widest text-primary/40 mb-2">Email Us</h3>
                      <p className="font-bold text-lg text-primary">support@sharcly.com</p>
                      <p className="font-bold text-lg text-accent">returns@sharcly.com</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-widest text-primary/40 mb-2">Call Us</h3>
                      <p className="font-bold text-lg text-primary">+1-469-833-2727</p>
                      <p className="text-sm font-medium text-foreground/40 mt-1">Mon-Fri, 9am - 5pm CST</p>
                    </div>
                  </div>

                  <div className="flex gap-6 items-start">
                    <div className="h-12 w-12 bg-primary/5 rounded-2xl flex items-center justify-center shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-black text-xs uppercase tracking-widest text-primary/40 mb-2">Office</h3>
                      <p className="font-bold text-lg text-primary">Plano, Texas</p>
                      <p className="text-sm font-medium text-foreground/40 mt-1">HQ - By Appointment Only</p>
                    </div>
                  </div>
                </div>

                <div className="p-10 bg-primary rounded-[2.5rem] text-cream space-y-8">
                   <h3 className="text-2xl font-black tracking-tight leading-tight">FOLLOW OUR JOURNEY.</h3>
                   <div className="flex gap-4">
                      <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                         <Instagram className="h-5 w-5" />
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                         <Twitter className="h-5 w-5" />
                      </div>
                      <div className="h-12 w-12 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                         <Facebook className="h-5 w-5" />
                      </div>
                   </div>
                </div>
              </div>

              {/* Form Section */}
              <div className="lg:col-span-8 bg-primary/[0.01] border border-primary/5 rounded-[3rem] p-8 md:p-16">
                 <h2 className="text-3xl font-black tracking-tight text-primary mb-12">SEND A MESSAGE.</h2>
                 <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 pl-4">Full Name</label>
                          <input type="text" className="w-full h-14 bg-white border border-primary/5 rounded-2xl px-6 font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="John Doe" />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 pl-4">Email Address</label>
                          <input type="email" className="w-full h-14 bg-white border border-primary/5 rounded-2xl px-6 font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all" placeholder="john@example.com" />
                       </div>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 pl-4">Subject</label>
                       <select className="w-full h-14 bg-white border border-primary/5 rounded-2xl px-6 font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all appearance-none cursor-pointer">
                          <option>General Inquiry</option>
                          <option>Order Support</option>
                          <option>Wholesale Partnership</option>
                          <option>Press & Media</option>
                       </select>
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black uppercase tracking-widest text-primary/40 pl-4">Your Message</label>
                       <textarea rows={6} className="w-full bg-white border border-primary/5 rounded-3xl p-6 font-bold outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none" placeholder="How can we help you?"></textarea>
                    </div>
                    <Button className="h-16 px-12 premium-gradient font-black uppercase tracking-widest text-xs rounded-2xl group w-full md:w-auto">
                       Send Message <Send className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    </Button>
                 </form>
              </div>

            </div>
          </div>
        </section>

        {/* Global Support Banner */}
        <section className="pb-32">
           <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                 <div className="p-8 border border-primary/5 rounded-3xl text-center flex flex-col items-center">
                    <Clock className="h-8 w-8 text-accent mb-6" />
                    <h3 className="font-black text-xs uppercase tracking-widest mb-2">Fast Response</h3>
                    <p className="text-foreground/40 font-medium">Under 24 hour response time.</p>
                 </div>
                 <div className="p-8 border border-primary/5 rounded-3xl text-center flex flex-col items-center">
                    <MessageSquare className="h-8 w-8 text-accent mb-6" />
                    <h3 className="font-black text-xs uppercase tracking-widest mb-2">Live Chat</h3>
                    <p className="text-foreground/40 font-medium">Available during business hours.</p>
                 </div>
                 <div className="p-8 border border-primary/5 rounded-3xl text-center flex flex-col items-center">
                    <RotateCcw className="h-8 w-8 text-accent mb-6" />
                    <h3 className="font-black text-xs uppercase tracking-widest mb-2">Easy Returns</h3>
                    <p className="text-foreground/40 font-medium">30-day no-hassle policy.</p>
                 </div>
              </div>
           </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
