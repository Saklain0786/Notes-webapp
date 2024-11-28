import React from 'react' 
import { GoogleGeminiEffectDesign } from '../../components/GoogleGeminiEffect'
import { HeroScrollDesign } from '../../components/ScrollDemo'
import { WobbleCardDesign } from '../../components/WoobleCard'
import {Helmet} from "react-helmet";

const Home = () => {
  return (
    <>
    <Helmet>
  <title>Home - Notes Saver</title>
  <meta   name="description"  content="Welcome to Notes Saver, your go-to platform for managing and saving your notes efficiently." />
  <meta  name="keywords" content="Notes Saver, Home, Notes Management, Save Notes, Organize Notes" />
  <meta name="author" content="Notes Saver Team" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
 
  <meta property="og:type" content="website" />
  <meta property="og:title" content="Home - Notes Saver" />
  <meta   property="og:description"  content="Welcome to Notes Saver, your go-to platform for managing and saving your notes efficiently."/>
  <meta property="og:image" content="./logo.png" />
  <meta
    property="og:url"
    content="https://noteswebapp-rust.vercel.app/"
  />
  <meta property="og:site_name" content="Notes Saver" />
</Helmet>

    <div className="min-h-screen bg-slate-100 dark:bg-gray-950 space-y-12 pb-12">
      <GoogleGeminiEffectDesign/> 
      <HeroScrollDesign title2={'Collaborate & Improve'} title1={'Join groups and enhance your notes together.'} img={'https://res.cloudinary.com/dbqq41bpc/image/upload/v1723419754/codesaarthi/7_tptucc.png'}/>
      <div className="p-1">
      <WobbleCardDesign/>
      </div>
     
    </div> 
    </>
  )
}

export default Home