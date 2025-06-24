"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/api"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
    } from "../components/ui/card"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { FileText, BarChart3, CheckCircle, Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [tab, setTab] = useState("signin")
  const nav = useNavigate()

  const [userName, setUserName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loginLoading, setLoginLoading] = useState(false)
  const [signupLoading, setSignupLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }
    setSignupLoading(true)
    try {
      await api.post("/auth/register", { userName, password })
      toast.success("Account created! You can now log in.")
      setTab("signin")
    } catch (err) {
      if (err.response?.status === 409) toast.error("User already exists")
      else toast.error("Registration failed. Please try again.")
    } finally {
      setSignupLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoginLoading(true)
    try {
      const res = await api.post("/auth/login", { userName, password })
      localStorage.setItem("token", res.data.token)
      toast.success("Login successful!")
      nav("/upload-invoice")
    } catch (err) {
      toast.error("Invalid credentials")
    } finally {
      setLoginLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      {/* Branding Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
          <div className="absolute bottom-32 left-32 w-40 h-40 border border-white/20 rounded-full"></div>
        </div>
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">MatchFlow</h1>
              <p className="text-blue-100 text-sm">Smart, simple invoicing done right.</p>
            </div>
          </div>
          <div className="space-y-6">
            <Feature icon={<CheckCircle style={{ color: 'white' }} />} title="Automated Matching" desc="Instantly match purchase orders with invoices using AI-powered recognition." />
            <Feature icon={<BarChart3 style={{ color: 'white' }}/>} title="Real-time Analytics" desc="Track spending patterns and vendor performance with detailed insights.\n\nDocument Management" />
            <Feature icon={<FileText style={{ color: 'white' }}/>} title="Document Management" desc="Organize and store all your invoices and purchase orders in one place." />
          </div>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white/90 text-lg italic">
            "MatchFlow transformed our accounts payable process, reducing processing time by 75%."
          </blockquote>
          <cite className="text-blue-200 text-sm mt-2 block">— Tony Nguyen, Software Engineer at Quest Payment System</cite>
        </div>
      </div>

      {/* Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MatchFlow</h1>
              <p className="text-gray-600 text-sm">Smart, simple invoicing done right.</p>
            </div>
          </div>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">
                {tab === "signin" ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription className="text-center text-gray-600">
                {tab === "signin" ? "Sign in to your account or create a new one" : "Join us to manage your invoices better"}
              </CardDescription>
            </CardHeader>

            <CardContent>
                <Tabs defaultValue="signin" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-100">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-white data-[state=active]:shadow-sm">Sign Up</TabsTrigger>
                    </TabsList>

                    {/* Sign In */}
                    <TabsContent value="signin" asChild>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="login-user" className="text-sm font-medium text-gray-700">Username</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                            id="login-user"
                            type="text"
                            placeholder="Enter your username"
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="login-pass" className="text-sm font-medium text-gray-700">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                            id="login-pass"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <label className="flex items-center space-x-2 text-sm">
                            <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-gray-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                            Forgot password?
                            </a>
                        </div>

                        <Button
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                          disabled={loginLoading}
                        >
                          {loginLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                              </svg>
                              Signing In...
                            </span>
                          ) : (
                            "Sign In"
                          )}
                        </Button>
                    </form>
                    </TabsContent>

                    {/* Sign Up */}
                    <TabsContent value="signup" asChild>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div className="space-y-2">
                        <Label htmlFor="signup-user" className="text-sm font-medium text-gray-700">Username</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                            id="signup-user"
                            type="text"
                            placeholder="Enter your username"
                            className="pl-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="signup-pass" className="text-sm font-medium text-gray-700">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                            id="signup-pass"
                            type={showPassword ? "text" : "password"}
                            placeholder="Create a password"
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        </div>

                        <div className="space-y-2">
                        <Label htmlFor="signup-confirm" className="text-sm font-medium text-gray-700">Confirm Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                            id="signup-confirm"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm your password"
                            className="pl-10 pr-10 h-12 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                            >
                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        </div>
                        <div className="flex items-start space-x-2">
                            <input type="checkbox" className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                            <span className="text-sm text-gray-600">
                            I agree to the{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Terms of Service
                            </a>{" "}
                            and{" "}
                            <a href="#" className="text-blue-600 hover:text-blue-700 font-medium">
                                Privacy Policy
                            </a>
                            </span>
                        </div>

                        <Button
                          className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium transition-all duration-200 transform hover:scale-[1.02]"
                          disabled={signupLoading}
                        >
                          {signupLoading ? (
                            <span className="flex items-center justify-center">
                              <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                              </svg>
                              Creating Account...
                            </span>
                          ) : (
                            "Create Account"
                          )}
                        </Button>
                    </form>
                    </TabsContent>
                </Tabs>

                {/* Divider */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-200" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">Or continue with</span>
                    </div>
                </div>

                {/* Google Button */}
                <Button
                    variant="outline"
                    className="w-full h-12 border-gray-200 hover:bg-gray-50 transition-all duration-200 transform hover:scale-[1.02] bg-white text-gray-700"
                >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </Button>
                </CardContent>
          </Card>
          <p className="text-center text-sm text-gray-500 mt-6">
            By signing in, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </div>
  )
}

function Feature({ icon, title, desc }) {
  return (
    <div className="flex items-start space-x-4">
      <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
        {icon}
      </div>
      <div>
        <h3 className="text-white font-semibold mb-1">{title}</h3>
        <p className="text-blue-100 text-sm">{desc}</p>
      </div>
    </div>
  )
}

function InputWithIcon({ label, id, icon, value, onChange, isPassword = false, toggle, show }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id} className="text-sm font-medium text-gray-700">{label}</Label>
      <div className="relative">
        <div className="absolute left-3 top-3 text-gray-400">{icon}</div>
        <Input
          id={id}
          type={isPassword ? (show ? "text" : "password") : "text"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10 h-12 border-gray-200"
        />
        {isPassword && toggle && (
          <button type="button" onClick={toggle} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
    </div>
  )
}
