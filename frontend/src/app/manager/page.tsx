import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Package, 
  MessageSquare, 
  BookOpen, 
  TrendingUp,
  ChevronRight,
  Clock,
  CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function ManagerPage() {
  const stats = [
    { title: "Orders Managed", value: "324", icon: Package, trend: "+5.1%", color: "bg-blue-500", light: "bg-blue-500/10", text: "text-blue-500" },
    { title: "Customer Inquiries", value: "12", icon: MessageSquare, trend: "-2.4%", color: "bg-emerald-500", light: "bg-emerald-500/10", text: "text-emerald-500" },
    { title: "Total Blogs", value: "24", icon: BookOpen, trend: "+2", color: "bg-purple-500", light: "bg-purple-500/10", text: "text-purple-500" },
    { title: "Review Score", value: "4.8/5", icon: TrendingUp, trend: "+0.1", color: "bg-orange-500", light: "bg-orange-500/10", text: "text-orange-500" },
  ];

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-4xl font-heading font-normal tracking-tight text-black">Manager Overview</h1>
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-black/30 mt-3">Store operations & synchronization</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="rounded-[2.5rem] bg-white border-black/5 shadow-sm overflow-hidden group">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-8 pt-8 px-8">
                <div className={cn("size-12 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform duration-500 group-hover:scale-110", stat.color)}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className={cn("px-3 py-1 rounded-full border border-black/5 text-[10px] font-black", stat.light, stat.text)}>
                  {stat.trend}
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <div className="text-3xl font-heading font-normal tracking-tight text-black">{stat.value}</div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-black/20 mt-2">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 rounded-[2.5rem] bg-white border-black/5 shadow-sm overflow-hidden">
          <CardHeader className="p-10 border-b border-black/5 bg-black/[0.01]">
            <CardTitle className="text-xl font-heading font-normal text-black">Administrative Pipeline</CardTitle>
            <CardDescription className="text-[10px] text-black/30 font-black uppercase tracking-[0.3em]">Critical tasks requiring synchronization</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-black/5">
              <div className="p-8 flex items-center justify-between group cursor-pointer hover:bg-black/[0.01] transition-all">
                <div className="flex items-center gap-6">
                  <div className="size-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-black group-hover:text-blue-600 transition-colors">Verify 5 new product additions</p>
                    <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">Priority: High • Queue: Delta</p>
                  </div>
                </div>
                <Button variant="ghost" className="rounded-xl px-10 h-11 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 group-hover:text-black">
                  Approve <ChevronRight className="ml-3 h-3 w-3" />
                </Button>
              </div>

              <div className="p-8 flex items-center justify-between group cursor-pointer hover:bg-black/[0.01] transition-all">
                <div className="flex items-center gap-6">
                  <div className="size-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-bold text-black group-hover:text-blue-600 transition-colors">Spring Trends Blog Review</p>
                    <p className="text-[10px] font-black text-black/20 uppercase tracking-[0.2em]">Priority: Medium • Queue: Content</p>
                  </div>
                </div>
                <Button variant="ghost" className="rounded-xl px-10 h-11 text-[10px] font-black uppercase tracking-[0.3em] text-black/20 group-hover:text-black">
                  Review <ChevronRight className="ml-3 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-4 rounded-[2.5rem] bg-black text-white border-transparent shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10">
             <CheckCircle2 className="size-12 text-white/10" />
          </div>
          <CardHeader className="p-10 pb-6">
             <CardTitle className="text-xl font-heading font-normal">System Readiness</CardTitle>
             <CardDescription className="text-[10px] text-white/40 font-black uppercase tracking-[0.3em]">Operational status report</CardDescription>
          </CardHeader>
          <CardContent className="p-10 pt-4 space-y-10">
             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Inventory Sync</p>
                   <p className="text-xl font-heading italic">Active</p>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "100%" }}
                     transition={{ duration: 1.5 }}
                     className="h-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)]" 
                   />
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">Auth Gateway</p>
                   <p className="text-xl font-heading italic">Secure</p>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                   <motion.div 
                     initial={{ width: 0 }}
                     animate={{ width: "85%" }}
                     transition={{ duration: 1.5, delay: 0.2 }}
                     className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                   />
                </div>
             </div>

             <Button className="w-full h-14 rounded-2xl bg-white text-black font-black text-[10px] uppercase tracking-[0.4em] hover:bg-emerald-500 hover:text-white transition-all">
                Generate Full Audit
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

