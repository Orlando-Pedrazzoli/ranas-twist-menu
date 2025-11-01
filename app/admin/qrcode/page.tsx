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
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #FFF9E6 0%, #FFFFFF 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 20px;
              }
              
              .card {
                background: white;
                border-radius: 24px;
                padding: 48px 40px;
                max-width: 450px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(236, 194, 22, 0.15);
                border: 3px solid #ECC216;
                position: relative;
                overflow: hidden;
              }
              
              .card::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(236, 194, 22, 0.05) 0%, transparent 70%);
                pointer-events: none;
              }
              
              .header {
                text-align: center;
                margin-bottom: 32px;
                position: relative;
                z-index: 1;
              }
              
              .logo-section {
                margin-bottom: 16px;
              }
              
              .restaurant-name {
                font-family: 'Playfair Display', serif;
                font-size: 42px;
                font-weight: 700;
                color: #ECC216;
                margin-bottom: 8px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                letter-spacing: 1px;
              }
              
              .tagline {
                font-size: 16px;
                color: #666;
                font-weight: 500;
                letter-spacing: 2px;
                text-transform: uppercase;
              }
              
              .divider {
                width: 80px;
                height: 3px;
                background: linear-gradient(90deg, transparent, #ECC216, transparent);
                margin: 24px auto;
              }
              
              .qr-container {
                background: white;
                padding: 24px;
                border-radius: 16px;
                display: inline-block;
                box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                margin: 0 auto 32px;
                display: block;
                width: fit-content;
                border: 2px solid #F5F5F5;
              }
              
              .qr-container img {
                display: block;
                width: 280px;
                height: 280px;
                border-radius: 8px;
              }
              
              .instructions {
                text-align: center;
                position: relative;
                z-index: 1;
              }
              
              .main-text {
                font-size: 20px;
                font-weight: 600;
                color: #333;
                margin-bottom: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
              }
              
              .emoji {
                font-size: 24px;
                animation: bounce 2s infinite;
              }
              
              @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-10px); }
              }
              
              .sub-text {
                font-size: 14px;
                color: #888;
                line-height: 1.6;
              }
              
              .features {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 2px dashed #E0E0E0;
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 16px;
              }
              
              .feature {
                text-align: center;
                padding: 12px;
                background: #FAFAFA;
                border-radius: 12px;
              }
              
              .feature-icon {
                font-size: 24px;
                margin-bottom: 6px;
              }
              
              .feature-text {
                font-size: 12px;
                color: #666;
                font-weight: 500;
              }
              
              .footer {
                margin-top: 28px;
                text-align: center;
                font-size: 11px;
                color: #999;
              }
              
              @media print {
                body {
                  background: white;
                  padding: 0;
                }
                
                .card {
                  box-shadow: none;
                  max-width: 100%;
                  page-break-inside: avoid;
                }
                
                @page {
                  margin: 1cm;
                  size: A5 portrait;
                }
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <div class="logo-section">
                  <h1 class="restaurant-name">Rana's Twist</h1>
                  <p class="tagline">Culinária Indiana Autêntica</p>
                </div>
                <div class="divider"></div>
              </div>
              
              <div class="qr-container">
                <img src="${qrCodeUrl}" alt="QR Code Menu Digital" />
              </div>
              
              <div class="instructions">
                <p class="main-text">
                  <span class="emoji">📱</span>
                  <span>Escaneie para ver o Menu</span>
                </p>
                <p class="sub-text">
                  Abra a câmera do seu smartphone<br/>
                  e aponte para o QR Code
                </p>
              </div>
              
              <div class="features">
                <div class="feature">
                  <div class="feature-icon">🌍</div>
                  <div class="feature-text">Português<br/>& English</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🌱</div>
                  <div class="feature-text">Opções<br/>Vegetarianas</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">🌶️</div>
                  <div class="feature-text">Níveis de<br/>Picância</div>
                </div>
                <div class="feature">
                  <div class="feature-icon">✨</div>
                  <div class="feature-text">Sem Contacto<br/>Digital</div>
                </div>
              </div>
              
              <div class="footer">
                R. Dr. António Patrício Gouveia 23A, Oeiras<br/>
                📞 +351 214 430 890
              </div>
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
                Design profissional pronto para impressão
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
                Preview do Design
              </CardTitle>
              <CardDescription>
                Design estilizado pronto para impressão em mesas e menus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-200">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                    <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="text-center bg-white p-8 rounded-2xl shadow-xl border-4 border-yellow-400 max-w-md">
                    <h2 className="text-3xl font-bold text-yellow-600 mb-2 font-display">Rana's Twist</h2>
                    <p className="text-sm text-gray-600 mb-4 uppercase tracking-wide">Culinária Indiana Autêntica</p>
                    <div className="w-16 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-6"></div>
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-100 mb-6">
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code Menu"
                        width={240}
                        height={240}
                        className="mx-auto rounded"
                      />
                    </div>
                    <p className="text-lg font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                      <span className="text-2xl">📱</span>
                      <span>Escaneie para ver o Menu</span>
                    </p>
                    <p className="text-xs text-gray-600 mb-4">
                      Abra a câmera do seu smartphone<br/>e aponte para o QR Code
                    </p>
                    <div className="grid grid-cols-2 gap-3 pt-4 border-t-2 border-dashed border-gray-200">
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xl mb-1">🌍</div>
                        <div className="text-xs text-gray-600">Português<br/>& English</div>
                      </div>
                      <div className="bg-gray-50 p-2 rounded-lg">
                        <div className="text-xl mb-1">🌱</div>
                        <div className="text-xs text-gray-600">Opções<br/>Vegetarianas</div>
                      </div>
                    </div>
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
                Baixe o QR Code ou imprima o design completo
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
                  className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Design
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
                  <strong>Imprimir Design Completo:</strong> Clique em "Imprimir Design" para uma versão estilizada e profissional pronta para as mesas
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <p>
                  <strong>Download Simples:</strong> Use "Download PNG/SVG" para apenas o QR Code, caso queira criar o seu próprio design
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <p>
                  <strong>Plastificar:</strong> Recomendamos plastificar o design impresso para maior durabilidade nas mesas
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <p>
                  <strong>Tamanho Recomendado:</strong> Para mesas, use "Grande (500px)" ou "Extra Grande (800px)" para melhor escaneamento
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-lg mt-4">
                <p className="text-amber-900 font-semibold mb-2">
                  💡 Dica Profissional
                </p>
                <p className="text-amber-800 text-sm">
                  O design inclui features do menu (multi-idioma, opções vegetarianas, níveis de picância) para incentivar os clientes a escanear. O mesmo QR Code pode ser usado em todas as mesas!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}