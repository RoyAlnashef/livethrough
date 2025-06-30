import { Node, nodeInputRule, type RawCommands } from '@tiptap/core'

export interface VideoOptions {
  allowFullscreen: boolean
  HTMLAttributes: Record<string, unknown>
}

export interface VideoAttrs {
  src: string
}

function getEmbedUrl(url: string): string | null {
  // YouTube
  const ytMatch = url.match(
    /(?:https?:\/\/(?:www\.)?)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/
  )
  if (ytMatch) {
    return `https://www.youtube.com/embed/${ytMatch[1]}`
  }
  // Vimeo
  const vimeoMatch = url.match(
    /(?:https?:\/\/(?:www\.)?)?vimeo\.com\/(\d+)/
  )
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  return null
}

export const Video = Node.create<VideoOptions>({
  name: 'video',

  group: 'block',
  atom: true,
  selectable: true,
  draggable: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {},
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      { class: 'tiptap-video-embed-wrapper' },
      [
        'iframe',
        {
          ...HTMLAttributes,
          class: 'tiptap-video-embed',
          frameborder: '0',
          allow: 'autoplay; encrypted-media',
          allowfullscreen: this.options.allowFullscreen ? 'true' : undefined,
          width: '100%',
          height: '360',
        },
      ],
    ]
  },

  addCommands() {
    return {
      setVideo:
        (options: { src: string }) =>
        ({ commands }: { commands: RawCommands }) => {
          const embedUrl = getEmbedUrl(options.src)
          if (!embedUrl) return false
          return commands.insertContent({
            type: this.name,
            attrs: { src: embedUrl },
          })
        },
    } as Partial<RawCommands>
  },

  addInputRules() {
    return [
      nodeInputRule({
        find: /(?:^|\s)(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|vimeo\.com\/)[^\s]+)/,
        type: this.type,
        getAttributes: match => {
          const embedUrl = getEmbedUrl(match[1])
          return embedUrl ? { src: embedUrl } : {}
        },
      }),
    ]
  },
}) 