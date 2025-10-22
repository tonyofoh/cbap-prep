"use client"

import { Coffee } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full py-6 border-t bg-background">
      <div className="container flex items-center justify-between px-4 mx-auto max-w-4xl">
        <div className="flex items-center gap-4">
          <div className="relative group">
            <img 
              src="/qr-code.png" 
              alt="Buy me a coffee QR code" 
              className="w-12 h-12 transition-transform cursor-pointer hover:scale-[3] hover:z-10 origin-bottom-left"
            />

          </div>
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} All rights reserved
          </p>
        </div>
        <a
          href="https://www.buymeacoffee.com/tonyofoh"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 font-medium transition-all rounded-full bg-[#FFDD00] hover:bg-[#FFDD00]/90 text-black border-2 border-black hover:shadow-[2px_2px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]"
        >
          <Coffee className="w-4 h-4" />
          <span className="font-['Cookie',_cursive] text-lg">Buy me a coffee</span>
        </a>
      </div>
    </footer>
  )
}