'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Download, QrCode as QrIcon, Plus, Trash2 } from 'lucide-react';

export default function AdminPage() {
  const [tables, setTables] = useState([
    { number: '1', qrCode: '' },
    { number: '2', qrCode: '' },
    { number: '3', qrCode: '' },
    { number: '4', qrCode: '' },
    { number: '5', qrCode: '' },
  ]);

  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Get the base URL
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    setBaseUrl(url);
    
    // Generate QR codes for all tables
    tables.forEach((table, index) => {
      generateQRCode(table.number, index);
    });
  }, []);

  const generateQRCode = async (tableNumber: string, index: number) => {
    try {
      const url = `${baseUrl}/pt?mesa=${tableNumber}`;
      const qrCodeDataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'M',
      });
      
      setTables(prev => {
        const newTables = [...prev];
        newTables[index] = { ...newTables[index], qrCode: qrCodeDataUrl };
        return newTables;
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const addTable = () => {
    const newTableNumber = (tables.length + 1).toString();
    setTables([...tables, { number: newTableNumber, qrCode: '' }]);
    setTimeout(() => {
      generateQRCode(newTableNumber, tables.length);
    }, 100);
  };

  const removeTable = (index: number) => {
    setTables(tables.filter((_, i) => i !== index));
  };

  const downloadQRCode = (qrCode: string, tableNumber: string) => {
    const link = document.createElement('a');
    link.download = `ranas-twist-mesa-${tableNumber}.png`;
    link.href = qrCode;
    link.click();
  };

  const downloadAllQRCodes = async () => {
    for (const table of tables) {
      if (table.qrCode) {
        downloadQRCode(table.qrCode, table.number);
        // Add delay between downloads to prevent browser blocking
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Painel Administrativo</h1>
          <p className="text-muted-foreground mt-2">Gestão de QR Codes e Menu</p>
        </div>

        {/* QR Code Management */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Gestão de QR Codes</CardTitle>
            <CardDescription>
              Gere e faça download dos QR codes para cada mesa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Button onClick={addTable}>
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Mesa
              </Button>
              <Button onClick={downloadAllQRCodes} variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download Todos
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {tables.map((table, index) => (
                <Card key={index}>
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">Mesa {table.number}</CardTitle>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeTable(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {table.qrCode && (
                      <>
                        <img 
                          src={table.qrCode} 
                          alt={`QR Code Mesa ${table.number}`}
                          className="w-full"
                        />
                        <div className="mt-4 space-y-2">
                          <p className="text-xs text-muted-foreground text-center">
                            {baseUrl}/pt?mesa={table.number}
                          </p>
                          <Button 
                            className="w-full"
                            size="sm"
                            variant="outline"
                            onClick={() => downloadQRCode(table.qrCode, table.number)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Links Rápidos</CardTitle>
            <CardDescription>Acesso rápido às funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20" asChild>
                <a href="/pt" target="_blank">
                  <div className="text-center">
                    <QrIcon className="w-6 h-6 mx-auto mb-2" />
                    Ver Menu
                  </div>
                </a>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <Plus className="w-6 h-6 mx-auto mb-2" />
                  Adicionar Prato
                </div>
              </Button>
              <Button variant="outline" className="h-20">
                <div className="text-center">
                  <Download className="w-6 h-6 mx-auto mb-2" />
                  Exportar Dados
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
