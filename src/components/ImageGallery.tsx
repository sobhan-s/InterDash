import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ImageIcon } from 'lucide-react'

interface ImageGalleryProps {
  photos: any[]
  theme: string
  counter: number
}

const ImageGallery = ({ photos, theme, counter }: ImageGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null)
  const [columns, setColumns] = useState(5)
  const [loadedImages, setLoadedImages] = useState<string[]>([])

  console.log('ImageGallery render', counter, 'photos:', photos?.length)

  useEffect(() => {
    const preloaded: string[] = []
    ;(photos || []).forEach((photo: any) => {
      const img = new Image()
      img.src = photo.thumbnailUrl
      img.onload = () => {
        preloaded.push(photo.thumbnailUrl)
        setLoadedImages([...preloaded])
      }
    })
    console.log('Preloading', photos?.length, 'images')
  }, [counter])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Photo Gallery ({photos?.length || 0} photos)
          </CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <span>Columns:</span>
            <input
              type="range" min="2" max="8" value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-muted-foreground">{columns}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          className="max-h-[500px] overflow-auto gap-1"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)` }}
        >
          {(photos || []).map((photo: any, index: number) => (
            <div
              key={index}
              className="relative cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img
                src={photo.thumbnailUrl}
                alt="photo"
                className="w-full h-[100px] object-cover rounded"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[9px] p-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                {photo.title}
              </div>
            </div>
          ))}
        </div>
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000]"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="text-center text-white" onClick={e => e.stopPropagation()}>
              <img src={selectedPhoto.url} alt="photo" className="max-w-[80vw] max-h-[80vh] rounded-lg" />
              //fix the xss issue
              <p className="mt-3 text-sm" >{ selectedPhoto.title }</p> 
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ImageGallery
