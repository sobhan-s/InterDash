import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageIcon } from 'lucide-react';
import { API_ENDPOINTS } from '../utils/constants';
import { ImageGalleryProps, Photo } from '@/lib/types';

const ImageGalleryComponent = ({ photos: propPhotos }: ImageGalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [columns, setColumns] = useState(5);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };

    if (selectedPhoto) {
      document.addEventListener('keydown', handleKey);
    }

    return () => document.removeEventListener('keydown', handleKey);
  }, [selectedPhoto]);

  useEffect(() => {
  const cancel = new AbortController();

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      if (propPhotos?.length) {
        setPhotos(propPhotos);
      } else {
        const res = await fetch(
          `${API_ENDPOINTS.photos}?_limit=100`,
          { signal: cancel.signal }
        );
        const data = await res.json();

        if (!cancel.signal.aborted) {
          setPhotos(data);
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        setPhotos([]);
      }
    } finally {
      if (!cancel.signal.aborted) {
        setLoading(false);
      }
    }
  };

  fetchPhotos();

  return () => cancel.abort();
}, [propPhotos]);

  const handleSelectPhoto = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleColumnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setColumns(Number(e.target.value));
  }, []);

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
              onChange={handleColumnChange}
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

        {!loading && photos.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No photos available</p>
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
                  aria-label="Image"
                  key={photo.id}
                  className="cursor-pointer p-0 border-0 bg-transparent"
                  onClick={() => handleSelectPhoto(photo)}
                >
                  <img
                    src={photo.url}
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
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000]"
            onClick={handleCloseModal}
          >
            <div tabIndex={0} onClick={handleStopPropagation}>
              <img
                src={selectedPhoto.url}
                alt={selectedPhoto.title}
                className="max-w-[80vw] max-h-[80vh] rounded-lg"
              />
              <p className="mt-3 text-sm text-white text-center">{selectedPhoto.title}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default React.memo(ImageGalleryComponent);
