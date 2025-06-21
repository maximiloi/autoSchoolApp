'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { QrCode } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export default function QrcodePopover({ student }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleOpenChange = async (isOpen) => {
    setOpen(isOpen);
    if (isOpen && !qrDataUrl && student?.id) {
      setLoading(true);
      try {
        const res = await fetch(`/api/generate-qr?id=${student.id}`);
        const data = await res.json();
        setQrDataUrl(data.qr);
      } catch {
        setQrDataUrl(null);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger>
        <QrCode className="text-red-500" />
      </PopoverTrigger>
      <PopoverContent>
        <h2>
          {student?.lastName} {student?.firstName}
        </h2>
        {loading && <div>Загрузка...</div>}
        {qrDataUrl && <Image src={qrDataUrl} alt="QR код" width={288} height={288} />}
      </PopoverContent>
    </Popover>
  );
}
