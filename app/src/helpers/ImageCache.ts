import { StringMap } from "@/basic-types";
import { httpClient } from "../components/Providers/http/httpClients";
import wait from "@/utils/wait";

/**
 * @param maxSizing max MB for cache image
 */
class ImageCache {
    constructor(config: { maxSizing: number, ignore?: (string | RegExp)[] }) {
        this.images = new Map()
        this.calls = new Map()
        this.size = 0
        this.maxSizing = config.maxSizing
    }

    getSize() {
        return this.size
    }

    private async process(url: string) {
        const { data, headers } = await httpClient.get(url, { responseType: 'arraybuffer' })

        if (!(await this.isImage(headers['content-type']))) {
            throw new Error(`The resource ${url} is not a image!`)
        }

        const size = parseInt(headers["content-length"] as string, 10) / 1024 / 1024;

        this.size += size

        const blobURL = URL.createObjectURL(
            new Blob([data], { type: headers['content-type'] })
        )

        this.images.set(url, { blobURL, references: 1 })

        return blobURL
    }

    private get(url: string) {
        if (this.images.has(url)) {
            const item = this.images.get(url)!
            
            console.log("Found one reference", item.references)
            item.references++

            return item.blobURL
        }
    }

    async link(url: string) {
        if (this.images.has(url) || (this.calls.has(url) && (await this.calls.get(url)))) return this.get(url)

        const process = this.process(url)

        this.calls.set(url, process)

        process.finally(() => this.calls.delete(url))

        return process
    }

    unlink(url: string) {
        if (!this.images.has(url)) return;

        const item = this.images.get(url)!

        item.references--

        if (item.references < 1) {
            console.log("No more reference for", url)
            URL.revokeObjectURL(item.blobURL)
            this.images.delete(url)
        }
    }

    async isImage(contentType: string) {
        const imageType = contentType.toString().split("image/").pop();

        return imageType !== undefined && ImageCache.IMAGES_TYPES.includes(imageType.toLowerCase())
    }

    public static readonly IMAGES_TYPES = ["jpeg", "png", "gif", "webp"]
    private calls: Map<string, Promise<string>>
    private images: Map<string, { blobURL: string, references: number }>;
    private size: number;
    private maxSizing: number;
}

export default new ImageCache({ maxSizing: 5 })