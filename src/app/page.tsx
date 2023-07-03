'use client'
import { useEffect } from "react"
import Card from "./components/Card"
import Header from "./components/Header"
import { writeContract } from "../../scripts/deploy"

export default function Home() {
  useEffect(() => {
    const contract = writeContract()
    console.log(['connect to metamask', contract]);
  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-12">
      <Header />
      <div>
        <Card />
      </div>

      <footer className="mb-32 grid text-center lg:mb-0 lg:grid-cols-1 lg:text-left">&copy;&lt;sanjana-vajr /&gt;
      </footer>
    </main>
  )
}
