import { useEffect, useState } from "react"
import * as S from './Image.styled' 
import React from "react"
import ImageCache from "@/helpers/ImageCache"

export default function Image({ width, height, src, ...props }: React.DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement>) {
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
                !mySrc && <S.LoadImage width={width} height={height} />
            }
            <img {...props} src={mySrc} />
        </>
    )
}