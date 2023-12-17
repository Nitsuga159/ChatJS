import * as S from './GetProfileImage.styled';
import { ReactNode, createContext, useCallback, useRef, useState } from "react";
import { IGetProfileImageProps, TGetProfileImageContext } from "./type";
import AutoSize from '@/components/AutoSize';
import ImageCrop from '@/components/ImageCrop';
import { IRenderCrop } from '@/components/ImageCrop/type';
import RenderCrop from '@/components/ImageCrop/RenderCrop';
import createImageFile from './createImageFile';
import CSSAnimation from '@/components/CSSAnimation';

export const GetProfileImageContext = createContext<TGetProfileImageContext | null>(null);

export const GetProfileImageProvider = ({ children }: { children: ReactNode | JSX.Element }) => {
  const [props, setProps] = useState<IGetProfileImageProps>({ show: false });
  const renderRef = useRef<HTMLCanvasElement | null>(null);

  const handleConfirmImage = async () => {
    if (props.onCompleted && renderRef.current) {
      props.onCompleted(await createImageFile(renderRef.current, 'image'));
      setProps({ show: false });
    }
  }

  return (
    <GetProfileImageContext.Provider
      value={(image, onCompleted) => setProps({ image, onCompleted, show: true })}
    >
      {children}
      <CSSAnimation open={props.show} timeout={200}>
        {
          (status) =>
            <S.Container status={status}>
              <S.SubContainer>
                <S.Title>Update your photo!</S.Title>
                <S.Paragraph>- Use the scroll-wheel on the image to resize it</S.Paragraph>
                <S.Paragraph>- Use the 80x80 frame to select the area that interests you</S.Paragraph>
                <S.Paragraph>- You can move the image if you need to</S.Paragraph>
                <S.ImageCropContainer>
                  {props.image && <AutoSize>
                    {
                      ({ width, height }) => (
                        <ImageCrop
                          renderRef={renderRef}
                          file={props.image!}
                          dimension={[width, height]}
                          frame={[80, 80]}
                        />
                      )
                    }
                  </AutoSize>}
                </S.ImageCropContainer>
                <S.Title>Preview</S.Title>
                <S.RenderContainer>
                  <S.RenderCanvas frame={[80, 80]}>
                    <RenderCrop giveRef={(canvas) => renderRef.current = canvas} frame={[80, 80]} />
                  </S.RenderCanvas>
                  <S.ConfirmButton onClick={handleConfirmImage}>Accept</S.ConfirmButton>
                </S.RenderContainer>
                <S.ExitIcon onClick={() => {
                  setProps({ show: false });
                }} />
              </S.SubContainer>
            </S.Container>
        }
      </CSSAnimation>
    </GetProfileImageContext.Provider>
  );
}