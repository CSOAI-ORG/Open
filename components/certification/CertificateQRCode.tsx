/**
 * Certificate QR Code Component
 * 
 * Generates and displays a QR code that links to the certificate
 * verification page for instant mobile verification.
 */

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, Download, Copy, Check, Smartphone, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CertificateQRCodeProps {
  certificateId: string;
  holderName?: string;
  courseName?: string;
  size?: 'sm' | 'md' | 'lg';
  showDownload?: boolean;
  showCopy?: boolean;
  className?: string;
}

export function CertificateQRCode({
  certificateId,
  holderName,
  courseName,
  size = 'md',
  showDownload = true,
  showCopy = true,
  className,
}: CertificateQRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [copied, setCopied] = useState(false);
  const [qrGenerated, setQrGenerated] = useState(false);

  // Determine verification URL
  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}` 
    : 'https://coai.manus.space';
  const verificationUrl = `${baseUrl}/verify/${certificateId}`;

  // Size configurations
  const sizeConfig = {
    sm: { qrSize: 128, padding: 16 },
    md: { qrSize: 200, padding: 20 },
    lg: { qrSize: 280, padding: 24 },
  };

  const { qrSize, padding } = sizeConfig[size];

  // Generate QR code using canvas
  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;

      try {
        // Dynamically import qrcode library (client-side only)
        const QRCode = (await import('qrcode')).default;
        
        await QRCode.toCanvas(canvasRef.current, verificationUrl, {
          width: qrSize,
          margin: 2,
          color: {
            dark: '#11885a', // CEASAI green
            light: '#ffffff',
          },
          errorCorrectionLevel: 'H', // High error correction for logo overlay
        });
        
        setQrGenerated(true);
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    };

    generateQR();
  }, [verificationUrl, qrSize]);

  // Download QR code as PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    
    const link = document.createElement('a');
    link.download = `certificate-qr-${certificateId}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  // Copy verification URL
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(verificationUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardHeader className="pb-3 bg-gradient-to-r from-emerald-50 to-blue-50 dark:from-emerald-950/30 dark:to-blue-950/30">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-emerald-100 dark:bg-emerald-900/50 rounded-lg">
            <QrCode className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <CardTitle className="text-lg">Verification QR Code</CardTitle>
            <CardDescription>Scan to instantly verify this certificate</CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-6">
        <div className="flex flex-col items-center">
          {/* QR Code Canvas */}
          <div 
            className="relative bg-white p-4 rounded-xl shadow-sm border-2 border-emerald-100"
            style={{ padding }}
          >
            <canvas 
              ref={canvasRef} 
              className="block"
              style={{ width: qrSize, height: qrSize }}
            />
            
            {/* Center logo overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-white p-1.5 rounded-lg shadow-sm">
                <Shield className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>

          {/* Certificate Info */}
          {(holderName || courseName) && (
            <div className="mt-4 text-center">
              {holderName && (
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {holderName}
                </p>
              )}
              {courseName && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {courseName}
                </p>
              )}
            </div>
          )}

          {/* Certificate ID Badge */}
          <Badge 
            variant="outline" 
            className="mt-3 font-mono text-xs bg-slate-50 dark:bg-slate-800"
          >
            {certificateId}
          </Badge>

          {/* Instructions */}
          <div className="flex items-center gap-2 mt-4 text-sm text-slate-500">
            <Smartphone className="h-4 w-4" />
            <span>Scan with your phone camera</span>
          </div>

          {/* Action Buttons */}
          {(showDownload || showCopy) && (
            <div className="flex gap-2 mt-4 w-full">
              {showDownload && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleDownload}
                  disabled={!qrGenerated}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
              )}
              {showCopy && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex-1"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2 text-emerald-600" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy URL
                    </>
                  )}
                </Button>
              )}
            </div>
          )}

          {/* Verification URL */}
          <p className="mt-3 text-xs text-slate-400 text-center break-all">
            {verificationUrl}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Inline QR Code - Smaller version for embedding in certificate views
 */
export function InlineCertificateQR({
  certificateId,
  size = 100,
  className,
}: {
  certificateId: string;
  size?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}` 
    : 'https://coai.manus.space';
  const verificationUrl = `${baseUrl}/verify/${certificateId}`;

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current) return;

      try {
        const QRCode = (await import('qrcode')).default;
        
        await QRCode.toCanvas(canvasRef.current, verificationUrl, {
          width: size,
          margin: 1,
          color: {
            dark: '#11885a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });
      } catch (error) {
        console.error('Failed to generate QR code:', error);
      }
    };

    generateQR();
  }, [verificationUrl, size]);

  return (
    <div className={cn('inline-block bg-white p-2 rounded-lg shadow-sm', className)}>
      <canvas 
        ref={canvasRef} 
        style={{ width: size, height: size }}
        title={`Scan to verify certificate ${certificateId}`}
      />
    </div>
  );
}

export default CertificateQRCode;
