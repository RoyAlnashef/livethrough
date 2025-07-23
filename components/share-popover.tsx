"use client"

import React, { useState } from "react"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import {
  Share,
  Facebook,
  Twitter,
  Mail,
  MessageSquare,
  Copy as CopyIcon,
} from "lucide-react"

interface SharePopoverProps {
  courseUrl: string
  courseTitle: string
  variant?: "default" | "secondary" | "outline" | "ghost" | "link"
}

export function SharePopover({ courseUrl, courseTitle, variant = "outline" }: SharePopoverProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(courseUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Social share links
  const encodedUrl = encodeURIComponent(courseUrl)
  const encodedTitle = encodeURIComponent(courseTitle)
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`
  const emailUrl = `mailto:?subject=${encodedTitle}&body=Check out this course: ${courseUrl}`
  const smsUrl = `sms:?&body=Check out this course: ${courseUrl}`

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={variant} className="border-zinc-600 text-teal-500 hover:text-teal-400 hover:bg-zinc-800">
          <Share className="h-4 w-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="p-0 w-80 max-w-full bg-zinc-900 border-zinc-800">
        <Card className="bg-zinc-900 border-none shadow-none py-0">

          <CardContent className="p-4">
            <div className="mb-2 text-zinc-300 font-medium text-sm">Course URL</div>
            <div className="flex items-center gap-2 mb-4">
              <Input
                value={courseUrl}
                readOnly
                className="bg-zinc-800 border-zinc-700 text-zinc-200 text-sm pr-10"
                style={{ fontFamily: 'monospace' }}
              />
              <Button
                size="icon"
                variant="ghost"
                className="text-zinc-400 hover:text-white"
                onClick={handleCopy}
                aria-label="Copy URL"
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
              {copied && <span className="text-xs text-teal-400 ml-1">Copied!</span>}
            </div>
            <Separator className="my-4 bg-zinc-800" />
            <div className="mb-2 text-zinc-300 font-medium text-sm">Share on social media</div>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <Button asChild variant="outline" className="justify-start gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer">
                  <Facebook className="h-4 w-4" /> Facebook
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer">
                  <Twitter className="h-4 w-4" /> Twitter
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                <a href={emailUrl}>
                  <Mail className="h-4 w-4" /> Email
                </a>
              </Button>
              <Button asChild variant="outline" className="justify-start gap-2 bg-zinc-800 border-zinc-700 text-zinc-200 hover:bg-zinc-700">
                <a href={smsUrl}>
                  <MessageSquare className="h-4 w-4" /> SMS
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
} 