'use client';

import { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, RefreshCw, QrCode, Table2 } from 'lucide-react';
import Link from 'next/link';

export default function QRCodePage() {
  const [baseUrl, setBaseUrl] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Set default URL on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);

  const fullUrl = tableNumber
    ? `${baseUrl}?table=${encodeURIComponent(tableNumber)}`
    : baseUrl;

  // Generate QR Code whenever URL changes
  useEffect(() => {
    if (!baseUrl) return;

    const generateQR = async () => {
      setIsGenerating(true);
      try {
        const dataUrl = await QRCode.toDataURL(fullUrl, {
          width: 400,
          margin: 2,
          color: {
            dark: '#1F2937',
            light: '#FFFFFF',
          },
          errorCorrectionLevel: 'H',
        });
        setQrDataUrl(dataUrl);
      } catch (err) {
        console.error('Error generating QR code:', err);
      } finally {
        setIsGenerating(false);
      }
    };

    generateQR();
  }, [fullUrl, baseUrl]);

  const handleDownload = () => {
    if (!qrDataUrl) return;

    const link = document.createElement('a');
    link.download = `parmato-qr${tableNumber ? `-meja-${tableNumber}` : ''}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const tablePresets = ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'C1', 'C2', 'C3', '1', '2', '3', '4', '5'];

  return (
    <div className="min-h-screen bg-[var(--bg-cream)]">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--primary-red)] to-[var(--primary-orange)] flex items-center justify-center">
              <span className="text-xl">🍛</span>
            </div>
            <span className="font-display text-xl font-bold text-[var(--text-dark)]">
              Parmato
            </span>
          </Link>
          <span className="text-sm text-[var(--text-muted)]">QR Code Generator</span>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[var(--primary-red)] to-[var(--primary-orange)] rounded-2xl mb-4">
            <QrCode className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[var(--text-dark)] mb-2">
            QR Code Generator
          </h1>
          <p className="text-[var(--text-muted)]">
            Buat QR code untuk setiap meja di restoran Anda
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-[var(--text-dark)] mb-6 flex items-center gap-2">
              <Table2 className="w-5 h-5 text-[var(--primary-red)]" />
              Pengaturan
            </h2>

            {/* Base URL */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-2">
                URL Website
              </label>
              <input
                type="url"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://parmato-menu.vercel.app"
                className="w-full px-4 py-3 bg-[var(--bg-light)] rounded-xl border-2 border-transparent focus:border-[var(--primary-red)] focus:outline-none text-[var(--text-dark)] placeholder:text-[var(--text-light)]"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Ganti dengan URL Vercel setelah deploy
              </p>
            </div>

            {/* Table Number */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-2">
                Nomor Meja (Opsional)
              </label>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Contoh: A1, B5, 12"
                className="w-full px-4 py-3 bg-[var(--bg-light)] rounded-xl border-2 border-transparent focus:border-[var(--primary-red)] focus:outline-none text-[var(--text-dark)] placeholder:text-[var(--text-light)]"
              />
              <p className="text-xs text-[var(--text-muted)] mt-1">
                Nomor meja akan ditambahkan ke URL sebagai parameter
              </p>
            </div>

            {/* Quick Table Presets */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-[var(--text-dark)] mb-2">
                Pilih Cepat
              </label>
              <div className="flex flex-wrap gap-2">
                {tablePresets.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setTableNumber(preset)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                      tableNumber === preset
                        ? 'bg-[var(--primary-red)] text-white'
                        : 'bg-[var(--bg-light)] text-[var(--text-body)] hover:bg-[var(--bg-warm)]'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
                <button
                  onClick={() => setTableNumber('')}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--bg-light)] text-[var(--text-muted)] hover:bg-red-50 hover:text-[var(--error)] transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Generated URL */}
            <div className="p-4 bg-[var(--bg-warm)] rounded-xl">
              <p className="text-xs text-[var(--text-muted)] mb-1">URL yang akan di-encode:</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-sm text-[var(--text-dark)] break-all font-mono">
                  {fullUrl}
                </code>
                <button
                  onClick={handleCopyUrl}
                  className="p-2 hover:bg-white rounded-lg transition-colors flex-shrink-0"
                  title="Copy URL"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-[var(--success)]" />
                  ) : (
                    <Copy className="w-4 h-4 text-[var(--text-muted)]" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* QR Code Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col items-center">
            <h2 className="font-display text-xl font-bold text-[var(--text-dark)] mb-6">
              Preview QR Code
            </h2>

            {/* QR Code Display */}
            <div className="relative mb-6">
              {isGenerating ? (
                <div className="w-64 h-64 bg-[var(--bg-light)] rounded-2xl flex items-center justify-center">
                  <RefreshCw className="w-8 h-8 text-[var(--text-light)] animate-spin" />
                </div>
              ) : qrDataUrl ? (
                <div className="relative">
                  <div className="bg-white p-4 rounded-2xl shadow-lg">
                    <img
                      src={qrDataUrl}
                      alt="QR Code"
                      className="w-56 h-56 sm:w-64 sm:h-64"
                    />
                  </div>
                  {/* Table Label */}
                  {tableNumber && (
                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[var(--primary-red)] text-white px-4 py-1.5 rounded-full font-bold text-sm shadow-lg">
                      Meja {tableNumber}
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-64 h-64 bg-[var(--bg-light)] rounded-2xl flex items-center justify-center">
                  <p className="text-[var(--text-muted)]">Masukkan URL</p>
                </div>
              )}
              <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              disabled={!qrDataUrl}
              className={`w-full flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-bold text-lg transition-all ${
                qrDataUrl
                  ? 'bg-gradient-to-r from-[var(--primary-red)] to-[var(--primary-orange)] text-white btn-transition shadow-lg shadow-red-500/25 hover:shadow-xl'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Download className="w-5 h-5" />
              Download QR Code
            </button>

            {/* Tips */}
            <div className="mt-6 p-4 bg-[var(--bg-light)] rounded-xl w-full">
              <p className="text-sm font-semibold text-[var(--text-dark)] mb-2">
                💡 Tips Cetak QR Code:
              </p>
              <ul className="text-xs text-[var(--text-muted)] space-y-1">
                <li>• Ukuran minimal 3x3 cm</li>
                <li>• Print dengan resolusi tinggi (300 DPI)</li>
                <li>• Tambahkan teks "Scan untuk melihat menu"</li>
                <li>• Laminasi untuk tahan lama</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Batch Generator Info */}
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="font-display text-xl font-bold text-[var(--text-dark)] mb-4">
            📋 Generate untuk Semua Meja
          </h2>
          <p className="text-[var(--text-muted)] mb-4">
            Untuk membuat QR code banyak meja sekaligus, Anda bisa:
          </p>
          <ol className="list-decimal list-inside text-[var(--text-body)] space-y-2">
            <li>Ubah nomor meja di atas</li>
            <li>Download QR code</li>
            <li>Ulangi untuk setiap meja</li>
          </ol>
          <p className="text-sm text-[var(--text-muted)] mt-4">
            Atau gunakan tool online seperti{' '}
            <a
              href="https://www.qrcode-monkey.com/qr-code-api-with-logo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--primary-red)] hover:underline"
            >
              QRCode Monkey
            </a>{' '}
            untuk batch generation dengan logo custom.
          </p>
        </div>
      </main>
    </div>
  );
}
