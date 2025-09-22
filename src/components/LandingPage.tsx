import { WebGLShader } from "@/components/ui/web-gl-shader";
import WebGLErrorBoundary from "@/components/ui/WebGLErrorBoundary";
import { Footer } from "@/components/ui/footer";
import { WaitlistModal } from "@/components/ui/waitlist-modal";
import { DemoModal } from "@/components/ui/demo-modal";
import { ChevronDown, Twitter, Linkedin } from "lucide-react";
import { useState } from "react";

const LandingPage = () => {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);

  const scrollToContent = () => {
    const contentSection = document.getElementById('content-section');
    if (contentSection) {
      contentSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative w-full overflow-hidden bg-background">
      <WebGLErrorBoundary>
        <WebGLShader />
      </WebGLErrorBoundary>

      {/* Hero Section - Full Viewport Height */}
      <section className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6">
        <div className="text-center space-y-4">
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl tracking-tighter text-white drop-shadow-2xl font-bold lg:text-8xl">
              Criticus AI
            </h1>
            <p className="max-w-3xl mx-auto text-lg md:text-xl lg:text-2xl text-white/80 font-medium">
              Redefining Education - where artificial intelligence meets authentic learning.
            </p>
          </div>

          {/* Status Indicator */}
          <div className="flex items-center justify-center gap-3 py-4">
            <span className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ai-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-ai-primary"></span>
            </span>
            <p className="text-sm text-ai-primary font-semibold tracking-wide uppercase">Launching July 2026</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center gap-3 pt-4">
            <button
              onClick={() => setIsWaitlistModalOpen(true)}
              className="text-white text-lg font-semibold tracking-wide bg-transparent border-2 border-white/30 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 px-6 py-2"
            >
              Join Waitlist
            </button>
            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="text-white text-lg font-semibold tracking-wide bg-transparent border-2 border-white/30 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 px-6 py-2"
            >
              Book a demo
            </button>
          </div>
        </div>

        {/* Scroll Down Arrow */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white/60 hover:text-white transition-all duration-300"
          aria-label="Scroll to content"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Content Section */}
      <section id="content-section" className="relative z-10 w-full">
        <div className="w-full mx-auto max-w-6xl px-6">
          <main className="relative py-20">
            {/* Our Mission Section */}
            <div className="max-w-4xl mx-auto text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-12 tracking-tight text-center">
                Our Mission
              </h2>
              <div className="space-y-8 text-lg md:text-xl text-white/90 leading-relaxed">
                <p>
                  Criticus AI is an artificial intelligence research and product company that specializes in building institution-grade AI for education use cases. We are building a future where educators and students can leverage the power of AI while maintaining alignment with their core educational values.
                </p>
                <p>
                  Although AI advancements have been occurring at light-speed for the past half-decade, there are still key flaws in many areas, leaving gaps in the market that slow-down the development of AI tools for specific use-cases. The education system's understanding of these advancements lags behind the rapidly accelerating capabilities of this technology - leaving educators and students stuck in a place of uncertainty. Although resources like Large Language Models can be used in the educational environment, the lack of deep personalization paired with the misalignment of fundamental education values creates major difficulty in implementation. To bridge this gap, we are building Criticus AI to make AI systems that are trustworthy, value-aligned, and classroom-ready.
                </p>
                <p className="text-xl md:text-2xl font-semibold text-white pt-4">
                  At Criticus AI, we have a singular goal - redefine the way students interface with AI, setting a precedent that the AI learning environment needs to be based on building critical thinking skills instead of replacing them - full stop.
                </p>

                <div className="space-y-6 pt-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                    Critical Thinking is Paramount
                  </h3>
                  <p>
                    <em>Critical Thinking as a foundational pillar.</em> Many of the current AI tools students utilize to help with their studies operate almost antithetically to education's core process. With nuanced, domain-specific AI tutors, we aim to replace the simple "Ask question, get answer" paradigm with an educational experience that values the student's well being by building reasoning and inference skills around their specific content.
                  </p>
                  <p>
                    <em>The student experience.</em> Although general Large Language Models are easy to use, students are quickly realizing that these AI tools are not helping or, in some cases, are negatively impacting their long-term cognitive capacity. Building an alternative AI tool for students that allows them to leverage the power of AI without the detriment of their learning capabilities is crucial to student success.
                  </p>
                </div>

                <div className="space-y-6 pt-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                    Personalized AI that works for everyone
                  </h3>
                  <p>
                    <em>Value of human-AI collaboration.</em> We know that teachers and professors are the true superstars in education. Our goal is not to replace them but instead to supplement their native processes with personalized, collaborative multimodal systems that serve their specific needs.
                  </p>
                  <p>
                    <em>Student and Educator-specific AI.</em> We recognize enormous potential for AI's integration into education. While there are some point-solutions that add value here and there, we aim to build an AI-driven education ecosystem that encompasses all the tools a student or educator will need at a personalized level.
                  </p>
                </div>

                <div className="space-y-6 pt-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                    Building for the Future
                  </h3>
                  <p>
                    <em>Knowledge transfer is no longer education's primary goal.</em> With any piece of information readily available within seconds, simply passing along knowledge to students should no longer be the main metric of education. The value will now be in a student's capacity to think critically, creatively, and innovatively to keep up with the rapid pace of advancements and solve the problems that will come with that exponential scale.
                  </p>
                  <p>
                    <em>Focus on what truly matters.</em> We'll spend time focusing on building with integrity-first principles to help provide our collaborators with real-time value in the present and a research-backed plan for the future. Our efforts here will allow educators and students alike to focus on what matters most, teaching and becoming the next generation of innovative minds that will power an incredible future.
                  </p>
                </div>

                <div className="space-y-6 pt-8">
                  <h3 className="text-2xl md:text-3xl font-bold text-white text-center">
                    Join us
                  </h3>
                  <p>
                    We are building education-first AI that delivers first-in-class assistance to educators and an effective educational experience to students. Our goal is to combine cutting-edge engineering, meticulous research, and boundless creativity to bring forth the next generation of educational tools, and we're looking for collaborators to help us bring this vision to life.
                  </p>
                  <p>
                    Follow along with our Newsletters for updates along the way and join the waitlist if you are a student excited for our platform drop!
                  </p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </section>

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-background/60 pointer-events-none"></div>

      {/* Footer */}
      <div className="relative z-10">
        <Footer
          logo={<></>}
          brandName="Criticus AI"
          socialLinks={[
            {
              icon: <Twitter className="h-5 w-5" />,
              href: "https://twitter.com",
              label: "Twitter",
            },
            {
              icon: <Linkedin className="h-5 w-5" />,
              href: "https://linkedin.com",
              label: "LinkedIn",
            },
          ]}
          mainLinks={[
            { href: "/about", label: "About" },
            { href: "/contact", label: "Contact" },
            { href: "/blog", label: "Blog" },
            { href: "/careers", label: "Careers" },
          ]}
          legalLinks={[
            { href: "/privacy", label: "Privacy Policy" },
            { href: "/terms", label: "Terms of Service" },
            { href: "/cookies", label: "Cookie Policy" },
          ]}
          copyright={{
            text: "© 2025 Criticus AI",
            license: "All rights reserved",
          }}
        />
      </div>

      {/* Waitlist Modal */}
      <WaitlistModal
        open={isWaitlistModalOpen}
        onOpenChange={setIsWaitlistModalOpen}
      />

      {/* Demo Modal */}
      <DemoModal
        open={isDemoModalOpen}
        onOpenChange={setIsDemoModalOpen}
      />
    </div>
  );
};

export default LandingPage;