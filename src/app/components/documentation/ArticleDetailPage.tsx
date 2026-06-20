import { useState } from 'react';
import { DashboardSidebar } from '@/app/components/dashboard/DashboardSidebar';
import { DashboardHeader } from '@/app/components/dashboard/DashboardHeader';
import { Button } from '@/app/components/ui/button';
import {
  Book,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Check,
  ArrowLeft,
  Clock,
  FileText,
  Share2,
  Printer,
  Download,
  Rocket,
  Users,
  Send,
} from 'lucide-react';

interface ArticleSection {
  id: string;
  title: string;
  level: number;
}

interface RelatedArticle {
  id: string;
  title: string;
  category: string;
  readTime: string;
}

interface ArticleDetailPageProps {
  onNavigate: (page: string) => void;
  onBackToDocumentation?: () => void;
  articleId?: string;
  userName?: string;
  workspaceName?: string;
  workspaceColor?: string;
}

export function ArticleDetailPage({
  onNavigate,
  onBackToDocumentation,
  articleId = 'getting-started-guide',
  userName = 'John Doe',
  workspaceName = 'Main Workspace',
  workspaceColor = '#4A90E2',
}: ArticleDetailPageProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [feedbackGiven, setFeedbackGiven] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');

  // Sample article data - in real app, this would come from a CMS or API
  const article = {
    id: articleId,
    title: 'Getting Started with NConnect',
    category: 'Getting Started',
    categoryIcon: Rocket,
    readTime: '5 min',
    lastUpdated: 'March 15, 2024',
    author: 'NConnect Team',
  };

  const sections: ArticleSection[] = [
    { id: 'introduction', title: 'Introduction', level: 1 },
    { id: 'prerequisites', title: 'Prerequisites', level: 1 },
    { id: 'setup-workspace', title: 'Setting Up Your Workspace', level: 1 },
    { id: 'create-workspace', title: 'Creating a Workspace', level: 2 },
    { id: 'configure-settings', title: 'Configuring Settings', level: 2 },
    { id: 'add-contacts', title: 'Adding Your First Contacts', level: 1 },
    { id: 'import-csv', title: 'Import from CSV', level: 2 },
    { id: 'manual-add', title: 'Add Manually', level: 2 },
    { id: 'verify-sender', title: 'Verifying Sender Email', level: 1 },
    { id: 'create-campaign', title: 'Creating Your First Campaign', level: 1 },
    { id: 'next-steps', title: 'Next Steps', level: 1 },
  ];

  const relatedArticles: RelatedArticle[] = [
    {
      id: 'create-first-campaign',
      title: 'Creating Your First Campaign',
      category: 'Campaigns',
      readTime: '8 min',
    },
    {
      id: 'import-contacts',
      title: 'Importing Contacts',
      category: 'Contacts',
      readTime: '6 min',
    },
    {
      id: 'email-verification',
      title: 'Verifying Your Sender Email',
      category: 'Sender Emails',
      readTime: '12 min',
    },
  ];

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleFeedback = (isHelpful: boolean) => {
    setFeedbackGiven(true);
    // In real app, send feedback to backend
  };

  const CategoryIcon = article.categoryIcon;

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
            {/* Back Navigation */}
            <div className="mb-6">
              <Button
                onClick={onBackToDocumentation || (() => onNavigate('documentation'))}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="size-4" />
                Back to Documentation
              </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  {/* Article Header */}
                  <div className="p-8 border-b border-gray-200">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <Book className="size-4" />
                      <span>Documentation</span>
                      <ChevronRight className="size-4" />
                      <span>{article.category}</span>
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      {article.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CategoryIcon className="size-4" />
                        <span>{article.category}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="size-4" />
                        <span>{article.readTime} read</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="size-4" />
                        <span>Updated {article.lastUpdated}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3 mt-6">
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Share2 className="size-4" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Printer className="size-4" />
                        Print
                      </Button>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="size-4" />
                        Export PDF
                      </Button>
                    </div>
                  </div>

                  {/* Article Content */}
                  <div className="p-8 prose prose-blue max-w-none">
                    {/* Introduction */}
                    <section id="introduction" className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
                      <p className="text-gray-700 mb-4">
                        Welcome to NConnect! This guide will walk you through the essential steps
                        to get started with our newsletter management platform. By the end of this
                        guide, you'll have set up your workspace, added contacts, verified your
                        sender email, and sent your first campaign.
                      </p>
                      <p className="text-gray-700">
                        NConnect is designed to be intuitive and powerful, offering features like
                        workspace segregation, automation workflows, detailed analytics, and more.
                        Let's dive in!
                      </p>
                    </section>

                    {/* Prerequisites */}
                    <section id="prerequisites" className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Prerequisites</h2>
                      <p className="text-gray-700 mb-4">
                        Before you begin, make sure you have:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                        <li>Created a NConnect account and verified your email</li>
                        <li>Access to your domain's DNS settings (for sender verification)</li>
                        <li>A list of contacts or subscribers (CSV format recommended)</li>
                        <li>A clear goal for your first email campaign</li>
                      </ul>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 font-medium mb-1">
                          💡 Pro Tip
                        </p>
                        <p className="text-sm text-blue-800">
                          Have your brand assets ready (logo, colors, email templates) to speed up
                          the setup process.
                        </p>
                      </div>
                    </section>

                    {/* Setting Up Workspace */}
                    <section id="setup-workspace" className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Setting Up Your Workspace
                      </h2>
                      <p className="text-gray-700 mb-4">
                        A workspace in NConnect is an isolated environment where you manage
                        contacts, campaigns, and settings. This is perfect for managing multiple
                        clients or brands separately.
                      </p>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6" id="create-workspace">
                        Creating a Workspace
                      </h3>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                        <li>Navigate to <strong>Workspaces</strong> from the sidebar</li>
                        <li>Click <strong>Create New Workspace</strong></li>
                        <li>Enter your workspace name (e.g., "Marketing Team")</li>
                        <li>Choose a color to help identify it quickly</li>
                        <li>Click <strong>Create Workspace</strong></li>
                      </ol>

                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">Example Configuration</span>
                          <button
                            onClick={() =>
                              copyCode(
                                'Workspace Name: Marketing Team\nColor: #4A90E2\nDescription: Main marketing workspace',
                                'workspace-config'
                              )
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            {copiedCode === 'workspace-config' ? (
                              <Check className="size-4" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </button>
                        </div>
                        <pre>
{`Workspace Name: Marketing Team
Color: #4A90E2
Description: Main marketing workspace`}
                        </pre>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6" id="configure-settings">
                        Configuring Settings
                      </h3>
                      <p className="text-gray-700 mb-4">
                        Once your workspace is created, configure the following settings:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-700">
                        <li><strong>Time Zone:</strong> Set your preferred time zone for scheduling</li>
                        <li><strong>Language:</strong> Choose your interface language</li>
                        <li><strong>Notifications:</strong> Configure email and in-app notifications</li>
                        <li><strong>Branding:</strong> Upload your logo and set brand colors</li>
                      </ul>
                    </section>

                    {/* Adding Contacts */}
                    <section id="add-contacts" className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Adding Your First Contacts
                      </h2>
                      <p className="text-gray-700 mb-4">
                        Contacts are the heart of your email marketing. NConnect offers multiple
                        ways to add and organize your subscribers.
                      </p>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6" id="import-csv">
                        Import from CSV
                      </h3>
                      <p className="text-gray-700 mb-4">
                        The fastest way to add multiple contacts is by importing a CSV file:
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                        <li>Go to <strong>Contacts</strong> in the sidebar</li>
                        <li>Click <strong>Import Contacts</strong></li>
                        <li>Download the CSV template</li>
                        <li>Fill in your contact data (email, name, custom fields)</li>
                        <li>Upload the file and map the columns</li>
                        <li>Review and confirm the import</li>
                      </ol>

                      <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-400">CSV Format Example</span>
                          <button
                            onClick={() =>
                              copyCode(
                                'email,first_name,last_name,company\njohn@example.com,John,Doe,Acme Inc\njane@example.com,Jane,Smith,Tech Corp',
                                'csv-format'
                              )
                            }
                            className="text-gray-400 hover:text-white"
                          >
                            {copiedCode === 'csv-format' ? (
                              <Check className="size-4" />
                            ) : (
                              <Copy className="size-4" />
                            )}
                          </button>
                        </div>
                        <pre>
{`email,first_name,last_name,company
john@example.com,John,Doe,Acme Inc
jane@example.com,Jane,Smith,Tech Corp`}
                        </pre>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 mb-3 mt-6" id="manual-add">
                        Add Manually
                      </h3>
                      <p className="text-gray-700">
                        For individual contacts, use the <strong>Add Contact</strong> button and
                        fill in the required information in the form.
                      </p>
                    </section>

                    {/* Verifying Sender */}
                    <section id="verify-sender" className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Verifying Sender Email
                      </h2>
                      <p className="text-gray-700 mb-4">
                        Before sending campaigns, you must verify your sender email by adding DNS
                        records to your domain. This improves deliverability and builds trust.
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                        <li>Navigate to <strong>Sender Emails</strong></li>
                        <li>Click <strong>Add Sender Email</strong></li>
                        <li>Enter your email and display name</li>
                        <li>Copy the provided DNS records (SPF, DKIM, DMARC)</li>
                        <li>Add these records to your domain's DNS settings</li>
                        <li>Click <strong>Check Verification Status</strong></li>
                      </ol>

                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p className="text-sm text-yellow-900 font-medium mb-1">
                          ⚠️ Important
                        </p>
                        <p className="text-sm text-yellow-800">
                          DNS propagation can take up to 48 hours. Your email won't be verified
                          instantly, so plan accordingly.
                        </p>
                      </div>
                    </section>

                    {/* Creating Campaign */}
                    <section id="create-campaign" className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">
                        Creating Your First Campaign
                      </h2>
                      <p className="text-gray-700 mb-4">
                        Now that everything is set up, you're ready to create and send your first
                        campaign!
                      </p>
                      <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-4">
                        <li>Go to <strong>Campaigns</strong> in the sidebar</li>
                        <li>Click <strong>Create Campaign</strong></li>
                        <li>Choose a template from the library</li>
                        <li>Customize your content and design</li>
                        <li>Select your recipients (contacts or groups)</li>
                        <li>Preview and test your email</li>
                        <li>Schedule or send immediately</li>
                      </ol>

                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <p className="text-sm text-green-900 font-medium mb-1">
                          ✅ Best Practice
                        </p>
                        <p className="text-sm text-green-800">
                          Always send a test email to yourself before launching a campaign to catch
                          any formatting or content issues.
                        </p>
                      </div>
                    </section>

                    {/* Next Steps */}
                    <section id="next-steps" className="mb-8">
                      <h2 className="text-2xl font-bold text-gray-900 mb-4">Next Steps</h2>
                      <p className="text-gray-700 mb-4">
                        Congratulations on completing the setup! Here are some recommended next
                        steps:
                      </p>
                      <ul className="list-disc list-inside space-y-2 text-gray-700 mb-4">
                        <li>
                          <strong>Create Automation Workflows:</strong> Set up welcome emails,
                          drip campaigns, and triggered messages
                        </li>
                        <li>
                          <strong>Organize with Groups:</strong> Segment your contacts for
                          targeted campaigns
                        </li>
                        <li>
                          <strong>Explore Analytics:</strong> Track opens, clicks, and campaign
                          performance
                        </li>
                        <li>
                          <strong>Invite Team Members:</strong> Collaborate with granular
                          permission controls
                        </li>
                        <li>
                          <strong>Customize Templates:</strong> Make templates your own with brand
                          colors and content
                        </li>
                      </ul>
                    </section>

                    {/* Feedback */}
                    <div className="border-t border-gray-200 pt-8 mt-8">
                      <h3 className="text-lg font-bold text-gray-900 mb-4">
                        Was this article helpful?
                      </h3>
                      {!feedbackGiven ? (
                        <div className="flex items-center gap-3">
                          <Button
                            onClick={() => handleFeedback(true)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <ThumbsUp className="size-4" />
                            Yes
                          </Button>
                          <Button
                            onClick={() => handleFeedback(false)}
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-2"
                          >
                            <ThumbsDown className="size-4" />
                            No
                          </Button>
                        </div>
                      ) : (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                          <p className="text-sm text-green-900">
                            Thank you for your feedback! We're constantly improving our
                            documentation.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <div className="sticky top-8 space-y-6">
                  {/* Table of Contents */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Table of Contents</h3>
                    <nav className="space-y-2">
                      {sections.map((section) => (
                        <a
                          key={section.id}
                          href={`#${section.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            setActiveSection(section.id);
                            document
                              .getElementById(section.id)
                              ?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className={`block text-sm hover:text-blue-600 transition-colors ${
                            section.level === 2 ? 'pl-4' : ''
                          } ${
                            activeSection === section.id
                              ? 'text-blue-600 font-medium'
                              : 'text-gray-600'
                          }`}
                        >
                          {section.title}
                        </a>
                      ))}
                    </nav>
                  </div>

                  {/* Related Articles */}
                  <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Related Articles</h3>
                    <div className="space-y-3">
                      {relatedArticles.map((relatedArticle) => (
                        <button
                          key={relatedArticle.id}
                          onClick={() => onNavigate('documentation')}
                          className="w-full text-left p-3 rounded-lg hover:bg-gray-50 border border-transparent hover:border-blue-200 transition-all group"
                        >
                          <p className="font-medium text-gray-900 text-sm group-hover:text-blue-600 mb-1">
                            {relatedArticle.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{relatedArticle.category}</span>
                            <span>•</span>
                            <span>{relatedArticle.readTime}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Help */}
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <h3 className="font-bold text-blue-900 mb-2">Need More Help?</h3>
                    <p className="text-sm text-blue-800 mb-4">
                      Can't find what you're looking for? Our support team is here to assist you.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-blue-300 text-blue-600 hover:bg-blue-100"
                    >
                      Contact Support
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
