import { NextRequest, NextResponse } from 'next/server';

// Example daily challenges (rotate by date)
const challenges = [
  {
    date: '2025-05-27',
    title: 'FizzBuzz Function',
    description: 'Write a function that prints numbers from 1 to 100. For multiples of 3, print "Fizz"; for multiples of 5, print "Buzz"; for multiples of both, print "FizzBuzz".'
  },
  {
    date: '2025-05-28',
    title: 'Palindrome Checker',
    description: 'Write a function to check if a given string is a palindrome.'
  },
  {
    date: '2025-05-29',
    title: 'Array Sum',
    description: 'Write a function that returns the sum of all elements in an array.'
  }
];

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);
  const challenge = challenges.find(c => c.date === today) || challenges[0];
  return NextResponse.json({ challenge });
}
