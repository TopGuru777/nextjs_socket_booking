import { RxDatabase } from "rxdb"

/**
 * 
 * @param text search string
 * @param db rxdb instance
 * @returns suggestons
 */

export const getCustomerSuggestions = async (text: string, db: RxDatabase | null) => {
  const suggestions = await db?.collections.customers.find({
    selector: {
      $or: [
        { phone: { $regex: `${text}` } },
        { first_name: { $regex: `${text}` } },
        { last_name: { $regex: `${text}` } }
      ]
    }
  }).exec();
  return suggestions;
}