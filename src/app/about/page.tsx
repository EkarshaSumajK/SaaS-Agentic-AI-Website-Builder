import React from "react";
import { Navbar } from "@/app/(home)/navbar";
import { 
  Sparkles, 
  Zap, 
  Code2, 
  Palette, 
  Rocket, 
  Shield, 
  Users, 
  Globe,
  ArrowRight,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Generation",
      description: "Advanced AI models understand your vision and turn ideas into production-ready code in minutes."
    },
    {
      icon: Code2,
      title: "Clean Code Output",
      description: "Get well-structured, TypeScript-first code following industry best practices and standards."
    },
    {
      icon: Palette,
      title: "Modern UI Components",
      description: "Built-in Shadcn UI components with beautiful, accessible, and customizable designs."
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Powered by E2B sandboxes with hot reload, your projects are generated and ready in seconds."
    },
    {
      icon: Shield,
      title: "Secure & Isolated",
      description: "Each project runs in its own secure sandbox environment, ensuring safety and reliability."
    },
    {
      icon: Globe,
      title: "Instant Preview",
      description: "See your website live instantly with real-time previews and instant deployment capabilities."
    }
  ];

  const useCases = [
    "Landing Pages & Marketing Sites",
    "Dashboards & Analytics Platforms",
    "E-commerce Storefronts",
    "Portfolio & Personal Websites",
    "SaaS Application Prototypes",
    "Admin Panels & Internal Tools"
  ];

  const techStack = [
    { name: "Next.js 15", description: "React framework with App Router" },
    { name: "TypeScript", description: "Type-safe development" },
    { name: "Tailwind CSS", description: "Utility-first styling" },
    { name: "Shadcn UI", description: "Beautiful components" },
    { name: "Gemini AI", description: "Advanced AI generation" },
    { name: "E2B Sandboxes", description: "Secure execution environment" }
  ];

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f3dbc]/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px]" />
        
        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-gray-300">Powered by Advanced AI</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-blue-100 to-white">
              About Lumina
            </h1>
            
            <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
              The AI-powered website builder that transforms your ideas into production-ready applications in minutes, not days.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl font-bold">Our Mission</h2>
              <div className="space-y-4 text-gray-300 leading-relaxed">
                <p>
                  Lumina is built on the belief that creating beautiful, functional websites should be accessible to everyone—from seasoned developers to first-time builders.
                </p>
                <p>
                  We harness the power of advanced AI models to understand your vision and generate production-quality code that follows modern best practices. No more wrestling with boilerplate code or design decisions.
                </p>
                <p>
                  Whether you're prototyping a SaaS idea, building a landing page, or creating a complex dashboard, Lumina streamlines the development process so you can focus on what truly matters: bringing your vision to life.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-[#1f3dbc]/20 via-purple-500/10 to-transparent border border-white/10 p-8 backdrop-blur-sm">
                <div className="grid grid-cols-2 gap-4 h-full">
                  {[Rocket, Users, Shield, Globe].map((Icon, i) => (
                    <div 
                      key={i}
                      className="rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Icon className="w-12 h-12 text-blue-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features</h2>
            <p className="text-gray-400 text-lg">Everything you need to build amazing websites</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] hover:border-white/20 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built With Modern Technology</h2>
            <p className="text-gray-400 text-lg">Powered by industry-leading tools and frameworks</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {techStack.map((tech, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-white/[0.02] border border-white/10 hover:border-blue-500/50 transition-all"
              >
                <h3 className="text-lg font-semibold text-blue-400 mb-1">{tech.name}</h3>
                <p className="text-sm text-gray-400">{tech.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-20 px-4 bg-gradient-to-b from-white/[0.02] to-transparent">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perfect For Any Project</h2>
            <p className="text-gray-400 text-lg">From simple landing pages to complex applications</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
            {useCases.map((useCase, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/10 hover:bg-white/[0.05] transition-colors"
              >
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-gray-300">{useCase}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
            
            <div className="relative p-12 text-center space-y-6">
              <h2 className="text-4xl font-bold">Ready to Build Something Amazing?</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Join thousands of developers and creators using Lumina to bring their ideas to life faster than ever.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/">
                  <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full px-8 group">
                    Get Started
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/projects">
                  <Button size="lg" variant="outline" className="rounded-full px-8 border-white/20 hover:bg-white/10">
                    View Projects
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Stats */}
      <section className="py-12 px-4 border-t border-white/10">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
              <div className="text-sm text-gray-400">Uptime</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">&lt;60s</div>
              <div className="text-sm text-gray-400">Generation Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">100%</div>
              <div className="text-sm text-gray-400">Type Safe</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-400 mb-2">24/7</div>
              <div className="text-sm text-gray-400">Available</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
