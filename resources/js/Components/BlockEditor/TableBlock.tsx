import { useState } from 'react';
import { Label } from '@/Components/ui/label';
import { Input } from '@/Components/ui/input';
import { Button } from '@/Components/ui/button';
import { Plus, Trash2 } from 'lucide-react';

interface TableBlockProps {
    tableData: string[][];
    onChange: (tableData: string[][]) => void;
}

export function TableBlock({ tableData, onChange }: TableBlockProps) {
    const [data, setData] = useState(tableData);

    const updateCell = (rowIndex: number, colIndex: number, value: string) => {
        const newData = data.map((row, rIdx) =>
            rIdx === rowIndex
                ? row.map((cell, cIdx) => cIdx === colIndex ? value : cell)
                : row
        );
        setData(newData);
        onChange(newData);
    };

    const addRow = () => {
        const newRow = new Array(data[0]?.length || 2).fill('');
        const newData = [...data, newRow];
        setData(newData);
        onChange(newData);
    };

    const addColumn = () => {
        const newData = data.map(row => [...row, '']);
        setData(newData);
        onChange(newData);
    };

    const removeRow = (rowIndex: number) => {
        if (data.length <= 1) return;
        const newData = data.filter((_, idx) => idx !== rowIndex);
        setData(newData);
        onChange(newData);
    };

    const removeColumn = (colIndex: number) => {
        if (data[0]?.length <= 1) return;
        const newData = data.map(row => row.filter((_, idx) => idx !== colIndex));
        setData(newData);
        onChange(newData);
    };

    return (
        <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tabla</Label>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border">
                    <tbody>
                        {data.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {row.map((cell, colIdx) => (
                                    <td key={colIdx} className="border p-1">
                                        <Input
                                            value={cell}
                                            onChange={(e) => updateCell(rowIdx, colIdx, e.target.value)}
                                            placeholder={rowIdx === 0 ? `Columna ${colIdx + 1}` : ''}
                                            className="h-8 text-sm"
                                        />
                                    </td>
                                ))}
                                <td className="border-0 p-1">
                                    {data.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeRow(rowIdx)}
                                            className="h-8 w-8 p-0"
                                        >
                                            <Trash2 className="h-3 w-3 text-red-500" />
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Controles */}
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addRow}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Fila
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addColumn}
                >
                    <Plus className="h-4 w-4 mr-1" />
                    Columna
                </Button>
                {data[0]?.length > 1 && (
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeColumn(data[0].length - 1)}
                    >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Última Columna
                    </Button>
                )}
            </div>
        </div>
    );
}
