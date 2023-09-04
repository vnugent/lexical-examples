import { useCallback, useEffect, useState, useRef } from "react"
import {
  LexicalCommand,
  createCommand,
  COMMAND_PRIORITY_HIGH,
  $getSelection,
  $isRangeSelection,
} from "lexical"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { getSelectedNode } from "@/utils/getSelectedNode"
import { sanitizeUrl } from "@/utils/url"
import { getLinkNodeInfo } from "@/utils/getLinkNodeInfo"

export const EDIT_LINK_COMMAND: LexicalCommand<null> = createCommand()

const FormSchema = z.object({
  text: z.string(),
  link: z.string(),
})

export const LinkEditorPlugin: React.FC<{ anchorElem?: HTMLElement }> = ({
  anchorElem,
}) => {
  const [editor] = useLexicalComposerContext()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    editor.registerCommand(
      EDIT_LINK_COMMAND,
      () => {
        setOpen(true)
        return false
      },
      COMMAND_PRIORITY_HIGH
    )
  }, [editor])

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onSubmit",
  })

  const { setValue, reset: resetForm } = form

  function onSubmit(formData: z.infer<typeof FormSchema>) {
    const { text, link } = formData
    if (text !== "") {
      updateLinkText(text)
    }
    if (link === "") {
      // no link provided --> remove link from node
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null)
    } else {
      const _url = sanitizeUrl(link)
      if (text.trim() === "") {
        // no text provided --> use link
        updateLinkText(_url)
      }
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, _url)
    }
    setOpen(false)
  }

  const onEditDialogCloseHandler = () => {
    setOpen(false)
    editor.focus()
  }

  const updateLinkText = (text: string) => {
    editor.update(() => {
      const selection = $getSelection()
      if ($isRangeSelection(selection)) {
        const node = getSelectedNode(selection)
        const parent = node.getParent()
        if ($isLinkNode(parent)) {
          node.setTextContent(text)
        } else if ($isLinkNode(node)) {
          console.log("# suppose to set child of link node text")
        }
      }
    })
  }

  useEffect(() => {
    if (open) {
      editor.getEditorState().read(() => {
        const { text, url } = getLinkNodeInfo()
        setValue("text", text)
        setValue("link", url)
      })
    }
  }, [editor, open])

  return (
    <Dialog open={open} onOpenChange={onEditDialogCloseHandler}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <DialogHeader>
              <DialogTitle>Edit link</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Link text"
                        {...field}
                        data-lpignore="true"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="link"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://example.com"
                        {...field}
                        data-lpignore="true"
                        autoFocus
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={onEditDialogCloseHandler}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
