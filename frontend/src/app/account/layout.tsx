import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-white text-[#062D1B] font-sans antialiased selection:bg-[#062D1B] selection:text-white">
      <Navbar />
      <main className="flex-1 pt-32 pb-20 container mx-auto px-6 md:px-12 max-w-5xl">
        {children}
      </main>
      <Footer />
    </div>
  );
}
