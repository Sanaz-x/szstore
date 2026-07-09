import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const fullscreenVert = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const gridFragmentShader = `
  uniform float u_time;
  uniform vec3 u_color;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv * 2.0 - 1.0;
    uv.y /= max(abs(uv.y), 0.1);
    uv += vec2(u_time * 0.5, u_time * 0.3);
    vec2 grid = abs(fract(uv * 10.0) - 0.5);
    float line = min(grid.x, grid.y);
    float alpha = 1.0 - smoothstep(0.0, 0.15, line);
    alpha *= max(1.0 - length(vUv - 0.5) * 1.5, 0.0);
    gl_FragColor = vec4(u_color, alpha * 0.8);
  }
`

const diamondFragmentShader = `
  uniform float u_time;
  uniform vec3 u_baseColor;
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
    vec3 viewDir = normalize(vViewPosition);
    vec3 halfDir = normalize(lightDir + viewDir);
    float diff = max(dot(vNormal, lightDir), 0.0);
    float spec = pow(max(dot(vNormal, halfDir), 0.0), 64.0);
    vec3 rainbow = vec3(
      sin(vNormal.x * 5.0 + u_time) * 0.5 + 0.5,
      sin(vNormal.y * 5.0 + u_time * 1.2) * 0.5 + 0.5,
      sin(vNormal.z * 5.0 + u_time * 0.8) * 0.5 + 0.5
    );
    vec3 color = mix(u_baseColor, rainbow, 0.3) * (0.5 + diff * 0.5);
    color += vec3(1.0, 1.0, 1.0) * spec * 0.5;
    float alpha = mix(0.6, 1.0, spec);
    gl_FragColor = vec4(color, alpha);
  }
`

const diamondVert = `
  varying vec3 vNormal;
  varying vec3 vViewPosition;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vViewPosition = -mvPosition.xyz;
    gl_Position = projectionMatrix * mvPosition;
  }
`

const wireframeFragmentShader = `
  uniform vec3 u_wireColor;
  uniform vec3 u_vertexColor;
  varying float vDistFromCenter;
  void main() {
    float dist = clamp(vDistFromCenter / 2.0, 0.0, 1.0);
    vec3 color = mix(u_vertexColor, u_wireColor, dist);
    gl_FragColor = vec4(color, 0.6 + dist * 0.4);
  }
`

const wireframeVert = `
  varying float vDistFromCenter;
  void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vDistFromCenter = length(position);
    gl_Position = projectionMatrix * mvPosition;
  }
`

const crtFragmentShader = `
  uniform sampler2D u_sceneTexture;
  uniform float u_time;
  uniform vec2 u_resolution;
  uniform float u_scanlineIntensity;
  uniform float u_flickerIntensity;
  uniform float u_chromaticIntensity;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    vec2 distUV = uv - 0.5;
    float dist = length(distUV);
    float barrel = 1.0 + dist * dist * 0.25;
    distUV *= barrel;
    vec2 distortedUV = distUV + 0.5;
    float aberration = u_chromaticIntensity * dist * 0.02;
    vec4 sceneColorR = texture2D(u_sceneTexture, distortedUV + vec2(aberration, 0.0));
    vec4 sceneColorG = texture2D(u_sceneTexture, distortedUV);
    vec4 sceneColorB = texture2D(u_sceneTexture, distortedUV - vec2(aberration, 0.0));
    vec4 sceneColor = vec4(sceneColorR.r, sceneColorG.g, sceneColorB.b, sceneColorG.a);
    float scanY = distortedUV.y * u_resolution.y;
    float scanline = sin(scanY * 1.5 - u_time * 5.0) * 0.5 + 0.5;
    float scanlineMix = mix(1.0, mix(0.92, 1.0, scanline), u_scanlineIntensity);
    float flicker = 1.0 - sin(u_time * 15.0) * u_flickerIntensity;
    vec2 vigUV = uv * 2.0 - 1.0;
    float vig = clamp(1.0 - dot(vigUV * 0.55, vigUV * 0.55), 0.0, 1.0);
    vig = vig * vig * vig;
    float gridX = sin(distortedUV.x * u_resolution.x * 0.5) * 0.5 + 0.5;
    float gridY = sin(distortedUV.y * u_resolution.y * 0.5) * 0.5 + 0.5;
    float grid = (gridX + gridY) * 0.02;
    vec3 color = sceneColor.rgb;
    color *= scanlineMix;
    color *= flicker;
    color *= vig;
    color += vec3(grid);
    gl_FragColor = vec4(color, 1.0);
  }
`

