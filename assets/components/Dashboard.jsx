import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';

export function Dashboard({ fontCount, themeCount, fontUrl, themeUrl }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <a href={fontUrl} className="block">
        <Card className="p-6 transition-colors hover:bg-muted/50">
          <CardHeader className="p-0">
            <CardTitle className="mb-1">Polices</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              Gérer les polices (native, Google, custom).
            </p>
            <p className="text-2xl font-semibold text-primary">{fontCount}</p>
          </CardContent>
        </Card>
      </a>
      <a href={themeUrl} className="block">
        <Card className="p-6 transition-colors hover:bg-muted/50">
          <CardHeader className="p-0">
            <CardTitle className="mb-1">Thèmes</CardTitle>
          </CardHeader>
          <CardContent className="p-0 pt-2">
            <p className="text-sm text-muted-foreground mb-4">
              Créer et éditer les thèmes CSS.
            </p>
            <p className="text-2xl font-semibold text-primary">{themeCount}</p>
          </CardContent>
        </Card>
      </a>
    </div>
  );
}
