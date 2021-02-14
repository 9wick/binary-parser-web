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

    // result.raw = buffer.slice(0, result._endPosition);
    const removePrivateKeys = (obj: any) => {
      if (
        typeof obj === 'boolean' ||
        typeof obj === 'string' ||
        typeof obj === 'number'
      ) {
        return obj;
      }
      const returnVal: any = {};
      for (const one of Object.keys(obj).sort()) {
        if (root && one.startsWith('_') && one !== '_raw') {
          continue;
        }
        if (obj[one] instanceof Buffer) {
          returnVal[one] = obj[one].toString('hex');
        } else if (Array.isArray(obj[one])) {
          returnVal[one] = obj[one].map(removePrivateKeys);
        } else if (typeof obj[one] === 'object') {
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

  enum(varName: string, type: any | null, options: any) {
    const meanings: any = CustomParser.list2meaning(options.list);
    const choices: any = CustomParser.list2choices(options.list);

    const defaultParser = CustomParser.getNestParser(p => {
      p.buffer('data', {
        readUntil: 'eof',
      });
    });
    Object.keys(options.list).map(key => {
      meanings[key] = options.list[key].meaning;
      choices[key] = options.list[key].choice || defaultParser;
    });

    const choiceOptions = {
      tag: varName,
      choices,
      defaultChoice: options.defaultChoice
        ? options.defaultChoice
        : defaultParser,
    };
    const choiceArg1 =
      options.nest !== false ? varName + 'Data' : choiceOptions;
    const choiceArg2 = options.nest !== false ? choiceOptions : undefined;
    if (type) {
      this.primitiveN(type, varName);
    }
    this.meaning(varName + 'String', {
      tag: varName,
      meanings,
    }).choice(choiceArg1, choiceArg2);
    return this;
  }

  static getDefaultParser(f?: (p: CustomParser) => void) {
    const parser = new CustomParser().saveOffset('_startPosition');
    if (f) {
      f(parser);
    }
    parser
      .saveOffset('_endPosition')
      .seek(function() {
        // @ts-ignore
        return -1 * (this._endPosition - this._startPosition);
      })
      .string('_raw', {
        encoding: 'hex',
        length: function() {
          // @ts-ignore
          return this._endPosition - this._startPosition;
        },
      });

    return parser;
  }

  hex(varName: string, options: any) {
    options.encoding = 'hex';
    return this.string(varName, options);
  }

  static getNestParser(f?: (p: CustomParser) => void) {
    const parser = new CustomParser();
    if (f) {
      f(parser);
    }
    return parser;
  }

  static list2meaning(list: any) {
    const meanings: any = {};
    Object.keys(list).map(key => {
      meanings[key] = list[key].meaning;
    });
    return meanings;
  }

  static list2choices(list: any) {
    const choices: any = {};
    Object.keys(list).map(key => {
      if (list[key]) {
        choices[key] = list[key].choice;
      }
    });
    return choices;
  }
}

export const getDefaultParser = CustomParser.getDefaultParser;
export const getNestParser = CustomParser.getNestParser;
