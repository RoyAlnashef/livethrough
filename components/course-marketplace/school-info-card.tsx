import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { School, Phone, Mail, MapPin, Copy, Globe, Facebook, Twitter, Instagram, Youtube, Bookmark } from "lucide-react";
import { SharePopover } from "@/components/share-popover";
import React from "react";

interface School {
  id: string;
  name: string;
  description: string;
  website?: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  location?: string;
  facebook_url?: string;
  twitter_url?: string;
  instagram_url?: string;
  youtube_url?: string;
}

interface SchoolInfoCardProps {
  school: School | null;
  logoError: boolean;
  setLogoError: (val: boolean) => void;
  copiedAddress: boolean;
  setCopiedAddress: (val: boolean) => void;
  isAuthenticated: boolean;
  openAuthModal: (mode: 'signup' | 'login') => void;
  handleBookmark: () => void;
  bookmarksLoading: boolean;
  isBookmarked: boolean;
  course: { id?: string; title?: string } | null;
  variant: 'mobile' | 'desktop';
}

export const SchoolInfoCard: React.FC<SchoolInfoCardProps> = ({
  school,
  logoError,
  setLogoError,
  copiedAddress,
  setCopiedAddress,
  isAuthenticated,
  openAuthModal,
  handleBookmark,
  bookmarksLoading,
  isBookmarked,
  course,
  variant,
}) => {
  return (
    <div className={variant === 'mobile' ? 'block lg:hidden' : 'hidden lg:block'}>
      <Card className="bg-zinc-950 border-teal-600 border-4 rounded-2xl  p-0">
        <CardContent className="space-y-4 py-6">
          <div className="flex flex-row items-start gap-4 mb-4">
            {school?.logo_url && !logoError ? (
              <Image
                src={school.logo_url}
                alt={school.name || "School Logo"}
                width={80}
                height={80}
                className="rounded-sm"
                onError={() => setLogoError(true)}
              />
            ) : (
              <div className="flex items-center justify-center bg-zinc-800 rounded-lg" style={{ width: 80, height: 80 }}>
                <School className="w-12 h-12 text-zinc-400" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-zinc-100 mb-2">{school?.name || "School Name"}</h3>
              <p className="text-zinc-400 text-sm">{school?.description || "No school description available."}</p>
            </div>
          </div>
          <Separator className="bg-zinc-800" />
          <div className="flex items-center gap-3">
            <Phone className="h-4 w-4 text-zinc-400" />
            <span className="text-zinc-300">{school?.contact_phone || "N/A"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-zinc-400" />
            {school?.contact_email ? (
              <a href={`mailto:${school.contact_email}`} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors">{school.contact_email}</a>
            ) : <span className="text-zinc-300">N/A</span>}
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="h-4 w-4 text-zinc-400 mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <Input
                  value={school?.address || school?.location || "N/A"}
                  readOnly
                  className="bg-zinc-800 border-zinc-700 text-zinc-200 text-sm pr-10"
                  style={{ fontFamily: 'monospace' }}
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-zinc-400 hover:text-white"
                  onClick={async () => {
                    if (school?.address || school?.location) {
                      await navigator.clipboard.writeText(school?.address || school?.location || "")
                      setCopiedAddress(true)
                      setTimeout(() => setCopiedAddress(false), 1500)
                    }
                  }}
                  aria-label="Copy Address"
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {copiedAddress && <span className="text-xs text-teal-400 ml-1">Copied!</span>}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Globe className="h-4 w-4 text-zinc-400" />
            {school?.website ? (
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-400 hover:text-teal-300 text-base font-normal"
              >
                {school.website.replace(/^https?:\/\//, "")}
              </a>
            ) : <span className="text-zinc-300">N/A</span>}
          </div>
          <Separator className="bg-zinc-800" />
          {(school?.facebook_url || school?.twitter_url || school?.instagram_url || school?.youtube_url) && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-zinc-400">Follow us:</span>
              <div className="flex gap-2">
                {school.facebook_url && (
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-teal-500 hover:text-teal-300" asChild>
                    <a href={school.facebook_url} target="_blank" rel="noopener noreferrer"><Facebook className="h-6 w-6" /></a>
                  </Button>
                )}
                {school.twitter_url && (
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-teal-500 hover:text-teal-300" asChild>
                    <a href={school.twitter_url} target="_blank" rel="noopener noreferrer"><Twitter className="h-6 w-6" /></a>
                  </Button>
                )}
                {school.instagram_url && (
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-teal-500 hover:text-teal-300" asChild>
                    <a href={school.instagram_url} target="_blank" rel="noopener noreferrer"><Instagram className="h-6 w-6" /></a>
                  </Button>
                )}
                {school.youtube_url && (
                  <Button variant="ghost" size="icon" className="h-10 w-10 text-teal-500 hover:text-teal-300" asChild>
                    <a href={school.youtube_url} target="_blank" rel="noopener noreferrer"><Youtube className="h-6 w-6" /></a>
                  </Button>
                )}
              </div>
            </div>
          )}
          <Separator className="bg-zinc-800" />
          <div className="grid grid-cols-2 gap-4">
            <SharePopover courseUrl={`https://livethrough.co/marketplace/courses/${course?.id ?? ""}`} courseTitle={course?.title ?? ""} variant="outline" />
            <Button
              variant="outline"
              className="border-zinc-600 text-teal-500 hover:text-teal-400 hover:bg-zinc-800 px-6 py-3 flex items-center justify-center"
              onClick={() => {
                if (!isAuthenticated) {
                  openAuthModal('signup')
                  return
                }
                handleBookmark()
              }}
              disabled={bookmarksLoading}
            >
              <Bookmark className={`h-4 w-4 mr-2 text-teal-500 hover:text-teal-400 ${isBookmarked ? 'fill-current' : ''}`} />
              {isBookmarked ? 'Saved' : 'Save'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}; 