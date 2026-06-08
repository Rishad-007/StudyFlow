import { useMemo } from 'react'
import { Quote } from 'lucide-react'

const QUOTES = [
  { text: 'The secret of getting ahead is getting started.', author: 'Mark Twain' },
  {
    text: 'Study hard what interests you the most in the most undisciplined, irreverent and original manner possible.',
    author: 'Richard Feynman',
  },
  {
    text: 'The beautiful thing about learning is that nobody can take it away from you.',
    author: 'B.B. King',
  },
  {
    text: 'Education is the most powerful weapon which you can use to change the world.',
    author: 'Nelson Mandela',
  },
  {
    text: 'Tell me and I forget. Teach me and I remember. Involve me and I learn.',
    author: 'Benjamin Franklin',
  },
  { text: 'The mind is not a vessel to be filled, but a fire to be kindled.', author: 'Plutarch' },
  {
    text: 'Success is the sum of small efforts, repeated day in and day out.',
    author: 'Robert Collier',
  },
  { text: 'It does not matter how slowly you go as long as you do not stop.', author: 'Confucius' },
  {
    text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
    author: 'Dr. Seuss',
  },
  { text: 'Learning never exhausts the mind.', author: 'Leonardo da Vinci' },
  {
    text: 'For the things we have to learn before we can do them, we learn by doing them.',
    author: 'Aristotle',
  },
  { text: 'In learning you will teach, and in teaching you will learn.', author: 'Phil Collins' },
  {
    text: 'Study without desire spoils the memory, and it retains nothing that it takes in.',
    author: 'Leonardo da Vinci',
  },
  {
    text: 'The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.',
    author: 'Brian Herbert',
  },
  { text: 'What we learn with pleasure we never forget.', author: 'Alfred Mercier' },
]

export function MotivationalQuote() {
  const quote = useMemo(() => QUOTES[Math.floor(Math.random() * QUOTES.length)], [])

  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-indigo-50/50 p-6 shadow-sm">
      <div className="absolute -top-8 -right-2 font-serif text-[8rem] leading-none text-indigo-100/40 select-none">
        "
      </div>
      <Quote className="relative h-8 w-8 text-indigo-400" />
      <p className="relative mt-3 text-lg leading-relaxed font-medium text-gray-800">
        "{quote.text}"
      </p>
      <p className="relative mt-3 text-sm font-semibold text-indigo-600">— {quote.author}</p>
    </div>
  )
}
