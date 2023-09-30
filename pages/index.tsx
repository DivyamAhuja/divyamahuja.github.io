import type { NextPage } from 'next'
import Head from 'next/head'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faDev, faTwitter, faGitlab, faHashnode } from '@fortawesome/free-brands-svg-icons'
import { faEnvelope, faFile, faFileLines, faSquareFull } from '@fortawesome/free-solid-svg-icons'
import Link from 'next/link'


const Links = [
  {
    url: "https://github.com/DivyamAhuja",
    icon: faGithub
  },
  {
    url: "https://blog.divyam.dev",
    icon: faHashnode
  },
  {
    url: "https://twitter.com/ahujadivyam",
    icon: faTwitter
  },
  {
    url: "https://gitlab.com/DivyamAhuja",
    icon: faGitlab
  },
  {
    url: "mailto:ahujadivyam@gmail.com",
    icon: faEnvelope
  },
  {
    url: "/Divyam_Resume.pdf",
    icon: faFileLines
  }
]

const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Divyam Ahuja</title>
        <meta name="description" content="Divyam Ahuja Portfolio" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className=" w-screen h-screen absolute top-0 left-0 bg-[color:#111] -z-50">
      </div>
      <main className=" flex flex-1 min-h-screen justify-center items-center flex-col ">
        <div className=" w-36 h-36 m-3 bg-contain rounded-full bg-[url('https://avatars.githubusercontent.com/u/39771050?v=4')]" />
        <h1 className=" text-transparent bg-clip-text bg-gradient-to-r from-[#ff004a] to-[#ff00a6] md:text-6xl text-4xl font-extrabold py-2">
          I&apos;m Divyam Ahuja
        </h1>
        <h2 className=" text-transparent bg-clip-text bg-gradient-to-r from-[#ff004a] to-[#ff00a6] md:text-3xl text-2xl font-bold my-1 text-center">
          FullStack Alchemist &middot; I Code Stuff &amp; Watch Anime. 
        </h2>
        <div className=" flex my-4">
          {
            Links.map(({ url, icon }) => (
              <Link href={url} key="url">
                <a target={"_blank"}><FontAwesomeIcon icon={icon} className=" text-[#ff3c74] text-4xl mx-2" /></a>
              </Link>
            ))
          }


        </div>
      </main>
    </>
  )
}

export default Home
