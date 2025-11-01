'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, QrCode, Printer, Share2, Star } from 'lucide-react';
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
              @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Inter:wght@400;600;700&display=swap');
              
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #FFF5E6 0%, #FFFFFF 100%);
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
                max-width: 480px;
                width: 100%;
                box-shadow: 0 20px 60px rgba(255, 193, 7, 0.2);
                border: 3px solid #FFC107;
                position: relative;
                overflow: hidden;
              }
              
              .card::before {
                content: '';
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 193, 7, 0.05) 0%, transparent 70%);
                pointer-events: none;
              }
              
              .header {
                text-align: center;
                margin-bottom: 28px;
                position: relative;
                z-index: 1;
              }
              
              .stars-container {
                display: flex;
                justify-content: center;
                gap: 8px;
                margin-bottom: 16px;
                font-size: 32px;
              }
              
              .star {
                color: #FFC107;
                filter: drop-shadow(0 2px 4px rgba(255, 193, 7, 0.3));
                animation: twinkle 2s infinite;
              }
              
              .star:nth-child(1) { animation-delay: 0s; }
              .star:nth-child(2) { animation-delay: 0.2s; }
              .star:nth-child(3) { animation-delay: 0.4s; }
              .star:nth-child(4) { animation-delay: 0.6s; }
              .star:nth-child(5) { animation-delay: 0.8s; }
              
              @keyframes twinkle {
                0%, 100% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.2); opacity: 0.8; }
              }
              
              .restaurant-name {
                font-family: 'Playfair Display', serif;
                font-size: 38px;
                font-weight: 700;
                color: #ECC216;
                margin-bottom: 8px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                letter-spacing: 1px;
              }
              
              .main-heading {
                font-size: 22px;
                font-weight: 700;
                color: #333;
                margin-bottom: 8px;
                line-height: 1.3;
              }
              
              .sub-heading {
                font-size: 14px;
                color: #666;
                font-weight: 500;
              }
              
              .divider {
                width: 100px;
                height: 3px;
                background: linear-gradient(90deg, transparent, #FFC107, transparent);
                margin: 20px auto;
              }
              
              .qr-container {
                background: white;
                padding: 20px;
                border-radius: 16px;
                display: inline-block;
                box-shadow: 0 8px 24px rgba(0,0,0,0.12);
                margin: 0 auto 28px;
                display: block;
                width: fit-content;
                border: 2px solid #FFF9E6;
              }
              
              .qr-container img {
                display: block;
                width: 260px;
                height: 260px;
                border-radius: 8px;
              }
              
              .instructions {
                text-align: center;
                position: relative;
                z-index: 1;
                background: linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%);
                padding: 20px;
                border-radius: 16px;
                border: 2px dashed #FFC107;
              }
              
              .main-text {
                font-size: 18px;
                font-weight: 600;
                color: #333;
                margin-bottom: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
              }
              
              .emoji {
                font-size: 22px;
              }
              
              .sub-text {
                font-size: 13px;
                color: #666;
                line-height: 1.6;
              }
              
              .benefits {
                margin-top: 24px;
                padding-top: 24px;
                border-top: 2px solid #FFE6A3;
              }
              
              .benefit-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                background: white;
                border-radius: 12px;
                margin-bottom: 10px;
                box-shadow: 0 2px 8px rgba(255, 193, 7, 0.1);
              }
              
              .benefit-icon {
                font-size: 24px;
                flex-shrink: 0;
              }
              
              .benefit-text {
                font-size: 12px;
                color: #555;
                font-weight: 500;
                text-align: left;
              }
              
              .footer {
                margin-top: 24px;
                text-align: center;
                padding-top: 20px;
                border-top: 2px dashed #E0E0E0;
              }
              
              .footer-text {
                font-size: 11px;
                color: #999;
                line-height: 1.6;
              }
              
              .thank-you {
                font-size: 16px;
                font-weight: 700;
                color: #FFC107;
                margin-bottom: 8px;
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
                <div class="stars-container">
                  <span class="star">⭐</span>
                  <span class="star">⭐</span>
                  <span class="star">⭐</span>
                  <span class="star">⭐</span>
                  <span class="star">⭐</span>
                </div>
                <h1 class="restaurant-name">Rana's Twist</h1>
                <h2 class="main-heading">Gostou da experiência?</h2>
                <p class="sub-heading">Deixe sua avaliação no Google</p>
                <div class="divider"></div>
              </div>
              
              <div class="qr-container">
                <img src="${qrCodeUrl}" alt="QR Code Avaliação Google" />
              </div>
              
              <div class="instructions">
                <p class="main-text">
                  <span class="emoji">📱</span>
                  <span>Escaneie e Avalie</span>
                </p>
                <p class="sub-text">
                  Use a câmera do seu smartphone<br/>
                  Leva apenas 30 segundos!
                </p>
              </div>
              
              <div class="benefits">
                <div class="benefit-item">
                  <span class="benefit-icon">💚</span>
                  <span class="benefit-text">Ajude outros clientes a descobrir nosso restaurante</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">🎯</span>
                  <span class="benefit-text">Sua opinião nos ajuda a melhorar continuamente</span>
                </div>
                <div class="benefit-item">
                  <span class="benefit-icon">⚡</span>
                  <span class="benefit-text">Processo rápido e seguro pelo Google</span>
                </div>
              </div>
              
              <div class="footer">
                <p class="thank-you">Obrigado pela sua preferência!</p>
                <p class="footer-text">
                  R. Dr. António Patrício Gouveia 23A, Oeiras<br/>
                  📞 +351 214 430 890
                </p>
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
                Design profissional para incentivar avaliações no Google
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
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                Preview do Design
              </CardTitle>
              <CardDescription>
                Design otimizado para maximizar avaliações dos clientes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg border-2 border-yellow-300">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
                    <p className="text-sm text-muted-foreground">Gerando QR Code...</p>
                  </div>
                ) : qrCodeUrl ? (
                  <div className="text-center bg-white p-8 rounded-2xl shadow-2xl border-4 border-yellow-400 max-w-md">
                    <div className="flex justify-center gap-2 mb-4">
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} className="w-7 h-7 text-yellow-400 fill-yellow-400" />
                      ))}
                    </div>
                    <h2 className="text-3xl font-bold text-yellow-600 mb-1 font-display">Rana's Twist</h2>
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">Gostou da experiência?</h3>
                    <p className="text-sm text-gray-600 mb-4">Deixe sua avaliação no Google</p>
                    <div className="w-20 h-1 bg-gradient-to-r from-transparent via-yellow-500 to-transparent mx-auto mb-6"></div>
                    
                    <div className="bg-white p-4 rounded-lg shadow-md border-2 border-gray-100 mb-6">
                      <Image
                        src={qrCodeUrl}
                        alt="QR Code Avaliação"
                        width={220}
                        height={220}
                        className="mx-auto rounded"
                      />
                    </div>
                    
                    <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-xl p-4 mb-4">
                      <p className="text-base font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
                        <span className="text-xl">📱</span>
                        <span>Escaneie e Avalie</span>
                      </p>
                      <p className="text-xs text-gray-600">
                        Use a câmera do seu smartphone<br/>
                        Leva apenas 30 segundos!
                      </p>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg text-left">
                        <span className="text-lg">💚</span>
                        <span className="text-xs text-gray-700">Ajude outros clientes</span>
                      </div>
                      <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg text-left">
                        <span className="text-lg">🎯</span>
                        <span className="text-xs text-gray-700">Nos ajude a melhorar</span>
                      </div>
                    </div>
                    
                    <p className="text-sm font-bold text-yellow-600 mb-2">Obrigado pela sua preferência!</p>
                    <p className="text-xs text-gray-500">📞 +351 214 430 890</p>
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
          <Card>
            <CardHeader>
              <CardTitle>Download e Impressão</CardTitle>
              <CardDescription>Baixe o QR Code ou imprima o design completo</CardDescription>
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
                  className="w-full bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
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
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                  1
                </span>
                <p>
                  <strong>Posicionamento Estratégico:</strong> Coloque próximo ao caixa, na saída ou nas mesas para máxima visibilidade
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                  2
                </span>
                <p>
                  <strong>Momento Ideal:</strong> Incentive avaliações quando o cliente está satisfeito, logo após uma boa refeição
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <p>
                  <strong>Plastificação:</strong> Proteja o material com plastificação para maior durabilidade
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-yellow-500 text-white flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <p>
                  <strong>Staff Training:</strong> Treine a equipa para mencionar casualmente: "Se gostou, temos um QR code ali para avaliação!"
                </p>
              </div>
              <div className="p-4 bg-gradient-to-r from-yellow-50 to-amber-50 border-2 border-yellow-300 rounded-lg mt-4">
                <p className="text-yellow-900 font-semibold mb-2 flex items-center gap-2">
                  <Star className="w-5 h-5 fill-yellow-600 text-yellow-600" />
                  Estatísticas de Sucesso
                </p>
                <p className="text-yellow-800 text-sm mb-2">
                  Restaurantes que implementam QR codes de avaliação veem um aumento de até <strong>300%</strong> em reviews!
                </p>
                <p className="text-yellow-700 text-xs">
                  💡 <strong>Dica:</strong> Clientes satisfeitos são mais propensos a avaliar quando o processo é fácil. Este design maximiza conversões!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}