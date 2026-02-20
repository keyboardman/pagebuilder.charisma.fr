import React, { useState } from 'react';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Button } from './components/ui/button';
import { cn } from '@/lib/utils';
import { PageBuilderEmbed } from './pageBuilder';

export function PageFormWithBuilder({ postUrl, themes, initialPage, csrfToken }) {
  const [title, setTitle] = useState(initialPage?.title ?? '');
  const [themeId, setThemeId] = useState(() =>
    String(initialPage?.theme_id ?? themes[0]?.id ?? '')
  );
  const [description, setDescription] = useState(initialPage?.description ?? '');
  const [content, setContent] = useState(initialPage?.content ?? '');

  const fileManagerConfig = {
    type: 'custom',
    custom: {
      listEndpoint: '/media/api/list',
      uploadEndpoint: '/media/api/upload',
      renameEndpoint: '/media/api/rename',
      deleteEndpoint: '/media/api/delete',
      useXHR: true,
    },
  };

  console.log('PageFormWithBuilder', fileManagerConfig); //

  return (
    <form method="post" action={postUrl} className="space-y-6">
      <input type="hidden" name="_token" value={csrfToken} />
      <input type="hidden" name="content" value={content} />
      <div className="card p-4 space-y-4">
        <h2 className="text-lg font-semibold">Page</h2>
        <div className="space-y-2">
          <label htmlFor="page-title" className="text-sm font-medium">Titre</label>
          <Input
            id="page-title"
            type="text"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Titre de la page"
            required
            className="w-full max-w-md"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="page-theme" className="text-sm font-medium">Thème</label>
          <select
            id="page-theme"
            name="theme_id"
            value={String(themeId)}
            onChange={(e) => setThemeId(e.target.value)}
            required
            className={cn(
              'flex h-10 w-full max-w-md rounded-md border border-input bg-background px-3 py-2 text-sm',
              'ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
          >
            <option value="">Choisir un thème</option>
            {themes.map((t) => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="card p-4 space-y-4">
        <h2 className="text-lg font-semibold">SEO</h2>
        <div className="space-y-2">
          <label htmlFor="page-description" className="text-sm font-medium">Description</label>
          <Textarea
            id="page-description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description pour les moteurs de recherche"
            rows={3}
            className="w-full"
          />
        </div>
      </div>
      <div className="card p-4 space-y-4">
        <h2 className="text-lg font-semibold">Contenu</h2>
        <div className="space-y-2">
          <label className="text-sm font-medium">Builder de page</label>
          <div className="border rounded-md min-h-[400px] overflow-hidden">
            <PageBuilderEmbed
              value={content || '{"cylsqgudkwtz":{"id":"cylsqgudkwtz","type":"node-root","parent":null,"content":{"title":""}}}'}
              onChange={setContent}
              //fileManagerConfig={fileManagerConfig}
            />
          </div>
        </div>
      </div>
      <Button type="submit" variant="default">Enregistrer</Button>
    </form>
  );
}