const bloomFragmentShader = `
  uniform sampler2D u_sceneTexture;
  uniform vec2 u_resolution;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    vec3 texel = texture2D(u_sceneTexture, uv).rgb;
    float lum = dot(texel, vec3(0.299, 0.587, 0.114));
    vec3 bloom = texel * smoothstep(0.4, 0.8, lum);
    vec2 pixel = vec2(1.0 / u_resolution.x, 0.0);
    vec3 blurred = texture2D(u_sceneTexture, uv + pixel * 2.0).rgb * 0.1
                 + texture2D(u_sceneTexture, uv + pixel).rgb * 0.2
                 + texture2D(u_sceneTexture, uv).rgb * 0.4
                 + texture2D(u_sceneTexture, uv - pixel).rgb * 0.2
                 + texture2D(u_sceneTexture, uv - pixel * 2.0).rgb * 0.1;
    gl_FragColor = vec4(bloom + blurred * 0.5, 1.0);
  }
`

const compositeFragmentShader = `
  uniform sampler2D u_sceneTexture;
  uniform sampler2D u_bloomTexture;
  varying vec2 vUv;
  void main() {
    vec3 scene = texture2D(u_sceneTexture, vUv).rgb;
    vec3 bloom = texture2D(u_bloomTexture, vUv).rgb;
    vec3 color = scene + bloom * 0.8;
    color = pow(color, vec3(1.0 / 2.2));
    gl_FragColor = vec4(color, 1.0);
  }
`

interface CRTDisplayProps {
  isVisible: boolean
}

