import { Lock, LockOpen, TextFields } from '@mui/icons-material'
import { useCallback, useRef, useState } from 'react'
import type { EditorOptions } from '@tiptap/core'
import { Stack } from '@mui/material'
import {
  LinkBubbleMenu,
  MenuButton,
  RichTextEditor,
  TableBubbleMenu,
  insertImages,
  type RichTextEditorRef,
} from 'mui-tiptap'

import EditorMenuControls from '@/components/molecules/EditorMenuControls'
import useExtensions from '@/hooks/useExtensions'

function fileListToImageFiles(fileList: FileList): File[] {
  // You may want to use a package like attr-accept
  // (https://www.npmjs.com/package/attr-accept) to restrict to certain file
  // types.
  return Array.from(fileList).filter((file) => {
    const mimeType = (file.type || '').toLowerCase()
    return mimeType.startsWith('image/')
  })
}

interface EditorProps {
  value: string,
  onChange: (nextValue: string) => void
}

const Editor: React.FC<EditorProps> = ({ value, onChange }) => {
  const extensions = useExtensions({
    placeholder: 'Add your own content here...',
  })
  const rteRef = useRef<RichTextEditorRef>(null)
  const [isEditable, setIsEditable] = useState(true)
  const [showMenuBar, setShowMenuBar] = useState(true)

  const handleNewImageFiles = useCallback(
    (files: File[], insertPosition?: number): void => {
      if (!rteRef.current?.editor) return

      const attributesForImageFiles = files.map((file) => ({
        src: URL.createObjectURL(file),
        alt: file.name,
      }))

      insertImages({
        images: attributesForImageFiles,
        editor: rteRef.current.editor,
        position: insertPosition,
      })
    },
    []
  )

  const handleDrop: NonNullable<EditorOptions['editorProps']['handleDrop']> =
    useCallback(
      (view, event) => {
        if (!(event instanceof DragEvent) || !event.dataTransfer) return false

        const imageFiles = fileListToImageFiles(event.dataTransfer.files)
        if (imageFiles.length > 0) {
          const insertPosition = view.posAtCoords({
            left: event.clientX,
            top: event.clientY,
          })?.pos

          handleNewImageFiles(imageFiles, insertPosition)
          event.preventDefault()
          return true
        }

        return false
      },
      [handleNewImageFiles]
    )

  const handlePaste: NonNullable<EditorOptions['editorProps']['handlePaste']> =
    useCallback(
      (_view, event) => {
        if (!event.clipboardData) return false

        const pastedImageFiles = fileListToImageFiles(event.clipboardData.files)
        if (pastedImageFiles.length > 0) {
          handleNewImageFiles(pastedImageFiles)
          return true
        }

        return false
      },
      [handleNewImageFiles]
    )

  return (
    <RichTextEditor
      ref={rteRef}
      extensions={extensions}
      content={value}
      onUpdate={(content) => onChange(content.editor.getHTML())}
      editable={isEditable}
      editorProps={{
        handleDrop: handleDrop,
        handlePaste: handlePaste,
      }}
      renderControls={() => <EditorMenuControls />}
      RichTextFieldProps={{
        variant: 'outlined',
        MenuBarProps: {
          hide: !showMenuBar,
        },
        footer: (
          <Stack
            direction='row'
            spacing={2}
            sx={{
              borderTopStyle: 'solid',
              borderTopWidth: 1,
              borderTopColor: (theme) => theme.palette.divider,
              py: 1,
              px: 1.5,
            }}
          >
            <MenuButton
              value='formatting'
              tooltipLabel={
                showMenuBar ? 'Hide formatting' : 'Show formatting'
              }
              size='small'
              onClick={() => setShowMenuBar((currentState) => !currentState)}
              selected={showMenuBar}
              IconComponent={TextFields}
            />

            <MenuButton
              value='formatting'
              tooltipLabel={
                isEditable
                  ? 'Prevent edits (use read-only mode)'
                  : 'Allow edits'
              }
              size='small'
              onClick={() => setIsEditable((currentState) => !currentState)}
              selected={!isEditable}
              IconComponent={isEditable ? Lock : LockOpen}
            />
          </Stack>
        ),
      }}
      sx={{
        '& .ProseMirror': {
          '& h1, & h2, & h3, & h4, & h5, & h6': {
            scrollMarginTop: showMenuBar ? 50 : 0,
          },
        },
      }}
    >
      {() => (
        <>
          <LinkBubbleMenu />
          <TableBubbleMenu />
        </>
      )}
    </RichTextEditor>
  )
}

export default Editor
