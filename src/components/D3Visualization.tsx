import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react'
import { select } from 'd3-selection'
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceCenter,
  forceCollide,
} from 'd3-force'
import { schemeCategory10 } from 'd3-scale-chromatic'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { GitBranch } from 'lucide-react'
import { D3VisualizationProps, RawData, GraphNode, GraphLink } from '@/lib/types'

const arePropsEqual = (prev: D3VisualizationProps, next: D3VisualizationProps) =>
  prev.data.length === next.data.length && prev.theme === next.theme;

const D3Visualization = React.memo(({ data, theme }: D3VisualizationProps) => {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions] = useState({ width: 600, height: 300 })

  const graph = useMemo(() => {
    const nodes: GraphNode[] = data.slice(0, 50).map((d: RawData, i: number) => ({
      id: d.id || i,
      name: d.title || d.name || `Item ${i}`,
      value: ((d.id || i) % 100) + 1,
    }))

    const links: GraphLink[] = nodes.slice(1).map((node, i) => ({
      source: nodes[Math.max(0, Math.floor(i / 2))],
      target: node,
    }))

    return { nodes, links }
  }, [data])

  useEffect(() => {
    if (!svgRef.current || graph.nodes.length === 0) return

    const svg = select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 40 }
    const width = dimensions.width - margin.left - margin.right
    const height = dimensions.height - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const { nodes, links } = graph

    const simulation = forceSimulation<GraphNode>(nodes)
      .force('link', forceLink<GraphNode, GraphLink>(links).id((d) => d.id).distance(50))
      .force('charge', forceManyBody().strength(-100))
      .force('center', forceCenter(width / 2, height / 2))
      .force('collision', forceCollide().radius(15))

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
      .attr('r', (d: GraphNode) => 3 + d.value / 20)
      .attr('fill', (d: GraphNode, i: number) => schemeCategory10[i % 10])
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)

    node.append('title').text((d: GraphNode) => d.name)

    simulation.on('tick', () => {
      link
        .attr('x1', (d: GraphLink) => d.source.x)
        .attr('y1', (d: GraphLink) => d.source.y)
        .attr('x2', (d: GraphLink) => d.target.x)
        .attr('y2', (d: GraphLink) => d.target.y)

      node
        .attr('cx', (d: GraphNode) => d.x)
        .attr('cy', (d: GraphNode) => d.y)
    })


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
          Nodes: {Math.min(data?.length || 0, 50)}
        </p>
      </CardContent>
    </Card>
  )
}, arePropsEqual)

D3Visualization.displayName = 'D3Visualization'

export default D3Visualization