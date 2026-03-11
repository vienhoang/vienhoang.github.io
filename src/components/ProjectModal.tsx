import React from 'react'
import { Project } from '../data/projects'

interface ProjectModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!isOpen || !project) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-8" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video bg-gray-200">
          <img 
            src={project.imageUrl} 
            alt={project.name} 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect fill='%23${project.color.includes('-') ? project.color.split('-')[2] : 'ccc'}' width='200' height='200'/%3E%3Ctext fill='%23ffffff' font-family='sans-serif' font-size='20' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E`
            }}
          />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 text-white p-3 rounded-full hover:bg-black/70 transition shadow-lg"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">{project.name}</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.map((tech, idx) => (
              <span key={idx} className="bg-blue-100 text-blue-800 px-4 py-1.5 rounded-full text-sm font-medium">
                {tech}
              </span>
            ))}
          </div>
          <p className="text-gray-600 mb-6 leading-relaxed text-xl">{project.description}</p>
          <div className="flex gap-4 flex-wrap">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-6 py-2.5 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md"
              >
                <span>🚀 Live</span>
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 text-white px-6 py-2.5 rounded-lg hover:bg-gray-900 transition flex items-center gap-2 shadow-md"
              >
                <span> GitHub</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectModal
