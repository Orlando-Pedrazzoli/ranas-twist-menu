'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Download,
  QrCode as QrIcon,
  Plus,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';

interface Table {
  number: string;
  qrCode: string;
}

export default function AdminPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [baseUrl, setBaseUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get the base URL
    const url = typeof window !== 'undefined' ? window.location.origin : '';
    setBaseUrl(url);

    // Initialize with default tables
    const initialTables = [
      { number: '1', qrCode: '' },
      { number: '2', qrCode: '' },
      { number: '3', qrCode: '' },
      { number: '4', qrCode: '' },
      { number: '5', qrCode: '' },
    ];

    setTables(initialTables);

    // Generate QR codes for all tables
    initialTables.forEach((table, index) => {
      generateQRCode(table.number, index);
    });

    setLoading(false);
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
        if (newTables[index]) {
          newTables[index] = { ...newTables[index], qrCode: qrCodeDataUrl };
        }
        return newTables;
      });
    } catch (err) {
      console.error('Error generating QR code:', err);
    }
  };

  const addTable = () => {
    const newTableNumber = (tables.length + 1).toString();
    const newTable = { number: newTableNumber, qrCode: '' };
    setTables([...tables, newTable]);
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

  if (loading) {
    return (
      <div className='min-h-screen bg-background p-6 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
          <p className='mt-4 text-muted-foreground'>Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-background p-4 sm:p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8 flex items-center justify-between'>
          <div>
            <h1 className='text-2xl sm:text-3xl font-bold'>
              Painel Administrativo
            </h1>
            <p className='text-muted-foreground mt-2'>
              Gestão de QR Codes e Menu
            </p>
          </div>
          <Link href='/pt'>
            <Button variant='outline' size='sm'>
              <ArrowLeft className='w-4 h-4 mr-2' />
              Voltar ao Menu
            </Button>
          </Link>
        </div>

        {/* QR Code Management */}
        <Card className='mb-8'>
          <CardHeader>
            <CardTitle>Gestão de QR Codes</CardTitle>
            <CardDescription>
              Gere e faça download dos QR codes para cada mesa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='mb-4 flex flex-wrap gap-2'>
              <Button onClick={addTable}>
                <Plus className='w-4 h-4 mr-2' />
                Adicionar Mesa
              </Button>
              <Button
                onClick={downloadAllQRCodes}
                variant='outline'
                disabled={tables.length === 0}
              >
                <Download className='w-4 h-4 mr-2' />
                Download Todos
              </Button>
            </div>

            {tables.length === 0 ? (
              <div className='text-center py-12 bg-muted/20 rounded-lg'>
                <QrIcon className='w-12 h-12 mx-auto text-muted-foreground mb-4' />
                <p className='text-muted-foreground'>
                  Nenhuma mesa criada ainda
                </p>
                <p className='text-sm text-muted-foreground mt-1'>
                  Clique em "Adicionar Mesa" para começar
                </p>
              </div>
            ) : (
              <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
                {tables.map((table, index) => (
                  <Card key={index} className='overflow-hidden'>
                    <CardHeader className='pb-4'>
                      <div className='flex justify-between items-center'>
                        <CardTitle className='text-lg'>
                          Mesa {table.number}
                        </CardTitle>
                        <Button
                          size='icon'
                          variant='ghost'
                          onClick={() => removeTable(index)}
                          className='h-8 w-8'
                        >
                          <Trash2 className='w-4 h-4' />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {table.qrCode ? (
                        <>
                          <div className='bg-white p-2 rounded'>
                            <img
                              src={table.qrCode}
                              alt={`QR Code Mesa ${table.number}`}
                              className='w-full'
                            />
                          </div>
                          <div className='mt-4 space-y-2'>
                            <p className='text-xs text-muted-foreground text-center break-all'>
                              {baseUrl}/pt?mesa={table.number}
                            </p>
                            <Button
                              className='w-full'
                              size='sm'
                              variant='outline'
                              onClick={() =>
                                downloadQRCode(table.qrCode, table.number)
                              }
                            >
                              <Download className='w-4 h-4 mr-2' />
                              Download
                            </Button>
                          </div>
                        </>
                      ) : (
                        <div className='h-48 bg-muted/20 rounded flex items-center justify-center'>
                          <div className='text-center'>
                            <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto'></div>
                            <p className='text-sm text-muted-foreground mt-2'>
                              Gerando...
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
          <CardHeader>
            <CardTitle>Links Rápidos</CardTitle>
            <CardDescription>Acesso rápido às funcionalidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
              <Link href='/pt' target='_blank'>
                <Button variant='outline' className='h-20 w-full'>
                  <div className='text-center'>
                    <QrIcon className='w-6 h-6 mx-auto mb-2' />
                    Ver Menu
                  </div>
                </Button>
              </Link>
              <Button variant='outline' className='h-20' disabled>
                <div className='text-center'>
                  <Plus className='w-6 h-6 mx-auto mb-2' />
                  Adicionar Prato
                  <p className='text-xs text-muted-foreground mt-1'>Em breve</p>
                </div>
              </Button>
              <Button variant='outline' className='h-20' disabled>
                <div className='text-center'>
                  <Download className='w-6 h-6 mx-auto mb-2' />
                  Exportar Dados
                  <p className='text-xs text-muted-foreground mt-1'>Em breve</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
