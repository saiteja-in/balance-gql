import { transactions } from "../dummyData/data.js";
import Transaction from "../models/transaction.model.js";

const transactionResolver = {
  Query: {
    transactions: async(_,__,context) => {
      try {
        if(!context.getuser())throw new Error("Unauthorised")
        const userId=await Transaction.find({userId});
        return transactions;
      } catch (error) {
        console.error("Error getting transactions:",error)
        throw new Error("error getting transactions")
      }
    },
    transaction:async(_,{transactionId},)=>{
      try {
        const transaction=await Transaction.findById(transactionId);
        return transaction
      } catch (error) {
        console.error("Error getting transactions:",error)
        throw new Error("error getting transactions")
      }
    }
  },
  Mutation: {
    createTransaction:async(_,{input},context)=>{
      try {
        const newTransaction=new Transaction({
          ...input,
          userId:context.getUser()._id
        })
        await newTransaction.save()
        return newTransaction
      } catch (error) {
        console.error("Error creating transactions:",error)
        throw new Error("error creating transactions")
      }
    },
    updateTransaction:async(_,{input},)=>{
      try {
        const updatedTransaction=await Transaction.findByIdAndUpdate(input.transactionId,input,{new:true})
        return updatedTransaction
      } catch (error) {
        console.error("Error getting transactions:",error)
        throw new Error("error getting transactions")
      }
    },
    deleteTransaction:async(_,{transactionId},)=>{
      try {
        const deletedTransaction=await Transaction.findByIdAndDelete(transactionId)
        return deletedTransaction;
      } catch (error) {
        console.error("Error deleting transactions:",error)
        throw new Error("error deleting transactions")
      }
    }
  },
};
export default transactionResolver;
