import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageIcon } from 'lucide-react';
import { API_ENDPOINTS } from '../utils/constants';
import { ImageGalleryProps, Photo } from '@/lib/types';

const THUMB_SIZE = 110;
const GAP = 4;
const OVERSCAN = 2;
const VIEWPORT_HEIGHT = 500;

const ImageGalleryComponent = ({ photos: propPhotos }: ImageGalleryProps) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [columns, setColumns] = useState(5);
  const [loading, setLoading] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedPhoto(null);
    };
    if (selectedPhoto) document.addEventListener('keydown', handleKey);
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
          const res = await fetch(`${API_ENDPOINTS.photos}?_limit=5000`, {
            signal: cancel.signal,
          });
          const data = await res.json();
          if (!cancel.signal.aborted) setPhotos(data);
        }
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setPhotos([]);
      } finally {
        if (!cancel.signal.aborted) setLoading(false);
      }
    };

    fetchPhotos();
    return () => cancel.abort();
  }, [propPhotos]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
    setScrollTop(0);
  }, [columns]);

  const rowHeight = THUMB_SIZE + GAP;
  const totalRows = Math.ceil(photos.length / columns);
  const totalHeight = totalRows * rowHeight;

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - OVERSCAN);
  const endRow = Math.min(
    totalRows - 1,
    Math.ceil((scrollTop + VIEWPORT_HEIGHT) / rowHeight) + OVERSCAN,
  );

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const handleSelectPhoto = useCallback((photo: Photo) => {
    setSelectedPhoto(photo);
  }, []);

  const handleCloseModal = useCallback(() => setSelectedPhoto(null), []);

  const handleStopPropagation = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
  }, []);

  const handleColumnChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setColumns(Number(e.target.value));
  }, []);

  const visibleRows = Array.from(
    { length: Math.max(0, endRow - startRow + 1) },
    (_, i) => startRow + i,
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Photo Gallery ({photos.length.toLocaleString()} photos)
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
              aria-label="columns-range-input"
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
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            style={{ height: VIEWPORT_HEIGHT, overflowY: 'auto', position: 'relative' }}
          >
            <div style={{ height: totalHeight, width: '100%' }} />

            {visibleRows.map((rowIdx) => {
              const start = rowIdx * columns;
              const rowPhotos = photos.slice(start, start + columns);

              return (
                <div
                  key={rowIdx}
                  style={{
                    position: 'absolute',
                    top: rowIdx * rowHeight,
                    left: 0,
                    display: 'flex',
                    gap: GAP,
                    padding: `0 ${GAP}px`,
                  }}
                >
                  {rowPhotos.map((photo) => (
                    <button
                      key={photo.id}
                      aria-label={photo.title}
                      className="cursor-pointer p-0 border-0 bg-transparent"
                      onClick={() => handleSelectPhoto(photo)}
                    >
                      <img
                        src={photo.url}
                        alt={photo.title}
                        loading="lazy"
                        width={THUMB_SIZE}
                        height={THUMB_SIZE}
                        className="object-cover rounded"
                        style={{ width: THUMB_SIZE, height: THUMB_SIZE }}
                        onError={(e) => {
                          e.currentTarget.src = `https://picsum.photos/seed/${photo.id}/110/110`;
                          e.currentTarget.onerror = null;
                        }}
                      />
                    </button>
                  ))}
                </div>
              );
            })}
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
                onError={(e) => {
                  e.currentTarget.src = `https://picsum.photos/seed/${selectedPhoto.id}/800/600`;
                  e.currentTarget.onerror = null;
                }}
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
