function getGroupCount(regexp: RegExp) {
  // Modify regexp so that it will match an empty string,
  // then match an empty string and see how many groups it returns.
  return new RegExp(regexp.source + '|').exec('').length - 1;
}

function getMatchGroups(regexp: RegExp): string[] {
  const buf: string[] = [];
  buf.push('complete match');
  for (let i = 0, j = getGroupCount(regexp); i < j; i++) {
    buf.push('capturing group #' + (i + 1));
  }
  return buf;
}

function forEachMatch(
  regexp: RegExp,
  str: string,
  callback: (match: RegExpExecArray) => boolean | void
): void {
  // tslint:disable-next-line: no-conditional-assignment
  for (let m: RegExpExecArray; (m = regexp.exec(str)) !== null; ) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regexp.lastIndex) {
      regexp.lastIndex++;
    } else if (callback(m)) {
      break;
    }
  }
}

export class UploadDictionaryFileModel {
  private _cardSeparator: string;
  private _lineSeparator: string;
  private _cardRegexp: RegExp;
  private _lineRegexp: RegExp;

  file: File;
  encoding: string;

  cardMatchGroups: string[] = [];
  lineMatchGroups: string[] = [];

  headSelection = -1;
  bodySelection = -1;
  lineSelection = -1;

  get isFileValid() {
    return this.file instanceof File;
  }

  get isCardSeparatorValid() {
    // At least two groups should be present.
    return this.cardMatchGroups && this.cardMatchGroups.length > 1;
  }

  get isLineSeparatorValid() {
    // At least one group should be present.
    return this.lineMatchGroups && this.lineMatchGroups.length > 0;
  }

  get isValid() {
    return (
      this.isFileValid &&
      this.isCardSeparatorValid &&
      (this.isLineSeparatorValid || !this._lineSeparator)
    );
  }

  get cardSeparator() {
    return this._cardSeparator;
  }

  set cardSeparator(value: string) {
    if (this._cardSeparator !== value) {
      this._cardSeparator = value;
      this._cardRegexp = null;
      this.cardMatchGroups = [];
      const oldHeadSelection = this.headSelection;
      const oldBodySelection = this.bodySelection;
      this.headSelection = -1;
      this.bodySelection = -1;

      if (value) {
        try {
          this._cardRegexp = new RegExp(value, 'g');
          this.cardMatchGroups = getMatchGroups(this._cardRegexp);

          if (oldHeadSelection >= 0 && oldHeadSelection < this.cardMatchGroups.length) {
            this.headSelection = oldHeadSelection;
          } else if (this.cardMatchGroups.length > 1) {
            this.headSelection = this.cardMatchGroups.length - 2;
          }

          if (oldBodySelection >= 0 && oldBodySelection < this.cardMatchGroups.length) {
            this.bodySelection = oldBodySelection;
          } else if (this.cardMatchGroups.length > 1) {
            this.bodySelection = this.cardMatchGroups.length - 1;
          }
        } catch (error) {}
      }
    }
  }

  get lineSeparator() {
    return this._lineSeparator;
  }

  set lineSeparator(value: string) {
    if (this._lineSeparator !== value) {
      this._lineSeparator = value;
      this._lineRegexp = null;
      this.lineMatchGroups = [];
      const oldLineSelection = this.lineSelection;
      this.lineSelection = -1;

      if (value) {
        try {
          this._lineRegexp = new RegExp(value, 'g');
          this.lineMatchGroups = getMatchGroups(this._lineRegexp);

          if (oldLineSelection >= 0 && oldLineSelection < this.lineMatchGroups.length) {
            this.lineSelection = oldLineSelection;
          } else if (this.lineMatchGroups.length > 0) {
            this.lineSelection = this.lineMatchGroups.length - 1;
          }
        } catch (error) {}
      }
    }
  }

  parse(data: string): string[][] {
    const words: string[][] = [];
    forEachMatch(this._cardRegexp, data, m => {
      const card: string[] = [m[this.headSelection]];
      const body = m[this.bodySelection];

      if (this._lineRegexp) {
        forEachMatch(this._lineRegexp, body, l => {
          card.push(l[this.lineSelection]);
        });
      } else {
        card.push(body);
      }

      words.push(card);
    });

    return words;
  }
}
