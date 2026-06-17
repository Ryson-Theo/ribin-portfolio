import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/about";
import Experience from "@/components/sections/experience";
import Projects from "@/components/sections/projects";
import Designs from "@/components/sections/designs";
import Research from "@/components/sections/research";
import Contact from "@/components/sections/Contact";
import Expertise from "@/components/sections/expertise";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main className="w-full bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      {/* overflow-x-clip prevents horizontal scroll without breaking mobile vertical touch */}
      <div className="relative w-full overflow-x-clip flex flex-col">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Designs />
        <Research />
        <Contact />
        <Expertise />
        <Footer />
      </div>
    </main>
  );
}