import Image from 'next/image'
import Link from 'next/link';

export default function Home() {
  return (
    <main className='mx-auto max-w-xl p-16'>
      <Link href='/plain'>Plain text</Link>
    </main>
  )
}
