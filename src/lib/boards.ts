// The shape of a board listing, and pretend boards so the site doesn't look empty.
// Real listings replace sampleBoards in a later step.
export type Board = {
  id: string;
  name: string;
  blurb: string;
  readyToRide: boolean;
  lengthFt: number;
  town: string;
  daysListed: number;
  color: string;
};

export const sampleBoards: Board[] = [
  { id: "big-blue", name: "Big Blue", blurb: "A few dings, loves small days.", readyToRide: true, lengthFt: 8, town: "Huntington Beach", daysListed: 3, color: "#3b82c4" },
  { id: "sunny", name: "Sunny", blurb: "Perfect first board for a kid.", readyToRide: true, lengthFt: 7, town: "Costa Mesa", daysListed: 1, color: "#f2c94c" },
  { id: "old-red", name: "Old Red", blurb: "Snapped tail. Great foam for a shaper.", readyToRide: false, lengthFt: 9, town: "San Clemente", daysListed: 12, color: "#e5674e" },
];
