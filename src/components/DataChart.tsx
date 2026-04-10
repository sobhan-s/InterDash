import React, { useEffect, useMemo, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import _ from 'lodash'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { BarChart3 } from 'lucide-react'

Chart.register(...registerables)

interface DataChartProps {
  posts: any[]
  users: any[]
  todos: any[]
  comments: any[]
  theme: string
  counter: number
}

const palette = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']

const DataChart = ({ posts, users, todos, comments, theme, counter }: DataChartProps) => {
  const chartRef1 = useRef<HTMLCanvasElement>(null)
  const chartRef2 = useRef<HTMLCanvasElement>(null)
  const chartRef3 = useRef<HTMLCanvasElement>(null)
  const chart1Ref = useRef<Chart<'bar'> | null>(null)
  const chart2Ref = useRef<Chart<'doughnut'> | null>(null)
  const chart3Ref = useRef<Chart<'line'> | null>(null)

  console.log('DataChart render', counter)

  const postsPerUser = useMemo(() => _.countBy(posts, 'userId'), [posts])
  const todoSummary = useMemo(() => {
    const completed = todos.filter((t: any) => t.completed).length
    const pending = todos.filter((t: any) => !t.completed).length
    return { completed, pending }
  }, [todos])
  const topComments = useMemo(() => {
    const commentsPerPost = _.countBy(comments, 'postId')
    return Object.entries(commentsPerPost)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 10)
  }, [comments])

  useEffect(() => {
    if (!chartRef1.current || posts.length === 0) return

    if (!chart1Ref.current) {
      const ctx = chartRef1.current.getContext('2d')
      if (!ctx) return

      chart1Ref.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: [],
          datasets: [{
            label: 'Posts per User',
            data: [],
            backgroundColor: palette,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
        },
      })
    }

    chart1Ref.current.data.labels = Object.keys(postsPerUser).map((id) => `User ${id}`)
    chart1Ref.current.data.datasets[0].data = Object.values(postsPerUser)
    chart1Ref.current.update('none')
  }, [posts, postsPerUser, theme])

  useEffect(() => {
    if (!chartRef2.current || todos.length === 0) return

    if (!chart2Ref.current) {
      const ctx = chartRef2.current.getContext('2d')
      if (!ctx) return

      chart2Ref.current = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Completed', 'Pending'],
          datasets: [{
            data: [],
            backgroundColor: ['#4BC0C0', '#FF6384'],
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
        },
      })
    }

    chart2Ref.current.data.datasets[0].data = [todoSummary.completed, todoSummary.pending]
    chart2Ref.current.update('none')
  }, [todos, todoSummary, theme])

  useEffect(() => {
    if (!chartRef3.current || comments.length === 0) return

    if (!chart3Ref.current) {
      const ctx = chartRef3.current.getContext('2d')
      if (!ctx) return

      chart3Ref.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: [],
          datasets: [{
            label: 'Comments',
            data: [],
            borderColor: '#36A2EB',
            fill: true,
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: false,
        },
      })
    }

    chart3Ref.current.data.labels = topComments.map(([id]) => `Post ${id}`)
    chart3Ref.current.data.datasets[0].data = topComments.map(([, count]) => count as number)
    chart3Ref.current.update('none')
  }, [comments, topComments, theme])

  useEffect(() => {
    return () => {
      chart1Ref.current?.destroy()
      chart2Ref.current?.destroy()
      chart3Ref.current?.destroy()
    }
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <BarChart3 className="h-4 w-4" />
          Charts & Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-5">
          <div className="h-[250px]">
            <h4 className="text-sm font-medium mb-2">Posts per User</h4>
            <canvas ref={chartRef1}></canvas>
          </div>
          <div className="h-[250px]">
            <h4 className="text-sm font-medium mb-2">Todo Status</h4>
            <canvas ref={chartRef2}></canvas>
          </div>
          <div className="h-[250px]">
            <h4 className="text-sm font-medium mb-2">Comments Distribution</h4>
            <canvas ref={chartRef3}></canvas>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default DataChart
