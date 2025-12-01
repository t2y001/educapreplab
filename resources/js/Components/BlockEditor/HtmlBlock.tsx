import { useState, useEffect } from 'react';
import { Label } from '@/Components/ui/label';
import { Card } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import { AlertTriangle } from 'lucide-react';
import DOMPurify from 'dompurify';

interface HtmlBlockProps {
    content: string;
    onChange: (content: string) => void;
}

export function HtmlBlock({ content, onChange }: HtmlBlockProps) {
    const [html, setHtml] = useState(content);
    const [sanitizedHtml, setSanitizedHtml] = useState('');

    useEffect(() => {
        // Sanitizar HTML para prevenir XSS
        const clean = DOMPurify.sanitize(html, {
            ALLOWED_TAGS: [
                'p', 'div', 'span', 'br', 'hr',
                'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small', 'sub', 'sup',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'a', 'img',
                'blockquote', 'code', 'pre'
            ],
            ALLOWED_ATTR: [
                'class', 'style', 'href', 'src', 'alt', 'title',
                'width', 'height', 'colspan', 'rowspan'
            ]
        });
        setSanitizedHtml(clean);
    }, [html]);

    const handleChange = (value: string) => {
        setHtml(value);
        onChange(value);
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground">HTML Personalizado</Label>
                <AlertTriangle className="h-3 w-3 text-yellow-600" />
                <span className="text-xs text-yellow-600">El HTML será sanitizado por seguridad</span>
            </div>

            {/* Editor HTML */}
            <Textarea
                value={html}
                onChange={(e) => handleChange(e.target.value)}
                className="min-h-[150px] font-mono text-xs"
                placeholder='Ejemplo:
<div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px;">
  <p><strong>Texto en negrita</strong> y <em>cursiva</em></p>
  <p style="color: #dc2626;">Texto en rojo</p>
</div>'
            />

            {/* Preview */}
            {html && (
                <Card className="p-3 bg-gray-50">
                    <Label className="text-xs text-muted-foreground mb-2">Vista Previa (Sanitizado):</Label>
                    <div
                        className="mt-2"
                        dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
                    />
                </Card>
            )}

            <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">Etiquetas HTML permitidas</summary>
                <div className="mt-2 space-y-1 pl-2">
                    <p><strong>Texto:</strong> p, div, span, strong, em, u, mark, small, sub, sup</p>
                    <p><strong>Encabezados:</strong> h1, h2, h3, h4, h5, h6</p>
                    <p><strong>Listas:</strong> ul, ol, li</p>
                    <p><strong>Tablas:</strong> table, thead, tbody, tr, th, td</p>
                    <p><strong>Otros:</strong> a, img, blockquote, code, pre, br, hr</p>
                    <p className="mt-2"><strong>Atributos permitidos:</strong> class, style, href, src, alt, title</p>
                </div>
            </details>

            <p className="text-xs text-yellow-600">
                ⚠️ Scripts, eventos y estilos peligrosos serán removidos automáticamente.
            </p>
        </div>
    );
}
