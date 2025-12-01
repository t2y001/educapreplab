import { useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card } from '@/Components/ui/card';
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

interface FormulaBlockProps {
    content: string;
    onChange: (content: string) => void;
    inline?: boolean;
}

export function FormulaBlock({ content, onChange, inline = false }: FormulaBlockProps) {
    const [latex, setLatex] = useState(content);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (value: string) => {
        setLatex(value);
        onChange(value);
        setError(null);
    };

    return (
        <div className="space-y-2">
            <Label>Fórmula LaTeX</Label>
            <Input
                value={latex}
                onChange={(e) => handleChange(e.target.value)}
                placeholder="Ej: E = mc^2 o \int_{0}^{\infty} x^2 dx"
            />

            {/* Preview */}
            <Card className="p-4 bg-gray-50">
                <Label className="text-xs text-muted-foreground mb-2">Vista Previa:</Label>
                <div className="mt-2">
                    {error ? (
                        <p className="text-red-500 text-sm">{error}</p>
                    ) : latex ? (
                        <div className="overflow-x-auto">
                            {inline ? (
                                <InlineMath math={latex} />
                            ) : (
                                <BlockMath math={latex} />
                            )}
                        </div>
                    ) : (
                        <p className="text-muted-foreground text-sm">Escribe una fórmula LaTeX...</p>
                    )}
                </div>
            </Card>

            {/* Ayuda rápida */}
            <details className="text-xs text-muted-foreground">
                <summary className="cursor-pointer hover:text-foreground">Ayuda LaTeX</summary>
                <div className="mt-2 space-y-1 pl-2">
                    <p>• Superíndice: x^2</p>
                    <p>• Subíndice: x_1</p>
                    <p>• Fracción: \frac{"{a}"}{"{b}"}</p>
                    <p>• Raíz: \sqrt{"{x}"}</p>
                    <p>• Integral: \int_{"{a}"}^{"{b}"} f(x) dx</p>
                    <p>• Suma: \sum_{"{i=1}"}^{"{n}"} x_i</p>
                    <p>• Límite: \lim_{"{x \\to \\infty}"} f(x)</p>
                </div>
            </details>
        </div>
    );
}
