import React, { useState, useEffect, useCallback } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { FileText, Undo2 } from 'lucide-react';
import { Badge } from './ui/badge';

import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

interface MarkdownEditorProps {
  theme: string;
  counter: number;
}

const MarkdownEditorComponent = ({ theme, counter }: MarkdownEditorProps) => {
  const [markdown, setMarkdown] = useState(`# Hello World  

This is a **markdown** editor with _live preview_.  

## Features  
- Real-time preview  
- Syntax highlighting  
- HTML sanitization  

\`\`\`javascript  
function hello() {  
  console.log('Hello, World!');  
}  
\`\`\`  

| Column 1 | Column 2 | Column 3 |  
|----------|----------|----------|  
| Cell 1   | Cell 2   | Cell 3   |  
| Cell 4   | Cell 5   | Cell 6   |  

> This is a blockquote with some **bold** text.  

---  

1. First item  
2. Second item  
3. Third item  
`);

  const [preview, setPreview] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [history, setHistory] = useState<string[]>([]);

  
  useEffect(() => {
    const html = marked(markdown) as string;
    const sanitized = DOMPurify.sanitize(html);
    setPreview(sanitized);
    setWordCount(markdown.split(/\s+/).filter(Boolean).length);

    setHistory((prev) => [...prev.slice(-50), markdown]);
  }, [markdown, counter]);


  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length > 1) {
        const newHistory = prev.slice(0, -1);
        setMarkdown(newHistory[newHistory.length - 1]);
        return newHistory;
      }
      return prev;
    });
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value);
    },
    []
  );

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Markdown Editor
          </CardTitle>

          <div className="flex items-center gap-3">
            <Badge variant="outline">Words: {wordCount}</Badge>
            <Badge variant="secondary">History: {history.length}</Badge>
            <Badge variant="outline">Chars: {markdown.length}</Badge>

            <Button
              aria-label='Undo'
              variant="ghost"
              size="sm"
              className="h-7"
              onClick={handleUndo}
            >
              <Undo2 className="h-3 w-3 mr-1" />
              Undo
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <h4 className="text-sm font-medium mb-2">Editor</h4>
            <textarea
              value={markdown}
              onChange={handleChange}
              className="w-full h-[300px] p-3 font-mono text-sm border rounded-md resize-y bg-background"
            />
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2">Preview</h4>

            <div
              className="h-[300px] overflow-auto p-3 border rounded-md bg-muted/30 prose prose-sm max-w-none"
              aria-live='polite'
              dangerouslySetInnerHTML={{ __html: preview }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MarkdownEditor = React.memo(MarkdownEditorComponent);

export default MarkdownEditor;