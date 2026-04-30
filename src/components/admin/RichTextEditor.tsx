"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { 
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon, 
  Type, Heading1, Heading2, Heading3, Unlink 
} from "lucide-react";

const TOOLBAR_BTNS = [
  { cmd: "formatBlock", arg: "H1", label: "H1", title: "Heading 1" },
  { cmd: "formatBlock", arg: "H2", label: "H2", title: "Heading 2" },
  { cmd: "formatBlock", arg: "H3", label: "H3", title: "Heading 3" },
  { cmd: "formatBlock", arg: "P",  label: "¶",  title: "Paragraph" },
  { cmd: "_sep" },
  { cmd: "bold",              label: "B",      title: "Bold",          style: { fontWeight: 700 } },
  { cmd: "italic",            label: "I",      title: "Italic",        style: { fontStyle: "italic" } },
  { cmd: "underline",         label: "U",      title: "Underline",     style: { textDecoration: "underline" } },
  { cmd: "_sep" },
  { cmd: "insertUnorderedList", label: "• List",  title: "Bullet List" },
  { cmd: "insertOrderedList",   label: "1. List", title: "Numbered List" },
  { cmd: "_sep" },
  { cmd: "createLink", label: "🔗 Link",  title: "Insert Link" },
  { cmd: "unlink",     label: "✂ Unlink", title: "Remove Link" },
] as const;

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const isInternal = useRef(false);

  useEffect(() => {
    if (editorRef.current && !isInternal.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
    isInternal.current = false;
  }, [value]);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      isInternal.current = true;
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const exec = useCallback((cmd: string, arg?: string) => {
    editorRef.current?.focus();
    if (cmd === "formatBlock") {
      document.execCommand(cmd, false, `<${arg}>`);
    } else if (cmd === "createLink") {
      const url = window.prompt("Enter URL:", "https://");
      if (url) document.execCommand("createLink", false, url);
    } else {
      document.execCommand(cmd, false, arg);
    }
    handleInput();
  }, [handleInput]);

  return (
    <div className="border rounded-xl overflow-hidden bg-background border-input shadow-sm focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background transition-all">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-muted/30 border-b border-input">
        {TOOLBAR_BTNS.map((btn, i) =>
          btn.cmd === "_sep" ? (
            <div key={i} className="w-px h-6 bg-input mx-1" />
          ) : (
            <button
              key={i}
              type="button"
              title={btn.title}
              onMouseDown={(e) => {
                e.preventDefault();
                exec(btn.cmd as string, (btn as any).arg);
              }}
              style={(btn as any).style}
              className="px-2 py-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition flex items-center justify-center text-xs font-bold"
            >
              {(btn as any).label}
            </button>
          )
        )}
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        className="min-h-[140px] max-h-[320px] overflow-y-auto px-4 py-3 text-sm focus:outline-none prose prose-sm max-w-none dark:prose-invert 
        [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2 
        [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2 
        [&_h3]:font-medium [&_h3]:mb-1 
        [&_p]:mb-2 
        [&_ul]:list-disc [&_ul]:ml-4 [&_ul]:mb-2 
        [&_ol]:list-decimal [&_ol]:ml-4 [&_ol]:mb-2 
        [&_a]:text-indigo-600 [&_a]:underline font-sans"
        data-placeholder={placeholder}
      />
    </div>
  );
}
