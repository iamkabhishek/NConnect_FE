import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import {
  Mail,
  Users,
  FileText,
  Upload,
  PieChart,
  Settings,
  ArrowRight,
} from 'lucide-react';

interface QuickAction {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  onCreateCampaign?: () => void;
  onAddContacts?: () => void;
  onNewTemplate?: () => void;
  onImportCSV?: () => void;
  onViewReports?: () => void;
  onESPSettings?: () => void;
}

export function QuickActions({
  onCreateCampaign,
  onAddContacts,
  onNewTemplate,
  onImportCSV,
  onViewReports,
  onESPSettings,
}: QuickActionsProps) {
  const actions: QuickAction[] = [
    {
      icon: <Mail className="size-5" />,
      title: 'Create Campaign',
      description: 'Send a new newsletter',
      color: 'bg-blue-100 text-blue-600 hover:bg-blue-200',
      onClick: () => onCreateCampaign?.(),
    },
    {
      icon: <Users className="size-5" />,
      title: 'Add Contacts',
      description: 'Import subscribers',
      color: 'bg-purple-100 text-purple-600 hover:bg-purple-200',
      onClick: () => onAddContacts?.(),
    },
    {
      icon: <FileText className="size-5" />,
      title: 'New Template',
      description: 'Design email template',
      color: 'bg-green-100 text-green-600 hover:bg-green-200',
      onClick: () => onNewTemplate?.(),
    },
    {
      icon: <Upload className="size-5" />,
      title: 'Import CSV',
      description: 'Bulk upload contacts',
      color: 'bg-orange-100 text-orange-600 hover:bg-orange-200',
      onClick: () => onImportCSV?.(),
    },
    {
      icon: <PieChart className="size-5" />,
      title: 'View Reports',
      description: 'Analyze performance',
      color: 'bg-teal-100 text-teal-600 hover:bg-teal-200',
      onClick: () => onViewReports?.(),
    },
    {
      icon: <Settings className="size-5" />,
      title: 'ESP Settings',
      description: 'Configure sending',
      color: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      onClick: () => onESPSettings?.(),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className="flex items-start p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left group"
            >
              <div className={`p-3 rounded-lg ${action.color} transition-colors mr-3 flex-shrink-0`}>
                {action.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-sm text-gray-600">{action.description}</p>
              </div>
              <ArrowRight className="size-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all ml-2 mt-1 flex-shrink-0" />
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}