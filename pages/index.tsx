import Head from 'next/head'
import React, { useState } from 'react'
import formatOutput from '../lib/format';
import { AiOutlineSound, AiFillSound } from 'react-icons/ai';

export default function Home() {
  const [article, setArticle] = useState('');
  const [token, setToken] = useState<number>(50);
  const [outPut, setOutPut] = useState('Output will show here')
  const [fetchLoading, setIsFetchLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false)

  const speak = () => {
    setSpeaking(true)
    const synth = window.speechSynthesis
    const uttrance = new SpeechSynthesisUtterance(outPut);

    uttrance.onend = (e) => setSpeaking(false);

    synth.speak(uttrance);
  }

  const submitHandle = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFetchLoading(true)

    try {
      const response = await fetch("api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({article: article, token: token})
      })
      const data = await response.json();
      if (data.status === 'success')  {
        setOutPut(formatOutput(data.result));
      }
      setIsFetchLoading(false)
      setArticle('');

    } catch (error) {
      console.log(error)
      setIsFetchLoading(false)
    }

  }

  return (
    <div className="mx-auto max-w-5xl mt-5">
      <Head>
        <title>Get summaries quick with AbridgeAI</title>
        <meta content='' />
      </Head>
      <header>
        <div>
          <h1 className="text-7xl">Abrigde AI</h1>
          <p className="">Powered By <a href="https://openai.com/" target="_blank" rel="noreferrer" className='font-bold font-sans'>Open AI</a></p>
        </div>
        <div>
          
        </div>
      </header>
      <main className="my-5 py-5">
        <form onSubmit={(e) => submitHandle(e)}>
          <textarea name="article" onChange={(e) => setArticle(e.target.value)} className="w-full h-52 resize-none bg-inherit border-2 border-white p-3 rounded-lg" placeholder="Enter the Text you wish to summarize" />
          <div className="mt-2 p-1 bg-white text-black rounded-lg flex">
            <div className='p-3 border-2 border-black rounded-md'>
              <label>Max: </label>
              <select value={token} name="token" className="bg-inherit outline-none" onChange={(e) => setToken(parseInt(e.target.value))}>
                <option value="50">50 Words</option>
                <option value="100">100 Words</option>
                <option value="150">150 Words</option>
                <option value="200">200 Words</option>
                <option value="250">250 Words</option>
              </select>
            </div>
            <button className="flex-auto">{fetchLoading ? `Waiting...` : `Summarize`}</button>
          </div>
        </form>
        <div className="mt-5 p-2 text-white border-2 border-white rounded-xl">
          <div className='flex gap-2'>
            <p className="p-3 w-24 bg-white text-black rounded-md">Summary</p>
            <div className='p-3 text-lg flex items-center justify-center bg-white text-black rounded-md cursor-pointer' onClick={speak}>{speaking ? <AiFillSound /> : <AiOutlineSound />}</div>
          </div>
          <div className="h-24 my-2">{outPut}</div>
        </div>
      </main>
      <footer>
        <p>Designed By <a href="https://twitter.com/AdewaleSylvest1" target="_blank" rel="noreferrer" className='font-bold'>@Techvester</a></p>
      </footer>
    </div>
  )
}
