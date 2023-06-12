/* 
  onSendMessage: callback that will be called with the message when the user presses enter.
  maxAutoHeight: max auto height for textarea, when height reaches that number will activate scroll-y. by default will be 200
  maxLength: you can set a limit of characters, by default will be unlimited.
*/

export interface TextAreaProps {
  onSendMessage: (message: string, files: File[]) => void;
  file?: {
    accept: string;
    maxSizeFile: number;
  };
  maxAutoHeight?: number;
  maxLength?: number;
}
