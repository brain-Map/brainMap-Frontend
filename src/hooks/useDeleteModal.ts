import { useState } from 'react'

interface UseDeleteModalOptions {
  title?: string
  message?: string
  confirmText?: string
  cancelText?: string
}

export function useDeleteModal(options: UseDeleteModalOptions = {}) {
  const [isOpen, setIsOpen] = useState(false)
  const [deleteFunction, setDeleteFunction] = useState<((...args: any[]) => Promise<void> | void) | null>(null)
  const [deleteArgs, setDeleteArgs] = useState<any[]>([])
  const [itemName, setItemName] = useState<string>("")

  const openModal = (
    fn: (...args: any[]) => Promise<void> | void, 
    args: any[] = [], 
    name?: string
  ) => {
    setDeleteFunction(() => fn)
    setDeleteArgs(args)
    setItemName(name || "")
    setIsOpen(true)
  }

  const closeModal = () => {
    setIsOpen(false)
    setDeleteFunction(null)
    setDeleteArgs([])
    setItemName("")
  }

  const modalProps = {
    isOpen,
    onClose: closeModal,
    onConfirm: deleteFunction || (() => {}),
    args: deleteArgs,
    itemName,
    ...options
  }

  return {
    openModal,
    closeModal,
    modalProps
  }
}