"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Heading from '@tiptap/extension-heading';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Quote, 
  Undo, 
  Redo,
  ShoppingBag,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api-client';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder: 'Tell your story here...',
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 font-serif leading-relaxed',
      },
    },
  });

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = () => {
    if (imageUrl) {
      editor?.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl('');
      setIsImageDialogOpen(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await apiClient.get(`/products?search=${search}`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    if (isProductDialogOpen) fetchProducts();
  }, [isProductDialogOpen, search]);

  const insertProduct = (product: any) => {
    const productHtml = `
      <div class="product-card-embed my-8 p-6 rounded-3xl border border-gray-100 bg-gray-50 flex items-center gap-6 no-prose" data-product-id="${product.id}">
        <img src="${product.thumbnail}" class="size-24 rounded-2xl object-cover" />
        <div class="flex-1">
          <h4 class="text-lg font-bold text-[#062D1B] mb-1">${product.title}</h4>
          <p class="text-sm font-bold opacity-40">$${product.price}</p>
          <a href="/products/${product.slug}" class="inline-flex items-center gap-2 mt-3 text-xs font-black uppercase tracking-widest text-[#062D1B]">View Product <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg></a>
        </div>
      </div>
      <p></p>
    `;
    editor?.chain().focus().insertContent(productHtml).run();
    setIsProductDialogOpen(false);
  };

  if (!editor) return null;

  return (
    <div className="rounded-[3rem] border border-gray-100 bg-white shadow-sm overflow-hidden flex flex-col">
      
      {/* Premium Toolbar */}
      <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50 flex flex-wrap items-center gap-2">
         <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100/50">
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
              active={editor.isActive('heading', { level: 1 })}
              icon={Heading1}
            />
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
              active={editor.isActive('heading', { level: 2 })}
              icon={Heading2}
            />
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
              active={editor.isActive('heading', { level: 3 })}
              icon={Heading3}
            />
         </div>

         <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100/50">
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleBold().run()} 
              active={editor.isActive('bold')}
              icon={Bold}
            />
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleItalic().run()} 
              active={editor.isActive('italic')}
              icon={Italic}
            />
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleUnderline().run()} 
              active={editor.isActive('underline')}
              icon={UnderlineIcon}
            />
         </div>

         <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100/50">
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleBulletList().run()} 
              active={editor.isActive('bulletList')}
              icon={List}
            />
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleOrderedList().run()} 
              active={editor.isActive('orderedList')}
              icon={ListOrdered}
            />
         </div>

         <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100/50">
            <ToolbarButton 
              onClick={() => editor.chain().focus().toggleBlockquote().run()} 
              active={editor.isActive('blockquote')}
              icon={Quote}
            />
         </div>

         <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100/50">
            <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
               <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-gray-50"><ImageIcon className="size-4" /></Button>
               </DialogTrigger>
               <DialogContent className="rounded-3xl border-gray-100 shadow-2xl">
                  <DialogHeader><DialogTitle className="font-bold">Insert Image</DialogTitle></DialogHeader>
                  <div className="space-y-4 py-4">
                     <Label className="text-xs font-bold uppercase tracking-widest text-gray-400">Image URL</Label>
                     <Input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="https://..." className="rounded-xl h-12" />
                  </div>
                  <DialogFooter><Button onClick={addImage} className="rounded-xl bg-[#062D1B] text-white font-bold h-12 px-6">Add to Story</Button></DialogFooter>
               </DialogContent>
            </Dialog>

            <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
               <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg hover:bg-emerald-50 text-emerald-600"><ShoppingBag className="size-4" /></Button>
               </DialogTrigger>
               <DialogContent className="max-w-2xl rounded-3xl border-gray-100 shadow-2xl">
                  <DialogHeader><DialogTitle className="font-bold">Add Product to Blog</DialogTitle></DialogHeader>
                  <div className="space-y-6 py-4">
                     <Input 
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        placeholder="Search products..." 
                        className="rounded-xl h-12" 
                     />
                     <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
                        {products.map((p) => (
                           <div key={p.id} className="p-4 rounded-2xl border border-gray-100 hover:border-[#062D1B] hover:shadow-md transition-all flex gap-4 items-center group cursor-pointer" onClick={() => insertProduct(p)}>
                              <img src={p.thumbnail} className="size-16 rounded-xl object-cover" />
                              <div className="flex-1 min-w-0">
                                 <h4 className="font-bold text-sm truncate">{p.title}</h4>
                                 <p className="text-xs font-bold opacity-30">$${p.price}</p>
                              </div>
                              <Plus className="size-4 text-gray-200 group-hover:text-[#062D1B]" />
                           </div>
                        ))}
                     </div>
                  </div>
               </DialogContent>
            </Dialog>
         </div>

         <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-gray-100/50">
            <ToolbarButton onClick={() => editor.chain().focus().undo().run()} icon={Undo} />
            <ToolbarButton onClick={() => editor.chain().focus().redo().run()} icon={Redo} />
         </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}

function ToolbarButton({ onClick, active, icon: Icon }: { onClick: () => void; active?: boolean; icon: any }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={onClick}
      className={cn(
        "h-9 w-9 rounded-lg transition-all",
        active ? "bg-[#062D1B] text-white shadow-md scale-110" : "hover:bg-gray-50 text-gray-400"
      )}
    >
      <Icon className="size-4" />
    </Button>
  );
}
