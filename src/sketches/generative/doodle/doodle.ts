import { getCanvasSize } from '../../../utility/canvas'
import { backgroundColor } from '../../../style/colors'
import p5, { Vector } from 'p5'
import vert from './shader.vert'
import frag from './shader.frag'
import treeFrag from './tree-shader.frag'

const PADDING = 20
const MAX_DIST = 50
const TREE_COUNT = 30

const doodle = (p5: p5) => {
  const trees: Tree[] = []
  let shader: p5.Shader
  let treeShader: p5.Shader
  let backgroundGraphics: p5.Graphics
  let treeGraphics: p5.Graphics

  const { width, height } = getCanvasSize()

  p5.setup = () => {
    const { width, height } = getCanvasSize()
    p5.createCanvas(width, height, p5.WEBGL)
    p5.pixelDensity(1)
    // p5.blendMode(p5.REMOVE)
    backgroundGraphics = p5.createGraphics(p5.width, p5.height, p5.WEBGL)
    treeGraphics = p5.createGraphics(100, 100, p5.WEBGL)
    shader = p5.createShader(vert, frag)
    treeShader = p5.createShader(vert, treeFrag)

    for (let i = 0; i < TREE_COUNT; i++) {
      const x = p5.random(-p5.width / 2, p5.width / 2)
      const y = p5.random(-p5.height / 2, p5.height / 2)
      trees.push(tree(p5)({ start: new Vector(x, y) }))
    }
    trees.forEach((tree) => {
      tree.setup()
    })
  }

  p5.windowResized = () => {
    const { width, height } = getCanvasSize()
    p5.resizeCanvas(width, height)
  }

  p5.draw = () => {
    shader.setUniform('u_resolution', [width, height])
    shader.setUniform('u_time', p5.frameCount * 0.02)
    backgroundGraphics.shader(shader)
    backgroundGraphics.rect(-p5.width / 2, -p5.height / 2, p5.width, p5.height)

    p5.image(
      backgroundGraphics,
      -p5.width / 2,
      -p5.height / 2,
      p5.width,
      p5.height,
    )

    treeGraphics.shader(treeShader)
    treeGraphics.rect(-0, 0, p5.width, p5.height)

    // p5.shader(treeShader)

    p5.texture(treeGraphics)
    p5.noStroke()
    trees.forEach((tree, i) => {
      tree.grow(trees.toSpliced(i, 1))
      tree.draw()
    })
  }
}

type TreePoint = {
  vector: Vector
  isDone: boolean
}

type Tree = {
  draw: () => void
  setup: () => void
  grow: (trees: Tree[]) => void
  center: Vector
  vectors: TreePoint[]
}

const tree =
  (p5: p5) =>
  ({ start }: { start: Vector }): Tree => {
    const MAX_DIST = p5.random(20, 40)

    const vectors: TreePoint[] = []
    const points = 30

    const setup = () => {
      for (let i = 0; i < points; i++) {
        const v = new Vector(start.x, start.y, p5.random(1, 1.2))
        vectors.push({ vector: v, isDone: false })
      }
    }

    const canGrow = (vector: Vector, trees: Tree[]) => {
      if (!isInWindow(p5, vector)) {
        return false
      }

      const hasCloseVector = trees
        .filter((tree) => {
          return tree.center.dist(vector) < p5.width
        })
        .flatMap((tree) => tree.vectors)
        .some(({ vector: v }) => {
          const dist = vector.dist(v)
          return dist < MAX_DIST
        })

      return !hasCloseVector
    }

    const grow = (trees: Tree[]) => {
      vectors.forEach(({ vector, isDone }, index) => {
        if (!isDone && canGrow(vector, trees)) {
          const target = new Vector(vector.x, vector.y)
          target.setHeading((p5.TWO_PI / points) * index)
          target.setMag(vector.z)
          vector.add(target)
        } else if (!isDone) {
          isDone = false
        }
      })
    }
    const draw = () => {
      p5.beginShape()
      vectors.forEach(({ vector }) => {
        p5.vertex(vector.x, vector.y)
      })
      p5.endShape(p5.CLOSE)
    }
    return { draw, setup, grow, vectors, center: start }
  }

const isInWindow = (p5: p5, v: Vector): boolean => {
  const maxWidth = p5.width / 2 - PADDING
  const maxHeight = p5.height / 2 - PADDING
  return (
    v.x < maxWidth && v.x > -maxWidth && v.y < maxHeight && v.y > -maxHeight
  )
}

doodle.date = '2024-12-24'
export { doodle }
