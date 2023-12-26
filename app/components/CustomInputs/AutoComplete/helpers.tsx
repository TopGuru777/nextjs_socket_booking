import { RxDatabase } from "rxdb"

/**
 * 
 * @param text search string
 * @param db rxdb instance
 * @returns suggestons
 */

export const getCustomerSuggestions = async (text: string, db: RxDatabase | null) => {
  /*
  const suggestions = await db?.collections.customers.find({
    selector: {
      $or: [
        { phone: { $regex: `${text}` } },
        { first_name: { $regex: `${text}` } },
        { last_name: { $regex: `${text}` } }
      ]
    }
  }).exec();
  */

  const lowerCasedText = text.toLowerCase();
  const allCustomers: any[] = await db?.collections.customers.find().exec() ?? [];
  let suggestions: any[] = [];
  allCustomers.forEach(customer => {
    if (customer.phone.toLowerCase().includes(lowerCasedText) ||
      `${customer.first_name} ${customer.last_name}`.toLowerCase().includes(lowerCasedText))
      suggestions.push(customer);
  });

  return suggestions;
}