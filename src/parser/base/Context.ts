import { Parser } from './BinaryParser';

export class Context {
  code = '';
  scopes = [['vars']];
  bitFields: Parser[] = [];
  tmpVariableCount = 0;
  references: { [key: string]: { resolved: boolean; requested: boolean } } = {};
  importPath?: string;
  imports: any[] = [];
  reverseImports = new Map<any, number>();

  constructor(importPath?: string) {
    this.importPath = importPath;
  }

  generateVariable(name?: string) {
    const arr = [];

    const scopes = this.scopes[this.scopes.length - 1];
    arr.push(...scopes);
    if (name) {
      arr.push(name);
    }
    if (arr.length < 1) {
      return arr.join('.');
    }
    return arr[0] + arr.slice(1).map(e => `["${e}"]`);
  }

  generateOption(val: number | string | Function | null | undefined) {
    switch (typeof val) {
      case 'number':
        return val.toString();
      case 'string':
        return this.generateVariable(val);
      case 'function':
        return `${this.addImport(val)}.call(${this.generateVariable()}, vars)`;
    }
  }

  generateError(err: string) {
    this.pushCode('throw new Error(' + err + ');');
  }

  generateTmpVariable() {
    return '$tmp' + this.tmpVariableCount++;
  }

  pushCode(code: string) {
    this.code += code + '\n';
  }

  pushPath(name: string) {
    if (name) {
      this.scopes[this.scopes.length - 1].push(name);
    }
  }

  popPath(name: string) {
    if (name) {
      this.scopes[this.scopes.length - 1].pop();
    }
  }

  pushScope(name: string) {
    this.scopes.push([name]);
  }

  popScope() {
    this.scopes.pop();
  }

  addImport(im: any) {
    if (!this.importPath) return `(${im})`;
    let id = this.reverseImports.get(im);
    if (!id) {
      id = this.imports.push(im) - 1;
      this.reverseImports.set(im, id);
    }
    return `${this.importPath}[${id}]`;
  }

  addReference(alias: string) {
    if (this.references[alias]) return;
    this.references[alias] = { resolved: false, requested: false };
  }

  markResolved(alias: string) {
    this.references[alias].resolved = true;
  }

  markRequested(aliasList: string[]) {
    aliasList.forEach(alias => {
      this.references[alias].requested = true;
    });
  }

  getUnresolvedReferences() {
    const references = this.references;
    return Object.keys(this.references).filter(
      alias => !references[alias].resolved && !references[alias].requested
    );
  }
}
