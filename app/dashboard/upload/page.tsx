"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  UploadIcon,
  FileSpreadsheetIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  DownloadIcon,
  RefreshCwIcon,
} from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface UploadHistory {
  id: string
  fileName: string
  uploadDate: string
  status: "success" | "failed" | "partial"
  recordsProcessed: number
  recordsFailed: number
}

const mockHistory: UploadHistory[] = [
  {
    id: "1",
    fileName: "inventory_update_jan_2024.xlsx",
    uploadDate: "2024-01-15 14:32",
    status: "success",
    recordsProcessed: 245,
    recordsFailed: 0,
  },
  {
    id: "2",
    fileName: "new_products_dec_2023.xlsx",
    uploadDate: "2024-01-10 09:15",
    status: "partial",
    recordsProcessed: 189,
    recordsFailed: 12,
  },
  {
    id: "3",
    fileName: "stock_update_dec_2023.xlsx",
    uploadDate: "2024-01-05 16:45",
    status: "success",
    recordsProcessed: 567,
    recordsFailed: 0,
  },
]

export default function UploadPage() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const excelFile = files.find(
      (file) =>
        file.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel" ||
        file.name.endsWith(".xlsx") ||
        file.name.endsWith(".xls"),
    )

    if (excelFile) {
      setSelectedFile(excelFile)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsUploading(false)
            setSelectedFile(null)
            setUploadProgress(0)
          }, 500)
          return 100
        }
        return prev + 10
      })
    }, 200)

    console.log("[v0] Uploading file:", selectedFile.name)
  }

  const getStatusBadge = (status: UploadHistory["status"]) => {
    switch (status) {
      case "success":
        return (
          <Badge variant="default" className="gap-1">
            <CheckCircleIcon className="size-3" />
            Success
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircleIcon className="size-3" />
            Failed
          </Badge>
        )
      case "partial":
        return (
          <Badge variant="secondary" className="gap-1">
            <AlertCircleIcon className="size-3" />
            Partial
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-balance">Upload Data</h1>
        <p className="text-muted-foreground text-pretty">
          Import inventory data from Excel files to sync with your system
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Excel File</CardTitle>
          <CardDescription>
            Drag and drop your Excel file or click to browse. Supported formats: .xlsx, .xls
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-lg p-12 transition-colors ${
              isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-accent/5"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              id="file-upload"
              className="sr-only"
              accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
              onChange={handleFileSelect}
              disabled={isUploading}
            />

            <div className="flex flex-col items-center justify-center gap-4 text-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary/10">
                <UploadIcon className="size-8 text-primary" />
              </div>

              {selectedFile ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <FileSpreadsheetIcon className="size-4 text-primary" />
                    <span className="font-medium">{selectedFile.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-lg font-medium">Drop your Excel file here</p>
                    <p className="text-sm text-muted-foreground mt-1">or click to browse from your computer</p>
                  </div>
                  <label htmlFor="file-upload">
                    <Button variant="outline" asChild>
                      <span>Browse Files</span>
                    </Button>
                  </label>
                </>
              )}

              {isUploading && (
                <div className="w-full max-w-md space-y-2">
                  <Progress value={uploadProgress} />
                  <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                </div>
              )}
            </div>
          </div>

          {selectedFile && !isUploading && (
            <div className="flex items-center gap-2 mt-4">
              <Button onClick={handleUpload} className="gap-2">
                <UploadIcon className="size-4" />
                Upload & Sync
              </Button>
              <Button variant="outline" onClick={() => setSelectedFile(null)}>
                Cancel
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Template Download */}
      <Card>
        <CardHeader>
          <CardTitle>Download Template</CardTitle>
          <CardDescription>Use our Excel template to ensure your data is formatted correctly</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
                <FileSpreadsheetIcon className="size-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Inventory Template.xlsx</p>
                <p className="text-xs text-muted-foreground">Includes all required columns and sample data</p>
              </div>
            </div>
            <Button variant="outline" className="gap-2 bg-transparent">
              <DownloadIcon className="size-4" />
              Download
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Upload History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Upload History</CardTitle>
              <CardDescription>Recent file uploads and sync status</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <RefreshCwIcon className="size-4" />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/5 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-md bg-primary/10">
                    <FileSpreadsheetIcon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{item.fileName}</p>
                    <p className="text-xs text-muted-foreground">{item.uploadDate}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-medium">{item.recordsProcessed} records processed</p>
                    {item.recordsFailed > 0 && <p className="text-xs text-destructive">{item.recordsFailed} failed</p>}
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                1
              </div>
              <div>
                <p className="font-medium">Download the template</p>
                <p className="text-muted-foreground">Use our Excel template to ensure proper formatting</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                2
              </div>
              <div>
                <p className="font-medium">Fill in your data</p>
                <p className="text-muted-foreground">Add your inventory items with all required fields</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                3
              </div>
              <div>
                <p className="font-medium">Upload and sync</p>
                <p className="text-muted-foreground">Drag and drop your file or click to browse, then upload</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="flex size-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary shrink-0">
                4
              </div>
              <div>
                <p className="font-medium">Review results</p>
                <p className="text-muted-foreground">Check the upload history for any errors or warnings</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
