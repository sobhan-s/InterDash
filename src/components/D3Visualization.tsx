import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { GitBranch } from 'lucide-react'

interface D3VisualizationProps {
  data: any[]
  counter: number
  theme: string
}

// Custom comparator: only re-render when data length or theme changes.
// counter is intentionally excluded — it never affects the graph output.
const arePropsEqual = (prev: D3VisualizationProps, next: D3VisualizationProps) =>
  prev.data.length === next.data.length && prev.theme === next.theme;

const D3Visualization = React.memo(({ data, counter, theme }: D3VisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions] = useState({ width: 600, height: 300 })

  // Stable graph structure: deterministic source/target indices, no Math.random().
  // Previously Math.random() inside the useEffect meant every counter tick
  // produced a completely different graph layout.
  const graph = useMemo(() => {
    const nodes = data.slice(0, 50).map((d: any, i: number) => ({
      id: d.id || i,
      name: d.title || d.name || `Item ${i}`,
      value: ((d.id || i) % 100) + 1,
    }))

    const links = nodes.slice(1).map((node, i) => ({
      source: nodes[Math.max(0, Math.floor(i / 2))],
      target: node,
    }))

    return { nodes, links }
  }, [data])

  // Effect now depends on the stable `graph` object from useMemo, not on `data`
  // or `counter` directly — so D3 only re-simulates when the graph data changes.
  useEffect(() => {
    if (!svgRef.current || graph.nodes.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 40 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    // Use the memoized stable nodes/links — no Math.random(), no re-layout on counter tick
    const { nodes, links } = graph

    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links as any).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(15))

    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1)

    const node = g.append('g')
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', (d: any) => 3 + d.value / 20)
      .attr('fill', (d: any, i: number) => d3.schemeCategory10[i % 10])
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)

    node.append('title').text((d: any) => d.name)

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node
        .attr('cx', (d: any) => d.x)
        .attr('cy', (d: any) => d.y)
    })

    // Stop simulation on cleanup to prevent tick callbacks firing after unmount
    return () => { simulation.stop() }
  }, [graph, dimensions])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <GitBranch className="h-4 w-4" />
          Network Graph (D3.js)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden bg-muted/20">
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full" />
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Nodes: {Math.min(data?.length || 0, 50)} | Render #{counter}
        </p>
      </CardContent>
    </Card>
  )
}, arePropsEqual)

D3Visualization.displayName = 'D3Visualization'

export default D3Visualization