import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { ImageIcon } from 'lucide-react'

interface Photo {
  id: number
  thumbnailUrl: string
  url: string
  title: string
}

interface ImageGalleryProps {
  photos?: any[]
  theme: string
  counter: number
}

// picsum.photos gives real images — jsonplaceholder URLs point to
// via.placeholder.com which is frequently blocked/broken
const generatePhotos = (count: number): Photo[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    title: `Photo ${i + 1}`,
    thumbnailUrl: `https://picsum.photos/seed/${i + 1}/110/110`,
    url: `https://picsum.photos/seed/${i + 1}/800/600`,
  }))

const ImageGallery = ({ photos: propPhotos }: ImageGalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null)
  const [columns, setColumns] = useState(5)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (propPhotos && propPhotos.length > 0) {
      setPhotos(propPhotos)
      setLoading(false)
      return
    }
    // generate 100 photo entries using picsum
    setPhotos(generatePhotos(100))
    setLoading(false)
  }, [])

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Photo Gallery ({photos.length} photos)
          </CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <span>Columns:</span>
            <input
              type="range"
              min="2"
              max="8"
              value={columns}
              onChange={(e) => setColumns(Number(e.target.value))}
              className="w-20"
            />
            <span className="text-muted-foreground">{columns}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <p className="text-sm text-muted-foreground py-4 text-center">Loading photos...</p>
        )}

        {!loading && photos.length > 0 && (
          <div className="overflow-auto max-h-[500px]">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${columns}, 110px)`,
                gap: '4px',
              }}
            >
              {photos.map((photo) => (
                <button
                  key={photo.id}
                  className="cursor-pointer p-0 border-0 bg-transparent"
                  onClick={() => setSelectedPhoto(photo)}
                  aria-label={`View image: ${photo.title}`}
                >
                  <img
                    src={photo.thumbnailUrl}
                    alt={photo.title}
                    loading="lazy"
                    className="w-[110px] h-[110px] object-cover rounded"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000]"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="text-center text-white" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-[80vw] max-h-[80vh] rounded-lg"
              />
              <p className="mt-3 text-sm">{selectedPhoto.title}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default ImageGallery