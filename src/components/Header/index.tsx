import { HeaderContainer, HeaderContent, NewTransactionButton } from "./styles";
import LogoImage from '../../assets/logo.svg'
import * as Dialog from '@radix-ui/react-dialog'
import { NewTransactionModal } from "../NewTransactionModal";
import { useState } from "react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  function handleModalOpenStateChange(value: boolean) {
    setIsOpen(value)
  }

  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={LogoImage} alt='' />

        <Dialog.Root 
          open={isOpen}
          onOpenChange={handleModalOpenStateChange}>
          <Dialog.Trigger asChild>
            <NewTransactionButton>Nova transação</NewTransactionButton>
          </Dialog.Trigger>

          <NewTransactionModal onModalOpenStateChange={handleModalOpenStateChange}/>
        </Dialog.Root>
      </HeaderContent>
    </HeaderContainer>
  )
}