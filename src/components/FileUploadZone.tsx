// File upload drop zone — Addendum A8
import { useState, useRef } from 'react'
import { UploadCloud, FileText, X } from 'lucide-react'
import { Badge } from './Badge'

export interface UploadedFile {
  name: string
  size: string
  type: 'main' | 'supporting'
}

interface FileUploadZoneProps {
  label: string
  required?: boolean
  helpText?: string
  multiple?: boolean
  files: UploadedFile[]
  onFilesChange: (files: UploadedFile[]) => void
  docType: 'main' | 'supporting'
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function FileUploadZone({
  label,
  required,
  helpText,
  multiple = false,
  files,
  onFilesChange,
  docType,
}: FileUploadZoneProps) {
  const [dragCount, setDragCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const isDragging = dragCount > 0

  const processFiles = (rawFiles: FileList | null) => {
    if (!rawFiles || rawFiles.length === 0) return
    const newFiles: UploadedFile[] = Array.from(rawFiles).map((f) => ({
      name: f.name,
      size: formatSize(f.size > 0 ? f.size : Math.floor(Math.random() * 3000000) + 50000),
      type: docType,
    }))
    if (multiple) {
      onFilesChange([...files, ...newFiles])
    } else {
      onFilesChange([newFiles[0]])
    }
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCount((c) => c + 1)
  }
  const handleDragLeave = () => setDragCount((c) => Math.max(0, c - 1))
  const handleDragOver = (e: React.DragEvent) => e.preventDefault()
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragCount(0)
    processFiles(e.dataTransfer.files)
  }

  const removeFile = (idx: number) => {
    onFilesChange(files.filter((_, i) => i !== idx))
  }

  const showZone = multiple || files.length === 0

  return (
    <div>
      {/* Label */}
      <div style={{ marginBottom: '8px' }}>
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--color-text-primary)',
          }}
        >
          {label}
          {required && (
            <span style={{ color: 'var(--color-negative)', marginLeft: '3px' }}>*</span>
          )}
        </span>
        {helpText && (
          <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            {helpText}
          </p>
        )}
      </div>

      {/* Drop zone */}
      {showZone && (
        <div
          onClick={() => inputRef.current?.click()}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          style={{
            border: `2px ${isDragging ? 'solid' : 'dashed'} ${isDragging ? 'var(--color-info)' : 'var(--color-border-strong)'}`,
            borderRadius: 'var(--radius-3)',
            backgroundColor: isDragging ? 'var(--color-info-subtle)' : 'var(--color-bg-subtle)',
            padding: '32px 24px',
            minHeight: '140px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            textAlign: 'center',
            transform: isDragging ? 'scale(1.01)' : 'scale(1)',
            transition: `border-color var(--duration-fast) var(--easing-standard),
                         background-color var(--duration-fast) var(--easing-standard),
                         transform var(--duration-fast) var(--easing-standard)`,
          }}
          onMouseEnter={(e) => {
            if (!isDragging) {
              e.currentTarget.style.borderColor = 'var(--color-border-focus)'
              e.currentTarget.style.backgroundColor = 'var(--color-info-subtle)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isDragging) {
              e.currentTarget.style.borderColor = 'var(--color-border-strong)'
              e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)'
            }
          }}
        >
          <UploadCloud
            size={36}
            strokeWidth={1.5}
            style={{ color: isDragging ? 'var(--color-info)' : 'var(--color-text-secondary)' }}
          />
          <p
            style={{
              margin: '10px 0 4px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--color-text-primary)',
            }}
          >
            Drag and drop your file here
          </p>
          <p style={{ margin: 0, fontSize: '12px', color: 'var(--color-text-secondary)' }}>
            or click to browse · PDF files only
          </p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        multiple={multiple}
        style={{ display: 'none' }}
        onChange={(e) => processFiles(e.target.files)}
      />

      {/* File list */}
      {files.map((file, idx) => (
        <div
          key={idx}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 14px',
            backgroundColor: 'var(--color-bg-surface)',
            border: '1px solid var(--color-border-default)',
            borderRadius: 'var(--radius-2)',
            marginTop: '8px',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-subtle)' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--color-bg-surface)' }}
        >
          <FileText size={18} style={{ color: 'var(--color-text-secondary)', flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--color-text-primary)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {file.name}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-text-secondary)', marginTop: '1px' }}>
              {file.size}
            </div>
          </div>
          <Badge
            variant={file.type === 'main' ? 'doc-main' : 'doc-supporting'}
            label={file.type === 'main' ? 'Main' : 'Supporting'}
            dot={false}
          />
          <button
            onClick={() => removeFile(idx)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '28px',
              height: '28px',
              border: 'none',
              borderRadius: 'var(--radius-2)',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              color: 'var(--color-text-secondary)',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--color-negative)' }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--color-text-secondary)' }}
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
