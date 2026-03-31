import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminHeader() {
  return (
    <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-foreground">Painel Admin</h1>
          <p className="font-body text-sm text-muted-foreground">Gerencie todo o conteúdo do seu site</p>
        </div>
        <Link to="/">
          <Button variant="outline" className="gap-2 font-body text-sm">
            <Eye className="w-4 h-4" />
            Ver Site
          </Button>
        </Link>
      </div>
    </div>
  );
}