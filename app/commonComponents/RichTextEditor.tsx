"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import Image from "@tiptap/extension-image";
import { useRef } from "react";
import { blogService } from "../sercices/user/blog.service";
import { getImageUrl } from "../utils/getImageUrl";

function MenuButton({
  onClick,
  isActive,
  label,
}: {
  onClick: () => void;
  isActive?: boolean;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      type="button"
      className={`px-2 py-1 rounded text-sm font-medium mr-1 border transition ${
        isActive
          ? "bg-blue-600 text-white border-blue-600"
          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

export default function RichTextEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (html: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false, // disable built-in heading to use extension
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Blockquote,
      CodeBlock,
      Image,
    ],
    content: value || "<p>Write something...</p>",
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML());
    },
  });

  // Commands
  const setHeading = (level: 1 | 2 | 3) =>
    editor?.chain().focus().toggleHeading({ level }).run();
  const setBold = () => editor?.chain().focus().toggleBold().run();
  const setItalic = () => editor?.chain().focus().toggleItalic().run();
  const setStrike = () => editor?.chain().focus().toggleStrike().run();
  const setBulletList = () => editor?.chain().focus().toggleBulletList().run();
  const setOrderedList = () =>
    editor?.chain().focus().toggleOrderedList().run();
  const setBlockquote = () => editor?.chain().focus().toggleBlockquote().run();
  const setCodeBlock = () => editor?.chain().focus().toggleCodeBlock().run();
  const undo = () => editor?.chain().focus().undo().run();
  const redo = () => editor?.chain().focus().redo().run();

  // Image upload handler
  const addImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await blogService.uploadImage(file);
    console.log("url,", res);
    if (res.url) {
      editor
        ?.chain()
        .focus()
        .setImage({ src: getImageUrl(res.url) })
        .run();
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) addImage(file);
  };

  if (!editor) return null;

  return (
    <div className="border rounded-lg shadow-sm p-2 bg-white">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 mb-3 border-b pb-2">
        <MenuButton
          onClick={() => setHeading(1)}
          isActive={editor.isActive("heading", { level: 1 })}
          label="H1"
        />
        <MenuButton
          onClick={() => setHeading(2)}
          isActive={editor.isActive("heading", { level: 2 })}
          label="H2"
        />
        <MenuButton
          onClick={() => setHeading(3)}
          isActive={editor.isActive("heading", { level: 3 })}
          label="H3"
        />
        <MenuButton
          onClick={setBold}
          isActive={editor.isActive("bold")}
          label="B"
        />
        <MenuButton
          onClick={setItalic}
          isActive={editor.isActive("italic")}
          label="I"
        />
        <MenuButton
          onClick={setStrike}
          isActive={editor.isActive("strike")}
          label="S"
        />
        <MenuButton
          onClick={setBulletList}
          isActive={editor.isActive("bulletList")}
          label="• List"
        />
        <MenuButton
          onClick={setOrderedList}
          isActive={editor.isActive("orderedList")}
          label="1. List"
        />
        <MenuButton
          onClick={setBlockquote}
          isActive={editor.isActive("blockquote")}
          label="❝"
        />
        <MenuButton
          onClick={setCodeBlock}
          isActive={editor.isActive("codeBlock")}
          label="</>"
        />
        <MenuButton onClick={undo} label="↺ Undo" />
        <MenuButton onClick={redo} label="↻ Redo" />
        <MenuButton onClick={handleImageClick} label="🖼 Image" />
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {/* Editor */}
      <EditorContent editor={editor} className="tiptap p-2" />
    </div>
  );
}
