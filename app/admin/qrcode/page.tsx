'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, QrCode, Printer, Share2 } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function QRCodePage() {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [selectedSize, setSelectedSize] = useState(300);

  const menuUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/pt`
    : 'http://localhost:3000/pt';

  useEffect(() => {
    generateQRCode();
  }, [selectedSize]);

  const generateQRCode = async () => {
    setLoading(true);
    try {
      // Gerar QR code como data URL para preview
      const QRCode = (await import('qrcode')).default;
      const dataUrl = await QRCode.toDataURL(menuUrl, {
        width: selectedSize,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(dataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('Erro ao gerar QR code');
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = async (format: 'png' | 'svg') => {
    try {
      const response = await fetch(`/api/qrcode?format=${format}&size=${selectedSize}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ranas-twist-qrcode.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading QR code:', error);
      alert('Erro ao fazer download do QR code');
    }
  };

  const printQRCode = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Rana's Twist - QR Code Menu</title>
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
              <p class="tagline">Culinária Indiana de Autor</p>
              <img src="${qrCodeUrl}" alt="QR Code Menu" />
              <p class="instructions">📱 Escaneie para ver o Menu</p>
              <p class="scan-text">Use a câmera do seu smartphone</p>
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
    navigator.clipboard.writeText(menuUrl);
    alert('URL copiado para área de transferência!');
  };

  const sizes = [
    { label: 'Pequeno (200px)', value: 200 },
    { label: 'Médio (300px)', value: 300 },
    { label: 'Grande (500px)', value: 500 },
    { label: 'Extra Grande (800px)', value: 800 },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
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
              <h1 className="text-2xl font-bold">QR Code do Menu</h1>
              <p className="text-sm text-muted-foreground">
                Gere e imprima o QR Code para as mesas
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid gap-6">
          {/* Preview Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="w-5 h-5" />
                Preview do QR Code
              </CardTitle>
              <CardDescription>
                Este QR Code leva diretamente ao menu do restaurante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="text-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code Menu"
                        width={selectedSize}
                        height={selectedSize}
                        className="mx-auto"
                      />
                    </div>
                    <p className="mt-4 text-sm font-medium">Rana's Twist - Menu Digital</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Escaneie para acessar o menu
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
              <CardDescription>
                Escolha o tamanho ideal para impressão
              </CardDescription>
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

          {/* URL do Menu */}
          <Card>
            <CardHeader>
              <CardTitle>URL do Menu</CardTitle>
              <CardDescription>
                Este é o link que o QR Code irá abrir
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <div className="flex-1 p-3 bg-muted rounded-md font-mono text-sm break-all">
                  {menuUrl}
                </div>
                <Button variant="outline" size="icon" onClick={copyUrl}>
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <Card>
            <CardHeader>
              <CardTitle>Download e Impressão</CardTitle>
              <CardDescription>
                Baixe o QR Code ou imprima diretamente
              </CardDescription>
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
                  <strong>Colocação:</strong> Imprima várias cópias, plastifique e cole uma em cada mesa do restaurante
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <p>
                  <strong>Tamanho Recomendado:</strong> Para mesas, use "Grande (500px)" ou "Extra Grande (800px)"
                </p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                <p className="text-amber-800">
                  💡 <strong>Dica:</strong> O mesmo QR Code pode ser usado em todas as mesas! 
                  Imprima uma vez e faça várias cópias.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}