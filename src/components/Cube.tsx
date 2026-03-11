import React from 'react'
import { Project } from '../data/projects'

interface CubeProps {
  project: Project
  position: { x: number; y: number }
  isHovered: boolean
  onMouseEnter: () => void
  onMouseLeave: () => void
  onClick: (project: Project) => void
}

const Cube: React.FC<CubeProps> = ({ project, position, isHovered, onMouseEnter, onMouseLeave, onClick }) => {
  const colorMap: Record<string, string> = {
    'bg-cube-sage': '#A7F3D0',
    'bg-cube-rose': '#FBCFE8',
    'bg-cube-blue': '#BFDBFE',
    'bg-cube-lavender': '#E9D5FF',
    'bg-cube-peach': '#FED7AA',
    'bg-cube-mint': '#D1FAE5',
  }
  
  const baseColor = colorMap[project.color] || '#A7F3D0'
  const lightColor = adjustColor(baseColor, 15)
  const darkColor = adjustColor(baseColor, -15)
  const darkerColor = adjustColor(baseColor, -30)

  function adjustColor(hex: string, amount: number): string {
    const num = parseInt(hex.slice(1), 16)
    const r = Math.min(255, Math.max(0, (num >> 16) + amount))
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0x00FF) + amount))
    const b = Math.min(255, Math.max(0, (num & 0x0000FF) + amount))
    return `rgb(${r}, ${g}, ${b})`
  }

  return (
    <div
      className={`absolute cursor-pointer ${isHovered ? 'z-50' : 'z-10'}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        perspective: '800px',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={() => onClick(project)}
    >
      <div 
        className={`relative w-32 h-32 transition-transform duration-300 ${isHovered ? 'scale-110' : 'animate-bounce-3d'}`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isHovered ? 'rotateX(0deg) rotateY(0deg) scale(1.1)' : 'rotateX(20deg) rotateY(25deg)',
        }}
      >
        {/* Front face - main ice cube face */}
        <div 
          className="absolute inset-0 rounded-[40px] flex items-center justify-center"
          style={{ 
            background: `linear-gradient(135deg, ${lightColor} 0%, ${baseColor} 50%, ${darkColor} 100%)`,
            transform: 'translateZ(56px)',
            boxShadow: `
              -8px -8px 20px rgba(255,255,255,0.4),
              8px 8px 20px rgba(0,0,0,0.1),
              inset 0 0 30px rgba(255,255,255,0.3)
            `,
            backdropFilter: 'blur(2px)',
          }}
        >
          {/* Ice shine effect */}
          <div 
            className="absolute top-2 left-3 w-8 h-8 rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%)',
            }}
          />
          <div className="text-center p-2">
            <h3 className="text-sm font-bold text-gray-800 leading-tight drop-shadow-sm">{project.name}</h3>
            <div className="mt-2 flex flex-wrap justify-center gap-1">
              {project.technologies.slice(0, 2).map((tech, idx) => (
                <span key={idx} className="text-[10px] bg-white/40 px-1.5 py-0.5 rounded-full text-gray-700 font-medium">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
        
        {/* Back face */}
        <div 
          className="absolute inset-0 rounded-[40px]"
          style={{ 
            background: `linear-gradient(135deg, ${darkColor} 0%, ${darkerColor} 100%)`,
            transform: 'rotateY(180deg) translateZ(56px)',
            boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1)',
          }}
        />
        
        {/* Right face */}
        <div 
          className="absolute inset-0 rounded-[40px]"
          style={{ 
            background: `linear-gradient(180deg, ${darkColor} 0%, ${darkerColor} 100%)`,
            transform: 'rotateY(90deg) translateZ(56px)',
            boxShadow: 'inset -10px 0 20px rgba(255,255,255,0.1)',
          }}
        />
        
        {/* Left face */}
        <div 
          className="absolute inset-0 rounded-[40px]"
          style={{ 
            background: `linear-gradient(180deg, ${lightColor} 0%, ${baseColor} 100%)`,
            transform: 'rotateY(-90deg) translateZ(56px)',
            boxShadow: 'inset 10px 0 20px rgba(255,255,255,0.2)',
          }}
        />
        
        {/* Top face - brightest, like light hitting ice */}
        <div 
          className="absolute inset-0 rounded-[40px]"
          style={{ 
            background: `linear-gradient(0deg, ${lightColor} 0%, rgba(255,255,255,0.6) 100%)`,
            transform: 'rotateX(90deg) translateZ(56px)',
            boxShadow: 'inset 0 -5px 15px rgba(255,255,255,0.5)',
          }}
        >
          {/* Extra shine on top */}
          <div 
            className="absolute top-2 right-4 w-6 h-4 rounded-full"
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 100%)',
            }}
          />
        </div>
        
        {/* Bottom face */}
        <div 
          className="absolute inset-0 rounded-[40px]"
          style={{ 
            background: `linear-gradient(0deg, ${darkerColor} 0%, ${darkColor} 100%)`,
            transform: 'rotateX(-90deg) translateZ(56px)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
          }}
        />
      </div>
    </div>
  )
}

export default Cube
