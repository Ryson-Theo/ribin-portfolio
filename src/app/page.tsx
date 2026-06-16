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
    <main
      className="
        min-h-screen
        bg-black
        text-white
        overflow-x-hidden
      "
    >
      <Navbar />

      <Hero />
      <About />
      <Experience />
      <Projects />
      <Designs />
      <Research />
      <Contact />
      <Expertise />
      <Footer />

    </main>
  );
}