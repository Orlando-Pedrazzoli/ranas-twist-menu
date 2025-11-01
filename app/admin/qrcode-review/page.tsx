'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, QrCode, Printer, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function QRCodeReviewPage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(300);

  const reviewUrl = 'https://search.google.com/local/writereview?placeid=ChIJ5Rw_CzrPHg0RCZ6J0tsZ5Tg';

  useEffect(() => {
    generateQRCode();
  }, [selectedSize]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      const QRCode = (await import('qrcode')).default;
      const dataUrl = await QRCode.toDataURL(reviewUrl, {
        width: selectedSize,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeUrl(dataUrl);
    } catch (error) {
      console.error('Erro ao gerar QR Code:', error);
      alert('Erro ao gerar QR Code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async (format: 'png' | 'svg') => {
    try {
      const response = await fetch(`/api/qrcode?format=${format}&size=${selectedSize}&url=${encodeURIComponent(reviewUrl)}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ranas-twist-review-qrcode.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar QR Code:', error);
      alert('Erro ao fazer download do QR Code');
    }
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Rana's Twist - Avaliação Google</title>
            <style>
              body {
                margin: 0;
                padding: 40px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
              }
              .container {
                text-align: center;
                border: 2px solid #ECC216;
                padding: 30px;
                border-radius: 15px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              h1 {
                color: #ECC216;
                margin-bottom: 10px;
                font-size: 32px;
              }
              .tagline {
                color: #666;
                margin-bottom: 20px;
                font-size: 16px;
              }
              img {
                max-width: 400px;
                height: auto;
                margin: 20px 0;
              }
              .instructions {
                color: #333;
                font-size: 18px;
                margin-top: 20px;
                font-weight: bold;
              }
              .scan-text {
                color: #666;
                font-size: 14px;
                margin-top: 10px;
              }
              @media print {
                body {
                  padding: 20px;
                }
              }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>Rana's Twist</h1>
              <p class="tagline">Avalie sua experiência no Google</p>
              <img src="${qrCodeUrl}" alt="QR Code Avaliação" />
              <p class="instructions">⭐ Escaneie para deixar sua avaliação</p>
              <p class="scan-text">Ajude-nos a crescer com sua opinião!</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
      }, 250);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(reviewUrl);
    alert('URL copiada para área de transferência!');
  };

  const sizes = [
    { label: 'Pequeno (200px)', value: 200 },
    { label: 'Médio (300px)', value: 300 },
    { label: 'Grande (500px)', value: 500 },
    { label: 'Extra Grande (800px)', value: 800 },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">QR Code de Avaliação</h1>
              <p className="text-sm text-muted-foreground">
                Gere e imprima o QR Code para incentivar avaliações no Google
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Preview do QR Code
              </CardTitle>
              <CardDescription>
                Este QR Code leva diretamente ao formulário de avaliação no Google
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                    <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="text-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code Avaliação"
                        width={selectedSize}
                        height={selectedSize}
                        className="mx-auto"
                      />
                    </div>
                    <p className="mt-4 text-sm font-medium">Rana's Twist - Avaliação Google</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Escaneie para deixar sua opinião
                    </p>
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>

          {/* Tamanho */}
          <Card>
            <CardHeader>
              <CardTitle>Tamanho do QR Code</CardTitle>
              <CardDescription>Escolha o tamanho ideal para impressão</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {sizes.map((size) => (
                  <Button
                    key={size.value}
                    variant={selectedSize === size.value ? 'default' : 'outline'}
                    onClick={() => setSelectedSize(size.value)}
                    className="w-full"
                  >
                    {size.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* URL */}
          <Card>
            <CardHeader>
              <CardTitle>URL de Avaliação</CardTitle>
              <CardDescription>Este é o link que o QR Code irá abrir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {reviewUrl}
                </div>
                <Button variant="outline" size="icon" onClick={copyUrl}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card> <CardHeader>
                <CardTitle>Download e Impressão</CardTitle>
                <CardDescription>Baixe o QR Code ou imprima diretamente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <Button
                    onClick={() => downloadQRCode('png')}
                    className="w-full"
                    variant="default"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PNG
                  </Button>
                  <Button
                    onClick={() => downloadQRCode('svg')}
                    className="w-full"
                    variant="outline"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download SVG
                  </Button>
                  <Button
                    onClick={printQRCode}
                    className="w-full"
                    variant="secondary"
                  >
                    <Printer className="w-4 h-4 mr-2" />
                    Imprimir
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Instruções */}
            <Card>
              <CardHeader>
                <CardTitle>📋 Instruções de Uso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <p>
                    <strong>Download:</strong> Clique em "Download PNG" ou "Download SVG" para salvar o QR Code
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <p>
                    <strong>Impressão:</strong> Use o botão "Imprimir" para uma versão formatada com o logo do restaurante
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <p>
                    <strong>Colocação:</strong> Imprima várias cópias e posicione próximo ao caixa ou nas mesas
                  </p>
                </div>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                  <p className="text-amber-800">
                    💡 <strong>Dica:</strong> Clientes satisfeitos são mais propensos a avaliar se for fácil e rápido. Um QR Code visível ajuda muito!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
}