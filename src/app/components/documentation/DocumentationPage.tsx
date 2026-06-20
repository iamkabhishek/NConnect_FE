import { useState } from 'react';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { Button } from '@/app/components/ui/button';
import {
  Book,
  Search,
  ChevronRight,
  FileText,
  Rocket,
  Users,
  Layout,
  Send,
  Workflow,
  Mail,
  BarChart3,
  Building2,
  UserCog,
  Settings,
  Code,
  HelpCircle,
  Zap,
  Globe,
  Shield,
  ArrowRight,
} from 'lucide-react';

interface DocCategory {
  id: string;
  name: string;
  description: string;
  icon: any;
  articleCount: number;
  color: string;
}

interface DocArticle {
  id: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  popular?: boolean;
}

interface DocumentationPageProps {
  onNavigate: (page: string) => void;
  onViewArticle?: (articleId: string) => void;
  userName?: string;
  workspaceName?: string;
  workspaceColor?: string;
}

export function DocumentationPage({
  onNavigate,
  onViewArticle,
  userName = 'John Doe',
  workspaceName = 'Main Workspace',
  workspaceColor = '#4A90E2',
}: DocumentationPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories: DocCategory[] = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      description: 'Learn the basics of NConnect',
      icon: Rocket,
      articleCount: 8,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'contacts',
      name: 'Contacts & Subscribers',
      description: 'Managing your contact lists',
      icon: Users,
      articleCount: 12,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'templates',
      name: 'Email Templates',
      description: 'Creating beautiful emails',
      icon: Layout,
      articleCount: 10,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      id: 'campaigns',
      name: 'Campaigns',
      description: 'Send and manage campaigns',
      icon: Send,
      articleCount: 15,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'workflows',
      name: 'Automation Workflows',
      description: 'Automate your email marketing',
      icon: Workflow,
      articleCount: 18,
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      id: 'sender-emails',
      name: 'Sender Emails',
      description: 'Verify and manage senders',
      icon: Mail,
      articleCount: 6,
      color: 'bg-pink-100 text-pink-600',
    },
    {
      id: 'analytics',
      name: 'Analytics & Reports',
      description: 'Track your performance',
      icon: BarChart3,
      articleCount: 9,
      color: 'bg-cyan-100 text-cyan-600',
    },
    {
      id: 'workspaces',
      name: 'Workspaces',
      description: 'Multi-client management',
      icon: Building2,
      articleCount: 7,
      color: 'bg-amber-100 text-amber-600',
    },
    {
      id: 'user-management',
      name: 'User Management',
      description: 'Manage team and permissions',
      icon: UserCog,
      articleCount: 10,
      color: 'bg-red-100 text-red-600',
    },
    {
      id: 'settings',
      name: 'Settings & Configuration',
      description: 'Customize your workspace',
      icon: Settings,
      articleCount: 8,
      color: 'bg-teal-100 text-teal-600',
    },
    {
      id: 'api',
      name: 'API Documentation',
      description: 'Integrate with NConnect API',
      icon: Code,
      articleCount: 20,
      color: 'bg-gray-100 text-gray-600',
    },
    {
      id: 'faq',
      name: 'FAQs',
      description: 'Frequently asked questions',
      icon: HelpCircle,
      articleCount: 25,
      color: 'bg-lime-100 text-lime-600',
    },
  ];

  const popularArticles: DocArticle[] = [
    {
      id: 'getting-started-guide',
      title: 'Getting Started with NConnect',
      description: 'A comprehensive guide to setting up your first workspace',
      category: 'getting-started',
      readTime: '5 min',
      popular: true,
    },
    {
      id: 'create-first-campaign',
      title: 'Creating Your First Campaign',
      description: 'Step-by-step guide to sending your first email campaign',
      category: 'campaigns',
      readTime: '8 min',
      popular: true,
    },
    {
      id: 'automation-basics',
      title: 'Automation Workflows: The Basics',
      description: 'Learn how to automate your email marketing',
      category: 'workflows',
      readTime: '10 min',
      popular: true,
    },
    {
      id: 'import-contacts',
      title: 'Importing Contacts',
      description: 'How to import and organize your subscriber lists',
      category: 'contacts',
      readTime: '6 min',
      popular: true,
    },
    {
      id: 'email-verification',
      title: 'Verifying Your Sender Email',
      description: 'Complete DNS setup guide for email verification',
      category: 'sender-emails',
      readTime: '12 min',
      popular: true,
    },
    {
      id: 'understanding-analytics',
      title: 'Understanding Your Analytics',
      description: 'Track opens, clicks, and campaign performance',
      category: 'analytics',
      readTime: '7 min',
      popular: true,
    },
  ];

  const allArticles: DocArticle[] = [
    ...popularArticles,
    {
      id: 'workspace-setup',
      title: 'Setting Up Multiple Workspaces',
      description: 'Manage multiple clients with workspace segregation',
      category: 'workspaces',
      readTime: '8 min',
    },
    {
      id: 'user-roles',
      title: 'Understanding User Roles and Permissions',
      description: 'Configure granular access control for your team',
      category: 'user-management',
      readTime: '9 min',
    },
    {
      id: 'template-customization',
      title: 'Customizing Email Templates',
      description: 'Make templates your own with content customization',
      category: 'templates',
      readTime: '10 min',
    },
    {
      id: 'segmentation',
      title: 'Advanced Contact Segmentation',
      description: 'Target the right audience with smart groups',
      category: 'contacts',
      readTime: '11 min',
    },
    {
      id: 'campaign-scheduling',
      title: 'Campaign Scheduling and Time Zones',
      description: 'Send campaigns at the perfect time',
      category: 'campaigns',
      readTime: '6 min',
    },
    {
      id: 'api-authentication',
      title: 'API Authentication',
      description: 'Secure your API integration with proper auth',
      category: 'api',
      readTime: '8 min',
    },
  ];

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredArticles = allArticles.filter(
    (article) =>
      (article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory ? article.category === selectedCategory : true)
  );

  const handleViewArticle = (articleId: string) => {
    if (onViewArticle) {
      onViewArticle(articleId);
    } else {
      // Default navigation
      onNavigate('documentation-article');
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <DashboardSidebar
        onNavigate={onNavigate}
        workspaceName={workspaceName}
        workspaceColor={workspaceColor}
        activePage="documentation"
      />

      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader
          onNavigate={onNavigate}
          userName={userName}
          workspaceName={workspaceName}
          workspaceColor={workspaceColor}
        />

        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-6 py-8">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                    <Book className="size-8 text-blue-600" />
                    Documentation
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Everything you need to know about NConnect
                  </p>
                </div>
                <Button
                  onClick={() => onNavigate('dashboard')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="size-4" />
                  Back to Dashboard
                </Button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search documentation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                />
              </div>
              <p className="text-sm text-gray-600 mt-3">
                Try searching for "campaigns", "automation", "contacts", or "API"
              </p>
            </div>

            {/* Quick Start */}
            {!searchQuery && !selectedCategory && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-8 mb-8 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                      <Rocket className="size-7" />
                      Quick Start Guide
                    </h2>
                    <p className="text-blue-100 mb-6 max-w-2xl">
                      New to NConnect? Start here to learn the basics and get your first
                      campaign up and running in minutes.
                    </p>
                    <Button
                      onClick={() => handleViewArticle('getting-started-guide')}
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      Get Started
                      <ChevronRight className="size-4 ml-2" />
                    </Button>
                  </div>
                  <Zap className="size-20 text-blue-400 opacity-50" />
                </div>
              </div>
            )}

            {/* Category Filter */}
            {selectedCategory && (
              <div className="mb-6">
                <Button
                  onClick={() => setSelectedCategory(null)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ChevronRight className="size-4 rotate-180" />
                  Back to All Categories
                </Button>
              </div>
            )}

            {/* Categories Grid */}
            {!selectedCategory && (
              <>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Browse by Category</h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Explore documentation organized by topic
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {filteredCategories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-blue-300 text-left group"
                      >
                        <div className="flex items-start gap-4 mb-3">
                          <div className={`p-3 rounded-lg ${category.color}`}>
                            <Icon className="size-6" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-600">
                              {category.name}
                            </h3>
                            <p className="text-sm text-gray-600">{category.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                          <span className="text-sm text-gray-600">
                            {category.articleCount} articles
                          </span>
                          <ChevronRight className="size-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {/* Popular/Filtered Articles */}
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.name
                    : searchQuery
                    ? 'Search Results'
                    : 'Popular Articles'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {selectedCategory
                    ? categories.find((c) => c.id === selectedCategory)?.description
                    : searchQuery
                    ? `${filteredArticles.length} article(s) found`
                    : 'Most viewed documentation articles'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.length > 0 ? (
                  filteredArticles.map((article) => {
                    const category = categories.find((c) => c.id === article.category);
                    const CategoryIcon = category?.icon || FileText;

                    return (
                      <button
                        key={article.id}
                        onClick={() => handleViewArticle(article.id)}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-blue-300 text-left group"
                      >
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${category?.color || 'bg-gray-100 text-gray-600'}`}>
                            <CategoryIcon className="size-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-bold text-gray-900 group-hover:text-blue-600">
                                {article.title}
                              </h3>
                              {article.popular && (
                                <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full ml-2">
                                  Popular
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-3">
                              {article.description}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <FileText className="size-3" />
                                {article.readTime} read
                              </span>
                              <span>•</span>
                              <span>{category?.name}</span>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <div className="col-span-2 text-center py-12">
                    <Search className="size-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 font-medium">No articles found</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Try adjusting your search or browse by category
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Need More Help */}
            {!selectedCategory && !searchQuery && (
              <div className="mt-12 bg-white rounded-xl border border-gray-200 p-8">
                <div className="text-center max-w-2xl mx-auto">
                  <HelpCircle className="size-12 text-blue-600 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Can't find what you're looking for?
                  </h2>
                  <p className="text-gray-600 mb-6">
                    Our support team is here to help. Contact us for personalized assistance.
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <Button variant="outline" className="flex items-center gap-2">
                      <Mail className="size-4" />
                      Contact Support
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                      <Globe className="size-4" />
                      Visit Help Center
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}