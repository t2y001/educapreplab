import { Textarea } from '@/Components/ui/textarea';
import { Button } from '@/Components/ui/button';
import { Label } from '@/Components/ui/label';
import { Card } from '@/Components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { Plus, Trash2, MoveUp, MoveDown, Type, Sigma, Image as ImageIcon, List, Table as TableIcon, FileText, Code } from 'lucide-react';
import { FormulaBlock } from './FormulaBlock';
import { ImageBlock } from './ImageBlock';
import { RichTextBlock } from './RichTextBlock';
import { TableBlock } from './TableBlock';
import { HtmlBlock } from './HtmlBlock';

interface Block {
    id: string;
    type: 'paragraph' | 'formula' | 'image' | 'rich_text' | 'list' | 'table' | 'html';
    content?: string;
    imageUrl?: string;
    imageAlt?: string;
    listItems?: string[];
    listType?: 'bullet' | 'numbered';
    tableData?: string[][];
}

interface BlockEditorProps {
    blocks: Block[];
    onChange: (blocks: Block[]) => void;
    label?: string;
    description?: string;
}

export function BlockEditor({ blocks, onChange, label, description }: BlockEditorProps) {
    const addBlock = (type: Block['type']) => {
        const newBlock: Block = {
            id: `block-${Date.now()}`,
            type,
            content: '',
            ...(type === 'list' && { listItems: [''], listType: 'bullet' as const }),
            ...(type === 'table' && { tableData: [['', ''], ['', '']] }),
        };
        onChange([...blocks, newBlock]);
    };

    const updateBlock = (id: string, updates: Partial<Block>) => {
        onChange(blocks.map(block =>
            block.id === id ? { ...block, ...updates } : block
        ));
    };

    const removeBlock = (id: string) => {
        onChange(blocks.filter(block => block.id !== id));
    };

    const moveBlock = (index: number, direction: 'up' | 'down') => {
        const newBlocks = [...blocks];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        if (targetIndex < 0 || targetIndex >= blocks.length) return;

        [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
        onChange(newBlocks);
    };

    return (
        <div className="space-y-4">
            {label && <Label>{label}</Label>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}

            {/* Bloques existentes */}
            <div className="space-y-3">
                {blocks.map((block, index) => (
                    <Card key={block.id} className="p-4">
                        <div className="flex items-start gap-2">
                            {/* Controles de orden */}
                            <div className="flex flex-col gap-1">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => moveBlock(index, 'up')}
                                    disabled={index === 0}
                                >
                                    <MoveUp className="h-3 w-3" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={() => moveBlock(index, 'down')}
                                    disabled={index === blocks.length - 1}
                                >
                                    <MoveDown className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Contenido del bloque */}
                            <div className="flex-1">
                                {block.type === 'paragraph' && (
                                    <div className="space-y-2">
                                        <Label className="text-xs text-muted-foreground">Párrafo</Label>
                                        <Textarea
                                            value={block.content || ''}
                                            onChange={(e) => updateBlock(block.id, { content: e.target.value })}
                                            placeholder="Escribe el texto..."
                                            rows={3}
                                        />
                                    </div>
                                )}

                                {block.type === 'formula' && (
                                    <FormulaBlock
                                        content={block.content || ''}
                                        onChange={(content) => updateBlock(block.id, { content })}
                                    />
                                )}

                                {block.type === 'image' && (
                                    <ImageBlock
                                        imageUrl={block.imageUrl}
                                        imageAlt={block.imageAlt}
                                        onChange={(data) => updateBlock(block.id, data)}
                                    />
                                )}

                                {block.type === 'rich_text' && (
                                    <RichTextBlock
                                        content={block.content || ''}
                                        onChange={(content) => updateBlock(block.id, { content })}
                                    />
                                )}

                                {block.type === 'html' && (
                                    <HtmlBlock
                                        content={block.content || ''}
                                        onChange={(content) => updateBlock(block.id, { content })}
                                    />
                                )}

                                {block.type === 'list' && (
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Label className="text-xs text-muted-foreground">Lista</Label>
                                            <Select
                                                value={block.listType || 'bullet'}
                                                onValueChange={(value: 'bullet' | 'numbered') =>
                                                    updateBlock(block.id, { listType: value })
                                                }
                                            >
                                                <SelectTrigger className="w-32 h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="bullet">Viñetas</SelectItem>
                                                    <SelectItem value="numbered">Numerada</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            {(block.listItems || ['']).map((item, idx) => (
                                                <div key={idx} className="flex gap-2">
                                                    <span className="text-sm text-muted-foreground mt-2">
                                                        {block.listType === 'numbered' ? `${idx + 1}.` : '•'}
                                                    </span>
                                                    <Textarea
                                                        value={item}
                                                        onChange={(e) => {
                                                            const newItems = [...(block.listItems || [''])];
                                                            newItems[idx] = e.target.value;
                                                            updateBlock(block.id, { listItems: newItems });
                                                        }}
                                                        placeholder="Elemento de la lista..."
                                                        rows={2}
                                                        className="flex-1"
                                                    />
                                                    {(block.listItems?.length || 0) > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                const newItems = (block.listItems || ['']).filter((_, i) => i !== idx);
                                                                updateBlock(block.id, { listItems: newItems });
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    )}
                                                </div>
                                            ))}
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const newItems = [...(block.listItems || ['']), ''];
                                                    updateBlock(block.id, { listItems: newItems });
                                                }}
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Agregar elemento
                                            </Button>
                                        </div>
                                    </div>
                                )}

                                {block.type === 'table' && (
                                    <TableBlock
                                        tableData={block.tableData || [['', ''], ['', '']]}
                                        onChange={(tableData) => updateBlock(block.id, { tableData })}
                                    />
                                )}
                            </div>

                            {/* Botón eliminar */}
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeBlock(block.id)}
                            >
                                <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Botones para agregar bloques */}
            <div className="flex flex-wrap gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock('paragraph')}
                >
                    <Type className="h-4 w-4 mr-1" />
                    Texto
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock('rich_text')}
                >
                    <FileText className="h-4 w-4 mr-1" />
                    Texto Rico
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock('formula')}
                >
                    <Sigma className="h-4 w-4 mr-1" />
                    Fórmula
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock('image')}
                >
                    <ImageIcon className="h-4 w-4 mr-1" />
                    Imagen
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock('list')}
                >
                    <List className="h-4 w-4 mr-1" />
                    Lista
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock('table')}
                >
                    <TableIcon className="h-4 w-4 mr-1" />
                    Tabla
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addBlock('html')}
                >
                    <Code className="h-4 w-4 mr-1" />
                    HTML
                </Button>
            </div>
        </div>
    );
}
