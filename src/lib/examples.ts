// Pretend boards so the site doesn't look empty on day one.
// They're added once, the first time the database is created.
export const exampleBoards = [
  { id: "big-blue", name: "Big Blue", blurb: "A few dings, loves small days.", readyToRide: true, lengthFt: 8, town: "Huntington Beach", daysAgo: 3, color: "#3b82c4" },
  { id: "sunny", name: "Sunny", blurb: "Perfect first board for a kid.", readyToRide: true, lengthFt: 7, town: "Costa Mesa", daysAgo: 1, color: "#f2c94c" },
  { id: "old-red", name: "Old Red", blurb: "Snapped tail. Great foam for a shaper.", readyToRide: false, lengthFt: 9, town: "San Clemente", daysAgo: 12, color: "#e5674e" },
];
