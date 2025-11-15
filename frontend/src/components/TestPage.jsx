import React from 'react';
import { Button, Card, Input } from '../ui';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-dark-950 p-8">
      <Card className="max-w-md mx-auto">
        <Card.Header>
          <Card.Title>Test Components</Card.Title>
          <Card.Description>Testing premium design system</Card.Description>
        </Card.Header>
        <Card.Content className="space-y-4">
          <Input placeholder="Test input" label="Test Label" />
          <Button variant="primary">Test Button</Button>
        </Card.Content>
      </Card>
    </div>
  );
};

export default TestPage;