export default function CRTDisplay({ isVisible }: CRTDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const cleanupRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!isVisible) {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
      return
    }

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    const bounds = container.getBoundingClientRect()
    renderer.setSize(bounds.width, bounds.height)
    renderer.domElement.classList.add('crt-canvas')
    container.appendChild(renderer.domElement)

    // Scene + Camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, bounds.width / bounds.height, 0.1, 1000)
    camera.position.z = 8

    // Render target
    const dpr = Math.min(window.devicePixelRatio, 2)
    const sceneRenderTarget = new THREE.WebGLRenderTarget(
      bounds.width * dpr,
      bounds.height * dpr,
      { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat }
    )

    // Post-process materials
    const crtMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: crtFragmentShader,
      uniforms: {
        u_sceneTexture: { value: sceneRenderTarget.texture },
        u_time: { value: 0 },
        u_resolution: { value: new THREE.Vector2(bounds.width, bounds.height) },
        u_scanlineIntensity: { value: 0.5 },
        u_flickerIntensity: { value: 0.05 },
        u_chromaticIntensity: { value: 0.05 },
      },
    })

    const bloomMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: bloomFragmentShader,
      uniforms: {
        u_sceneTexture: { value: sceneRenderTarget.texture },
        u_resolution: { value: new THREE.Vector2(bounds.width, bounds.height) },
      },
    })

    const compositeMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: compositeFragmentShader,
      uniforms: {
        u_sceneTexture: { value: sceneRenderTarget.texture },
        u_bloomTexture: { value: sceneRenderTarget.texture },
      },
    })

    // Post-process scenes
    const orthoCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const planeGeo = new THREE.PlaneGeometry(2, 2)

    const crtMesh = new THREE.Mesh(planeGeo, crtMaterial)
    const crtScene = new THREE.Scene()
    crtScene.add(crtMesh)

    const bloomMesh = new THREE.Mesh(planeGeo, bloomMaterial)
    const bloomScene = new THREE.Scene()
    bloomScene.add(bloomMesh)

    const compositeMesh = new THREE.Mesh(planeGeo, compositeMaterial)
    const compositeScene = new THREE.Scene()
    compositeScene.add(compositeMesh)

    // Content materials
    const gridMaterial = new THREE.ShaderMaterial({
      vertexShader: fullscreenVert,
      fragmentShader: gridFragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_color: { value: new THREE.Color('#00E5FF') },
      },
      transparent: true,
      side: THREE.DoubleSide,
    })

    const wireframeMaterial = new THREE.ShaderMaterial({
      vertexShader: wireframeVert,
      fragmentShader: wireframeFragmentShader,
      uniforms: {
        u_wireColor: { value: new THREE.Color('#9FD3E8') },
        u_vertexColor: { value: new THREE.Color('#E040FB') },
      },
      transparent: true,
      wireframe: true,
    })

    const diamondMaterial = new THREE.ShaderMaterial({
      vertexShader: diamondVert,
      fragmentShader: diamondFragmentShader,
      uniforms: {
        u_time: { value: 0 },
        u_baseColor: { value: new THREE.Color('#E040FB') },
      },
      transparent: true,
    })

    // Scene objects
    const gridMesh = new THREE.Mesh(new THREE.PlaneGeometry(30, 30, 1, 1), gridMaterial)
    gridMesh.rotation.x = -Math.PI / 2
    gridMesh.position.y = -4
    scene.add(gridMesh)

    const wireMesh = new THREE.Mesh(new THREE.TorusKnotGeometry(1.2, 0.3, 100, 16), wireframeMaterial)
    scene.add(wireMesh)

    const diamondMesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 0), diamondMaterial)
    diamondMesh.position.x = 3.5
    scene.add(diamondMesh)

    const diamondMesh2 = new THREE.Mesh(new THREE.IcosahedronGeometry(1.8, 0), diamondMaterial)
    diamondMesh2.position.x = -3.5
    diamondMesh2.scale.set(0.6, 0.6, 0.6)
    scene.add(diamondMesh2)

    // Animation state
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 }
    let animationTime = 0
    let isRunning = true
    let bootPhase = 0

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.targetY = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Resize observer
    const resizeObserver = new ResizeObserver(() => {
      const b = container.getBoundingClientRect()
      renderer.setSize(b.width, b.height)
      camera.aspect = b.width / b.height
      camera.updateProjectionMatrix()
      sceneRenderTarget.setSize(b.width * dpr, b.height * dpr)
      crtMaterial.uniforms.u_resolution.value.set(b.width, b.height)
      bloomMaterial.uniforms.u_resolution.value.set(b.width, b.height)
    })
    resizeObserver.observe(container)

    const updateBootSequence = (dt: number) => {
      if (bootPhase < 2.5) {
        bootPhase += dt
        crtMaterial.uniforms.u_scanlineIntensity.value = 0.8
        crtMaterial.uniforms.u_flickerIntensity.value = 0.15
        crtMaterial.uniforms.u_chromaticIntensity.value = 0.12
      } else if (bootPhase < 3.0) {
        bootPhase += dt
        crtMaterial.uniforms.u_scanlineIntensity.value = 0.5
        crtMaterial.uniforms.u_flickerIntensity.value = 0.05
        crtMaterial.uniforms.u_chromaticIntensity.value = 0.06
      } else {
        crtMaterial.uniforms.u_scanlineIntensity.value = 0.5
        crtMaterial.uniforms.u_flickerIntensity.value = 0.05
        crtMaterial.uniforms.u_chromaticIntensity.value = 0.05
      }
    }

    // Render loop
    const animate = () => {
      if (!isRunning) return
      requestAnimationFrame(animate)

      mouse.x += (mouse.targetX - mouse.x) * 0.05
      mouse.y += (mouse.targetY - mouse.y) * 0.05
      animationTime += 0.016

      const t = animationTime
      const s1 = Math.sin(t * 0.7)
      const c1 = Math.cos(t * 0.5)

      updateBootSequence(0.016)

      gridMaterial.uniforms.u_time.value = t
      wireMesh.rotation.set(s1 * 0.2, t * 0.5, c1 * 0.1)
      wireMesh.position.y = Math.sin(t * 0.3) * 0.5
      diamondMesh.rotation.y = t * 0.3
      diamondMesh.position.y = Math.abs(Math.sin(t * 0.8)) * 0.5 + 0.5
      diamondMesh2.rotation.y = -t * 0.4
      diamondMesh2.position.y = Math.abs(Math.cos(t * 0.6)) * 0.5 + 0.5

      crtMaterial.uniforms.u_time.value = t

      // Render passes
      renderer.setRenderTarget(sceneRenderTarget)
      renderer.render(scene, camera)
      renderer.setRenderTarget(null)
      renderer.render(crtScene, orthoCamera)
      renderer.render(bloomScene, orthoCamera)
      renderer.render(compositeScene, orthoCamera)
    }

    animate()

    // Cleanup
    cleanupRef.current = () => {
      isRunning = false
      window.removeEventListener('mousemove', handleMouseMove)
      resizeObserver.disconnect()
      renderer.domElement.remove()
      renderer.dispose()
      sceneRenderTarget.dispose()
      gridMaterial.dispose()
      wireframeMaterial.dispose()
      diamondMaterial.dispose()
      crtMaterial.dispose()
      bloomMaterial.dispose()
      compositeMaterial.dispose()
      planeGeo.dispose()
    }

    return () => {
      if (cleanupRef.current) {
        cleanupRef.current()
        cleanupRef.current = null
      }
    }
  }, [isVisible])

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/3] rounded-3xl p-4"
      style={{
        background: 'linear-gradient(145deg, #1a1f35 0%, #0d1220 50%, #1a1f35 100%)',
        border: '2px solid rgba(159, 211, 232, 0.2)',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.5), 0 0 60px rgba(159, 211, 232, 0.15)',
      }}
    >
      {/* Speaker grill */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-white/10" />
        ))}
      </div>
      {/* LED dots */}
      <div className="absolute bottom-2 right-4 flex gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-[#FF4081]" style={{ boxShadow: '0 0 4px #FF4081' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-[#FFD740]" style={{ boxShadow: '0 0 4px #FFD740' }} />
        <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" style={{ boxShadow: '0 0 4px #00E5FF' }} />
      </div>
    </div>
  )
}
