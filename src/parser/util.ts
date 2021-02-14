import { Parser } from './base/BinaryParser';

// interface CustomParserOptions extends Parser.prototype.uint8.arguments[1] {
//   type?: string | Parser | ParserOptions;
//   count?: number;
// }

// const stopParser = new Parser();

export class CustomParser extends Parser {
  private repeatParser?: CustomParser;
  public parentParser?: CustomParser;
  private repeatName?: string;

  repeat(varName: string, options: any) {
    if (typeof options.count === 'number') {
      for (let i = 0; i < options.count; i++) {
        (this as any).setNextParser('nest', varName + '' + i, options);
      }
      return this;
    }

    const newParser = options.type;
    this.repeatName = varName;
    newParser.parentParser = this;
    this.repeatParser = newParser;
    return newParser;
  }

  parse(buffer: Buffer | Uint8Array, root = true): any {
    const result = super.parse(buffer);
    const length = buffer.length;
    let count = 0;
    while (this.repeatParser && result._endPosition !== length) {
      const childResult = this.repeatParser.parse(
        buffer.slice(result._endPosition),
        false
      );
      result[this.repeatName! + count] = childResult;
      result._endPosition += childResult._endPosition;
      count++;
    }

    result.raw = buffer.slice(0, result._endPosition);

    if (!root) {
      return result;
    }
    const removePrivateKeys = (obj: any) => {
      const returnVal: any = {};
      for (const one of Object.keys(obj).sort()) {
        if (one.startsWith('_')) {
          continue;
        }
        if (typeof obj[one] === 'object') {
          returnVal[one] = removePrivateKeys(obj[one]);
        } else {
          returnVal[one] = obj[one];
        }
      }
      return returnVal;
    };
    return removePrivateKeys(result);
  }

  getCode(): string {
    return super.getCode() + '\n //---------\n' + this.repeatParser?.getCode();
  }

  static getDefaultParser(f?: (p: CustomParser) => void) {
    const parser = new CustomParser().saveOffset('_startPosition');
    // .buffer('_full', {
    //   readUntil: function(item: any, buffer: any) {
    //     // @ts-ignore
    //     // eslint-disable-next-line @typescript-eslint/no-this-alias
    //     const self: any = this;
    //     self.__bufferTmp = self.__bufferTmp || [];
    //     self.__bufferTmp = [...self.__bufferTmp, item];
    //
    //     return self.__bufferTmp.length > 2 ? true : false;
    //   } as any,
    // })
    // .saveOffset('_fullEndPosition')
    // .seek(function() {
    //   //@ts-ignore
    //   return (this._fullEndPosition - this._startPosition) * -1;
    // });
    if (f) {
      f(parser);
    }
    parser.saveOffset('_endPosition');

    return parser;
  }
}

export const getDefaultParser = CustomParser.getDefaultParser;
