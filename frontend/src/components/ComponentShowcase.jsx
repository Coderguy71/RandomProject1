import React, { useState } from 'react';
import {
  Button,
  Input,
  Card,
  Badge,
  ProgressBar,
  Modal,
  Toast,
  Spinner,
  Tabs,
  Stepper,
  Navigation,
  Chart,
  Skeleton,
} from '../ui';

const ComponentShowcase = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [progressValue, setProgressValue] = useState(65);
  const [activeTab, setActiveTab] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [activeNavItem, setActiveNavItem] = useState('dashboard');

  // Sample data for charts
  const chartData = [
    { id: 1, label: 'Jan', value: 45 },
    { id: 2, label: 'Feb', value: 52 },
    { id: 3, label: 'Mar', value: 38 },
    { id: 4, label: 'Apr', value: 65 },
    { id: 5, label: 'May', value: 48 },
    { id: 6, label: 'Jun', value: 78 },
  ];

  const pieChartData = [
    { id: 1, label: 'Algebra', value: 35 },
    { id: 2, label: 'Geometry', value: 25 },
    { id: 3, label: 'Statistics', value: 20 },
    { id: 4, label: 'Probability', value: 20 },
  ];

  const tabs = [
    {
      id: 'components',
      label: 'Components',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Button Showcase */}
          <Card>
            <Card.Header>
              <Card.Title>Buttons</Card.Title>
              <Card.Description>Various button styles and states</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="primary" size="sm">Primary</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="gradient">Gradient</Button>
                <Button variant="danger">Danger</Button>
              </div>
              <div className="flex gap-2">
                <Button loading>Loading</Button>
                <Button disabled>Disabled</Button>
              </div>
            </Card.Content>
          </Card>

          {/* Badge Showcase */}
          <Card>
            <Card.Header>
              <Card.Title>Badges</Card.Title>
              <Card.Description>Status indicators and labels</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="default">Default</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="danger">Danger</Badge>
                <Badge variant="info">Info</Badge>
                <Badge variant="gradient">Gradient</Badge>
              </div>
              <div className="flex gap-2">
                <Badge removable onRemove={() => {}}>Removable</Badge>
                <Badge size="lg">Large Badge</Badge>
              </div>
            </Card.Content>
          </Card>

          {/* Progress Bar Showcase */}
          <Card>
            <Card.Header>
              <Card.Title>Progress Bars</Card.Title>
              <Card.Description>Loading and progress indicators</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <ProgressBar value={progressValue} showLabel />
              <ProgressBar value={80} variant="success" striped />
              <ProgressBar value={45} variant="warning" size="sm" />
              <ProgressBar value={90} variant="gradient" animated />
              <Button 
                size="sm" 
                onClick={() => setProgressValue(Math.min(100, progressValue + 10))}
              >
                Increase Progress
              </Button>
            </Card.Content>
          </Card>

          {/* Spinner Showcase */}
          <Card>
            <Card.Header>
              <Card.Title>Spinners</Card.Title>
              <Card.Description>Loading animations</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <div className="flex items-center space-x-4">
                <Spinner size="sm" />
                <Spinner />
                <Spinner size="lg" variant="gradient" />
              </div>
              <div className="flex items-center space-x-4">
                <Spinner.Pulse />
                <Spinner.Dots />
              </div>
              <Spinner label="Loading..." />
            </Card.Content>
          </Card>

          {/* Input Showcase */}
          <Card>
            <Card.Header>
              <Card.Title>Input Fields</Card.Title>
              <Card.Description>Form inputs with validation</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <Input
                placeholder="Enter your email"
                label="Email Address"
                type="email"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Input
                placeholder="Enter password"
                label="Password"
                type="password"
              />
              <Input
                placeholder="Search..."
                label="Search"
                error="This field is required"
              />
            </Card.Content>
          </Card>

          {/* Skeleton Showcase */}
          <Card>
            <Card.Header>
              <Card.Title>Skeleton Loaders</Card.Title>
              <Card.Description>Content placeholders</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-4">
              <Skeleton lines={3} />
              <div className="flex items-center space-x-3">
                <Skeleton variant="avatar" />
                <div className="flex-1">
                  <Skeleton width="60%" />
                  <Skeleton width="40%" className="mt-2" />
                </div>
              </div>
            </Card.Content>
          </Card>
        </div>
      ),
    },
    {
      id: 'navigation',
      label: 'Navigation',
      content: (
        <div className="space-y-8">
          {/* Navigation Demo */}
          <Card>
            <Card.Header>
              <Card.Title>Navigation Components</Card.Title>
              <Card.Description>Interactive navigation elements</Card.Description>
            </Card.Header>
            <Card.Content className="space-y-6">
              <div>
                <h4 className="text-lg font-medium text-dark-100 mb-4">Horizontal Navigation</h4>
                <Navigation
                  items={[
                    { id: 'dashboard', label: 'Dashboard', badge: 'New' },
                    { id: 'practice', label: 'Practice' },
                    { id: 'analytics', label: 'Analytics' },
                    { id: 'settings', label: 'Settings' },
                  ]}
                  activeItem={activeNavItem}
                  onItemClick={(item) => setActiveNavItem(item.id)}
                  variant="pills"
                />
              </div>

              <div>
                <h4 className="text-lg font-medium text-dark-100 mb-4">Vertical Navigation</h4>
                <div className="w-64">
                  <Navigation
                    items={[
                      { id: 'dashboard', label: 'Dashboard', icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      )},
                      { id: 'practice', label: 'Practice', icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      )},
                      { id: 'analytics', label: 'Analytics', icon: (
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      )},
                    ]}
                    activeItem={activeNavItem}
                    onItemClick={(item) => setActiveNavItem(item.id)}
                    orientation="vertical"
                  />
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-dark-100 mb-4">Tabs</h4>
                <Tabs
                  tabs={[
                    { id: 'overview', label: 'Overview', content: <p className="text-dark-200">Overview content goes here...</p> },
                    { id: 'details', label: 'Details', content: <p className="text-dark-200">Detailed information...</p> },
                    { id: 'settings', label: 'Settings', content: <p className="text-dark-200">Settings panel...</p> },
                  ]}
                  activeTab={activeTab}
                  onChange={(index) => setActiveTab(index)}
                  variant="underline"
                />
              </div>
            </Card.Content>
          </Card>
        </div>
      ),
    },
    {
      id: 'charts',
      label: 'Charts',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <Card.Header>
              <Card.Title>Bar Chart</Card.Title>
              <Card.Description>Monthly performance metrics</Card.Description>
            </Card.Header>
            <Card.Content>
              <Chart type="bar" data={chartData} height={250} />
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Line Chart</Card.Title>
              <Card.Description>Progress over time</Card.Description>
            </Card.Header>
            <Card.Content>
              <Chart type="line" data={chartData} height={250} />
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Pie Chart</Card.Title>
              <Card.Description>Topic distribution</Card.Description>
            </Card.Header>
            <Card.Content>
              <Chart type="pie" data={pieChartData} height={250} />
            </Card.Content>
          </Card>

          <Card>
            <Card.Header>
              <Card.Title>Stepper</Card.Title>
              <Card.Description>Multi-step process indicator</Card.Description>
            </Card.Header>
            <Card.Content>
              <Stepper
                steps={[
                  { id: 1, label: 'Profile Setup' },
                  { id: 2, label: 'Skill Assessment' },
                  { id: 3, label: 'Learning Path' },
                  { id: 4, label: 'Start Practice' },
                ]}
                currentStep={currentStep}
                onStepClick={setCurrentStep}
                variant="gradient"
              />
              <div className="mt-6">
                <Button 
                  size="sm" 
                  onClick={() => setCurrentStep(Math.min(3, currentStep + 1))}
                  disabled={currentStep >= 3}
                >
                  Next Step
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-dark-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-premium">
            Premium Design System
          </h1>
          <p className="text-lg text-dark-400">
            Black and Purple Theme with Glassmorphism Effects
          </p>
        </div>

        {/* Toast Demo */}
        <div className="fixed top-4 right-4 z-50 space-y-2">
          <Toast.Container
            toasts={[
              {
                id: 1,
                type: 'success',
                title: 'Welcome!',
                message: 'Explore our premium component library.',
                onClose: () => {},
              },
            ]}
            position="top-right"
          />
        </div>

        {/* Main Content */}
        <Tabs
          tabs={tabs}
          variant="pills"
          size="lg"
          className="w-full"
        />

        {/* Modal Demo */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Premium Modal"
          description="This is an example of our premium modal component with backdrop blur."
          size="md"
          footer={
            <div className="flex space-x-3">
              <Button variant="ghost" onClick={() => setModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setModalOpen(false)}>
                Confirm
              </Button>
            </div>
          }
        >
          <div className="space-y-4">
            <p className="text-dark-200">
              This modal showcases our premium design system with glassmorphism effects,
              smooth animations, and a polished user experience.
            </p>
            <Input placeholder="Enter something..." label="Example Input" />
            <ProgressBar value={75} showLabel label="Modal Progress" />
          </div>
        </Modal>

        {/* Modal Trigger */}
        <div className="text-center">
          <Button variant="gradient" onClick={() => setModalOpen(true)}>
            Open Premium Modal
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ComponentShowcase;