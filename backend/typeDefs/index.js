import {mergeResolvers} from '@graphql-tools/merge'
import userTypeDef from './user.typeDef.js'
import transactionTypeDef from './transaction.typeDef.js'

const mergedTypeDefs=mergeResolvers(userTypeDef,transactionTypeDef)

export default mergedTypeDefs