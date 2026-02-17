'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signOut({ callbackUrl: '/' })}
      className="gap-2 border border-white/5"
    >
      <LogOut className="w-4 h-4" /> TERMINATE_SESSION
    </Button>
  );
}
