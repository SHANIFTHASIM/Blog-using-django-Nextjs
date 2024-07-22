import Image from "next/image"
import Link from "next/link"

const Footer = () => {
  return (
    <div className="mt-12 px-5 py-0 flex flex-col md:flex-row justify-between items-center text-gray-600 gap-12">
      
      <div className="flex-1 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <Image src="/gmail.png" alt="logo" width={50} height={50} />
          <h1 className="font-light">Blog</h1>
        </div>

        <p className="font-light">
          And this is the description which may feel discomfort, but believe me you will one day. Things get scarier, more tough, more realistic, more drama, but suit yourself in preferred situation.
        </p>

        <div className="mt-3 flex gap-3 mb-3">
          <Image src="/discord.jpeg" alt="discord" width={50} height={30} />
          <Image src="/fb.png" alt="fb" width={34} height={24} />
          <Image src="/gmail.png" alt="gmail" width={24} height={24} />
          <Image src="/skype.png" alt="skype" width={24} height={24} />
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row justify-end gap-12 md:gap-24 w-full sm:text-sm">
        <div className="flex flex-col gap-3 font-light">
          <span className="font-bold">Links</span>
          <Link href="/">Homepage</Link>
          <Link href="/">Blog</Link>
          <Link href="/">About</Link>
          <Link href="/">Contact</Link>
        </div>

        <div className="flex flex-col gap-3 font-light">
          <span className="font-bold">Tags</span>
          <Link href="/">Style</Link>
          <Link href="/">Fashion</Link>
          <Link href="/">Coding</Link>
          <Link href="/">Travel</Link>
        </div>

        <div className="flex flex-col gap-3 font-light">
          <span className="font-bold">Social</span>
          <Link href="/">Facebook</Link>
          <Link href="/">Instagram</Link>
          <Link href="/">Tiktok</Link>
          <Link href="/">Youtube</Link>
        </div>
      </div>
    </div>
  )
}

export default Footer

