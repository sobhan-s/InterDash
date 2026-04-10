import React, { memo, useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ImageIcon } from 'lucide-react';
import { Grid } from 'react-window';

interface ImageGalleryProps {
  photos: any[];
  theme: string;
}

const Cell = ({ columnIndex, rowIndex, style, photos, columns, setSelectedPhoto }: any) => {
  const index = rowIndex * columns + columnIndex;
  const photo = photos[index];

  if (!photo) return null;

  return (
    <div style={style} className="p-1 cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
      <img
        src={photo.thumbnailUrl}
        loading="lazy"
        className="w-full h-[100px] object-cover rounded"
      />
    </div>
  );
};

const ImageGallery = ({ photos, theme }: ImageGalleryProps) => {
  const [selectedPhoto, setSelectedPhoto] = useState<any>(null);
  const [columns, setColumns] = useState(5);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);

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
        <div className="max-h-[500px] overflow-auto">
          <Grid
            columnCount={columns}
            rowCount={Math.ceil((photos?.length || 0) / columns)}
            columnWidth={110}
            rowHeight={110}
            cellComponent={Cell}
            cellProps={{
              photos,
              columns,
              setSelectedPhoto,
            }}
            style={{
              height: 500,
              width: columns * 110,
            }}
          />
        </div>
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-[2000]"
            onClick={() => setSelectedPhoto(null)}
          >
            <div className="text-center text-white" onClick={(e) => e.stopPropagation()}>
              <img
                src={selectedPhoto.url}
                alt="photo"
                className="max-w-[80vw] max-h-[80vh] rounded-lg"
              />
              //fix the xss issue
              <p className="mt-3 text-sm">{selectedPhoto.title}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default memo(ImageGallery);
