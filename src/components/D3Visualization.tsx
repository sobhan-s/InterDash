import React, { useMemo, useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { GitBranch } from 'lucide-react'

interface D3VisualizationProps {
  data: any[]
  counter: number
  theme: string
}

const D3Visualization = ({ data, counter, theme }: D3VisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const simulationRef = useRef<d3.Simulation<any, undefined> | null>(null)
  const [dimensions] = useState({ width: 600, height: 300 })

  console.log('D3Visualization render', counter)

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

  useEffect(() => {
    if (!svgRef.current || graph.nodes.length === 0) return

    simulationRef.current?.stop()

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 40 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const link = g.append('g')
      .selectAll('line')
      .data(graph.links)
      .join('line')
      .attr('stroke', theme === 'dark' ? '#64748b' : '#999')
      .attr('stroke-opacity', 0.6)
      .attr('stroke-width', 1)

    const node = g.append('g')
      .selectAll('circle')
      .data(graph.nodes)
      .join('circle')
      .attr('r', (d: any) => 3 + d.value / 20)
      .attr('fill', (_d: any, i: number) => d3.schemeCategory10[i % 10])
      .attr('stroke', theme === 'dark' ? '#0f172a' : '#fff')
      .attr('stroke-width', 1.5)

    node.append('title').text((d: any) => d.name)

    const simulation = d3.forceSimulation(graph.nodes as any)
      .force('link', d3.forceLink(graph.links).id((d: any) => d.id).distance(50))
      .force('charge', d3.forceManyBody().strength(-100))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(15))

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

    simulationRef.current = simulation

    return () => {
      simulation.stop()
    }
  }, [graph, dimensions, theme])

  useEffect(() => {
    return () => {
      simulationRef.current?.stop()
    }
  }, [])

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
}

export default D3Visualization
