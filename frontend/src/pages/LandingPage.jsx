"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BarChart3, Upload, FolderOpen, ArrowRight, Menu, X, Star } from "lucide-react"

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
    navigate('/auth')
  }

  const handleLogin = () => {
    navigate('/auth')
  }

  const handleSignup = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-gray-900">MatchFlow</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Home
              </a>
              <a href="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Features
              </a>
              <a href="#workflow" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                How it Works
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
                Contact
              </a>
              {!isAuthenticated ? (
                <>
                  <Button variant="ghost" className="text-gray-700 hover:text-blue-600" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white" onClick={handleSignup}>
                    Sign Up
                  </Button>
                </>
              ) : (
                <Button variant="ghost" className="text-gray-700 hover:text-red-600" onClick={handleLogout}>
                  Log Out
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button className="md:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="md:hidden bg-white/95 backdrop-blur-md border-t border-gray-200">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Home
                </a>
                <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Features
                </a>
                <a href="#workflow" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                  How it Works
                </a>
                <a href="#contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 font-medium">
                  Contact
                </a>
                <div className="px-3 py-2 space-y-2">
                  {!isAuthenticated ? (
                    <>
                      <Button variant="ghost" className="w-full justify-start text-gray-700" onClick={handleLogin}>
                        Login
                      </Button>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white" onClick={handleSignup}>
                        Sign Up
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" className="w-full justify-start text-gray-700" onClick={handleLogout}>
                      Log Out
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Smart, Simple Invoicing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Done Right
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Create purchase orders, upload invoices, and automate matching with real-time insights. Transform your
              finance operations with intelligent document processing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 text-lg font-medium transition-all duration-200 transform hover:scale-105"
                onClick={() => navigate('/create-po')}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg font-medium border-gray-300 hover:bg-gray-50"
              >
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">75%</div>
              <div className="text-gray-600">Faster Processing</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">99.9%</div>
              <div className="text-gray-600">Accuracy Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Manage Invoices
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Streamline your entire invoice workflow with our comprehensive suite of tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Create PO */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 cursor-pointer"
              onClick={() => navigate('/create-po')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Create PO</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Quickly create and store purchase orders with structured metadata and automated workflows.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Upload Invoice */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 cursor-pointer"
              onClick={() => navigate('/upload-invoice')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Upload Invoice</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Upload your invoices and let MatchFlow extract data automatically using advanced AI recognition.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Track Invoices */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 cursor-pointer"
              onClick={() => navigate('/invoices')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Track My Invoices</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  See status, matching results, and complete history of all uploaded invoices in real-time.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Manage POs */}
            <Card 
              className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white/80 backdrop-blur-sm border-0 cursor-pointer"
              onClick={() => navigate('/purchase-orders')}
            >
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FolderOpen className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900">Manage My POs</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className="text-gray-600 leading-relaxed">
                  Edit, archive, or export your previous purchase orders with comprehensive management tools.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How MatchFlow Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Three simple steps to transform your invoice processing workflow
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Create PO</h3>
              <p className="text-gray-600 leading-relaxed">
                Start by creating detailed purchase orders with all necessary information and approval workflows.
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-10 -right-4 text-blue-300">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Upload Invoice</h3>
              <p className="text-gray-600 leading-relaxed">
                Upload invoices in any format and let our AI extract all relevant data automatically and accurately.
              </p>
              {/* Arrow for desktop */}
              <div className="hidden md:block absolute top-10 -right-4 text-blue-300">
                <ArrowRight className="w-8 h-8" />
              </div>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Auto-Match & Review</h3>
              <p className="text-gray-600 leading-relaxed">
                Our system automatically matches invoices to purchase orders and flags any discrepancies for review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Trusted by Finance Teams Worldwide</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">See what our customers are saying about MatchFlow</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "MatchFlow transformed our finance ops — invoice processing is 75% faster and virtually error-free."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">TN</span>
                  </div>
                  <div>
                    <cite className="font-semibold text-gray-900 not-italic">Tony Nguyen</cite>
                    <p className="text-sm text-gray-600">Software Engineer @ Quest Payment Systems</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "The automated matching feature saved us countless hours. Our team can now focus on strategic work
                  instead of manual data entry."
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">SC</span>
                  </div>
                  <div>
                    <cite className="font-semibold text-gray-900 not-italic">Sarah Chen</cite>
                    <p className="text-sm text-gray-600">CFO @ TechCorp Industries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-gray-700 mb-4 italic">
                  "MatchFlow's intuitive interface made adoption seamless across our entire finance team. Highly
                  recommended!"
                </blockquote>
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-semibold text-sm">MR</span>
                  </div>
                  <div>
                    <cite className="font-semibold text-gray-900 not-italic">Michael Rodriguez</cite>
                    <p className="text-sm text-gray-600">Finance Director @ Global Solutions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Invoice Processing?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of companies already using MatchFlow to streamline their finance operations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-4 text-lg font-medium transition-all duration-200 transform hover:scale-105"
              onClick={() => navigate('/auth')}
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white hover:bg-white/10 px-8 py-4 text-lg font-medium text-slate-500 bg-white"
              onClick={() => navigate('/create-po')}
            >
              Schedule Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Logo and Description */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-bold">MatchFlow</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Smart, simple invoicing done right. Transform your finance operations with intelligent document
                processing and automated workflows.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-xs font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-xs font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 cursor-pointer transition-colors">
                  <span className="text-xs font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-gray-400 hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#workflow" className="text-gray-400 hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#contact" className="text-gray-400 hover:text-white transition-colors">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    API Docs
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">© 2025 MatchFlow. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
