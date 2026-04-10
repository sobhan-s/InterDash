import React, { memo, useState, useEffect } from 'react'
import * as mathjs from 'mathjs'
import { faker } from '@faker-js/faker'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Calculator } from 'lucide-react'


interface MathPlaygroundProps {
  theme: string
}

const MathPlayground = ({ theme }: MathPlaygroundProps) => {
  const [results, setResults] = useState<any>({})
  const [matrix, setMatrix] = useState<number[][]>([])

  useEffect(() => {
    const r: any = {}

    // Matrix operations - intentionally wasteful
    const size = 50
    const A = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => faker.number.float({ min: -10, max: 10 }))
    )
    const B = Array.from({ length: size }, () =>
      Array.from({ length: size }, () => faker.number.float({ min: -10, max: 10 }))
    )

    r.matrixProduct = mathjs.multiply(A, B)
    r.determinant = mathjs.det(A)
    r.eigenvalues = 'computing...' // eigenvalues too slow to actually compute every second

    // Statistical computations
    const bigDataset = Array.from({ length: 100000 }, () => faker.number.float({ min: 0, max: 1000 }))
    r.mean = mathjs.mean(bigDataset)
    r.std = mathjs.std(bigDataset)
    r.median = mathjs.median(bigDataset)
    r.variance = mathjs.variance(bigDataset)

    // Expression evaluation
    r.expr1 = mathjs.evaluate('sin(pi/4) * cos(pi/3)')
    r.expr2 = mathjs.evaluate('sqrt(2) + e^2')
    r.expr3 = mathjs.evaluate('log(1000, 10)')

    // Fibonacci sequence using mathjs (slow)
    r.fib = []
    for (let i = 0; i < 30; i++) {
      r.fib.push(mathjs.evaluate(`round(((1 + sqrt(5)) / 2)^${i} / sqrt(5))`))
    }

    setResults(r)
    setMatrix(A.slice(0, 5).map(row => row.slice(0, 5)))
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          Math Playground (mathjs)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-xs mb-2">Statistics (100K samples)</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mean:</span>
                <Badge variant="outline">{typeof results.mean === 'number' ? results.mean.toFixed(4) : '...'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Std Dev:</span>
                <Badge variant="outline">{typeof results.std === 'number' ? results.std.toFixed(4) : '...'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Median:</span>
                <Badge variant="outline">{typeof results.median === 'number' ? results.median.toFixed(4) : '...'}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Variance:</span>
                <Badge variant="outline">{typeof results.variance === 'number' ? results.variance.toFixed(4) : '...'}</Badge>
              </div>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-xs mb-2">Expressions</h4>
            <div className="space-y-1 text-xs font-mono">
              <div>sin(π/4)·cos(π/3) = {typeof results.expr1 === 'number' ? results.expr1.toFixed(6) : '...'}</div>
              <div>√2 + e² = {typeof results.expr2 === 'number' ? results.expr2.toFixed(6) : '...'}</div>
              <div>log₁₀(1000) = {typeof results.expr3 === 'number' ? results.expr3.toFixed(6) : '...'}</div>
              <div>det(50×50) = {typeof results.determinant === 'number' ? results.determinant.toExponential(4) : '...'}</div>
            </div>
          </div>
        </div>
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
        <div className="mt-3">
          <h4 className="font-medium text-xs mb-1">Fibonacci (first 20)</h4>
          <div className="flex flex-wrap gap-1">
            {(results.fib || []).slice(0, 20).map((n: number, i: number) => (
              <Badge key={i} variant="secondary" className="text-[10px]">{n}</Badge>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">Recalculated on load</p>
      </CardContent>
    </Card>
  )
}

export default memo(MathPlayground)
