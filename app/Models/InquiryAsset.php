<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class InquiryAsset extends Model
{
    protected $fillable = [
        'inquiry_id',
        'inquiry_step_id',
        'asset_type',
        'asset_path',
        'asset_url',
        'filename',
        'mime_type',
        'file_size',
        'description',
        'order',
    ];

    // Relaciones
    public function inquiry(): BelongsTo
    {
        return $this->belongsTo(Inquiry::class);
    }

    public function inquiryStep(): BelongsTo
    {
        return $this->belongsTo(InquiryStep::class);
    }

    // Métodos de utilidad
    public function getUrl(): string
    {
        if ($this->asset_url) {
            return $this->asset_url;
        }
        return Storage::url($this->asset_path);
    }

    public function isImage(): bool
    {
        return $this->asset_type === 'image';
    }

    public function isVideo(): bool
    {
        return $this->asset_type === 'video';
    }

    public function getFormattedSize(): string
    {
        $bytes = $this->file_size;
        if ($bytes < 1024) return $bytes . ' B';
        if ($bytes < 1048576) return round($bytes / 1024, 2) . ' KB';
        return round($bytes / 1048576, 2) . ' MB';
    }

    // Scope
    public function scopeImages($query)
    {
        return $query->where('asset_type', 'image');
    }

    public function scopeVideos($query)
    {
        return $query->where('asset_type', 'video');
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}
