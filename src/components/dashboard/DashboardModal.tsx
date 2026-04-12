import React, { useEffect} from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

import { DashboardModalProps } from '../../lib/types';

const DashboardModal = ({ open, content, onClose }: DashboardModalProps) => {

  useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }

  document.addEventListener('keydown', handleKey)
  return () => document.removeEventListener('keydown', handleKey)
  }, [])
  

  if (!open) {
    return null;
  }

  return (
    <div
      role="dialog" 
      aria-modal="true"
      aria-labelledby='modal-title'
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <Card
        className="max-w-lg w-[90%] max-h-[80vh] overflow-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <CardContent className="p-5">
          <h3 id="modal-title" className="font-semibold mb-3">Details</h3>
          <pre className="text-xs overflow-auto bg-muted/50 p-3 rounded max-h-[400px]">
            {JSON.stringify(content, null, 2)}
          </pre>
          <Button aria-label="close" className="mt-3" onClick={onClose}>
            Close
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardModal;
