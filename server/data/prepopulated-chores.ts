// 50+ pre-populated household chores with realistic payment amounts
// Payment amounts are designed to be proportional to effort and time required
// Time windows: Morning (6-9am), Afternoon (3-6pm), Evening (6-9pm), Anytime (0-23)
// Difficulty: easy (simple tasks), medium (moderate effort), hard (challenging tasks)

export interface PrePopulatedChore {
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  choreType: 'shared' | 'individual';
  basePayment: number; // base amount, will be adjusted based on total pocket money
  startHour: number; // 0-23, start of time window
  endHour: number; // 0-23, end of time window
  difficulty: 'easy' | 'medium' | 'hard';
}

export const prePopulatedChores: PrePopulatedChore[] = [
  // Daily Individual Chores (personal responsibility) - MORNING (6-9am)
  { title: "Make Your Bed", description: "Straighten sheets, arrange pillows, and tidy your bed", frequency: "daily", choreType: "individual", basePayment: 0.50, startHour: 6, endHour: 9, difficulty: "easy" },
  { title: "Brush Teeth (Morning)", description: "Brush teeth thoroughly in the morning", frequency: "daily", choreType: "individual", basePayment: 0.25, startHour: 6, endHour: 9, difficulty: "easy" },
  { title: "Put Dirty Clothes in Hamper", description: "Place all dirty clothes in the laundry hamper", frequency: "daily", choreType: "individual", basePayment: 0.25, startHour: 6, endHour: 9, difficulty: "easy" },
  { title: "Tidy Your Bedroom", description: "Pick up toys, books, and keep room organized", frequency: "daily", choreType: "individual", basePayment: 0.75, startHour: 6, endHour: 9, difficulty: "easy" },
  { title: "Pack Your School Bag", description: "Prepare and pack school bag for the next day", frequency: "daily", choreType: "individual", basePayment: 0.50, startHour: 6, endHour: 9, difficulty: "easy" },
  
  // Daily Individual Chores - AFTERNOON (3-6pm)
  { title: "Hang Up Your Coat", description: "Hang coat and put away shoes when coming home", frequency: "daily", choreType: "individual", basePayment: 0.25, startHour: 15, endHour: 18, difficulty: "easy" },
  { title: "Complete Homework", description: "Finish all assigned homework before playtime", frequency: "daily", choreType: "individual", basePayment: 1.00, startHour: 15, endHour: 18, difficulty: "medium" },
  
  // Daily Individual Chores - EVENING (6-9pm)
  { title: "Feed Your Pet", description: "Feed and provide fresh water for your pet", frequency: "daily", choreType: "individual", basePayment: 0.75, startHour: 18, endHour: 21, difficulty: "easy" },
  { title: "Brush Teeth (Night)", description: "Brush teeth thoroughly before bed", frequency: "daily", choreType: "individual", basePayment: 0.25, startHour: 19, endHour: 21, difficulty: "easy" },
  
  // Daily Shared Chores - MORNING (6-9am)
  { title: "Clear Breakfast Table", description: "Remove dishes and wipe down table after breakfast", frequency: "daily", choreType: "shared", basePayment: 0.75, startHour: 6, endHour: 9, difficulty: "easy" },
  { title: "Load Dishwasher (Breakfast)", description: "Load breakfast dishes into dishwasher", frequency: "daily", choreType: "shared", basePayment: 1.00, startHour: 6, endHour: 9, difficulty: "easy" },
  { title: "Wipe Kitchen Counters (Morning)", description: "Clean and wipe down kitchen countertops after breakfast", frequency: "daily", choreType: "shared", basePayment: 0.75, startHour: 6, endHour: 9, difficulty: "easy" },
  { title: "Sweep Kitchen Floor (Morning)", description: "Sweep the kitchen floor after breakfast", frequency: "daily", choreType: "shared", basePayment: 0.75, startHour: 6, endHour: 9, difficulty: "easy" },
  
  // Daily Shared Chores - AFTERNOON (3-6pm)
  { title: "Bring in the Mail", description: "Collect mail from mailbox and bring inside", frequency: "daily", choreType: "shared", basePayment: 0.50, startHour: 15, endHour: 18, difficulty: "easy" },
  { title: "Water Indoor Plants", description: "Water all indoor plants as needed", frequency: "daily", choreType: "shared", basePayment: 0.50, startHour: 15, endHour: 18, difficulty: "easy" },
  { title: "Tidy Living Room", description: "Pick up items and straighten living room", frequency: "daily", choreType: "shared", basePayment: 1.00, startHour: 15, endHour: 18, difficulty: "easy" },
  
  // Daily Shared Chores - EVENING (6-9pm)
  { title: "Set the Table", description: "Set plates, utensils, and napkins for dinner", frequency: "daily", choreType: "shared", basePayment: 1.00, startHour: 17, endHour: 20, difficulty: "easy" },
  { title: "Clear the Dinner Table", description: "Remove dishes and wipe down table after dinner", frequency: "daily", choreType: "shared", basePayment: 1.00, startHour: 18, endHour: 21, difficulty: "easy" },
  { title: "Load the Dishwasher (Dinner)", description: "Load dirty dishes into dishwasher after dinner", frequency: "daily", choreType: "shared", basePayment: 1.25, startHour: 18, endHour: 21, difficulty: "easy" },
  { title: "Unload the Dishwasher", description: "Put away clean dishes and utensils", frequency: "daily", choreType: "shared", basePayment: 1.25, startHour: 18, endHour: 21, difficulty: "medium" },
  { title: "Wipe Kitchen Counters (Evening)", description: "Clean and wipe down all kitchen countertops after dinner", frequency: "daily", choreType: "shared", basePayment: 0.75, startHour: 18, endHour: 21, difficulty: "easy" },
  { title: "Sweep Kitchen Floor (Evening)", description: "Sweep the kitchen floor after dinner", frequency: "daily", choreType: "shared", basePayment: 1.00, startHour: 18, endHour: 21, difficulty: "easy" },
  { title: "Take Out Kitchen Trash", description: "Empty kitchen trash and replace with new bag", frequency: "daily", choreType: "shared", basePayment: 0.75, startHour: 18, endHour: 21, difficulty: "easy" },
  
  // Weekly Individual Chores - ANYTIME
  { title: "Change Your Bed Sheets", description: "Remove and replace bed sheets and pillowcases", frequency: "weekly", choreType: "individual", basePayment: 2.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Organize Your Closet", description: "Arrange clothes and shoes neatly in closet", frequency: "weekly", choreType: "individual", basePayment: 2.50, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Dust Your Bedroom", description: "Dust all surfaces in your bedroom", frequency: "weekly", choreType: "individual", basePayment: 1.50, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Vacuum Your Bedroom", description: "Vacuum or sweep your bedroom floor", frequency: "weekly", choreType: "individual", basePayment: 2.00, startHour: 0, endHour: 23, difficulty: "medium" },
  
  // Weekly Shared Chores - ANYTIME
  { title: "Vacuum Living Areas", description: "Vacuum all carpeted living areas in the house", frequency: "weekly", choreType: "shared", basePayment: 3.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Mop Hard Floors", description: "Mop kitchen, bathroom, and hallway floors", frequency: "weekly", choreType: "shared", basePayment: 3.50, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Clean Bathroom Mirror", description: "Clean and polish bathroom mirrors", frequency: "weekly", choreType: "shared", basePayment: 1.50, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Clean Bathroom Sink", description: "Scrub and clean bathroom sink and faucet", frequency: "weekly", choreType: "shared", basePayment: 2.00, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Clean Toilet", description: "Clean and sanitize toilet bowl and seat", frequency: "weekly", choreType: "shared", basePayment: 2.50, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Clean Bathtub/Shower", description: "Scrub bathtub or shower walls and floor", frequency: "weekly", choreType: "shared", basePayment: 3.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Dust Living Room", description: "Dust all furniture and surfaces in living room", frequency: "weekly", choreType: "shared", basePayment: 2.00, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Dust Dining Room", description: "Dust dining table, chairs, and other surfaces", frequency: "weekly", choreType: "shared", basePayment: 1.50, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Clean Windows (Interior)", description: "Clean inside of windows throughout the house", frequency: "weekly", choreType: "shared", basePayment: 3.50, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Organize Entryway", description: "Tidy shoes, coats, and organize entryway area", frequency: "weekly", choreType: "shared", basePayment: 1.50, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Take Out All Trash Bins", description: "Empty all trash bins in house and replace bags", frequency: "weekly", choreType: "shared", basePayment: 2.00, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Take Out Recycling", description: "Sort and take recycling to curb or bin", frequency: "weekly", choreType: "shared", basePayment: 2.00, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Wipe Down Light Switches", description: "Clean light switches and door handles", frequency: "weekly", choreType: "shared", basePayment: 1.00, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Organize Pantry", description: "Straighten and organize pantry shelves", frequency: "weekly", choreType: "shared", basePayment: 2.50, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Clean Microwave", description: "Clean inside and outside of microwave", frequency: "weekly", choreType: "shared", basePayment: 2.00, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Wipe Down Appliances", description: "Clean exterior of refrigerator, stove, dishwasher", frequency: "weekly", choreType: "shared", basePayment: 2.00, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Water Outdoor Plants", description: "Water garden, lawn, or outdoor plants", frequency: "weekly", choreType: "shared", basePayment: 2.50, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Sweep Garage", description: "Sweep garage floor and organize items", frequency: "weekly", choreType: "shared", basePayment: 2.50, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Wash Family Car", description: "Wash and dry the family car", frequency: "weekly", choreType: "shared", basePayment: 5.00, startHour: 0, endHour: 23, difficulty: "hard" },
  
  // Monthly Shared Chores (bigger tasks) - ANYTIME
  { title: "Clean Out Refrigerator", description: "Remove expired items and wipe down shelves", frequency: "monthly", choreType: "shared", basePayment: 4.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Deep Clean Oven", description: "Clean inside of oven thoroughly", frequency: "monthly", choreType: "shared", basePayment: 5.00, startHour: 0, endHour: 23, difficulty: "hard" },
  { title: "Organize Garage", description: "Organize and tidy garage space", frequency: "monthly", choreType: "shared", basePayment: 6.00, startHour: 0, endHour: 23, difficulty: "hard" },
  { title: "Clean Baseboards", description: "Wipe down baseboards throughout the house", frequency: "monthly", choreType: "shared", basePayment: 4.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Wash Windows (Exterior)", description: "Clean outside of windows", frequency: "monthly", choreType: "shared", basePayment: 5.00, startHour: 0, endHour: 23, difficulty: "hard" },
  { title: "Clean Ceiling Fans", description: "Dust and clean all ceiling fan blades", frequency: "monthly", choreType: "shared", basePayment: 3.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Organize Toy Room", description: "Sort, organize, and donate unused toys", frequency: "monthly", choreType: "shared", basePayment: 4.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Vacuum Under Furniture", description: "Move furniture and vacuum underneath", frequency: "monthly", choreType: "shared", basePayment: 4.00, startHour: 0, endHour: 23, difficulty: "hard" },
  { title: "Clean Air Vents", description: "Dust and wipe air vents and returns", frequency: "monthly", choreType: "shared", basePayment: 3.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Mow the Lawn", description: "Mow grass in front and back yard", frequency: "monthly", choreType: "shared", basePayment: 8.00, startHour: 0, endHour: 23, difficulty: "hard" },
  { title: "Rake Leaves", description: "Rake and bag leaves from yard", frequency: "monthly", choreType: "shared", basePayment: 6.00, startHour: 0, endHour: 23, difficulty: "hard" },
  { title: "Weed Garden Beds", description: "Pull weeds from garden and flower beds", frequency: "monthly", choreType: "shared", basePayment: 5.00, startHour: 0, endHour: 23, difficulty: "medium" },
  { title: "Organize Linen Closet", description: "Fold and organize towels and linens", frequency: "monthly", choreType: "shared", basePayment: 3.00, startHour: 0, endHour: 23, difficulty: "easy" },
  { title: "Clean Out Car Interior", description: "Vacuum and clean inside of family car", frequency: "monthly", choreType: "shared", basePayment: 4.00, startHour: 0, endHour: 23, difficulty: "medium" },
];
