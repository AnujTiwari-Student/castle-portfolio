// frontend/app/config/branding.ts

import type { BrandingConfig } from '@/types'

export const brandingConfig = {
  user: {
    name: 'Anuj Tiwari',
    displayName: 'Anuj',
    currentRole: 'Software Engineer (Apprentice)',
    company: 'Reliance Jio',
    location: 'India',
    employmentDate: 'Mar 2026 – Present',
    tagline:
      'Building reliable backend systems, SRE workflows, and DevOps automation.',
  },

  jioCabin: {
    plaque: {
      enabled: true,
      titleTemplate: '{USER_NAME} | {CURRENT_ROLE}',
      subtitle: 'Reliance Jio SRE Command Center',
      metaTemplate: '{COMPANY} | {EMPLOYMENT_DATE}',
      style: 'glassmorphism',
    },

    statusPanels: [
      {
        id: 'current-sprint',
        label: 'Current Sprint',
        value: 'Backend Optimization',
        variant: 'info',
        visible: true,
      },
      {
        id: 'on-call',
        label: 'On-Call Status',
        value: 'Active',
        variant: 'warning',
        visible: true,
      },
      {
        id: 'system-health',
        label: 'System Health',
        value: 'Stable',
        variant: 'success',
        visible: true,
      },
      {
        id: 'work-mode',
        label: 'Work Mode',
        value: 'Currently Working Here',
        variant: 'info',
        visible: true,
      },
    ],

    techStackWall: {
      enabled: true,
      items: [
        {
          id: 'go',
          label: 'Go',
          icon: 'go',
          visible: true,
          glow: true,
        },
        {
          id: 'azure',
          label: 'Azure',
          icon: 'azure',
          visible: true,
          glow: true,
        },
        {
          id: 'devops',
          label: 'DevOps',
          icon: 'devops',
          visible: true,
          glow: true,
        },
        {
          id: 'grpc',
          label: 'gRPC',
          icon: 'grpc',
          visible: true,
          glow: true,
        },
        {
          id: 'postgresql',
          label: 'PostgreSQL',
          icon: 'postgresql',
          visible: true,
          glow: true,
        },
      ],
    },

    dashboards: {
      enabled: true,
      style: 'grafana-inspired',
      panels: [
        {
          id: 'latency',
          title: 'API Latency',
          metric: 'p95 latency',
          value: '128ms',
          trend: 'down',
          visible: true,
        },
        {
          id: 'error-rate',
          title: 'Error Rate',
          metric: '5xx errors',
          value: '0.03%',
          trend: 'stable',
          visible: true,
        },
        {
          id: 'uptime',
          title: 'Service Uptime',
          metric: 'availability',
          value: '99.98%',
          trend: 'up',
          visible: true,
        },
        {
          id: 'traffic',
          title: 'Portal Traffic',
          metric: 'requests/min',
          value: '42.7k',
          trend: 'up',
          visible: true,
        },
        {
          id: 'kubernetes-health',
          title: 'Kubernetes Health',
          metric: 'healthy pods',
          value: '47 / 48',
          trend: 'stable',
          visible: true,
        },
        {
          id: 'db-query-latency',
          title: 'DB Query Latency',
          metric: 'avg query time',
          value: '18ms',
          trend: 'down',
          visible: true,
        },
      ],
    },

    achievementShelf: {
      enabled: true,
      trophies: [
        {
          id: 'backend-optimization',
          title: 'Backend Optimization',
          description:
            'Improved reliability and performance for backend workflows.',
          model: 'trophy',
          visible: true,
        },
        {
          id: 'sre-automation',
          title: 'SRE Automation',
          description:
            'Built automation-focused reliability tooling and backend support workflows.',
          model: 'badge',
          visible: true,
        },
        {
          id: 'observability-focus',
          title: 'Observability Focus',
          description:
            'Worked with monitoring-first engineering practices and reliability signals.',
          model: 'cube',
          visible: true,
        },
      ],
    },

    customSections: [
      {
        id: 'focus-areas',
        title: 'Current Focus Areas',
        type: 'list',
        visible: true,
        items: [
          'Backend reliability',
          'Go service development',
          'gRPC service health',
          'Azure-oriented workflows',
          'DevOps practices',
          'PostgreSQL-backed systems',
          'Observability and monitoring awareness',
        ],
      },
      {
        id: 'daily-loop',
        title: 'Daily Engineering Loop',
        type: 'timeline',
        visible: true,
        items: [
          'Monitor dashboards',
          'Check alerts',
          'Review service health',
          'Debug backend issues',
          'Ship reliability improvements',
        ],
      },
    ],
  },
} as const satisfies BrandingConfig