
import gm from 'gm';

interface PositionObject {
  logoX: number,
  logoY: number,
  logoHeight: number,
  logoWidth: number
}

type Position = "left-top" | "left-bottom" | "right-top" | PositionObject;

type Result = "buffer" | "file";

interface Options {
  bufferLogo: string,
  bufferImage: string,
  saveDestination?: string,
  position: PositionObject,
  result: Result
}

type Callback = (err: string, buffer?: string) => any 

const getPosition = (position: Position, size: any) => {
  switch (position) {
    case 'left-top':
      return {
        logoX: 10,
        logoY: 10,
      }

    case 'left-bottom':
      return {
        logoX: 10,
        logoY: size.height - (size.height / 8),
      }

    case 'right-top':
      return {
        logoX: size.width - (size.width / 8),
        logoY: 10,
      }
    default:
      return {
        logoWidth: position.logoWidth,
        logoHeight: position.logoHeight,
        logoX: position.logoX,
        logoY: position.logoY,
      }  
  }
}
const watermark = function (options: Options, callback: Callback) {

  let { bufferLogo, bufferImage, saveDestination, position, result } = options;

  gm(bufferImage)
    .size(function (err, size) {
      if (!err) {
        const params = {
          logoWidth: (size.width / 10),
          logoHeight: (size.height / 10),
          logoX: size.width - (size.width / 8),
          logoY: size.height - (size.height / 8),
          ...getPosition(position, size)
        }

        if(result === "file") {
          gm(bufferImage)
            .draw('params + logo')
            .write(saveDestination, callback);
        } else {
          gm(bufferImage)
            .draw('params + logo')
            .toBuffer('PNG', callback)
        }
      } else {
        console.error(err);
        callback(err);
      }
    });
};

export default watermark;
