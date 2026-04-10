import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Activity, BarChart, Users, FileText, CheckSquare, Image } from 'lucide-react';

import {
  BarChart as ReBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';

interface AnalyticsProps {
  posts: any[];
  users: any[];
  todos: any[];
  comments: any[];
  albums: any[];
  photos: any[];
  theme: string;
  counter: number;
}

const COLORS = [
  '#0088FE',
  '#00C49F',
  '#FFBB28',
  '#FF8042',
  '#8884D8',
  '#82CA9D',
  '#FFC658',
  '#8DD1E1',
  '#A4DE6C',
  '#D0ED57',
];

const Analytics = ({
  posts,
  users,
  todos,
  comments,
  albums,
  photos,
  theme,
  counter,
}: AnalyticsProps) => {
  const [stats, setStats] = useState<any>({});
  const [calculating, setCalculating] = useState(false);

  useEffect(() => {
    setCalculating(true);

    const calculateStats = () => {
      const result: any = {};

      result.postsPerUser = _.countBy(posts, 'userId');
      result.commentsPerPost = _.countBy(comments, 'postId');
      result.avgWordCount = _.meanBy(posts, (p: any) => p.body?.split(' ').length || 0);

      const postsByUser = _.groupBy(posts, 'userId');
      const todosByUser = _.groupBy(todos, 'userId');
      const albumsByUser = _.groupBy(albums, 'userId');

      result.completionRates = {} as Record<string, string>;
      Object.entries(todosByUser).forEach(([userId, userTodos]: [string, any[]]) => {
        const completed = userTodos.filter((t: any) => t.completed).length;
        result.completionRates[userId] = ((completed / userTodos.length) * 100).toFixed(1);
      });

      result.userActivity = users.map((user) => {
        const userPosts = postsByUser[user.id] || [];
        const userTodos = todosByUser[user.id] || [];
        const userAlbums = albumsByUser[user.id] || [];

        return {
          ...user,
          postCount: userPosts.length,
          todoCount: userTodos.length,
          albumCount: userAlbums.length,
        };
      });
      const postMap = new Map(posts.map((p) => [p.id, p]));
      const userMap = new Map(users.map((u) => [u.id, u]));

      result.commentAuthors = comments.map((comment) => {
        const post = postMap.get(comment.postId);
        const user = userMap.get(post?.userId);

        return {
          ...comment,
          postAuthor: user?.name,
          postTitle: post?.title,
        };
      });

    

      // Prepare recharts data
      result.postsChartData = Object.entries(result.postsPerUser).map(([userId, count]) => ({
        name: `User ${userId}`,
        posts: count,
      }));

      let completed = 0;
      let pending = 0;

      for (const t of todos) {
        if (t.completed) completed++;
        else pending++;
      }

      result.todoChartData = [
        { name: 'Completed', value: completed },
        { name: 'Pending', value: pending },
      ];

      return result;
    };

    
    const result = calculateStats();
    setStats(result);
    setCalculating(false);
  }, [posts, users, todos, comments, albums, photos]);

  if (calculating) return <p className="text-sm text-muted-foreground">Calculating analytics...</p>;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Stat Cards */}
        <div className="grid grid-cols-4 gap-3 mb-5">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
            <FileText className="h-5 w-5 mx-auto text-blue-600 mb-1" />
            <div className="text-2xl font-bold">{posts?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Total Posts</div>
          </div>
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-center">
            <Users className="h-5 w-5 mx-auto text-green-600 mb-1" />
            <div className="text-2xl font-bold">{users?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Users</div>
          </div>
          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg text-center">
            <CheckSquare className="h-5 w-5 mx-auto text-orange-600 mb-1" />
            <div className="text-2xl font-bold">
              {todos?.filter((t: any) => t.completed).length || 0}
            </div>
            <div className="text-xs text-muted-foreground">Completed Todos</div>
          </div>
          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg text-center">
            <Image className="h-5 w-5 mx-auto text-pink-600 mb-1" />
            <div className="text-2xl font-bold">{photos?.length || 0}</div>
            <div className="text-xs text-muted-foreground">Photos</div>
          </div>
        </div>

        {/* Recharts */}
        <div className="grid grid-cols-2 gap-5 mb-5">
          <div>
            <h4 className="text-sm font-medium mb-2">Posts per User</h4>
            <ResponsiveContainer width="100%" height={200}>
              <ReBarChart data={stats.postsChartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="posts" fill="#8884d8" />
              </ReBarChart>
            </ResponsiveContainer>
          </div>
          <div>
            <h4 className="text-sm font-medium mb-2">Todo Status</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={stats.todoChartData || []}
                  cx="50%"
                  cy="50%"
                  outerRadius={70}
                  dataKey="value"
                  label
                >
                  {(stats.todoChartData || []).map((_: any, index: number) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* User Activity Table */}
        <h4 className="text-sm font-medium mb-2">User Activity</h4>
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-center">Posts</th>
                <th className="p-2 text-center">Todos</th>
                <th className="p-2 text-center">Albums</th>
                <th className="p-2 text-center">Completion %</th>
              </tr>
            </thead>
            <tbody>
              {(stats.userActivity || []).map((user: any, i: number) => (
                <tr key={i} className="border-t">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2 text-center">{user.postCount}</td>
                  <td className="p-2 text-center">{user.todoCount}</td>
                  <td className="p-2 text-center">{user.albumCount}</td>
                  <td className="p-2 text-center">
                    <Badge
                      variant={
                        Number(stats.completionRates?.[user.id]) > 50 ? 'default' : 'destructive'
                      }
                    >
                      {stats.completionRates?.[user.id] || 0}%
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 text-xs text-muted-foreground space-y-1">
          <p>Average words per post: {stats.avgWordCount?.toFixed(1)}</p>
          <p>Total comments: {comments?.length}</p>
          <p>Total albums: {albums?.length}</p>
          <p>Calculation timestamp: {moment().format('HH:mm:ss.SSS')}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Analytics;
