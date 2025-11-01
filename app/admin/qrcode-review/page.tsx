'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download, QrCode, Printer, Share2, CreditCard } from 'lucide-react';
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

  const printTableCard = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Rana's Twist - Cartão Avaliação Mesa</title>
            <style>
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
              
              @page {
                size: A5 landscape;
                margin: 0;
              }
              
              body {
                margin: 0;
                padding: 0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                font-family: 'Georgia', serif;
                background: linear-gradient(135deg, #fffbf0 0%, #fff8e1 100%);
              }
              
              .card {
                width: 210mm;
                height: 148mm;
                background: white;
                position: relative;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                box-shadow: 0 10px 30px rgba(0,0,0,0.1);
              }
              
              /* Fundo com estrelas */
              .stars-bg {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                opacity: 0.05;
                background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 5l12.5 25.3L90 35 70 54.5l4.7 27.5L50 68.8 25.3 82l4.7-27.5L10 35l27.5-4.7z' fill='%23FFD700'/%3E%3C/svg%3E");
                background-size: 50px 50px;
              }
              
              /* Decoração superior dourada */
              .top-decoration {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 30mm;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
                clip-path: polygon(0 0, 100% 0, 100% 60%, 50% 100%, 0 60%);
              }
              
              /* Estrelas decorativas no topo */
              .stars-row {
                position: absolute;
                top: 10mm;
                left: 50%;
                transform: translateX(-50%);
                font-size: 24pt;
                color: white;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                letter-spacing: 10px;
              }
              
              /* Container principal */
              .content {
                position: relative;
                z-index: 10;
                text-align: center;
                padding: 25mm 15mm 20mm;
              }
              
              /* Logo/Nome do restaurante */
              .restaurant-name {
                font-size: 38pt;
                color: #ECC216;
                font-weight: bold;
                letter-spacing: 3px;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
                margin-bottom: 3mm;
                font-family: 'Playfair Display', 'Georgia', serif;
              }
              
              .tagline {
                font-size: 14pt;
                color: #B87333;
                font-style: italic;
                margin-bottom: 8mm;
                letter-spacing: 1px;
              }
              
              /* Container do QR Code com moldura dourada */
              .qr-container {
                background: white;
                padding: 10mm;
                border-radius: 15px;
                box-shadow: 0 8px 25px rgba(0,0,0,0.2);
                display: inline-block;
                border: 3px solid transparent;
                background-image: linear-gradient(white, white), 
                                  linear-gradient(45deg, #FFD700, #FFA500, #FFD700);
                background-origin: border-box;
                background-clip: content-box, border-box;
                position: relative;
              }
              
              /* Estrelas ao redor do QR */
              .star-decoration {
                position: absolute;
                color: #FFD700;
                font-size: 16pt;
              }
              
              .star-top-left {
                top: -20px;
                left: -20px;
              }
              
              .star-top-right {
                top: -20px;
                right: -20px;
              }
              
              .star-bottom-left {
                bottom: -20px;
                left: -20px;
              }
              
              .star-bottom-right {
                bottom: -20px;
                right: -20px;
              }
              
              .qr-code {
                width: 45mm;
                height: 45mm;
              }
              
              /* Instruções com estilo de avaliação */
              .instructions {
                margin-top: 10mm;
                padding: 6mm 12mm;
                background: linear-gradient(90deg, transparent, #FFD700, transparent);
                background-size: 100% 2px;
                background-position: center bottom;
                background-repeat: no-repeat;
                padding-bottom: 8mm;
              }
              
              .rating-stars {
                font-size: 28pt;
                color: #FFD700;
                margin-bottom: 3mm;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
              }
              
              .scan-text {
                font-size: 16pt;
                color: #333;
                font-weight: bold;
                margin-bottom: 2mm;
              }
              
              .scan-subtitle {
                font-size: 11pt;
                color: #666;
                font-style: italic;
              }
              
              .thank-you {
                font-size: 10pt;
                color: #B87333;
                margin-top: 3mm;
                font-weight: bold;
              }
              
              /* Decoração inferior */
              .bottom-decoration {
                position: absolute;
                bottom: 0;
                left: 0;
                right: 0;
                height: 20mm;
                background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
                clip-path: polygon(0 40%, 50% 0, 100% 40%, 100% 100%, 0 100%);
              }
              
              /* Informações do restaurante */
              .restaurant-info {
                position: absolute;
                bottom: 5mm;
                left: 50%;
                transform: translateX(-50%);
                color: white;
                font-size: 9pt;
                z-index: 11;
                text-shadow: 1px 1px 2px rgba(0,0,0,0.4);
                font-weight: bold;
              }
              
              /* Elementos decorativos de feedback */
              .feedback-icons {
                position: absolute;
                bottom: 25mm;
                left: 50%;
                transform: translateX(-50%);
                font-size: 14pt;
                opacity: 0.3;
              }
              
              @media print {
                body {
                  background: white;
                }
                .card {
                  box-shadow: none;
                }
              }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="stars-bg"></div>
              <div class="top-decoration"></div>
              <div class="stars-row">⭐⭐⭐⭐⭐</div>
              
              <div class="content">
                <h1 class="restaurant-name">Rana's Twist</h1>
                <p class="tagline">✨ Sua Opinião é Importante ✨</p>
                
                <div class="qr-container">
                  <span class="star-decoration star-top-left">⭐</span>
                  <span class="star-decoration star-top-right">⭐</span>
                  <span class="star-decoration star-bottom-left">⭐</span>
                  <span class="star-decoration star-bottom-right">⭐</span>
                  <img src="${qrCodeUrl}" alt="QR Code Avaliação" class="qr-code" />
                </div>
                
                <div class="instructions">
                  <div class="rating-stars">⭐⭐⭐⭐⭐</div>
                  <p class="scan-text">AVALIE NO GOOGLE</p>
                  <p class="scan-subtitle">Escaneie e compartilhe sua experiência</p>
                  <p class="thank-you">AGRADECEMOS SUA AVALIAÇÃO!</p>
                </div>
                
                <div class="feedback-icons">💬 📝 👍</div>
              </div>
              
              <div class="bottom-decoration"></div>
              <div class="restaurant-info">
                Oeiras • Portugal • Obrigado pela visita!
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
          <Card>
            <CardHeader>
              <CardTitle>Download e Impressão</CardTitle>
              <CardDescription>
                Baixe o QR Code, imprima diretamente ou crie um cartão personalizado
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                  Imprimir Simples
                </Button>
                <Button
                  onClick={printTableCard}
                  className="w-full"
                  variant="default"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Imprimir Cartão Mesa
                </Button>
              </div>
              
              {/* Nova seção com descrição do cartão */}
              <div className="mt-4 p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                <p className="text-sm font-medium mb-1">⭐ Novo: Cartão de Avaliação para Mesa</p>
                <p className="text-xs text-muted-foreground">
                  Imprima um cartão dourado elegante em formato A5 com estrelas decorativas, perfeito para incentivar avaliações. 
                  Design especial com tema de avaliação 5 estrelas para colocar próximo ao caixa ou nas mesas.
                </p>
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
                  <strong>Impressão Simples:</strong> Use "Imprimir Simples" para uma versão básica com o logo
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  3
                </span>
                <p>
                  <strong>Cartão para Mesa:</strong> Use "Imprimir Cartão Mesa" para criar um cartão dourado com tema de avaliação
                </p>
              </div>
              <div className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                  4
                </span>
                <p>
                  <strong>Colocação:</strong> Posicione próximo ao caixa, nas mesas ou na saída do restaurante
                </p>
              </div>
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mt-4">
                <p className="text-amber-800">
                  💡 <strong>Dica:</strong> O cartão de avaliação tem design dourado com estrelas, criando um visual premium 
                  que incentiva clientes satisfeitos a deixarem suas avaliações. Imprima em papel de maior gramatura e plastifique 
                  para melhor durabilidade!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}