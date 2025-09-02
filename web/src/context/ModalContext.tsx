import React, { createContext, useContext, useState } from 'react'

export type ModalOptions = {
  onClose?: () => void
  isClosing?: boolean
}


type ModalData<T extends React.ElementType> = {
  component: T
  props?: React.ComponentProps<T>
  options?: ModalOptions
}


type ModalContextType = {
  showModal: <T extends React.ElementType>(
    component: ModalData<T>['component'],
    props?: ModalData<T>['props'],
    options?: ModalData<T>['options']
  ) => void
  hideModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

// eslint-disable-next-line react-refresh/only-export-components
export const useModal = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error('useModal must be used inside ModalProvider')
  return ctx
}

export const ModalProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [isClosing, setIsClosing] = useState(false)
  const [modal, setModal] = useState<ModalData<React.ElementType>>()

  const showModal = <T extends React.ElementType>(
    component: ModalData<T>['component'],
    props?: ModalData<T>['props'],
    options?: ModalData<T>['options']
  ) => {
    setModal({ component, props, options })
  }

  const hideModal = () => {
    modal?.options?.onClose?.()
    setIsClosing(true)
    setTimeout(() => {
      setIsClosing(false)
      setModal(undefined)
    }, 400) // 400ms set on the theme definition on App.tsx
  }

  const ModalComponent = modal ? modal.component : React.Fragment

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}

      <ModalComponent
        {...modal?.props}
        {...(modal ? {
          isClosing: isClosing,
          onClose: hideModal,
        } : {})}
      />
    </ModalContext.Provider>
  )
}
