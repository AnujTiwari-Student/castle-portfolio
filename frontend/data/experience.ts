// frontend/data/experience.ts

import type { ExperienceEntry } from '@/types'

export const EXPERIENCE: ExperienceEntry[] = [
  {
    year: 2019,
    title: 'Diploma in Computer Science — Starting Point',
    company: 'HIST',
    description:
      'Started my technical journey with computer science fundamentals, programming basics, Linux usage, and command-line workflows.',
    tech: ['C', 'Linux', 'Bash', 'Programming Fundamentals'],
    type: 'education',
    dateRange: '2019',
    location: 'Prayagraj, India',
  },
  {
    year: 2020,
    title: 'Full-Stack Foundations',
    company: 'HIST',
    description:
      'Built a foundation in web development by learning responsive layouts, JavaScript fundamentals, Git workflows, and basic frontend architecture.',
    tech: ['HTML5', 'CSS3', 'JavaScript', 'Git'],
    type: 'education',
    dateRange: '2020',
    location: 'Prayagraj, India',
  },
  {
    year: 2021,
    title: 'Backend Systems & API Design',
    company: 'HIST',
    description:
      'Moved deeper into backend development, focusing on API design, server-side logic, database concepts, and request-response workflows.',
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Postman'],
    type: 'education',
    dateRange: '2021',
    location: 'Prayagraj, India',
  },
  {
    year: 2022,
    title: 'Diploma Completion',
    company: 'HIST',
    description:
      'Completed diploma studies with a stronger understanding of software development, databases, system basics, and project implementation.',
    tech: ['Systems Engineering', 'SQL', 'Project Development'],
    type: 'education',
    dateRange: 'Jun 2022',
    location: 'Prayagraj, India',
  },
  {
    year: 2022,
    title: 'B.Tech Computer Science — Lateral Entry',
    company: 'SRMU',
    description:
      'Started B.Tech through lateral entry and expanded into object-oriented programming, data structures, algorithms, and engineering fundamentals.',
    tech: ['Python', 'Java', 'C++', 'Data Structures'],
    type: 'education',
    dateRange: 'Aug 2022',
    location: 'Lucknow, India',
  },
  {
    year: 2023,
    title: 'Advanced Engineering Theory',
    company: 'SRMU',
    description:
      'Focused on operating systems, database management, algorithms, and distributed systems concepts as part of core computer science coursework.',
    tech: ['PostgreSQL', 'System Design', 'Algorithms', 'Operating Systems'],
    type: 'education',
    dateRange: '2023',
    location: 'Lucknow, India',
  },
  {
    year: 2024,
    title: 'Core Systems & Cloud Engineering',
    company: 'SRMU',
    description:
      'Started applying cloud, containerization, deployment, and DevOps concepts through academic and practical engineering projects.',
    tech: ['Docker', 'Kubernetes', 'Cloud Computing', 'DevOps'],
    type: 'education',
    dateRange: '2024',
    location: 'Lucknow, India',
  },
  {
    year: 2024,
    title: 'Software Developer Intern',
    company: 'Synapsesphere Technologies',
    description:
      'Worked on frontend and backend features, improving application structure, UI implementation, and TypeScript-based development workflows.',
    tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Redux'],
    type: 'internship',
    dateRange: 'Sep 2024 – Feb 2025',
    location: 'Lucknow, India',
  },
  {
    year: 2025,
    title: 'B.Tech Graduation',
    company: 'SRMU',
    description:
      'Completed B.Tech in Computer Science with focus areas including cloud architecture, deployment workflows, backend systems, and reliability-minded engineering.',
    tech: ['AWS', 'Cloud Architecture', 'Nginx', 'CI/CD'],
    type: 'education',
    dateRange: 'May 2025',
    location: 'Lucknow, India',
  },
  {
    year: 2025,
    title: 'Software Developer Intern',
    company: 'Microtex Clothing Pvt Ltd',
    description:
      'Worked on application development and deployment-focused tasks involving modern frontend systems, containerized workflows, and cloud-oriented infrastructure.',
    tech: ['Next.js 15', 'Kubernetes', 'Docker', 'AWS'],
    type: 'internship',
    dateRange: 'Oct 2025 – Feb 2026',
    location: 'Mumbai, India',
  },
  {
    year: 2026,
    title: 'Software Engineer (Apprentice)',
    company: 'Reliance Jio',
    description:
      'Currently working on backend-focused engineering, reliability-oriented workflows, and scalable service development using Go, cloud, DevOps, and database systems.',
    tech: ['Go', 'Azure', 'DevOps', 'gRPC', 'PostgreSQL'],
    type: 'job',
    dateRange: 'Mar 2026 – Present',
    location: 'Mumbai, India',
  },
  {
    year: 2026,
    title: 'SYSTEM OVERLOAD // FUTURE STATE',
    company: 'Future State',
    description:
      'The timeline reaches the current edge. The projector glitches, overloads, and transitions into the next chapter: deeper SRE, distributed backend systems, and high-scale infrastructure work.',
    tech: ['Distributed Systems', 'Advanced Go', 'SRE', 'Infrastructure as Code'],
    type: 'overload',
    dateRange: 'Beyond 2026',
    location: 'Undefined',
    isSystemOverload: true,
  },
]

export const EXPERIENCE_NORMAL: ExperienceEntry[] = EXPERIENCE.filter(
  (entry) => !entry.isSystemOverload
)

export const EXPERIENCE_OVERLOAD: ExperienceEntry =
  EXPERIENCE.find((entry) => entry.isSystemOverload) ?? {
    year: 2026,
    title: 'SYSTEM OVERLOAD // FUTURE STATE',
    company: 'Future State',
    description:
      'The timeline reaches the current edge and transitions into the next chapter.',
    tech: ['SRE', 'Distributed Systems', 'Go'],
    type: 'overload',
    dateRange: 'Beyond 2026',
    location: 'Undefined',
    isSystemOverload: true,
  }

export const EXPERIENCE_TOTAL = EXPERIENCE.length

export const EXPERIENCE_START_YEAR = EXPERIENCE[0]?.year ?? 2019

export const EXPERIENCE_END_YEAR =
  EXPERIENCE_NORMAL[EXPERIENCE_NORMAL.length - 1]?.year ?? 2026 