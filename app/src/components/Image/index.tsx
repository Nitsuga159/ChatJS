import { useEffect, useState } from "react"
import * as S from './Image.styled' 
import React from "react"
import ImageCache from "@/helpers/ImageCache"

interface ImageProps extends React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
    loadWidth: number, loadHeight: number
}

export default function Image({ loadWidth, loadHeight, src, ...props }: ImageProps) {
    const [mySrc, setMySrc] = useState<string>()

    useEffect(() => {
        ImageCache.link(src!)
        .then(url => {
            setMySrc(url)
        })

        return () => {
            ImageCache.unlink(src!)
        }
    }, [])

    return (
        <>
            {
                !mySrc && <S.LoadImage width={loadWidth} height={loadHeight} />
            }
            <img {...props} src={mySrc} />
        </>
    )
}