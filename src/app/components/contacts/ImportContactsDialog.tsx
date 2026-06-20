import { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download, HelpCircle } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Progress } from '@/app/components/ui/progress';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/app/components/ui/tooltip';
import { Checkbox } from '@/app/components/ui/checkbox';

interface ImportContactsDialogProps {
  open: boolean;
  onClose: () => void;
  onImportComplete: (count: number) => void;
}

export function ImportContactsDialog({ open, onClose, onImportComplete }: ImportContactsDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState<{
    success: number;
    failed: number;
    total: number;
  } | null>(null);
  const [hasConsent, setHasConsent] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      // Validate file type
      if (!selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
        alert('Please upload a CSV or Excel file');
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2500));

    clearInterval(progressInterval);
    setUploadProgress(100);

    // Mock import result
    const mockResult = {
      total: 150,
      success: 147,
      failed: 3,
    };

    setImportResult(mockResult);
    setIsUploading(false);

    // Notify parent
    setTimeout(() => {
      onImportComplete(mockResult.success);
    }, 2000);
  };

  const handleClose = () => {
    setFile(null);
    setIsUploading(false);
    setUploadProgress(0);
    setImportResult(null);
    setHasConsent(false);
    onClose();
  };

  const downloadTemplate = () => {
    // In real app, this would trigger CSV template download
    alert('CSV template would be downloaded with columns: Name, Email, Tags');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <DialogDescription>
            Upload a CSV or Excel file to import your contacts in bulk
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-blue-900">Need a template?</h4>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="text-blue-600 hover:text-blue-800 transition-colors">
                        <HelpCircle className="size-4" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom" className="max-w-sm">
                      <div className="space-y-2">
                        <p className="font-semibold">How to import contacts:</p>
                        <ol className="list-decimal list-inside space-y-1 text-xs">
                          <li>Download the CSV template</li>
                          <li>Fill in your contact details (Name, Email, Phone, etc.)</li>
                          <li>Save the file as CSV or XLSX</li>
                          <li>Upload the file here</li>
                          <li>Review and confirm the import</li>
                        </ol>
                        <p className="text-xs mt-2">💡 Tip: Ensure email addresses are valid and unique</p>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-sm text-blue-700 mt-1">
                  Download our CSV template with the correct format
                </p>
              </div>
              <Button variant="outline" size="sm" onClick={downloadTemplate}>
                <Download className="size-4 mr-2" />
                Download
              </Button>
            </div>
          </div>

          {/* File Upload Area */}
          {!importResult && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                onChange={handleFileSelect}
                className="hidden"
              />

              {!file ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                >
                  <Upload className="size-12 text-gray-400 mx-auto mb-4" />
                  <p className="font-medium text-gray-900 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-500">CSV or XLSX files (max 10MB)</p>
                </div>
              ) : (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 p-3 rounded-lg">
                      <FileText className="size-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate">{file.name}</p>
                      <p className="text-sm text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB
                      </p>

                      {isUploading && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              {uploadProgress < 100 ? 'Uploading...' : 'Processing...'}
                            </span>
                            <span className="text-sm font-medium text-blue-600">
                              {uploadProgress}%
                            </span>
                          </div>
                          <Progress value={uploadProgress} className="h-2" />
                        </div>
                      )}
                    </div>
                    {!isUploading && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setFile(null)}
                        className="text-gray-500"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Consent Checkbox - Always visible below upload area */}
          {!importResult && (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox 
                  id="consent" 
                  checked={hasConsent}
                  onCheckedChange={(checked) => setHasConsent(checked as boolean)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <label 
                    htmlFor="consent" 
                    className="text-sm font-medium text-gray-900 cursor-pointer"
                  >
                    I confirm that I have obtained proper consent to contact these individuals
                  </label>
                  <p className="text-xs text-gray-600 mt-1">
                    By checking this box, you confirm compliance with GDPR, CAN-SPAM, and other applicable data protection regulations. You must have explicit permission to email or contact these individuals.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Import Result */}
          {importResult && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                <CheckCircle className="size-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Import Complete!</h3>
                <p className="text-gray-600 mb-4">
                  Successfully imported {importResult.success} contacts
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                  <div className="bg-white rounded-lg p-3 border border-gray-200">
                    <div className="text-2xl font-bold text-gray-900">{importResult.total}</div>
                    <div className="text-xs text-gray-600">Total</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-200">
                    <div className="text-2xl font-bold text-green-600">
                      {importResult.success}
                    </div>
                    <div className="text-xs text-gray-600">Imported</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-red-200">
                    <div className="text-2xl font-bold text-red-600">{importResult.failed}</div>
                    <div className="text-xs text-gray-600">Failed</div>
                  </div>
                </div>
              </div>

              {importResult.failed > 0 && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="size-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-orange-900">
                        {importResult.failed} contacts couldn't be imported
                      </p>
                      <p className="text-sm text-orange-700 mt-1">
                        Common issues: Invalid email format, duplicate entries
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              {importResult ? 'Done' : 'Cancel'}
            </Button>
            {!importResult && (
              <Button
                onClick={handleUpload}
                disabled={!file || isUploading || !hasConsent}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                {isUploading ? (
                  <>
                    <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Upload className="size-4 mr-2" />
                    Import Contacts
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}