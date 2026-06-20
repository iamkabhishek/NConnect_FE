import { useState } from 'react';
import {
  ArrowLeft, Save, Play, MoreVertical, Trash2, Copy, Plus,
  Zap, Mail, Clock, Users, Filter, Tag, Link, GitBranch,
  CheckCircle, AlertCircle, Settings, Eye
} from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface NavigationProps {
  onNavigate: (page: string) => void;
}

type NodeType = 'trigger' | 'action' | 'condition' | 'delay';

interface WorkflowNode {
  id: string;
  type: NodeType;
  config: {
    title: string;
    subtitle?: string;
    icon?: string;
    settings?: Record<string, any>;
  };
}

export function WorkflowBuilderPage({ onNavigate }: NavigationProps) {
  const [workflowName, setWorkflowName] = useState('Welcome Series');
  const [workflowDescription, setWorkflowDescription] = useState('Automated welcome emails for new subscribers');
  const [showSidebar, setShowSidebar] = useState(true);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showNodeSettings, setShowNodeSettings] = useState(false);

  // Sample workflow nodes
  const [nodes, setNodes] = useState<WorkflowNode[]>([
    {
      id: '1',
      type: 'trigger',
      config: {
        title: 'Subscriber Joins Group',
        subtitle: 'Newsletter Subscribers',
        icon: '👤',
        settings: { groupId: 'newsletter-subscribers' }
      }
    },
    {
      id: '2',
      type: 'delay',
      config: {
        title: 'Wait',
        subtitle: '1 day',
        icon: '⏰',
        settings: { duration: 1, unit: 'days' }
      }
    },
    {
      id: '3',
      type: 'action',
      config: {
        title: 'Send Email',
        subtitle: 'Welcome Email Template',
        icon: '✉️',
        settings: { templateId: 'welcome-email' }
      }
    },
    {
      id: '4',
      type: 'delay',
      config: {
        title: 'Wait',
        subtitle: '2 days',
        icon: '⏰',
        settings: { duration: 2, unit: 'days' }
      }
    },
    {
      id: '5',
      type: 'action',
      config: {
        title: 'Send Email',
        subtitle: 'Getting Started Guide',
        icon: '✉️',
        settings: { templateId: 'getting-started' }
      }
    }
  ]);

  const availableBlocks = [
    {
      category: 'Triggers',
      items: [
        { type: 'trigger', icon: '👤', title: 'Subscriber Joins', subtitle: 'When added to group' },
        { type: 'trigger', icon: '📧', title: 'Email Opened', subtitle: 'When email is opened' },
        { type: 'trigger', icon: '🖱️', title: 'Link Clicked', subtitle: 'When link is clicked' },
        { type: 'trigger', icon: '📅', title: 'Date Based', subtitle: 'On specific date/time' },
        { type: 'trigger', icon: '💤', title: 'Inactivity', subtitle: 'After period of no action' }
      ]
    },
    {
      category: 'Actions',
      items: [
        { type: 'action', icon: '✉️', title: 'Send Email', subtitle: 'Send template email' },
        { type: 'action', icon: '➕', title: 'Add to Group', subtitle: 'Add subscriber to group' },
        { type: 'action', icon: '➖', title: 'Remove from Group', subtitle: 'Remove from group' },
        { type: 'action', icon: '🏷️', title: 'Add Tag', subtitle: 'Tag subscriber' },
        { type: 'action', icon: '📝', title: 'Update Field', subtitle: 'Update subscriber data' }
      ]
    },
    {
      category: 'Logic',
      items: [
        { type: 'condition', icon: '🔀', title: 'If/Else Condition', subtitle: 'Branch based on data' },
        { type: 'delay', icon: '⏰', title: 'Wait', subtitle: 'Add time delay' },
        { type: 'condition', icon: '🎯', title: 'Filter', subtitle: 'Filter subscribers' }
      ]
    }
  ];

  const handleAddNode = (type: string, title: string) => {
    const newNode: WorkflowNode = {
      id: Date.now().toString(),
      type: type as NodeType,
      config: {
        title,
        subtitle: 'Configure settings',
        icon: availableBlocks.flatMap(cat => cat.items).find(item => item.title === title)?.icon || '⚙️'
      }
    };
    setNodes([...nodes, newNode]);
  };

  const handleDeleteNode = (nodeId: string) => {
    setNodes(nodes.filter(node => node.id !== nodeId));
    if (selectedNode === nodeId) {
      setSelectedNode(null);
      setShowNodeSettings(false);
    }
  };

  const handleDuplicateNode = (nodeId: string) => {
    const nodeToDuplicate = nodes.find(node => node.id === nodeId);
    if (nodeToDuplicate) {
      const newNode: WorkflowNode = {
        ...nodeToDuplicate,
        id: Date.now().toString(),
        config: {
          ...nodeToDuplicate.config,
          title: nodeToDuplicate.config.title + ' (Copy)'
        }
      };
      const index = nodes.findIndex(node => node.id === nodeId);
      const newNodes = [...nodes];
      newNodes.splice(index + 1, 0, newNode);
      setNodes(newNodes);
    }
  };

  const getNodeColor = (type: NodeType) => {
    switch (type) {
      case 'trigger':
        return 'bg-purple-50 border-purple-300 text-purple-700';
      case 'action':
        return 'bg-blue-50 border-blue-300 text-blue-700';
      case 'condition':
        return 'bg-amber-50 border-amber-300 text-amber-700';
      case 'delay':
        return 'bg-green-50 border-green-300 text-green-700';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar - Building Blocks */}
      <div className={`${showSidebar ? 'w-80' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden flex-shrink-0`}>
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-1">Building Blocks</h3>
          <p className="text-sm text-gray-600">Drag or click to add to workflow</p>
        </div>
        <div className="p-4">
          {availableBlocks.map((category, catIndex) => (
            <div key={catIndex} className="mb-6">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                {category.category}
              </h4>
              <div className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <button
                    key={itemIndex}
                    onClick={() => handleAddNode(item.type, item.title)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-3 hover:border-blue-400 hover:shadow-sm transition-all text-left group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{item.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 group-hover:text-blue-600 truncate">
                          {item.title}
                        </div>
                        <div className="text-xs text-gray-500 truncate">{item.subtitle}</div>
                      </div>
                      <Plus className="size-4 text-gray-400 group-hover:text-blue-600 flex-shrink-0" />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content - Workflow Canvas */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => onNavigate('automation')}
              >
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
              <div className="h-8 w-px bg-gray-300" />
              <div className="flex-1">
                <input
                  type="text"
                  value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
                  className="text-lg font-bold text-gray-900 border-0 focus:ring-0 p-0 w-full"
                  placeholder="Workflow name"
                />
                <input
                  type="text"
                  value={workflowDescription}
                  onChange={(e) => setWorkflowDescription(e.target.value)}
                  className="text-sm text-gray-600 border-0 focus:ring-0 p-0 w-full mt-1"
                  placeholder="Add description..."
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <Eye className="size-4 mr-2" />
                Preview
              </Button>
              <Button variant="outline">
                <Save className="size-4 mr-2" />
                Save Draft
              </Button>
              <Button className="bg-green-600 hover:bg-green-700">
                <Play className="size-4 mr-2" />
                Activate
              </Button>
            </div>
          </div>
        </div>

        {/* Workflow Canvas */}
        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto py-12 px-6">
            {/* Workflow Stats */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-sm text-blue-600 mb-1">Total Steps</p>
                  <p className="text-2xl font-bold text-blue-900">{nodes.length}</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 mb-1">Estimated Duration</p>
                  <p className="text-2xl font-bold text-blue-900">5 days</p>
                </div>
                <div>
                  <p className="text-sm text-blue-600 mb-1">Status</p>
                  <p className="text-2xl font-bold text-blue-900">Draft</p>
                </div>
              </div>
            </div>

            {/* Workflow Nodes */}
            {nodes.length === 0 ? (
              <div className="text-center py-12">
                <Zap className="size-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Start Building Your Workflow</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Add blocks from the left sidebar to create your automation
                </p>
                <Button onClick={() => setShowSidebar(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="size-4 mr-2" />
                  Add First Block
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {nodes.map((node, index) => (
                  <div key={node.id}>
                    {/* Node Card */}
                    <div
                      className={`relative group ${
                        selectedNode === node.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                    >
                      <div
                        onClick={() => {
                          setSelectedNode(node.id);
                          setShowNodeSettings(true);
                        }}
                        className={`border-2 rounded-lg p-5 cursor-pointer transition-all ${getNodeColor(node.type)} hover:shadow-md`}
                      >
                        {/* Node Type Badge */}
                        <div className="absolute -top-3 left-4">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white border-2 border-gray-200 text-gray-700">
                            {node.type === 'trigger' && '🎯 Trigger'}
                            {node.type === 'action' && '⚡ Action'}
                            {node.type === 'condition' && '🔀 Condition'}
                            {node.type === 'delay' && '⏰ Delay'}
                          </span>
                        </div>

                        <div className="flex items-start gap-4 mt-2">
                          {/* Icon */}
                          <div className="text-4xl">{node.config.icon}</div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {node.config.title}
                            </h4>
                            {node.config.subtitle && (
                              <p className="text-sm text-gray-600">{node.config.subtitle}</p>
                            )}
                          </div>

                          {/* Actions Menu */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedNode(node.id);
                                setShowNodeSettings(true);
                              }}
                              title="Settings"
                            >
                              <Settings className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDuplicateNode(node.id);
                              }}
                              title="Duplicate"
                            >
                              <Copy className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNode(node.id);
                              }}
                              title="Delete"
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="size-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Node Stats (for actions) */}
                        {node.type === 'action' && (
                          <div className="mt-4 pt-4 border-t border-current/20">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Sent:</span>
                                <span className="font-semibold ml-2">1,245</span>
                              </div>
                              <div>
                                <span className="text-gray-600">Open Rate:</span>
                                <span className="font-semibold ml-2">34.5%</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Connector Arrow */}
                    {index < nodes.length - 1 && (
                      <div className="flex justify-center py-2">
                        <div className="flex flex-col items-center">
                          <div className="h-8 w-px bg-gray-300" />
                          <div className="size-2 rounded-full bg-gray-300" />
                          <div className="h-8 w-px bg-gray-300" />
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {/* Add Step Button */}
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={() => setShowSidebar(true)}
                    variant="outline"
                    className="border-dashed border-2"
                  >
                    <Plus className="size-4 mr-2" />
                    Add Step
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Right Sidebar - Node Settings */}
      {showNodeSettings && selectedNode && (
        <div className="w-96 bg-white border-l border-gray-200 flex-shrink-0">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Settings</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowNodeSettings(false);
                setSelectedNode(null);
              }}
            >
              <ArrowLeft className="size-4" />
            </Button>
          </div>
          <div className="p-6 overflow-y-auto h-[calc(100vh-140px)]">
            {(() => {
              const node = nodes.find(n => n.id === selectedNode);
              if (!node) return null;

              return (
                <div className="space-y-6">
                  {/* Node Info */}
                  <div>
                    <div className="text-4xl mb-3">{node.config.icon}</div>
                    <h4 className="font-semibold text-gray-900 mb-1">{node.config.title}</h4>
                    <p className="text-sm text-gray-600">{node.config.subtitle}</p>
                  </div>

                  <div className="h-px bg-gray-200" />

                  {/* Settings based on node type */}
                  {node.type === 'trigger' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Select Group
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Newsletter Subscribers</option>
                          <option>VIP Members</option>
                          <option>Product Updates</option>
                        </select>
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-sm text-blue-800">
                          This workflow will trigger when a subscriber is added to the selected group.
                        </p>
                      </div>
                    </div>
                  )}

                  {node.type === 'action' && node.config.title === 'Send Email' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Template
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Welcome Email</option>
                          <option>Getting Started Guide</option>
                          <option>Feature Highlights</option>
                          <option>Special Offer</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Subject Line
                        </label>
                        <input
                          type="text"
                          defaultValue="Welcome to NConnect! 🎉"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Personalization
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {['{{first_name}}', '{{email}}', '{{company}}']. map((tag) => (
                            <button
                              key={tag}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200"
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {node.type === 'delay' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Wait Duration
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            defaultValue="1"
                            min="1"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option>Minutes</option>
                            <option>Hours</option>
                            <option selected>Days</option>
                            <option>Weeks</option>
                          </select>
                        </div>
                      </div>
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800">
                          Subscribers will wait at this step before continuing to the next action.
                        </p>
                      </div>
                    </div>
                  )}

                  {node.type === 'condition' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Condition Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                          <option>Email opened</option>
                          <option>Link clicked</option>
                          <option>Has tag</option>
                          <option>Custom field value</option>
                        </select>
                      </div>
                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <p className="text-sm text-amber-800">
                          Split your workflow into two paths based on this condition.
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="h-px bg-gray-200" />

                  <div className="space-y-2">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <CheckCircle className="size-4 mr-2" />
                      Save Settings
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-300 hover:bg-red-50"
                      onClick={() => handleDeleteNode(selectedNode)}
                    >
                      <Trash2 className="size-4 mr-2" />
                      Delete Step
                    </Button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}