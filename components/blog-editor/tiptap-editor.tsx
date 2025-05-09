// "use client"

// import { useCallback, useEffect, useState } from "react"
// import { useEditor as useEditorContext } from "./editor-context"
// import { EditorContent, useEditor } from "@tiptap/react"
// import StarterKit from "@tiptap/starter-kit"
// import Underline from "@tiptap/extension-underline"
// import TextStyle from "@tiptap/extension-text-style"
// import Color from "@tiptap/extension-color"
// import Highlight from "@tiptap/extension-highlight"
// import Image from "@tiptap/extension-image"
// import Link from "@tiptap/extension-link"
// import Placeholder from "@tiptap/extension-placeholder"
// import { Toolbar } from "./toolbar"
// import { Button } from "@/components/ui/button"
// import { Plus } from "lucide-react"
// import { motion } from "framer-motion"

// interface TipTapEditorProps {
//   onImageAdd: () => void
//   onLinkAdd: () => void
// }

// export const TipTapEditor = ({ onImageAdd, onLinkAdd }: TipTapEditorProps) => {
//   const { content, setContent } = useEditorContext()
//   const [isFocused, setIsFocused] = useState(false)

//   // Initialize TipTap editor with extensions
//   const editor = useEditor({
//     extensions: [
//       StarterKit.configure({
//         heading: {
//           levels: [1, 2, 3],
//         },
//       }),
//       Underline,
//       TextStyle,
//       Color,
//       Highlight.configure({
//         multicolor: true,
//       }),
//       Image.configure({
//         allowBase64: true,
//         inline: false,
//       }),
//       Link.configure({
//         openOnClick: false,
//         HTMLAttributes: {
//           rel: "noopener noreferrer",
//           target: "_blank",
//         },
//       }),
//       Placeholder.configure({
//         placeholder: "Start writing your blog post...",
//       }),
//     ],
//     content,
//     onUpdate: ({ editor }) => {
//       setContent(editor.getJSON())
//     },
//     onFocus: () => {
//       setIsFocused(true)
//     },
//     onBlur: () => {
//       setIsFocused(false)
//     },
//   })

//   // Add image handler
//   const addImage = useCallback(
//     (url: string, alt: string) => {
//       if (editor) {
//         editor.chain().focus().setImage({ src: url, alt }).run()
//       }
//     },
//     [editor],
//   )

//   // Add link handler
//   const addLink = useCallback(
//     (url: string, text: string) => {
//       if (editor) {
//         // If text is selected, update the link on that text
//         if (editor.state.selection.empty) {
//           // If no text is selected, insert new text with link
//           editor
//             .chain()
//             .focus()
//             .insertContent(text)
//             .setTextSelection({
//               from: editor.state.selection.from - text.length,
//               to: editor.state.selection.from,
//             })
//             .setLink({ href: url })
//             .run()
//         } else {
//           // Apply link to selected text
//           editor.chain().focus().setLink({ href: url }).run()
//         }
//       }
//     },
//     [editor],
//   )

//   // Expose methods to parent component
//   useEffect(() => {
//     if (editor) {
//       // Make addImage and addLink available to parent
//       window.addImage = addImage
//       window.addLink = addLink

//       return () => {
//         // Clean up
//         delete (window as any).addImage
//         delete (window as any).addLink
//       }
//     }
//   }, [editor, addImage, addLink])

//   if (!editor) {
//     return null
//   }

//   return (
//     <div className="space-y-4">
//       <Toolbar editor={editor} onImageAdd={onImageAdd} onLinkAdd={onLinkAdd} />

//       <motion.div
//         initial={{ opacity: 0, y: 10 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3 }}
//         className={`min-h-[300px] max-h-[600px] overflow-y-auto border rounded-lg p-4 bg-white dark:bg-gray-900 ${
//           isFocused ? "ring-2 ring-violet-500/50 dark:ring-violet-500/30" : "border-violet-200 dark:border-violet-800"
//         } transition-all duration-300 relative`}
//       >
//         <EditorContent editor={editor} className="prose dark:prose-invert max-w-none" />

//         <motion.div
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ delay: 0.2, duration: 0.3 }}
//           className="mt-4"
//         >
//           <Button
//             type="button"
//             variant="ghost"
//             className="w-full border border-dashed border-gray-300 dark:border-gray-600 hover:border-violet-400 dark:hover:border-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-muted-foreground hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
//             onClick={() => editor.chain().focus().createParagraphNear().run()}
//           >
//             <Plus className="h-4 w-4 mr-2" />
//             Add paragraph
//           </Button>
//         </motion.div>
//       </motion.div>

//       <div className="text-sm text-muted-foreground flex items-center justify-between">
//         <span>
//           Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Shift+Enter</kbd> for a line
//           break, <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded text-xs">Enter</kbd> for a new paragraph
//         </span>
//       </div>
//     </div>
//   )
// }

// // Add type definitions for window
// declare global {
//   interface Window {
//     addImage: (url: string, alt: string) => void
//     addLink: (url: string, text: string) => void
//   }
// }