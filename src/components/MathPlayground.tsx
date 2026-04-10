import React, { useState, useEffect, useMemo } from 'react';
import * as mathjs from 'mathjs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Calculator } from 'lucide-react';

interface MathPlaygroundProps {
  counter: number;
  theme: string;
}

const MathPlayground = ({ counter, theme }: MathPlaygroundProps) => {
  const [matrix, setMatrix] = useState<number[][]>([]);

  console.log('MathPlayground render', counter);

  const results = useMemo(() => {
    const r: any = {};

    const size = 50;

    const A = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.random() * 20 - 10),
    );

    const B = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => Math.random() * 20 - 10),
    );

    // Matrix operations
    r.matrixProduct = mathjs.multiply(A, B);
    r.determinant = mathjs.det(A);

    // Statistics (reduced size for performance)
    const bigDataset = Array.from({ length: 20000 }, () => Math.random() * 1000);

    r.mean = mathjs.mean(bigDataset);
    r.std = mathjs.std(bigDataset);
    r.median = mathjs.median(bigDataset);
    r.variance = mathjs.variance(bigDataset);

    // Expressions (fast)
    r.expr1 = Math.sin(Math.PI / 4) * Math.cos(Math.PI / 3);
    r.expr2 = Math.sqrt(2) + Math.exp(2);
    r.expr3 = Math.log10(1000);

    const fib = [0, 1];
    for (let i = 2; i < 30; i++) {
      fib[i] = fib[i - 1] + fib[i - 2];
    }
    r.fib = fib;

    // Store small matrix preview
    setMatrix(A.slice(0, 5).map((row) => row.slice(0, 5)));

    return r;
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Math Playground (optimized)
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* Statistics */}
          <div>
            <h4 className="font-medium text-xs mb-2">Statistics</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mean:</span>
                <Badge variant="outline">{results.mean?.toFixed(4)}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Std Dev:</span>
                <Badge variant="outline">{results.std?.toFixed(4)}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Median:</span>
                <Badge variant="outline">{results.median?.toFixed(4)}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Variance:</span>
                <Badge variant="outline">{results.variance?.toFixed(4)}</Badge>
              </div>
            </div>
          </div>

          {/* Expressions */}
          <div>
            <h4 className="font-medium text-xs mb-2">Expressions</h4>
            <div className="space-y-1 text-xs font-mono">
              <div>sin(π/4)·cos(π/3) = {results.expr1?.toFixed(6)}</div>
              <div>√2 + e² = {results.expr2?.toFixed(6)}</div>
              <div>log₁₀(1000) = {results.expr3?.toFixed(6)}</div>
              <div>det(50×50) = {results.determinant?.toExponential(4)}</div>
            </div>
          </div>
        </div>

        {/* Matrix */}
        <div className="mt-3">
          <h4 className="font-medium text-xs mb-2">5×5 Matrix Preview</h4>
          <div className="overflow-auto">
            <table className="text-[10px] font-mono border-collapse">
              <tbody>
                {matrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((val, j) => (
                      <td key={j} className="border px-1.5 py-0.5 text-right">
                        {val.toFixed(2)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fibonacci */}
        <div className="mt-3">
          <h4 className="font-medium text-xs mb-1">Fibonacci</h4>
          <div className="flex flex-wrap gap-1">
            {results.fib?.slice(0, 20).map((n: number, i: number) => (
              <Badge key={i} variant="secondary" className="text-[10px]">
                {n}
              </Badge>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-2">Render count: {counter}</p>
      </CardContent>
    </Card>
  );
};

export default MathPlayground;
