/*
  ==========================================================
  hooks/useEditModal.ts
  ----------------------------------------------------------
  الگوی تکراری «{ open, editingItem }» + توابع openCreate/
  openEdit/close که تو Products، Orders، Users و Team عیناً
  تکرار شده بود.

  استفاده:

  const formModal = useEditModal<Product>();

  <Button onClick={formModal.openCreate}>افزودن</Button>
  <ProductTable onEdit={formModal.openEdit} ... />
  <ProductFormModal
    open={formModal.open}
    onClose={formModal.close}
    initialProduct={formModal.editingItem}
  />
  ==========================================================
*/

import { useState } from "react";

interface EditModalState<T> {
  open: boolean;
  editingItem: T | null;
}

export function useEditModal<T>() {
  const [state, setState] = useState<EditModalState<T>>({
    open: false,
    editingItem: null,
  });

  const openCreate = () => setState({ open: true, editingItem: null });

  const openEdit = (item: T) => setState({ open: true, editingItem: item });

  const close = () => setState({ open: false, editingItem: null });

  return { ...state, openCreate, openEdit, close };
}
