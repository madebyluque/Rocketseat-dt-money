import * as Dialog from "@radix-ui/react-dialog";
import { CloseButton, Content, Overlay, TransactionType, TransactionTypeButton } from "./styles";
import { ArrowCircleDown, ArrowCircleUp, X } from "phosphor-react";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { useContextSelector } from "use-context-selector";

const newTransactionFormSchema = z.object({
  description: z.string(),
  price: z.number(),
  category: z.string(),
  type: z.enum(['income', 'outcome'])
})

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>

interface NewTransactionModalProps {
  onModalOpenStateChange: (value: boolean) => void
}

export function NewTransactionModal({onModalOpenStateChange}: NewTransactionModalProps) {
  const createTransaction = useContextSelector(TransactionsContext, (context) => {
    return context.createTransaction
  })

  const {
    control, // sempre que uma info do form não venha de um input nativo do html
    register,
    handleSubmit,
    reset,
    formState: {isSubmitting}
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
    defaultValues: {
      type: 'income'
    }
  })

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    await createTransaction(data)
    reset()
    onModalOpenStateChange(false);
  }

  return(
    <Dialog.Portal>
      <Overlay />
      
      <Content>
        <Dialog.Title>Nova transação</Dialog.Title>
        
        <CloseButton>
          <X size={24}/>
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input 
            type="text" 
            placeholder="Descrição" 
            required
            {...register('description')}
            />
          <input 
            type="number" 
            placeholder="Preço" 
            required
            {...register('price', {valueAsNumber: true})}
            />
          <input 
            type="text" 
            placeholder="Categoria" 
            required
            {...register('category')}
            />
          
          <Controller 
            control={control}
            name='type'
            render={({ field }) => {
              return(
                <TransactionType 
                  onValueChange={field.onChange} 
                  value={field.value}>
                  <TransactionTypeButton variant="income" value='income'>
                    <ArrowCircleUp size={24} />
                    Entrada
                  </TransactionTypeButton>
                  <TransactionTypeButton variant="outcome" value='outcome'>
                    <ArrowCircleDown size={24} />
                    Saída
                  </TransactionTypeButton>
                </TransactionType>
              )
            }
            } />
          <button type="submit" disabled={isSubmitting}>Cadastrar</button>
        </form>
      </Content>
    </Dialog.Portal>
  )
}