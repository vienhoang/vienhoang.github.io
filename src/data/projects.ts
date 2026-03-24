export interface Project {
  id: number
  name: string
  description: string
  technologies: string[]
  imageUrl: string
  demoUrl?: string
  repoUrl?: string
  color: string
}

export const projects: Project[] = [
  {
    id: 1,
    name: 'netabbr.com',
    description: 'A small dictionary with network and cybersecurity abbreviations and terms, built to help students and technicians quickly look up common terms.',
    technologies: ['React', 'JavaScript', 'HTML', 'CSS', 'JSON'],
    imageUrl: `${import.meta.env.BASE_URL}images/netabbr.jpg`,
    demoUrl: 'https://netabbr.com/',
    color: 'bg-cube-sage',
  },
  {
    id: 2,
    name: 'Bitcoin Value Projector',
    description: 'A free and privacy-focused tool that lets you interactively explore potential future bitcoin price scenarios.',
    technologies: ['JavaScript', 'HTML', 'CSS'],
    imageUrl: `${import.meta.env.BASE_URL}images/bitcoin-value-projector.jpg`,
    demoUrl: 'https://bitcoin-value-projector.pages.dev/',
    color: 'bg-cube-peach',
  },
  {
    id: 3,
    name: 'Viper Port Scanner',
    description: 'A Python tool that scans ports, saves results, and adds a fun visual and audio experience while you wait.',
    technologies: ['Python'],
    imageUrl: `${import.meta.env.BASE_URL}images/portscanner.jpg`,
    repoUrl: 'https://github.com/vienhoang/viper-port-scanner',
    color: 'bg-cube-blue',
  }
]
