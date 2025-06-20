'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { QrCode } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function QrcodePopover({ student }) {
  const [qrDataUrl, setQrDataUrl] = useState(null);

  useEffect(() => {
    fetch(`/api/generate-qr?id=${student?.id}`)
      .then((res) => res.json())
      .then((data) => setQrDataUrl(data.qr));
  }, [student]);

  return (
    <Popover>
      <PopoverTrigger>
        <QrCode className="text-red-500" />
      </PopoverTrigger>
      <PopoverContent>
        <h2>
          {student?.lastName} {student?.firstName}
        </h2>
        {qrDataUrl && <Image src={qrDataUrl} alt="QR код" width={288} height={288} />}
      </PopoverContent>
    </Popover>
  );
}
