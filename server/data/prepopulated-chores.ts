// 50+ pre-populated household chores with realistic payment amounts
// Payment amounts are designed to be proportional to effort and time required

export interface PrePopulatedChore {
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  choreType: 'shared' | 'individual';
  basePayment: number; // base amount, will be adjusted based on total pocket money
}

export const prePopulatedChores: PrePopulatedChore[] = [
  // Daily Individual Chores (personal responsibility)
  { title: "Make Your Bed", description: "Straighten sheets, arrange pillows, and tidy your bed", frequency: "daily", choreType: "individual", basePayment: 0.50 },
  { title: "Brush Teeth (Morning & Night)", description: "Brush teeth thoroughly twice a day", frequency: "daily", choreType: "individual", basePayment: 0.25 },
  { title: "Put Dirty Clothes in Hamper", description: "Place all dirty clothes in the laundry hamper", frequency: "daily", choreType: "individual", basePayment: 0.25 },
  { title: "Tidy Your Bedroom", description: "Pick up toys, books, and keep room organized", frequency: "daily", choreType: "individual", basePayment: 0.75 },
  { title: "Pack Your School Bag", description: "Prepare and pack school bag for the next day", frequency: "daily", choreType: "individual", basePayment: 0.50 },
  { title: "Hang Up Your Coat", description: "Hang coat and put away shoes when coming home", frequency: "daily", choreType: "individual", basePayment: 0.25 },
  { title: "Feed Your Pet", description: "Feed and provide fresh water for your pet", frequency: "daily", choreType: "individual", basePayment: 0.75 },
  { title: "Complete Homework", description: "Finish all assigned homework before playtime", frequency: "daily", choreType: "individual", basePayment: 1.00 },
  
  // Daily Shared Chores (first come, first served)
  { title: "Set the Table", description: "Set plates, utensils, and napkins for dinner", frequency: "daily", choreType: "shared", basePayment: 1.00 },
  { title: "Clear the Table", description: "Remove dishes and wipe down table after meals", frequency: "daily", choreType: "shared", basePayment: 1.00 },
  { title: "Load the Dishwasher", description: "Load dirty dishes into dishwasher properly", frequency: "daily", choreType: "shared", basePayment: 1.25 },
  { title: "Unload the Dishwasher", description: "Put away clean dishes and utensils", frequency: "daily", choreType: "shared", basePayment: 1.25 },
  { title: "Wipe Kitchen Counters", description: "Clean and wipe down all kitchen countertops", frequency: "daily", choreType: "shared", basePayment: 0.75 },
  { title: "Sweep Kitchen Floor", description: "Sweep the kitchen floor to remove crumbs and dirt", frequency: "daily", choreType: "shared", basePayment: 1.00 },
  { title: "Take Out Kitchen Trash", description: "Empty kitchen trash and replace with new bag", frequency: "daily", choreType: "shared", basePayment: 0.75 },
  { title: "Water Indoor Plants", description: "Water all indoor plants as needed", frequency: "daily", choreType: "shared", basePayment: 0.50 },
  { title: "Bring in the Mail", description: "Collect mail from mailbox and bring inside", frequency: "daily", choreType: "shared", basePayment: 0.50 },
  { title: "Tidy Living Room", description: "Pick up items and straighten living room", frequency: "daily", choreType: "shared", basePayment: 1.00 },
  
  // Weekly Individual Chores
  { title: "Change Your Bed Sheets", description: "Remove and replace bed sheets and pillowcases", frequency: "weekly", choreType: "individual", basePayment: 2.00 },
  { title: "Organize Your Closet", description: "Arrange clothes and shoes neatly in closet", frequency: "weekly", choreType: "individual", basePayment: 2.50 },
  { title: "Dust Your Bedroom", description: "Dust all surfaces in your bedroom", frequency: "weekly", choreType: "individual", basePayment: 1.50 },
  { title: "Vacuum Your Bedroom", description: "Vacuum or sweep your bedroom floor", frequency: "weekly", choreType: "individual", basePayment: 2.00 },
  
  // Weekly Shared Chores
  { title: "Vacuum Living Areas", description: "Vacuum all carpeted living areas in the house", frequency: "weekly", choreType: "shared", basePayment: 3.00 },
  { title: "Mop Hard Floors", description: "Mop kitchen, bathroom, and hallway floors", frequency: "weekly", choreType: "shared", basePayment: 3.50 },
  { title: "Clean Bathroom Mirror", description: "Clean and polish bathroom mirrors", frequency: "weekly", choreType: "shared", basePayment: 1.50 },
  { title: "Clean Bathroom Sink", description: "Scrub and clean bathroom sink and faucet", frequency: "weekly", choreType: "shared", basePayment: 2.00 },
  { title: "Clean Toilet", description: "Clean and sanitize toilet bowl and seat", frequency: "weekly", choreType: "shared", basePayment: 2.50 },
  { title: "Clean Bathtub/Shower", description: "Scrub bathtub or shower walls and floor", frequency: "weekly", choreType: "shared", basePayment: 3.00 },
  { title: "Dust Living Room", description: "Dust all furniture and surfaces in living room", frequency: "weekly", choreType: "shared", basePayment: 2.00 },
  { title: "Dust Dining Room", description: "Dust dining table, chairs, and other surfaces", frequency: "weekly", choreType: "shared", basePayment: 1.50 },
  { title: "Clean Windows (Interior)", description: "Clean inside of windows throughout the house", frequency: "weekly", choreType: "shared", basePayment: 3.50 },
  { title: "Organize Entryway", description: "Tidy shoes, coats, and organize entryway area", frequency: "weekly", choreType: "shared", basePayment: 1.50 },
  { title: "Take Out All Trash Bins", description: "Empty all trash bins in house and replace bags", frequency: "weekly", choreType: "shared", basePayment: 2.00 },
  { title: "Take Out Recycling", description: "Sort and take recycling to curb or bin", frequency: "weekly", choreType: "shared", basePayment: 2.00 },
  { title: "Wipe Down Light Switches", description: "Clean light switches and door handles", frequency: "weekly", choreType: "shared", basePayment: 1.00 },
  { title: "Organize Pantry", description: "Straighten and organize pantry shelves", frequency: "weekly", choreType: "shared", basePayment: 2.50 },
  { title: "Clean Microwave", description: "Clean inside and outside of microwave", frequency: "weekly", choreType: "shared", basePayment: 2.00 },
  { title: "Wipe Down Appliances", description: "Clean exterior of refrigerator, stove, dishwasher", frequency: "weekly", choreType: "shared", basePayment: 2.00 },
  { title: "Water Outdoor Plants", description: "Water garden, lawn, or outdoor plants", frequency: "weekly", choreType: "shared", basePayment: 2.50 },
  { title: "Sweep Garage", description: "Sweep garage floor and organize items", frequency: "weekly", choreType: "shared", basePayment: 2.50 },
  { title: "Wash Family Car", description: "Wash and dry the family car", frequency: "weekly", choreType: "shared", basePayment: 5.00 },
  
  // Monthly Shared Chores (bigger tasks)
  { title: "Clean Out Refrigerator", description: "Remove expired items and wipe down shelves", frequency: "monthly", choreType: "shared", basePayment: 4.00 },
  { title: "Deep Clean Oven", description: "Clean inside of oven thoroughly", frequency: "monthly", choreType: "shared", basePayment: 5.00 },
  { title: "Organize Garage", description: "Organize and tidy garage space", frequency: "monthly", choreType: "shared", basePayment: 6.00 },
  { title: "Clean Baseboards", description: "Wipe down baseboards throughout the house", frequency: "monthly", choreType: "shared", basePayment: 4.00 },
  { title: "Wash Windows (Exterior)", description: "Clean outside of windows", frequency: "monthly", choreType: "shared", basePayment: 5.00 },
  { title: "Clean Ceiling Fans", description: "Dust and clean all ceiling fan blades", frequency: "monthly", choreType: "shared", basePayment: 3.00 },
  { title: "Organize Toy Room", description: "Sort, organize, and donate unused toys", frequency: "monthly", choreType: "shared", basePayment: 4.00 },
  { title: "Vacuum Under Furniture", description: "Move furniture and vacuum underneath", frequency: "monthly", choreType: "shared", basePayment: 4.00 },
  { title: "Clean Air Vents", description: "Dust and wipe air vents and returns", frequency: "monthly", choreType: "shared", basePayment: 3.00 },
  { title: "Mow the Lawn", description: "Mow grass in front and back yard", frequency: "monthly", choreType: "shared", basePayment: 8.00 },
  { title: "Rake Leaves", description: "Rake and bag leaves from yard", frequency: "monthly", choreType: "shared", basePayment: 6.00 },
  { title: "Weed Garden Beds", description: "Pull weeds from garden and flower beds", frequency: "monthly", choreType: "shared", basePayment: 5.00 },
  { title: "Organize Linen Closet", description: "Fold and organize towels and linens", frequency: "monthly", choreType: "shared", basePayment: 3.00 },
  { title: "Clean Out Car Interior", description: "Vacuum and clean inside of family car", frequency: "monthly", choreType: "shared", basePayment: 4.00 },
];
