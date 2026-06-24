import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Mail,
  Users,
  Zap,
  BarChart3,
  Layout,
  Globe,
  CheckCircle2,
  ArrowRight,
  Shield,
  Sparkles,
  Menu,
  X,
  Server,
  Workflow,
  FileText,
  UserCog,
  Clock,
  Target,
  TrendingUp,
  Code,
  Lock,
  Layers,
  Send,
  Eye,
  MousePointer,
  Award,
  Briefcase,
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface LandingPageProps {
  onGetStarted?: () => void;
  onBookDemo?: () => void;
}

function LandingPage({ onGetStarted, onBookDemo }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('workspaces');
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.95]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const features = [
    {
      icon: <Layout className="w-6 h-6" />,
      title: 'Workspace Management',
      description: 'Organize multiple clients with complete data isolation and workspace-specific access control.',
      color: 'blue',
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: 'Template Builder',
      description: 'Choose from professionally designed email templates and customize content effortlessly.',
      color: 'purple',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Contact & Group Management',
      description: 'Import, organize, and segment your subscribers with powerful group management tools.',
      color: 'green',
    },
    {
      icon: <Send className="w-6 h-6" />,
      title: 'Campaign Creation',
      description: 'Design, schedule, and launch email campaigns with an intuitive campaign builder.',
      color: 'orange',
    },
    {
      icon: <Workflow className="w-6 h-6" />,
      title: 'Automation Workflows',
      description: 'Create trigger-based email sequences and automate your marketing campaigns.',
      color: 'pink',
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: 'Advanced Analytics',
      description: 'Track opens, clicks, conversions, and gain actionable insights from detailed reports.',
      color: 'indigo',
    },
  ];

  const benefits = [
    {
      icon: <Server className="w-8 h-8" />,
      title: 'Self-Hosted Solution',
      description: 'Deploy NConnect on your own infrastructure for complete control and data ownership.',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Enterprise Security',
      description: 'Granular role-based permissions with Full Access, Editor, Creator, and Viewer roles.',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Performance',
      description: 'Instant workspace switching with optimized performance and real-time updates.',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'ESP Integration',
      description: 'Seamlessly connect with popular email service providers for reliable delivery.',
      gradient: 'from-orange-500 to-red-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Workspace',
      description: 'Set up isolated workspaces for different clients or projects.',
      icon: <Briefcase className="w-6 h-6" />,
    },
    {
      number: '02',
      title: 'Import Contacts',
      description: 'Upload subscriber lists and organize them into groups.',
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: '03',
      title: 'Design Campaign',
      description: 'Select templates and customize with your brand content.',
      icon: <FileText className="w-6 h-6" />,
    },
    {
      number: '04',
      title: 'Launch & Track',
      description: 'Send campaigns and monitor performance in real-time.',
      icon: <TrendingUp className="w-6 h-6" />,
    },
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime SLA', icon: <Target className="w-6 h-6" /> },
    { value: '5M+', label: 'Emails Delivered', icon: <Send className="w-6 h-6" /> },
    { value: '10K+', label: 'Active Users', icon: <Users className="w-6 h-6" /> },
    { value: '<100ms', label: 'Response Time', icon: <Zap className="w-6 h-6" /> },
  ];

  const testimonials = [
    {
      quote: "NConnect transformed how we manage newsletters for our clients. The workspace segregation is a game-changer.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "TechCorp Inc.",
    },
    {
      quote: "Self-hosting gave us the control we needed. The platform is intuitive and incredibly powerful.",
      author: "Michael Chen",
      role: "CTO",
      company: "StartupHub",
    },
    {
      quote: "The analytics and automation features helped us increase engagement by 300%. Highly recommend!",
      author: "Emma Williams",
      role: "Email Marketing Manager",
      company: "GrowthLabs",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <motion.nav
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 bg-[#4A90E2] rounded-lg flex items-center justify-center shadow-md">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">NConnect</span>
            </motion.div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {['Features', 'Pricing', 'Benefits', 'How It Works', 'Testimonials'].map((item, index) => (
                <motion.button
                  key={item}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => scrollToSection(item.toLowerCase().replaceAll(' ', '-'))}
                  className="text-gray-600 hover:text-[#4A90E2] transition-colors text-sm font-medium relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A90E2] transition-all group-hover:w-full" />
                </motion.button>
              ))}
              {onBookDemo && (
                <motion.button
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  onClick={onBookDemo}
                  className="text-[#4A90E2] hover:text-[#3A7BC8] transition-colors text-sm font-bold relative group"
                >
                  Book a Demo
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#4A90E2] transition-all group-hover:w-full" />
                </motion.button>
              )}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Button 
                  onClick={onGetStarted}
                  className="bg-[#4A90E2] hover:bg-[#3A7BC8] text-white shadow-sm"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </motion.div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {['Features', 'Pricing', 'Benefits', 'How It Works', 'Testimonials'].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase().replaceAll(' ', '-'))}
                  className="block w-full text-left px-4 py-2 text-gray-600 hover:text-[#4A90E2] hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
              {onBookDemo && (
                <button
                  onClick={onBookDemo}
                  className="block w-full text-left px-4 py-2 text-[#4A90E2] hover:bg-gray-50 rounded-lg transition-colors font-bold"
                >
                  Book a Demo
                </button>
              )}
              <Button onClick={onGetStarted} className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white">
                Get Started
              </Button>
            </div>
          </motion.div>
        )}
      </motion.nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
        
        {/* Animated Blobs */}
        <motion.div
          className="absolute top-20 right-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 left-10 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-blue-100/80 backdrop-blur-sm text-[#4A90E2] px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-semibold">Self-Hosted Newsletter Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Newsletter Management
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4A90E2] to-[#667EEA]">
                Made Simple
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed"
            >
              Send and receive newsletters with workspace segregation, visual templates, and powerful
              automation. Self-host for complete control.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                size="lg"
                onClick={onGetStarted}
                className="bg-[#4A90E2] hover:bg-[#3A7BC8] text-white px-8 shadow-lg hover:shadow-xl transition-all group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              {onBookDemo && (
                <Button
                  size="lg"
                  variant="outline"
                  onClick={onBookDemo}
                  className="border-2 border-zinc-200 hover:border-[#4A90E2] text-zinc-700 hover:text-[#4A90E2] px-8 shadow-sm transition-all"
                >
                  Book a Demo
                </Button>
              )}
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-5xl mx-auto"
          >
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-2xl rounded-3xl" />
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              {/* Browser Chrome */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                </div>
                <div className="flex-1 text-center text-sm text-gray-500 font-medium">
                  NConnect Dashboard
                </div>
              </div>

              {/* Dashboard Preview */}
              <div className="bg-gradient-to-br from-gray-50 to-white p-8">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {[
                    { icon: <Send className="w-6 h-6 text-blue-600" />, label: 'Campaigns', value: '142', color: 'blue' },
                    { icon: <Users className="w-6 h-6 text-green-600" />, label: 'Subscribers', value: '12.5K', color: 'green' },
                    { icon: <Eye className="w-6 h-6 text-purple-600" />, label: 'Open Rate', value: '68.4%', color: 'purple' },
                  ].map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 + index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600 font-medium">{stat.label}</span>
                        <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                          {stat.icon}
                        </div>
                      </div>
                      <div className="text-3xl font-bold text-gray-900">{stat.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Mini Campaign List */}
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="text-sm font-semibold text-gray-900">Recent Campaigns</h3>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {['Product Launch Newsletter', 'Weekly Digest #42', 'Special Offer Campaign'].map((title, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Mail className="w-4 h-4 text-blue-600" />
                          </div>
                          <span className="text-sm font-medium text-gray-900">{title}</span>
                        </div>
                        <span className="text-xs text-gray-500">Sent</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2 text-[#4A90E2] mb-4">
                <div className="h-px w-12 bg-[#4A90E2]" />
                <span className="text-sm font-semibold uppercase tracking-wider">Features</span>
                <div className="h-px w-12 bg-[#4A90E2]" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for professional newsletter management
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <div className="h-full bg-white rounded-xl border border-gray-200 p-6 hover:border-[#4A90E2]/50 hover:shadow-xl transition-all">
                  <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center text-${feature.color}-600 mb-4 group-hover:scale-110 transition-transform`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2 text-[#4A90E2] mb-4">
                <div className="h-px w-12 bg-[#4A90E2]" />
                <span className="text-sm font-semibold uppercase tracking-wider">Pricing</span>
                <div className="h-px w-12 bg-[#4A90E2]" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Flexible pricing for teams of all sizes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Basic Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-[#4A90E2]/50 hover:shadow-xl transition-all"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Basic</h3>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">$29</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 3 workspaces</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">10,000 subscribers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Email support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Basic analytics</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                Get Started
              </Button>
            </motion.div>

            {/* Professional Plan - Featured */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl border-2 border-[#4A90E2] p-8 hover:shadow-2xl transition-all relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-gradient-to-r from-[#4A90E2] to-[#667EEA] text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
                <p className="text-gray-600">For growing businesses</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">$99</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Up to 10 workspaces</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">50,000 subscribers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Premium templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Priority support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced analytics</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Automation workflows</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">API access</span>
                </li>
              </ul>
              <Button className="w-full bg-[#4A90E2] hover:bg-[#3A7BC8] text-white shadow-lg">
                Get Started
              </Button>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl border-2 border-gray-200 p-8 hover:border-[#4A90E2]/50 hover:shadow-xl transition-all"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                <p className="text-gray-600">For large organizations</p>
              </div>
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-5xl font-bold text-gray-900">$299</span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited workspaces</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Unlimited subscribers</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom templates</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Dedicated support</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Full analytics suite</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Advanced automation</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">White-label options</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#4A90E2] flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">Custom integrations</span>
                </li>
              </ul>
              <Button className="w-full bg-gray-900 hover:bg-gray-800 text-white">
                Contact Sales
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2 text-[#4A90E2] mb-4">
                <div className="h-px w-12 bg-[#4A90E2]" />
                <span className="text-sm font-semibold uppercase tracking-wider">Benefits</span>
                <div className="h-px w-12 bg-[#4A90E2]" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Why Choose NConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Built for flexibility, security, and unmatched performance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <div className="h-full bg-white rounded-xl border border-gray-200 p-8 hover:shadow-xl transition-all relative overflow-hidden">
                  {/* Gradient Line */}
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${benefit.gradient}`} />
                  
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center text-white flex-shrink-0 group-hover:scale-110 transition-transform`}>
                      {benefit.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2 text-[#4A90E2] mb-4">
                <div className="h-px w-12 bg-[#4A90E2]" />
                <span className="text-sm font-semibold uppercase tracking-wider">Process</span>
                <div className="h-px w-12 bg-[#4A90E2]" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Get Started in 4 Simple Steps
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Launch your first campaign in minutes
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Connection Line */}
            <div className="hidden lg:block absolute top-16 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <motion.div
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-[#4A90E2]/50 hover:shadow-xl transition-all relative z-10"
                >
                  {/* Step Number */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mb-4 mx-auto shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-[#4A90E2] mb-4 mx-auto">
                    {step.icon}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#4A90E2] to-[#667EEA] relative overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '48px 48px',
            }}
          />
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, type: 'spring' }}
                whileHover={{ scale: 1.1, y: -5 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-white mx-auto mb-4">
                  {stat.icon}
                </div>
                <div className="text-4xl sm:text-5xl font-bold text-white mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block">
              <div className="flex items-center gap-2 text-[#4A90E2] mb-4">
                <div className="h-px w-12 bg-[#4A90E2]" />
                <span className="text-sm font-semibold uppercase tracking-wider">Testimonials</span>
                <div className="h-px w-12 bg-[#4A90E2]" />
              </div>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Trusted by Thousands
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what our customers have to say
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-xl transition-all"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Award key={i} className="w-5 h-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-[#4A90E2]">{testimonial.company}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-2xl">
              <Mail className="w-10 h-10" />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Join thousands of users managing newsletters with NConnect. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-[#4A90E2] hover:bg-[#3A7BC8] text-white px-8 shadow-lg hover:shadow-xl transition-all group"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-gray-300 hover:border-[#4A90E2] text-gray-700 hover:text-[#4A90E2] px-8"
              >
                Schedule Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#4A90E2] rounded-lg flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">NConnect</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional newsletter management platform with self-hosting capabilities.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#4A90E2] transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-[#4A90E2] transition-colors">Pricing</a></li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#4A90E2] transition-colors">About</a></li>
                <li><a href="#" className="hover:text-[#4A90E2] transition-colors">Contact</a></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-[#4A90E2] transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-[#4A90E2] transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-[#4A90E2] transition-colors">Cookie Policy</a></li>
                <li><a href="#" className="hover:text-[#4A90E2] transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <p className="text-center text-sm text-gray-400">
              © {new Date().getFullYear()} NConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;