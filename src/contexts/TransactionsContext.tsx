/* eslint-disable react-refresh/only-export-components */
import { ReactNode, useEffect, useState } from "react";
import { api } from "../lib/axios";
import { createContext } from "use-context-selector";

interface Transaction {
  id: number
  description: string
  type: 'income' | 'outcome'
  price: number
  category: string
  createdAt: string
}

interface CreateTransactionInput {
  description: string;
  price: number;
  category: string;
  type: 'income' | 'outcome'
}

interface TransactionContextType {
  transactions: Transaction[],
  fetchTransactions: (query?: string) => Promise<void>
  createTransaction: (data: CreateTransactionInput) => Promise<void>
}

export const TransactionsContext = createContext<TransactionContextType>({} as TransactionContextType)

interface TransactionsProviderProps {
  children: ReactNode
}

export function TransactionsProvider({children}: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])

  async function fetchTransactions(query?: string) {
    const response = await api.get('/transactions', {
      params: {
        q: query,
        _order: 'desc',
        _sort: 'createdAt',
      }
    }) 

    setTransactions(response.data)
  }


  async function createTransaction(data: CreateTransactionInput) {
    const {description, price, category, type} = data
    
    const response = await api.post<Transaction>('/transactions', {
      description,
      price,
      category,
      type,
      createdAt: new Date()
    })

    setTransactions(state => [...state, response.data])
  }

  useEffect(() => {
    fetchTransactions()
  }, [])
  
  return (
    <TransactionsContext.Provider 
      value={{
        transactions,
        fetchTransactions,
        createTransaction
      }}>
      {children}
    </TransactionsContext.Provider>
  )
}