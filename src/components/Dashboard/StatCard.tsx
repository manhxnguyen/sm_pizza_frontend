import React from 'react';
import { Card, Text, Group, ThemeIcon } from '@mantine/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: IconDefinition;
  color: string;
  description?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon, 
  color, 
  description 
}) => {
  return (
    <Card withBorder p="lg" className="pizza-card">
      <Group justify="apart">
        <div>
          <Text c="dimmed" size="sm" fw={500}>
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value}
          </Text>
          {description && (
            <Text size="xs" c="dimmed" mt="xs">
              {description}
            </Text>
          )}
        </div>
        <ThemeIcon
          color={color}
          variant="light"
          size="lg"
          radius="md"
        >
          <FontAwesomeIcon icon={icon} />
        </ThemeIcon>
      </Group>
    </Card>
  );
};
