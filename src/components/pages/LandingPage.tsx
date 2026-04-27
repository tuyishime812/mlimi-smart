import { useState } from "react";
import { Sprout, Cloud, Image, TrendingUp, MessageSquare, Menu, X, ArrowRight, Check, Zap, Shield, Globe, Sun, Moon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/context/ThemeContext";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                <Sprout className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Mlimi Smart
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                Benefits
              </a>
              <Link to="/app" className="inline-flex items-center gap-2 shadow-lg hover:shadow-xl transition-all rounded-md px-4 py-2 text-sm bg-gradient-to-r from-primary to-accent text-white">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Desktop theme toggle + Mobile Menu Button */}
            <div className="flex items-center gap-2">
              <button onClick={toggleTheme} className="hidden md:inline-flex p-2 rounded-md hover:bg-muted/10" aria-label="Toggle theme">
                {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-4 border-t animate-fade-in">
              <a
                href="#features"
                className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </a>
              <a
                href="#benefits"
                className="block w-full text-left px-4 py-2 text-sm font-medium text-foreground hover:text-primary transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Benefits
              </a>
              <div className="px-4">
                <Link to="/app" onClick={() => setMobileMenuOpen(false)} className="inline-flex items-center justify-center w-full gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-primary to-accent text-white">
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center space-y-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 backdrop-blur-sm">
              <Zap className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm font-medium text-primary">AI-Powered Agricultural Revolution</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              <span className="block text-foreground">Transform Your</span>
              <span className="block mt-2 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Smart Farming
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Harness the power of artificial intelligence for crop and farm management — instant disease detection, accurate weather forecasts, and real-time market insights all in one intelligent platform.
            </p>

            <div className="flex flex-wrap gap-4 justify-center pt-6">
              <Link to="/app" className="inline-flex items-center gap-2 text-base px-6 py-3 shadow-md hover:shadow-lg transition-all rounded-lg bg-gradient-to-r from-primary to-accent text-white">
                Start Free Today
                <ArrowRight className="h-5 w-5" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 text-base px-6 py-3 rounded-lg border-2 hover:shadow-sm">
                Explore Features
              </a>
            </div>

            {/* Stats with animation */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 max-w-3xl mx-auto">
              <div className="space-y-2 p-5 rounded-xl bg-primary/5 border border-primary/10 hover:border-primary/30 transition-all hover-scale">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">24/7</div>
                <div className="text-sm font-medium text-muted-foreground">AI Support</div>
              </div>
              <div className="space-y-2 p-5 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/30 transition-all hover-scale">
  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">95%+</div>
  <div className="text-sm font-medium text-muted-foreground">Accuracy</div>
</div>

<div className="space-y-2 p-5 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/30 transition-all hover-scale">
  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">7-Days</div>
  <div className="text-sm font-medium text-muted-foreground">Forecasts</div>
</div>

<div className="space-y-2 p-5 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/30 transition-all hover-scale">
  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-br from-accent to-primary bg-clip-text text-transparent">Real-time</div>
  <div className="text-sm font-medium text-muted-foreground">Market Data</div>
</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-b from-muted/30 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Tools for <span className="text-primary">Modern Farmers</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to maximize your crop yields and farm profits
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Link to="/app" className="block">
              <Card className="group border-2 hover:border-primary hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-background to-primary/5">
                <CardHeader>
                  <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 w-fit group-hover:scale-110 transition-transform duration-500">
                    <MessageSquare className="h-10 w-10 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">AI Chat Assistant</CardTitle>
                  <CardDescription className="text-base">
                    Get instant, expert answers to your farming questions 24/7
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Multi-Local-languages support</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Context-aware responses</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Expert farming advice</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link to="/weather" className="block">
              <Card className="group border-2 hover:border-accent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-background to-accent/5">
                <CardHeader>
                  <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 w-fit group-hover:scale-110 transition-transform duration-500">
                    <Cloud className="h-10 w-10 text-accent" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">Smart Weather Forecasts</CardTitle>
                  <CardDescription className="text-base">
                    Accurate 7-day forecasts with personalized farming recommendations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Detailed hourly predictions</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Rainfall & humidity tracking</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Planting & harvesting tips</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link to="/disease" className="block">
              <Card className="group border-2 hover:border-warning hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-background to-warning/5">
                <CardHeader>
                  <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-warning/20 to-warning/5 w-fit group-hover:scale-110 transition-transform duration-500">
                    <Image className="h-10 w-10 text-warning" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">Disease Detection</CardTitle>
                  <CardDescription className="text-base">
                    Upload plant images for instant AI-powered disease diagnosis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Instant image analysis</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Treatment recommendations</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Prevention strategies</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>

            <Link to="/market" className="block">
              <Card className="group border-2 hover:border-success hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-gradient-to-br from-background to-success/5">
                <CardHeader>
                  <div className="mb-4 p-4 rounded-2xl bg-gradient-to-br from-success/20 to-success/5 w-fit group-hover:scale-110 transition-transform duration-500">
                    <TrendingUp className="h-10 w-10 text-success" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-2xl">Market Intelligence</CardTitle>
                  <CardDescription className="text-base">
                    Real-time market prices and revenue projections for better planning
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Live market prices</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Revenue calculators</span>
                    </li>
                    <li className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      <span>Quality grading insights</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Why Farmers <span className="text-primary">Choose Us</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Join thousands of farmers already transforming their operations
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4 p-8 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent border border-primary/10 hover:border-primary/30 transition-all hover-scale">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <Zap className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Get instant answers and analysis in seconds, not hours
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl bg-gradient-to-b from-accent/5 to-transparent border border-accent/10 hover:border-accent/30 transition-all hover-scale">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-accent to-success flex items-center justify-center shadow-lg">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Always Reliable</h3>
              <p className="text-muted-foreground">
                95%+ accuracy backed by advanced AI and expert knowledge
              </p>
            </div>

            <div className="text-center space-y-4 p-8 rounded-2xl bg-gradient-to-b from-success/5 to-transparent border border-success/10 hover:border-success/30 transition-all hover-scale">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-success to-primary flex items-center justify-center shadow-lg">
                <Globe className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Global Reach</h3>
              <p className="text-muted-foreground">
                Multi-language support for farmers worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="relative overflow-hidden text-center py-20 px-6 md:px-12 rounded-3xl bg-gradient-to-br from-primary via-accent to-primary bg-[length:200%_200%] animate-gradient shadow-2xl">
            {/* Overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/50 to-transparent" />
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground">
                Ready to Revolutionize Your Farm?
              </h2>
              <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto">
                Join thousands of successful farmers using AI to boost yields and profits
              </p>
              <div className="flex flex-wrap gap-4 justify-center pt-4">
                <Link to="/app" className="inline-flex items-center gap-2 text-lg px-8 py-6 shadow-xl hover:shadow-2xl transition-all rounded-2xl bg-secondary text-white">
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/20 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                  <Sprout className="h-6 w-6 text-primary-foreground" />
                </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Mlimi Smart
                  </span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering farmers worldwide with intelligent agricultural solutions.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/app" className="hover:text-primary transition-colors block">AI Chat Assistant</Link>
                </li>
                <li>
                  <Link to="/weather" className="hover:text-primary transition-colors block">Weather Forecasts</Link>
                </li>
                <li>
                  <Link to="/disease" className="hover:text-primary transition-colors block">Disease Detection</Link>
                </li>
                <li>
                  <Link to="/market" className="hover:text-primary transition-colors block">Market Analysis</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/privacy" className="hover:text-primary transition-colors block">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Get Started</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Start using our AI-powered tools today—completely free!
              </p>
              <Link to="/app" className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-gradient-to-r from-primary to-accent text-white">
                Launch App
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© 2025 Mlimi Smart. Transforming agriculture through artificial intelligence.</p>
            <p>Powered by Tuyishime Martin</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
