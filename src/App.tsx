import { useState, useEffect, useRef, useCallback } from 'react'
import Cube from './components/Cube'
import ProjectModal from './components/ProjectModal'
import { projects, Project } from './data/projects'

interface CubeState {
  id: number
  position: { x: number; y: number }
  velocity: { x: number; y: number }
  mass: number
}

const CUBE_SIZE = 128
const SPEED = 1.5

function App() {
  const [cubes, setCubes] = useState<CubeState[]>([])
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [hoveredCubeId, setHoveredCubeId] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const containerWidth = window.innerWidth
    const containerHeight = window.innerHeight
    // Dynamic - uses actual project count
    const cubeCount = projects.length

    const initialCubes: CubeState[] = Array.from({ length: cubeCount }).map((_, i) => ({
      id: projects[i].id,
      position: {
        x: Math.random() * (containerWidth - CUBE_SIZE - 200) + 100,
        y: Math.random() * (containerHeight - CUBE_SIZE - 200) + 100,
      },
      velocity: {
        x: (Math.random() - 0.5) * SPEED * 2,
        y: (Math.random() - 0.5) * SPEED * 2,
      },
      mass: 1,
    }))

    setCubes(initialCubes)
  }, [])

  useEffect(() => {
    const section = shineRef.current
    if (!section) return

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          section.classList.add('shine-active')
          observer.unobserve(section)
        }
      })
    }, { threshold: 0.3 })

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  const checkCollision = useCallback((c1: CubeState, c2: CubeState) => {
    const dx = (c1.position.x + CUBE_SIZE / 2) - (c2.position.x + CUBE_SIZE / 2)
    const dy = (c1.position.y + CUBE_SIZE / 2) - (c2.position.y + CUBE_SIZE / 2)
    const distance = Math.sqrt(dx * dx + dy * dy)
    return distance < CUBE_SIZE
  }, [])

  const resolveCollision = useCallback((c1: CubeState, c2: CubeState) => {
    const dx = c2.position.x - c1.position.x
    const dy = c2.position.y - c1.position.y
    const distance = Math.sqrt(dx * dx + dy * dy)
    
    if (distance === 0) return { v1: c1.velocity, v2: c2.velocity }
    
    const nx = dx / distance
    const ny = dy / distance
    
    const dvx = c1.velocity.x - c2.velocity.x
    const dvy = c1.velocity.y - c2.velocity.y
    
    const dotProduct = dvx * nx + dvy * ny
    
    if (dotProduct > 0) return { v1: c1.velocity, v2: c2.velocity }
    
    const restitution = 0.9
    
    const impulse = (2 * dotProduct) / (c1.mass + c2.mass) * restitution
    
    const newV1 = {
      x: c1.velocity.x - impulse * c2.mass * nx,
      y: c1.velocity.y - impulse * c2.mass * ny,
    }
    
    const newV2 = {
      x: c2.velocity.x + impulse * c1.mass * nx,
      y: c2.velocity.y + impulse * c1.mass * ny,
    }
    
    return { v1: newV1, v2: newV2 }
  }, [])

  useEffect(() => {
    let animationId: number

    const updateCubes = () => {
      setCubes((prevCubes) => {
        const containerWidth = window.innerWidth
        const containerHeight = window.innerHeight
        let newCubes = prevCubes.map((cube) => {
          if (hoveredCubeId !== null && cube.id === hoveredCubeId) return cube

          let newX = cube.position.x + cube.velocity.x
          let newY = cube.position.y + cube.velocity.y
          let newVx = cube.velocity.x
          let newVy = cube.velocity.y

          if (newX <= 50) {
            newVx = Math.abs(newVx) * 0.9
            newX = 50
          }
          if (newX >= containerWidth - CUBE_SIZE - 50) {
            newVx = -Math.abs(newVx) * 0.9
            newX = containerWidth - CUBE_SIZE - 50
          }
          if (newY <= 50) {
            newVy = Math.abs(newVy) * 0.9
            newY = 50
          }
          if (newY >= containerHeight - CUBE_SIZE - 50) {
            newVy = -Math.abs(newVy) * 0.9
            newY = containerHeight - CUBE_SIZE - 50
          }

          const minSpeed = 0.5
          if (Math.abs(newVx) < minSpeed) {
            newVx = newVx >= 0 ? minSpeed : -minSpeed
          }
          if (Math.abs(newVy) < minSpeed) {
            newVy = newVy >= 0 ? minSpeed : -minSpeed
          }

          return {
            ...cube,
            position: { x: newX, y: newY },
            velocity: { x: newVx, y: newVy },
          }
        })

        for (let i = 0; i < newCubes.length; i++) {
          for (let j = i + 1; j < newCubes.length; j++) {
            if (hoveredCubeId !== null && (newCubes[i].id === hoveredCubeId || newCubes[j].id === hoveredCubeId)) {
              continue
            }
            
            if (checkCollision(newCubes[i], newCubes[j])) {
              const { v1, v2 } = resolveCollision(newCubes[i], newCubes[j])
              
              const overlap = CUBE_SIZE - Math.sqrt(
                Math.pow(newCubes[j].position.x - newCubes[i].position.x, 2) +
                Math.pow(newCubes[j].position.y - newCubes[i].position.y, 2)
              )
              
              if (overlap > 0) {
                const dx = newCubes[j].position.x - newCubes[i].position.x
                const dy = newCubes[j].position.y - newCubes[i].position.y
                const dist = Math.sqrt(dx * dx + dy * dy) || 1
                const nx = dx / dist
                const ny = dy / dist
                
                newCubes[i] = {
                  ...newCubes[i],
                  position: {
                    x: newCubes[i].position.x - nx * overlap * 0.5,
                    y: newCubes[i].position.y - ny * overlap * 0.5,
                  },
                  velocity: v1,
                }
                newCubes[j] = {
                  ...newCubes[j],
                  position: {
                    x: newCubes[j].position.x + nx * overlap * 0.5,
                    y: newCubes[j].position.y + ny * overlap * 0.5,
                  },
                  velocity: v2,
                }
              } else {
                newCubes[i] = { ...newCubes[i], velocity: v1 }
                newCubes[j] = { ...newCubes[j], velocity: v2 }
              }
            }
          }
        }

        return newCubes
      })

      animationId = requestAnimationFrame(updateCubes)
    }

    animationId = requestAnimationFrame(updateCubes)
    return () => cancelAnimationFrame(animationId)
  }, [hoveredCubeId, checkCollision, resolveCollision])

  const handleCubeClick = (project: Project) => {
    setSelectedProject(project)
    setModalOpen(true)
  }

  const handleHoverChange = (id: number | null) => {
    setHoveredCubeId(id)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setTimeout(() => setSelectedProject(null), 300)
  }

  return (
    <div ref={containerRef} className="min-h-screen bg-warm-gray-50 relative overflow-hidden">
      <section className="relative z-0 pt-20 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-4">
            Hello, I'm <span className="text-blue-600 animate-shake">Vien</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Creative AI Agentic Coder | Network Engineer Student
          </p>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            I enjoy building small useful tools and experimenting with AI to accelerate learning.
          </p>
        </div>
      </section>

      <section className="relative z-10 min-h-[60vh]">
        <div className="max-w-6xl mx-auto px-4 md:px-8 mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Featured Projects
          </h2>
          <p className="text-gray-600 mb-8">
            Hover over a cube to pause it, click to explore!
          </p>
        </div>

        <div className="relative w-full h-[60vh] bg-blue-gradient-animate">
          {cubes.map((cube) => (
            <Cube
              key={cube.id}
              project={projects.find((p) => p.id === cube.id)!}
              position={cube.position}
              isHovered={hoveredCubeId === cube.id}
              onMouseEnter={() => handleHoverChange(cube.id)}
              onMouseLeave={() => handleHoverChange(null)}
              onClick={handleCubeClick}
            />
          ))}
        </div>
      </section>

      <section className="relative z-0 py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
            Technical Skills
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {[
              'Docker', 'Terraform', 'Python', 'Linux(Ubuntu)', 'Git', 'PHP', 'MySQL', 'SQL', 'HTML', 'CSS', 'JavaScript',
              'OpenCode', 'AI assistants(ChatGPT, Claude, Copilot, Gemini, DeepSeek)', 'Stable Diffusion', 'ComfyUI', 
              'DaVinci Resolve', 'Photoshop', 'Lightroom', 'routing', 'switching', 'VLAN', 'SSH', 'VirtualBox', 'Cisco IOS', 
              'Cisco Packet Tracer', 'Wireshark', 'Nmap', 'Photography'
            ].map((skill, idx) => (
              <div
                key={idx}
                className="px-6 py-3 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition"
              >
                {skill}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={shineRef} className="shine-section relative z-0 py-16 px-4 bg-warm-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
            About Me
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p className="mb-4">
              I used to build everything by hand, but today I combine my skills with the power of AI to create even better results. 
            </p>
            <p className="mb-4">
              In my free time, I develop my skills in programming/web development, strength training, investing, photography, and AI techniques, areas that strengthen my creativity, problem-solving, and willingness to learn new things.
            </p>
          </div>
        </div>
      </section>

      <section className="relative z-0 py-16 px-4 bg-white">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
            Let's Connect
          </h2>
          <p className="text-gray-600 mb-8">
            Have a project in mind or want to collaborate? Feel free to reach out!
          </p>
          <a
            href="https://www.linkedin.com/in/vien-hoang-5077bb96/" target='_blank'
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg shadow-lg"
          >
            LinkedIn
          </a>
          &nbsp;
          <a
            href="mailto:hoang.vien@proton.me"
            className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg shadow-lg"
          >
            Email Me
          </a>
        </div>
      </section>

      <footer className="relative z-0 py-8 text-center text-gray-500 bg-blue-gradient-animate">
        <p>© {new Date().getFullYear()} Vien Hoang. All rights reserved.</p>
      </footer>

      <ProjectModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

export default App
