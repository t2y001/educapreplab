// resources/js/Components/ContentBlocks.tsx
import DOMPurify from 'dompurify';

type Block =
  | { type: 'paragraph'; data: { text: string; shaded?: boolean} }
  | { type: 'image'; data: { src: string; alt?: string; caption?: string } }
  | { type: 'table'; data: { headers?: string[]; rows: string[][] } }
  | { type: 'html'; data: { html: string } }
  | { type: 'callout'; data: {variant?: 'muted'|'info'|'warning'; blocks: Block[]}}
  | { type: 'list'; data: {style?:'bulleted'|'numbered'; items: string[]}}

export function ContentBlocks({ blocks }: { blocks: Block[] | undefined | null }) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'paragraph':
            //const base = "text-sm leading-7 text-foreground";
            const shaded = b.data.shaded ? "bg-muted/40 border rounded-md p-3" : "";
            return (
              <p key={i} className={`${shaded}`.trim()}>
                {b.data.text}
              </p>
            );
          case 'image':
            return (
              <figure key={i} className="space-y-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.data.src} alt={b.data.alt || ''} className="max-w-full rounded-lg border" />
                {b.data.caption && (
                  <figcaption className="text-xs text-muted-foreground">{b.data.caption}</figcaption>
                )}
              </figure>
            );
          case 'table':
            return (
              <div key={i} className="overflow-x-auto border rounded-lg">
                <table className="w-full text-sm">
                  {b.data.headers && (
                    <thead className="bg-accent/20">
                      <tr>
                        {b.data.headers.map((h, idx) => (
                          <th key={idx} className="px-3 py-2 text-left font-medium">{h}</th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {b.data.rows.map((row, rIdx) => (
                      <tr key={rIdx} className="border-t">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="px-3 py-2 align-top">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case 'html':
            const safe = DOMPurify.sanitize(b.data.html || '');
            return (
              <div
                key={i}
                //className="text-sm leading-7"
                dangerouslySetInnerHTML={{ __html: safe }}
              />
            );
          case 'callout':
            return (
              <div key={i} className="bg-muted/40 border rounded-xl p-4 space-y-3">
                <ContentBlocks blocks={b.data.blocks as any[]} />
              </div>
            );
          case 'list':
            return b.data.style === 'numbered' ? (
              <ol key={i} className="list-decimal pl-6 space-y-1">
                {b.data.items.map((t: string, k: number) => <li key={k}>{t}</li>)}
              </ol>
            ) : (
              <ul key={i} className="list-disc pl-6 space-y-1">
                {b.data.items.map((t: string, k: number) => <li key={k}>{t}</li>)}
              </ul>
            );
        }
      })}
    </div>
  );
}
