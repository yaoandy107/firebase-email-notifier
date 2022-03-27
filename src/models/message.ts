export interface MarkdownMessage {
    msgtype: string
    markdown: Markdown
    at: At
}

export interface At {
    atMobiles?: string[]
    atUserIds?: string[]
    isAtAll?: boolean
}

export interface Markdown {
    title: string
    text: string
}
