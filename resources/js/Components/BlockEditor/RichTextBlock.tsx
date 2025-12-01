import { useState } from 'react';
import { Label } from '@/Components/ui/label';
import { Card } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
import { Bold, Italic, Underline, List, ListOrdered, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';

interface RichTextBlockProps {
    content: string;
    onChange: (content: string) => void;
}

export function RichTextBlock({ content, onChange }: RichTextBlockProps) {
    const [text, setText] = useState(content);
    const [styleType, setStyleType] = useState<string>('normal');

    const handleChange = (value: string) => {
        setText(value);
        onChange(value);
    };

    const insertMarkdown = (before: string, after: string = before) => {
        const textarea = document.activeElement as HTMLTextAreaElement;
        if (textarea && textarea.tagName === 'TEXTAREA') {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = text.substring(start, end) || 'texto';
            const newText = text.substring(0, start) + before + selectedText + after + text.substring(end);
            handleChange(newText);

            // Restaurar el foco y la selección
            setTimeout(() => {
                textarea.focus();
                textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
            }, 0);
        }
    };

    const insertStyle = (type: string) => {
        let prefix = '';
        switch (type) {
            case 'note':
                prefix = '[!NOTE] ';
                break;
            case 'warning':
                prefix = '[!WARNING] ';
                break;
            case 'important':
                prefix = '[!IMPORTANT] ';
                break;
            case 'gray-box':
                prefix = '[!BOX] ';
                break;
        }

        if (prefix) {
            handleChange(text + '\n' + prefix + 'Tu texto aquí');
        }
    };

    const renderPreview = (rawText: string) => {
        let html = rawText
            // Alertas especiales
            .replace(/\[!NOTE\]\s*(.+?)(?=\n|$)/g, '<div class="p-3 mb-2 bg-blue-50 border-l-4 border-blue-500 rounded"><strong>📘 Nota:</strong> $1</div>')
            .replace(/\[!WARNING\]\s*(.+?)(?=\n|$)/g, '<div class="p-3 mb-2 bg-yellow-50 border-l-4 border-yellow-500 rounded"><strong>⚠️ Advertencia:</strong> $1</div>')
            .replace(/\[!IMPORTANT\]\s*(.+?)(?=\n|$)/g, '<div class="p-3 mb-2 bg-red-50 border-l-4 border-red-500 rounded"><strong>❗ Importante:</strong> $1</div>')
            .replace(/\[!BOX\]\s*(.+?)(?=\n|$)/g, '<div class="p-3 mb-2 bg-gray-100 rounded">$1</div>')
            // Formato básico
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/__(.+?)__/g, '<u>$1</u>')
            // Listas
            .replace(/^- (.+)$/gm, '<li>$1</li>')
            .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
            // Saltos de línea
            .replace(/\n/g, '<br/>');

        return html;
    };

    return (
        <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Texto Rico</Label>

            {/* Toolbar */}
            <div className="flex flex-wrap gap-2 p-2 border rounded bg-gray-50">
                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Negrita"
                        onClick={() => insertMarkdown('**')}
                    >
                        <Bold className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Cursiva"
                        onClick={() => insertMarkdown('*')}
                    >
                        <Italic className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Subrayado"
                        onClick={() => insertMarkdown('__')}
                    >
                        <Underline className="h-4 w-4" />
                    </Button>
                </div>

                <div className="w-px bg-gray-300" />

                <div className="flex gap-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Lista"
                        onClick={() => handleChange(text + '\n- Elemento de lista')}
                    >
                        <List className="h-4 w-4" />
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        title="Lista numerada"
                        onClick={() => handleChange(text + '\n1. Elemento numerado')}
                    >
                        <ListOrdered className="h-4 w-4" />
                    </Button>
                </div>

                <div className="w-px bg-gray-300" />

                {/* Estilos predefinidos */}
                <Select value={styleType} onValueChange={(value) => {
                    setStyleType(value);
                    if (value !== 'normal') {
                        insertStyle(value);
                        setStyleType('normal');
                    }
                }}>
                    <SelectTrigger className="w-40 h-8">
                        <SelectValue placeholder="Estilos" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="normal">Estilos...</SelectItem>
                        <SelectItem value="note">📘 Nota</SelectItem>
                        <SelectItem value="warning">⚠️ Advertencia</SelectItem>
                        <SelectItem value="important">❗ Importante</SelectItem>
                        <SelectItem value="gray-box">⬜ Caja gris</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Editor de texto */}
            <Textarea
                value={text}
                onChange={(e) => handleChange(e.target.value)}
                className="min-h-[120px] font-mono text-sm"
                placeholder="Escribe texto con formato...
**negrita** *cursiva* __subrayado__
- Lista con viñetas
1. Lista numerada
[!NOTE] Nota importante
[!WARNING] Advertencia
[!IMPORTANT] Muy importante
[!BOX] Caja con fondo gris"
            />

            {/* Preview */}
            {text && (
                <Card className="p-3 bg-gray-50">
                    <Label className="text-xs text-muted-foreground mb-2">Vista Previa:</Label>
                    <div
                        className="mt-2 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: renderPreview(text) }}
                    />
                </Card>
            )}

            <p className="text-xs text-muted-foreground">
                💡 Usa markdown para formato. Selecciona texto y haz click en los botones para aplicar formato.
            </p>
        </div>
    );
}
