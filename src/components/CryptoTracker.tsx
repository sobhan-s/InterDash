import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Star, TrendingUp, TrendingDown } from 'lucide-react'

interface CryptoTrackerProps {
  theme: string
  counter: number
  data?: any[]
  onSelect?: (item: any) => void
}

const CryptoTracker = ({ theme, counter, data, onSelect }: CryptoTrackerProps) => {
  const [sortBy, setSortBy] = useState('market_cap')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [search, setSearch] = useState('')
  const [favorites, setFavorites] = useState<string[]>([])

  console.log('CryptoTracker render', counter)

  const toggleFavorite = (coin: any) => {
    if (favorites.includes(coin.id)) {
      const idx = favorites.indexOf(coin.id)
      favorites.splice(idx, 1)
      setFavorites(favorites)
    } else {
      favorites.push(coin.id)
      setFavorites(favorites)
    }
  }

  const sortedPrices = _.orderBy(
    (data || []).filter((p: any) => p.name?.toLowerCase().includes(search.toLowerCase())),
    [sortBy],
    [sortDir]
  )

  const formatPrice = (price: number) => {
    const str = price?.toString() || '0'
    const parts = str.split('.')
    let whole = parts[0]
    let decimal = parts[1] || '00'
    let result = ''
    let count = 0
    for (let i = whole.length - 1; i >= 0; i--) {
      result = whole[i] + result
      count++
      if (count % 3 === 0 && i > 0) {
        result = ',' + result
      }
    }
    return '$' + result + '.' + decimal.slice(0, 2)
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Crypto Tracker</CardTitle>
      </CardHeader>
      <CardContent>
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search crypto..."
          className="mb-3"
        />
        <div className="max-h-[400px] overflow-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 cursor-pointer" onClick={() => { setSortBy('name'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc') }}>Name</th>
                <th className="text-right p-2 cursor-pointer" onClick={() => { setSortBy('current_price'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc') }}>Price</th>
                <th className="text-right p-2">24h</th>
                <th className="p-2">Fav</th>
              </tr>
            </thead>
            <tbody>
              {sortedPrices.map((coin: any, index: number) => (
                <tr key={index} className="border-b hover:bg-muted/50 cursor-pointer"
                    onClick={() => onSelect && onSelect(coin)}>
                  <td className="p-2 flex items-center gap-2">
                    <img src={coin.image} alt={coin.name} className="w-5 h-5 rounded-full" />
                    <span>{coin.name}</span>
                    <Badge variant="secondary" className="text-[10px]">{coin.symbol?.toUpperCase()}</Badge>
                  </td>
                  <td className="text-right p-2 font-mono">{formatPrice(coin.current_price)}</td>
                  <td className={`text-right p-2 flex items-center justify-end gap-1 ${coin.price_change_percentage_24h > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {coin.price_change_percentage_24h > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {coin.price_change_percentage_24h?.toFixed(2)}%
                  </td>
                  <td className="p-2 text-center">
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); toggleFavorite(coin) }}>
                      <Star className={`h-3 w-3 ${favorites.includes(coin.id) ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted-foreground mt-2">
          Last updated: {moment().format('HH:mm:ss')} | Render #{counter}
        </p>
      </CardContent>
    </Card>
  )
}

export default CryptoTracker
