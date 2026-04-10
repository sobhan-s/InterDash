<<<<<<< fix/bug-18-use-react-memo
import React, { memo, useState, useEffect, useRef } from 'react'
import { Chart, registerables } from 'chart.js'
import _ from 'lodash'
import moment from 'moment'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { BarChart3 } from 'lucide-react'
=======
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import _ from 'lodash';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BarChart3 } from 'lucide-react';
>>>>>>> dev

Chart.register(...registerables);

interface DataChartProps {
<<<<<<< fix/bug-18-use-react-memo
  posts: any[]
  users: any[]
  todos: any[]
  comments: any[]
  theme: string
}

const DataChart = ({ posts, users, todos, comments, theme }: DataChartProps) => {
  const chartRef1 = useRef<HTMLCanvasElement>(null)
  const chartRef2 = useRef<HTMLCanvasElement>(null)
  const chartRef3 = useRef<HTMLCanvasElement>(null)
  const [chart1, setChart1] = useState<Chart | null>(null)
  const [chart2, setChart2] = useState<Chart | null>(null)
  const [chart3, setChart3] = useState<Chart | null>(null)

=======
  posts: any[];
  users: any[];
  todos: any[];
  comments: any[];
  theme: string;
  counter: number;
}

const DataChart = ({ posts, users, todos, comments, theme, counter }: DataChartProps) => {
  const chartRef1 = useRef<HTMLCanvasElement>(null);
  const chartRef2 = useRef<HTMLCanvasElement>(null);
  const chartRef3 = useRef<HTMLCanvasElement>(null);

  // ✅ Use refs instead of state
  const chartInstance1 = useRef<Chart | null>(null);
  const chartInstance2 = useRef<Chart | null>(null);
  const chartInstance3 = useRef<Chart | null>(null);


>>>>>>> dev
  useEffect(() => {
    if (!chartRef1.current || posts.length === 0) return;

  
    chartInstance1.current?.destroy();

    const postsPerUser = _.countBy(posts, 'userId');
    const ctx = chartRef1.current.getContext('2d')!;

    chartInstance1.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(postsPerUser).map((id) => `User ${id}`),
        datasets: [
          {
            label: 'Posts per User',
            data: Object.values(postsPerUser),
<<<<<<< fix/bug-18-use-react-memo
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF',
              '#FF9F40', '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      })
      setChart1(newChart)
    }
  }, [posts])
=======
            backgroundColor: [
              '#FF6384',
              '#36A2EB',
              '#FFCE56',
              '#4BC0C0',
              '#9966FF',
              '#FF9F40',
            ],
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    return () => {
      chartInstance1.current?.destroy();
    };
  }, [posts, counter]);

>>>>>>> dev

  useEffect(() => {
    if (!chartRef2.current || todos.length === 0) return;

    chartInstance2.current?.destroy();

    const completed = todos.filter((t: any) => t.completed).length;
    const pending = todos.filter((t: any) => !t.completed).length;

    const ctx = chartRef2.current.getContext('2d')!;

    chartInstance2.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Completed', 'Pending'],
        datasets: [
          {
            data: [completed, pending],
            backgroundColor: ['#4BC0C0', '#FF6384'],
<<<<<<< fix/bug-18-use-react-memo
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      })
      setChart2(newChart)
    }
  }, [todos])
=======
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });

    return () => {
      chartInstance2.current?.destroy();
    };
  }, [todos, counter]);
>>>>>>> dev

 
  useEffect(() => {
    if (!chartRef3.current || comments.length === 0) return;

    chartInstance3.current?.destroy();

    const commentsPerPost = _.countBy(comments, 'postId');
    const top10 = Object.entries(commentsPerPost)
      .sort((a, b) => (b[1] as number) - (a[1] as number))
      .slice(0, 10);

    const ctx = chartRef3.current.getContext('2d')!;

    chartInstance3.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: top10.map(([id]) => `Post ${id}`),
        datasets: [
          {
            label: 'Comments',
            data: top10.map(([, count]) => count),
            borderColor: '#36A2EB',
            backgroundColor: 'rgba(54, 162, 235, 0.1)',
<<<<<<< fix/bug-18-use-react-memo
          }]
        },
        options: { responsive: true, maintainAspectRatio: false }
      })
      setChart3(newChart)
    }
  }, [comments])
=======
            fill: true,
          },
        ],
      },
      options: { responsive: true, maintainAspectRatio: false },
    });
>>>>>>> dev

    return () => {
      chartInstance3.current?.destroy();
    };
  }, [comments, counter]);

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
  );
};

<<<<<<< fix/bug-18-use-react-memo
export default memo(DataChart)
=======
export default DataChart;
>>>>>>> dev
