import { useState } from 'react';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { Upload, X } from 'lucide-react';
import { router } from '@inertiajs/react';

interface ImageBlockProps {
    imageUrl?: string;
    imageAlt?: string;
    onChange: (data: { imageUrl: string; imageAlt: string }) => void;
}

export function ImageBlock({ imageUrl, imageAlt, onChange }: ImageBlockProps) {
    const [preview, setPreview] = useState(imageUrl);
    const [alt, setAlt] = useState(imageAlt || '');
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
        if (!validTypes.includes(file.type)) {
            alert('Formato no válido. Usa PNG, JPG, WebP o SVG');
            return;
        }

        // Validar tamaño (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('La imagen es muy grande. Máximo 5MB');
            return;
        }

        // Crear preview local inmediatamente
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result as string);
            onChange({ imageUrl: reader.result as string, imageAlt: alt });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="space-y-4">
            <div>
                <Label>Imagen</Label>
                <div className="mt-2">
                    {preview ? (
                        <div className="relative">
                            <img
                                src={preview}
                                alt={alt}
                                className="max-w-full h-auto rounded border"
                            />
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => {
                                    setPreview('');
                                    onChange({ imageUrl: '', imageAlt: '' });
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
                            <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            <span className="text-sm text-muted-foreground">
                                Click para subir imagen
                            </span>
                            <span className="text-xs text-muted-foreground mt-1">
                                PNG, JPG, WebP, SVG (max 5MB)
                            </span>
                            <input
                                type="file"
                                className="hidden"
                                accept=".png,.jpg,.jpeg,.webp,.svg"
                                onChange={handleFileUpload}
                            />
                        </label>
                    )}
                </div>
            </div>

            <div>
                <Label>Texto alternativo (accesibilidad)</Label>
                <Input
                    value={alt}
                    onChange={(e) => {
                        setAlt(e.target.value);
                        if (preview) {
                            onChange({ imageUrl: preview, imageAlt: e.target.value });
                        }
                    }}
                    placeholder="Describe la imagen..."
                />
            </div>
        </div>
    );
}
